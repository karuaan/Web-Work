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
import com.firebase.ui.auth.IdpResponse;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.novoholdings.safetybook.BuildConfig;
import com.novoholdings.safetybook.R;
import com.novoholdings.safetybook.common.AppProperties;
import com.novoholdings.safetybook.database.AssignmentsDao;
import com.novoholdings.safetybook.database.GroupsDao;

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
import java.util.List;

import okhttp3.OkHttpClient;

public class LoginActivity extends AppCompatActivity {

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


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (isOnline() == true) {
            updateChecker();
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

        private class RequestGroups extends AsyncTask<String, String, String> {
            private ProgressDialog pd = new ProgressDialog(LoginActivity.this);
            InputStream inputStream = null;
            String result = "";

            @Override
            protected void onPreExecute() {
                pd.setMessage("Downloading your data...");
                pd.show();
                pd.setOnCancelListener(new DialogInterface.OnCancelListener() {
                    @Override
                    public void onCancel(DialogInterface dialog) {
                        RequestGroups.this.cancel(true);
                    }
                });

                super.onPreExecute();
            }


            @Override
            protected String doInBackground(String... params) {

                HttpURLConnection connection = null;
                BufferedReader reader = null;

                try {
                    URL url = new URL(params[0]);
                    connection = (HttpURLConnection) url.openConnection();
                    connection.setReadTimeout(10000);
                    connection.setConnectTimeout(15000);
                    connection.setRequestMethod("POST");
                    connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
                    connection.setDoInput(true);
                    connection.setDoOutput(true);


                    List<AbstractMap.SimpleEntry> json = new ArrayList<AbstractMap.SimpleEntry>();
                    json.add(new AbstractMap.SimpleEntry("email", "test@test.test"));


                    OutputStream os = connection.getOutputStream();
                    BufferedWriter writer = new BufferedWriter(
                            new OutputStreamWriter(os, "UTF-8"));
                    writer.write(getQuery(json));
                    writer.flush();
                    writer.close();
                    os.close();


                    connection.connect();


                    InputStream stream = connection.getInputStream();

                    reader = new BufferedReader(new InputStreamReader(stream));

                    StringBuffer buffer = new StringBuffer();
                    String line = "";

                    while ((line = reader.readLine()) != null) {
                        buffer.append(line + "\n");
                        Log.d("Response: ", "> " + line);   //here u ll get whole response...... :-)

                    }

                    return buffer.toString();


                } catch (MalformedURLException e) {
                    e.printStackTrace();
                } catch (IOException e) {
                    e.printStackTrace();
                } finally {
                    if (connection != null) {
                        connection.disconnect();
                    }
                    try {
                        if (reader != null) {
                            reader.close();
                        }
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
                return null;

            }

            @Override
            protected void onPostExecute(String result) {
                super.onPostExecute(result);
                if (pd.isShowing()) {
                    pd.dismiss();
                }
            }

            private String getQuery(List<AbstractMap.SimpleEntry> params) throws UnsupportedEncodingException {
                StringBuilder result = new StringBuilder();
                boolean first = true;

                for (AbstractMap.SimpleEntry pair : params) {
                    if (first)
                        first = false;
                    else
                        result.append("&");

                    result.append(URLEncoder.encode((String) pair.getKey(), "UTF-8"));
                    result.append("=");
                    result.append(URLEncoder.encode((String) pair.getValue(), "UTF-8"));
                }

                return result.toString();
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
                        Uri downloadUrl = (Uri) response.get("version_url");

                        if (currentVersionNumber != latestVersionNumber) {
                            AlertDialog.Builder downloadAlert = new AlertDialog.Builder(LoginActivity.this);
                            downloadAlert.setTitle("Update Available.")
                                    .setMessage("Please download the latest update to continue using Safety Book Reader.")
                                    .setPositiveButton("Download", new DialogInterface.OnClickListener() {
                                        @Override
                                        public void onClick(DialogInterface dialogInterface, int i) {
                                            downloadUpdate(downloadUrl);

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

                            groupsDao = new GroupsDao(LoginActivity.this);
                            assignmentsDao = new AssignmentsDao(LoginActivity.this);
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

        private void downloadUpdate(Uri uri)
        {
            downloadManager = (DownloadManager) getSystemService(Context.DOWNLOAD_SERVICE);
            DownloadManager.Request request = new DownloadManager.Request(uri);
            request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
            Long reference = downloadManager.enqueue(request);
        }

        private void checkIfInstalled( int latestVersionNumber)
        {
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

        public boolean isOnline()
        {
            ConnectivityManager cm =
                    (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
            NetworkInfo netInfo = cm.getActiveNetworkInfo();
            return netInfo != null && netInfo.isConnectedOrConnecting();
        }
    }
}
