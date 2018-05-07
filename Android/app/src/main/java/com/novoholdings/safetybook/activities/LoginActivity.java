package com.novoholdings.safetybook.activities;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.DownloadManager;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.design.widget.Snackbar;
import android.support.v4.app.ActivityCompat;
import android.support.v4.app.NotificationCompat;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.Request.Method;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.facebook.stetho.Stetho;
import com.facebook.stetho.okhttp3.StethoInterceptor;
import com.firebase.ui.auth.AuthUI;
import com.firebase.ui.auth.ErrorCodes;
import com.firebase.ui.auth.IdpResponse;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.messaging.FirebaseMessaging;
import com.novoholdings.safetybook.BuildConfig;
import com.novoholdings.safetybook.R;
import com.novoholdings.safetybook.RequestQueue;
import com.novoholdings.safetybook.common.AppProperties;
import com.novoholdings.safetybook.common.AppSharedPreference;
import com.novoholdings.safetybook.common.Utils;
import com.novoholdings.safetybook.database.AssignmentsDao;
import com.novoholdings.safetybook.database.GroupsDao;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.security.acl.Group;
import java.util.AbstractMap;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import okhttp3.OkHttpClient;

public class LoginActivity extends AppCompatActivity {

    private static final String TAG = "LoginActivity";
    private Button loginButton;
    private Button forgotPass;
    SharedPreferences sharedPreferences;
    SharedPreferences.Editor editor;
    private static final String PREF_NAME = "prefs";
    private static final String KEY_REMEMBER = "remember";
    private static final String KEY_EMAIL = "email";
    private static final String KEY_PASS = "password";
    DownloadManager downloadManager;

    private GroupsDao groupsDao;
    private AssignmentsDao assignmentsDao;

    private FirebaseAuth mAuth;

    private static final int RC_SIGN_IN = 123;

    // Choose authentication providers
    List<AuthUI.IdpConfig> providers = Arrays.asList(
            new AuthUI.IdpConfig.EmailBuilder().setAllowNewAccounts(false).build());

    RequestQueue requestQueue;
    ProgressDialog progressDialog;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestQueue = RequestQueue.getInstance(this);
        progressDialog = new ProgressDialog(this);
        progressDialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);
        progressDialog.setMessage("Loading please wait ..");

        if (Utils.isOnline(LoginActivity.this)) {
            updateChecker();
        } else {
            loginButton = (Button) findViewById(R.id.loginButton);
            forgotPass = (Button) findViewById(R.id.forgetPass);

            mAuth = FirebaseAuth.getInstance();

            if (mAuth.getCurrentUser() == null) {
                startActivityForResult(// Get an instance of AuthUI based on the default app
                        AuthUI
                                .getInstance()
                                .createSignInIntentBuilder()
                                .setAvailableProviders(providers)
                                .setIsSmartLockEnabled(true /* credentials */, true /* hints */)
                                .build(),
                        RC_SIGN_IN);
            }
            setContentView(R.layout.activity_main);
            Stetho.initializeWithDefaults(this);

//        forgotPass.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View v) {
//                Intent forgetPass = new Intent(LoginActivity.this, ForgetPassActivity.class);
//                startActivity(forgetPass);
//            }
        }
    }

    private void updateChecker()
    {
        int currentVersionNumber = BuildConfig.VERSION_CODE;

        String url = AppProperties.DIR_SERVER_ROOT + "androidVersionTable";

        JsonObjectRequest getComplete = new JsonObjectRequest(Request.Method.GET, url, null, new Response.Listener<JSONObject>() {
            public void onResponse(JSONObject response) {
                try {
                    int latestVersionNumber = response.getInt("version_number");
                    String downloadLinkStr = response.getString("version_url");
                    Uri downloadLinkUri = Uri.parse(downloadLinkStr);

                    if (currentVersionNumber < latestVersionNumber) {
                        AlertDialog.Builder downloadAlert = new AlertDialog.Builder(LoginActivity.this);
                        downloadAlert.setTitle("Update Available.")
                                .setMessage("Please download the latest update to continue using Safety Book Reader.")
                                .setPositiveButton("Download", new DialogInterface.OnClickListener() {
                                    @Override
                                    public void onClick(DialogInterface dialogInterface, int i) {
                                        downloadUpdate(downloadLinkUri);

                                        checkIfInstalled(latestVersionNumber);

                                    }
                                })
                                .setNegativeButton("Update Later", new DialogInterface.OnClickListener() {
                                    @Override
                                    public void onClick(DialogInterface dialogInterface, int i) {
                                        Intent intent = new Intent(getApplicationContext(), LoginActivity.class);
                                        intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                                        intent.putExtra("EXIT", true);
                                        startActivity(intent);

                                        if (getIntent().getExtras() != null && getIntent().getExtras().getBoolean("EXIT", false)) {
                                            finish();
                                        }
                                    }
                                })
                                .show();
                    } else {
                        loginButton = (Button) findViewById(R.id.loginButton);
                        forgotPass = (Button) findViewById(R.id.forgetPass);

                        mAuth = FirebaseAuth.getInstance();

                        if (mAuth.getCurrentUser() == null) {
                            AuthUI.IdpConfig.EmailBuilder emailBuilder = new AuthUI.IdpConfig.EmailBuilder();
                            emailBuilder.setAllowNewAccounts(false);
                            startActivityForResult(// Get an instance of AuthUI based on the default app
                                    AuthUI
                                            .getInstance()
                                            .createSignInIntentBuilder()
                                            .setAvailableProviders(providers)
                                            .setIsSmartLockEnabled(false /* credentials */, true /* hints */)
                                            .build(),
                                    RC_SIGN_IN);
                        } else {
                            Intent i = new Intent(LoginActivity.this, GroupsActivity.class);
                            startActivity(i);
                        }
                    }

                } catch (JSONException e) {
                    e.printStackTrace();
                }

            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                AlertDialog.Builder alert = new AlertDialog.Builder(LoginActivity.this);
                alert.setTitle("Could not check for updates.")
                        .setMessage(error.getMessage() + "\n\nPlease check your network connection and try again.")
                        .setPositiveButton("Try Again.", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                updateChecker();
                            }
                        })
                        .setNegativeButton("Later", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {

                                Intent intent = new Intent(getApplicationContext(), LoginActivity.class);
                                intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                                intent.putExtra("EXIT", true);
                                startActivity(intent);

                                if (getIntent().getExtras() != null && getIntent().getExtras().getBoolean("EXIT", false)) {
                                    finish();
                                }
                            }
                        })
                        .show();
            }
        });

        Volley.newRequestQueue(this).add(getComplete);
    }

    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        // RC_SIGN_IN is the request code you passed into startActivityForResult(...) when starting the sign in flow.
        if (requestCode == RC_SIGN_IN) {

            progressDialog.show();
            //nextScreen();
            getDetailsFromServer();

            IdpResponse response = IdpResponse.fromResultIntent(data);

            // Successfully signed in
            if (resultCode == RESULT_OK) {
                startActivity(GroupsActivity.createIntent(this, response));
                finish();
            } else {
                // Sign in failed
                if (response == null) {
                    // User pressed back button
                   // showSnackbar(R.string.sign_in_cancelled);
                    return;
                }

                if (response.getError().getErrorCode() == ErrorCodes.NO_NETWORK) {
                    showSnackbar(R.string.no_internet_connection);
                    return;
                }

                showSnackbar(R.string.unknown_error);
                Log.e("Error", "Sign-in error: ", response.getError());
            }
        }
    }

    private void showSnackbar(int stringResource){
     /*   Snackbar mySnackbar = Snackbar.make(findViewById(R.id.myCoordinatorLayout),
                R.string.email_archived, Snackbar.LENGTH_SHORT);
        mySnackbar.setAction(R.string.undo_string, new MyUndoListener());
        mySnackbar.show();*/

    }
    private void downloadUpdate(Uri uri)
    {
        downloadManager = (DownloadManager) getSystemService(Context.DOWNLOAD_SERVICE);
        DownloadManager.Request request = new DownloadManager.Request(uri);
        request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
        Long reference = downloadManager.enqueue(request);
    }

    private void checkIfInstalled( int latestVersionNumber) {
        int checkedVersionNumber = BuildConfig.VERSION_CODE;

        if (checkedVersionNumber != latestVersionNumber) {
            AlertDialog.Builder installAlert = new AlertDialog.Builder(LoginActivity.this);
            installAlert.setTitle("Please Install.")
                    .setMessage("Please go to your download manager and install the latest application update.")
                    .setNeutralButton("OK.", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialogInterface, int i) {
                            Intent intent = new Intent(getApplicationContext(), LoginActivity.class);
                            intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                            intent.putExtra("EXIT", true);
                            startActivity(intent);

                            if (getIntent().getExtras() != null && getIntent().getExtras().getBoolean("EXIT", false)) {
                                finish();
                            }
                        }
                    })
                    .show();
        }
    }

    private void getLoginScreen(){
        AuthUI.IdpConfig.EmailBuilder emailBuilder = new AuthUI.IdpConfig.EmailBuilder();
        emailBuilder.setAllowNewAccounts(false);
        startActivityForResult(// Get an instance of AuthUI based on the default app
                AuthUI
                        .getInstance()
                        .createSignInIntentBuilder()
                        .setAvailableProviders(providers)
                        .setIsSmartLockEnabled(false /* credentials */, true /* hints */)
                        .build(),
                RC_SIGN_IN);

    }


    private void getDetailsFromServer(){
        Map<String,String> params = new HashMap<>();
        params.put("email",mAuth.getCurrentUser().getEmail());
        params.put("firebase_token", AppSharedPreference.getData(this,AppSharedPreference.FIREBASE_TOKEN,""));
        JsonObjectRequest objectRequest = new JsonObjectRequest(Method.POST,AppProperties.DIR_SERVER_ROOT+"getUserDetails", new JSONObject(params),
                new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                progressDialog.dismiss();
                Log.d(TAG, "onResponse: =============== ");
                if(response!=null){
                    try {
                        AppSharedPreference.putData(LoginActivity.this,AppSharedPreference.USER_ID,response.getString("ID"));
                        AppSharedPreference.putData(LoginActivity.this,AppSharedPreference.USER_FIRSTNAME,response.getString("FIRST_NAME"));
                        AppSharedPreference.putData(LoginActivity.this,AppSharedPreference.USER_LAST_NAME,response.getString("LAST_NAME"));
                        JSONArray suscribingTopics = response.getJSONArray("SUSCRIBE_TOPICS");
                        for(int i =0;i<suscribingTopics.length();i++){
                            FirebaseMessaging.getInstance().subscribeToTopic(suscribingTopics.getString(i));

                        }
                        nextScreen();

                    } catch (JSONException e) {
                        e.printStackTrace();
                        mAuth.signOut();
                        Toast.makeText(LoginActivity.this, "Something went wrong try again", Toast.LENGTH_SHORT).show();
                        getLoginScreen();
                    }


                }else {
                    mAuth.signOut();
                    Toast.makeText(LoginActivity.this, "Something went wrong try again", Toast.LENGTH_SHORT).show();
                    getLoginScreen();
                }

            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d(TAG, "onErrorResponse: ==================");
                progressDialog.dismiss();
                mAuth.signOut();
                Toast.makeText(LoginActivity.this, "Unable to sign in try again", Toast.LENGTH_SHORT).show();
                getLoginScreen();
            }
        });

        requestQueue.addToRequestQueue(objectRequest);


    }

    private void nextScreen(){
        Intent i = new Intent(LoginActivity.this, GroupsActivity.class);
        startActivity(i);
        finish();

    }


}

