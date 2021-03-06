package com.novoholdings.safetybook.activities;

import android.Manifest;
import android.app.AlertDialog;
import android.app.DownloadManager;
import android.app.ProgressDialog;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.RelativeLayout;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.Request.Method;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.facebook.stetho.Stetho;
import com.firebase.ui.auth.AuthUI;
import com.firebase.ui.auth.ErrorCodes;
import com.firebase.ui.auth.IdpResponse;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.messaging.FirebaseMessaging;
import com.novoholdings.safetybook.BuildConfig;
import com.novoholdings.safetybook.R;
import com.novoholdings.safetybook.RequestQueue;
import com.novoholdings.safetybook.common.AppProperties;
import com.novoholdings.safetybook.common.AppSharedPreference;
import com.novoholdings.safetybook.common.Utils;
import com.novoholdings.safetybook.database.AssignmentsDao;
import com.novoholdings.safetybook.database.GroupsDao;
import com.novoholdings.safetybook.http.UpdateResponse;
import com.novoholdings.safetybook.receivers.DownloadReceiver;
import com.crashlytics.android.Crashlytics;
import io.fabric.sdk.android.Fabric;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class LoginActivity extends AppCompatActivity {

    private static final String TAG = "LoginActivity";

    SharedPreferences sharedPreferences;
    SharedPreferences.Editor editor;
    private static final String PREF_NAME = "prefs";
    private static final String KEY_REMEMBER = "remember";
    private static final String KEY_EMAIL = "email";
    private static final String KEY_PASS = "password";
    DownloadManager downloadManager;

    private GroupsDao groupsDao;
    private AssignmentsDao assignmentsDao;
    private DownloadReceiver downloadReceiver;

    private FirebaseAuth mAuth;

    private static final int RC_SIGN_IN = 123;

    // Choose authentication providers
    List<AuthUI.IdpConfig> providers = Arrays.asList(
            new AuthUI.IdpConfig.EmailBuilder().setAllowNewAccounts(false).build());

    RequestQueue requestQueue;
    ProgressDialog progressDialog;
    RelativeLayout downloadMessage;

    private final int REQUEST_PERMISSION_WRITE_EXTERNAL_STORAGE=2233;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Fabric.with(this, new Crashlytics());
        requestQueue = RequestQueue.getInstance(this);

        mAuth = FirebaseAuth.getInstance();
        setContentView(R.layout.activity_main);
        Stetho.initializeWithDefaults(this);
        downloadMessage = findViewById(R.id.downloadMessage);
        progressDialog = new ProgressDialog(this);
        progressDialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);
        progressDialog.setMessage("Loading please wait ..");

        int permissionCheck = ContextCompat.checkSelfPermission(
                this, Manifest.permission.WRITE_EXTERNAL_STORAGE);
        if (permissionCheck != PackageManager.PERMISSION_GRANTED){
            ActivityCompat.shouldShowRequestPermissionRationale(this,
                    Manifest.permission.WRITE_EXTERNAL_STORAGE);
            showExplanation("Storage permission needed", "", Manifest.permission.READ_PHONE_STATE, REQUEST_PERMISSION_WRITE_EXTERNAL_STORAGE);
        } else {

            if (Utils.isOnline(LoginActivity.this)) {
                updateChecker();
            } else if (mAuth.getCurrentUser() == null) {
                getLoginScreen();
            }else{

                getDetailsFromServer();
            }



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
        downloadReceiver = new DownloadReceiver(LoginActivity.this);
        IntentFilter intentFilter = new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE);
        registerReceiver(downloadReceiver, intentFilter);
        int currentVersionNumber = com.android.volley.BuildConfig.VERSION_CODE;

        String url = AppProperties.DIR_SERVER_ROOT + "androidVersionTable";

        JsonObjectRequest getComplete = new JsonObjectRequest(Request.Method.GET, url, null, new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                int currentVersionNumber = BuildConfig.VERSION_CODE;

                try {
                    int latestVersionNumber = response.getInt("version_number");
                    String downloadLinkStr = response.getString("version_url");
                    String fileName = AppProperties.getFileNameFromPath(downloadLinkStr);
                    Uri downloadLinkUri = Uri.parse(AppProperties.DIR_SERVER_ROOT + downloadLinkStr);

                    if (currentVersionNumber < latestVersionNumber) {
                        AlertDialog.Builder downloadAlert = new AlertDialog.Builder(LoginActivity.this);
                        downloadAlert.setTitle("Update Available.")
                                .setMessage("Please download the latest update to continue using Safety Book Reader.")
                                .setPositiveButton("Download", new DialogInterface.OnClickListener() {
                                    @Override
                                    public void onClick(DialogInterface dialogInterface, int i) {
                                        downloadUpdate(downloadLinkUri, fileName);
                                    }
                                })
                                .setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                                    @Override
                                    public void onClick(DialogInterface dialogInterface, int i) {
                                        unregisterReceiver(downloadReceiver);
                                        finish();

                                    }
                                })
                                .show();
                    } else {
                        unregisterReceiver(downloadReceiver);
                        if (mAuth.getCurrentUser() == null) {
                            getLoginScreen();
                        }else{
                            getDetailsFromServer();
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
                alert.setTitle("No connection to the server")
                        .setMessage("Please check your network connection and try again.")
                        .setPositiveButton("Try Again.", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                updateChecker();
                            }
                        })
                        .setNegativeButton("Later", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {

                                //finish();
                            }
                        })
                        .show();
            }
        });

        Volley.newRequestQueue(this).add(getComplete);
    }

    private void downloadUpdate(Uri uri, String fileName)
    {

        try {
            String localFolderPath = AppProperties.SDCARD_APP_FOLDER_NAME;
            DownloadManager downloadManager = (DownloadManager) getSystemService(Context.DOWNLOAD_SERVICE);
            DownloadManager.Request request = new DownloadManager.Request(uri);
            Environment.getExternalStoragePublicDirectory(localFolderPath).mkdirs();
            //File file = new File(Environment.getExternalStorageDirectory(), "reader");
            //request.setDestinationUri(Uri.fromFile(file));
            request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
            ActivityCompat.requestPermissions(LoginActivity.this, new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, 1);
            downloadReceiver.fileName = fileName;
            downloadReceiver.apkDownload = downloadManager.enqueue(request
                            .setAllowedNetworkTypes(DownloadManager.Request.NETWORK_WIFI |
                                    DownloadManager.Request.NETWORK_MOBILE)
                            .setAllowedOverRoaming(false)
                            .setTitle(uri.getLastPathSegment().toString())
                            .setDescription("Newest app version")
                            .setVisibleInDownloadsUi(true)
                            .setDestinationInExternalPublicDir(localFolderPath, uri.getLastPathSegment()));
            downloadMessage.setVisibility(View.VISIBLE);

        }
        catch (IllegalArgumentException e) {
            e.printStackTrace();
        }

    }





    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        // RC_SIGN_IN is the request code you passed into startActivityForResult(...) when starting the sign in flow.
        if (requestCode == RC_SIGN_IN) {

            if (progressDialog!=null)
                progressDialog.show();
            //nextScreen();

            IdpResponse response = IdpResponse.fromResultIntent(data);

            // Successfully signed in
            if (resultCode == RESULT_OK) {
                mAuth = FirebaseAuth.getInstance();
                getDetailsFromServer();

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
                if (progressDialog!=null)
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

    private void showExplanation(String title,
                                 String message,
                                 final String permission,
                                 final int permissionRequestCode) {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle(title)
                .setMessage(message)
                .setPositiveButton(android.R.string.ok, new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        requestPermission(permissionRequestCode);
                    }
                });
        builder.create().show();
    }

    private void requestPermission(int permissionRequestCode) {
        ActivityCompat.requestPermissions(this,
                new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, permissionRequestCode);
    }

    @Override
    public void onRequestPermissionsResult(
            int requestCode,
            String permissions[],
            int[] grantResults) {
        switch (requestCode) {
            case REQUEST_PERMISSION_WRITE_EXTERNAL_STORAGE:
                if (grantResults.length > 0
                        && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    if (Utils.isOnline(LoginActivity.this)) {
                        updateChecker();
                    } else if (mAuth.getCurrentUser() == null) {
                        getLoginScreen();
                    }else{
                        getDetailsFromServer();
                    }

                    Toast.makeText(LoginActivity.this, "Permission granted", Toast.LENGTH_SHORT).show();
                } else {
                    requestPermission(REQUEST_PERMISSION_WRITE_EXTERNAL_STORAGE);
                    Toast.makeText(LoginActivity.this, "Permission denied", Toast.LENGTH_SHORT).show();
                }
        }
    }

    private void nextScreen(){
        Intent i = new Intent(LoginActivity.this, GroupsActivity.class);
        startActivity(i);
        finish();

    }

}

