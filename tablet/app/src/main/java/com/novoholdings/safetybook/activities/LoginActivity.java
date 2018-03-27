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

import com.android.volley.Request;
import com.android.volley.Request.Method;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.facebook.stetho.Stetho;
import com.facebook.stetho.okhttp3.StethoInterceptor;
//import com.novoholdings.safetybook.BuildConfig;
import com.novoholdings.safetybook.Manifest;
import com.novoholdings.safetybook.R;
import com.novoholdings.safetybook.common.AppProperties;
import com.novoholdings.safetybook.database.AssignmentsDao;
import com.novoholdings.safetybook.database.GroupsDao;
import com.okta.appauth.android.OktaAppAuth;

import net.openid.appauth.AuthorizationException;

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
import java.util.AbstractMap;
import java.util.ArrayList;
import java.util.List;

import okhttp3.OkHttpClient;
//import com.novoholdings.safetybook.BuildConfig;
import static android.content.Context.NOTIFICATION_SERVICE;
import net.openid.appauth.AuthorizationException;
import com.okta.appauth.android.*;
import com.facebook.stetho.okhttp3.StethoInterceptor;
import com.facebook.stetho.Stetho;
import android.content.SharedPreferences;
import android.os.Bundle;


public class LoginActivity extends AppCompatActivity{

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

    private OktaAppAuth mOktaAuth;

    NotificationCompat.Builder threeDayNotification, oneDayNotification, oneHourNotification, overdueNotification, newGroupNotifier, newAssignmentNotifier, testNotifier;
    private static final int threeDay = 5548;
    private static final int oneDay = 5546;
    private static final int oneHour = 5542;
    private static final int overdueNotifi = 5524;
    private static final int newGroupNotification = 5584;
    private static final int newAssignmentNotification = 5562;
    private static final int newTestNotify = 5588;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        updateChecker();
        setContentView(R.layout.activity_main);
        Stetho.initializeWithDefaults(this);

//        forgotPass.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View v) {
//                Intent forgetPass = new Intent(LoginActivity.this, ForgetPassActivity.class);
//                startActivity(forgetPass);
//            }

        threeDayNotification = new NotificationCompat.Builder(this);
        threeDayNotification.setAutoCancel(true);

        oneDayNotification = new NotificationCompat.Builder(this);
        oneDayNotification.setAutoCancel(true);

        oneHourNotification = new NotificationCompat.Builder(this);
        oneHourNotification.setAutoCancel(true);

        overdueNotification = new NotificationCompat.Builder(this);

        newGroupNotifier = new NotificationCompat.Builder(this);
        newGroupNotifier.setAutoCancel(true);

        newAssignmentNotifier = new NotificationCompat.Builder(this);
        newAssignmentNotifier.setAutoCancel(true);

        testNotifier = new NotificationCompat.Builder(this);
        testNotifier.setAutoCancel(true);
    }

    private void startAuth() {
        Intent completionIntent = new Intent(this, GroupsActivity.class);
        Intent cancelIntent = new Intent(this, LoginActivity.class);
        cancelIntent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);

        mOktaAuth.login(
                this,
                PendingIntent.getActivity(this, 0, completionIntent, 0),
                PendingIntent.getActivity(this, 0, cancelIntent, 0)
        );
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
                connection.setRequestProperty("Content-Type","application/x-www-form-urlencoded");
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

        private String getQuery(List<AbstractMap.SimpleEntry> params) throws UnsupportedEncodingException
        {
            StringBuilder result = new StringBuilder();
            boolean first = true;

            for (AbstractMap.SimpleEntry pair : params)
            {
                if (first)
                    first = false;
                else
                    result.append("&");

                result.append(URLEncoder.encode((String)pair.getKey(), "UTF-8"));
                result.append("=");
                result.append(URLEncoder.encode((String)pair.getValue(), "UTF-8"));
            }

            return result.toString();
        }
    }

    public void setThreeDayNotifier(String name)
    {
        String message = "Assignment due date is creeping close!";
        String titleText = "Group " + name + " Assignment";
        String notifierText = "Group " + name + "'s Assignment is due in 3 days. Don't be late!";

        threeDayNotification.setSmallIcon(R.drawable.ic_assignment);
        threeDayNotification.setTicker(message);
        threeDayNotification.setWhen(System.currentTimeMillis());
        threeDayNotification.setContentTitle(titleText);
        threeDayNotification.setContentText(notifierText);

        Intent intent = new Intent(this, GroupsActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);
        threeDayNotification.setContentIntent(pendingIntent);

        //Builds Notification and issues it

        NotificationManager nm = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        nm.notify(threeDay, threeDayNotification.build());
    }

    public void setOneDayNotifier(String name)
    {
        String message = "Assignment due date is creeping close!";
        String titleText = "Group " + name + " Assignment";
        String notifierText = "Group " + name + "'s Assignment is due in 1 day. Don't be late!";

        oneDayNotification.setSmallIcon(R.drawable.ic_assignment);
        oneDayNotification.setTicker(message);
        oneDayNotification.setWhen(System.currentTimeMillis());
        oneDayNotification.setContentTitle(titleText);
        oneDayNotification.setContentText(notifierText);

        Intent intent = new Intent(this, GroupsActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);
        oneDayNotification.setContentIntent(pendingIntent);

        //Builds Notification and issues it

        NotificationManager manager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        manager.notify(oneDay, oneDayNotification.build());
    }

    public void setOneHourNotifier(String name)
    {
        String message = "Assignment due date is creeping close!";
        String titleText = "Group " + name + " Assignment";
        String notifierText = "Group " + name + "'s Assignment is due in 1 hour. Don't be late!";

        oneHourNotification.setSmallIcon(R.drawable.ic_assignment);
        oneHourNotification.setTicker(message);
        oneHourNotification.setWhen(System.currentTimeMillis());
        oneHourNotification.setContentTitle(titleText);
        oneHourNotification.setContentText(notifierText);

        Intent intent = new Intent(this, GroupsActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);
        oneHourNotification.setContentIntent(pendingIntent);

        //Builds Notification and issues it

        NotificationManager manager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        manager.notify(oneHour, oneHourNotification.build());
    }

    public void setOverdueNotifier(String name)
    {
        String message = "Assignment due date is creeping close!";
        String titleText = "Group " + name + " Assignment";
        String notifierText = "Group " + name + "'s Assignment is due in 1 hour. Don't be late!";

        overdueNotification.setSmallIcon(R.drawable.ic_assignment);
        overdueNotification.setTicker(message);
        overdueNotification.setWhen(System.currentTimeMillis());
        overdueNotification.setContentTitle(titleText);
        overdueNotification.setContentText(notifierText);

        Intent intent = new Intent(this, GroupsActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);
        overdueNotification.setContentIntent(pendingIntent);

        //Builds Notification and issues it

        NotificationManager manager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        manager.notify(overdueNotifi, overdueNotification.build());
    }

    public void setNewGroupNotifier(String name)
    {
        String message = "Welcome to your new group!";
        String titleText = "Welcome!";
        String notifierText = "You have been added to Group " + name;

        newGroupNotifier.setSmallIcon(R.drawable.ic_group_name);
        newGroupNotifier.setTicker(message);
        newGroupNotifier.setWhen(System.currentTimeMillis());
        newGroupNotifier.setContentTitle(titleText);
        newGroupNotifier.setContentText(notifierText);

        Intent intent = new Intent(this, GroupsActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);
        newGroupNotifier.setContentIntent(pendingIntent);

        //Builds Notification and issues it

        NotificationManager manager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        manager.notify(newGroupNotification, newGroupNotifier.build());
    }

    public void setNewAssignmentNotifier(String groupName)
    {
        String message = "New Assignment has been added!";
        String titleText = "New Assignment!";
        String notifierText = "Assignment has been added to Group " + groupName;

        newAssignmentNotifier.setSmallIcon(R.drawable.ic_assignment);
        newAssignmentNotifier.setTicker(message);
        newAssignmentNotifier.setWhen(System.currentTimeMillis());
        newAssignmentNotifier.setContentTitle(titleText);
        newAssignmentNotifier.setContentText(notifierText);

        Intent intent = new Intent(this, GroupsActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);
        newAssignmentNotifier.setContentIntent(pendingIntent);

        //Builds Notification and issues it

        NotificationManager manager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        manager.notify(newAssignmentNotification, newAssignmentNotifier.build());
    }

    public void setTestNotifier()
    {
        String message = "You are now in the Groups Page!";
        String titleText = "Groups Page";
        String notifierText = "This is the groups page!";

        testNotifier.setSmallIcon(R.drawable.ic_assignment);
        testNotifier.setTicker(message);
        testNotifier.setWhen(System.currentTimeMillis());
        testNotifier.setContentTitle(titleText);
        testNotifier.setContentText(notifierText);

        Intent intent = new Intent(this, GroupsActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);
        testNotifier.setContentIntent(pendingIntent);

        //Builds Notification and issues it

        NotificationManager manager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        manager.notify(newTestNotify, testNotifier.build());
    }

    private void updateChecker()
    {
        int currentVersionNumber = BuildConfig.VERSION_CODE;

        String  url = AppProperties.DIR_SERVER_ROOT+"/androidVersionTable";

        JsonObjectRequest getComplete = new JsonObjectRequest(Request.Method.GET, url, null, new Response.Listener<JSONObject>() {
            public void onResponse(JSONObject response)
            {
                try
                {
                    int latestVersionNumber = response.getInt("versionNumber");
                    Uri downloadUrl = (Uri) response.get("androidapk");

                    if (currentVersionNumber != latestVersionNumber) {
                        AlertDialog.Builder downloadAlert = new AlertDialog.Builder(LoginActivity.this);
                        downloadAlert.setTitle("New Update Available.")
                                .setMessage("Please download the latest update to continue using Safety Book Reader.")
                                .setPositiveButton("Download", new DialogInterface.OnClickListener() {
                                    @Override
                                    public void onClick(DialogInterface dialogInterface, int i)
                                    {
                                       downloadUpdate(downloadUrl);

                                       checkIfInstalled(latestVersionNumber);

                                    }
                                })
                                .setNegativeButton("Update Later", new DialogInterface.OnClickListener() {
                                    @Override
                                    public void onClick(DialogInterface dialogInterface, int i)
                                    {
                                        Intent intent = new Intent(getApplicationContext(), LoginActivity.class);
                                        intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                                        intent.putExtra("EXIT", true);
                                        startActivity(intent);

                                        if (getIntent().getExtras() != null && getIntent().getExtras().getBoolean("EXIT", false))
                                        {
                                            finish();
                                        }
                                    }
                                })
                                .show();
                    }

                    else
                    {
                        new OkHttpClient.Builder()
                                .addNetworkInterceptor  (new StethoInterceptor())
                                .build();

                        groupsDao = new GroupsDao(LoginActivity.this);
                        assignmentsDao = new AssignmentsDao(LoginActivity.this);

                        loginButton = (Button)findViewById(R.id.loginButton);
                        forgotPass = (Button) findViewById(R.id.forgetPass);

                        mOktaAuth = OktaAppAuth.getInstance(LoginActivity.this);

                        if (mOktaAuth.isUserLoggedIn()){
                            Intent i = new Intent(LoginActivity.this, GroupsActivity.class);
                            startActivity(i);
                        }
                        else
                            mOktaAuth.init(LoginActivity.this, new OktaAppAuth.OktaAuthListener() {
                                @Override
                                public void onSuccess() {
                                    //handle successful initialization (display login button)
                                    loginButton.setOnClickListener(new View.OnClickListener() {
                                        @Override
                                        public void onClick(View v) {
                                            startAuth();
                                        }
                                    });
                                }

                                @Override
                                public void onTokenFailure(@NonNull AuthorizationException e) {
                                    //handle failed initialization
                                    e.printStackTrace();
                                }
                            });
                    }

                } catch (JSONException e) {
                    e.printStackTrace();
                }

            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error)
            {
                AlertDialog.Builder alert = new AlertDialog.Builder(LoginActivity.this);
                alert.setTitle("Could not check for updates.")
                        .setMessage(error.getMessage()+"\n\nPlease check your network connection and try again.")
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

                                if (getIntent().getExtras() != null && getIntent().getExtras().getBoolean("EXIT", false))
                                {
                                    finish();
                                }
                            }
                        })
                        .show();
            }
        });

        Volley.newRequestQueue(this).add(getComplete);
    }

    private void downloadUpdate(Uri uri )
    {
        downloadManager = (DownloadManager)getSystemService(Context.DOWNLOAD_SERVICE);
        DownloadManager.Request request = new DownloadManager.Request(uri);
        request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
        Long reference = downloadManager.enqueue(request);
    }

    private void checkIfInstalled(int latestVersionNumber)
    {
        int checkedVersionNumber = BuildConfig.VERSION_CODE;

        if (checkedVersionNumber != latestVersionNumber)
        {
            AlertDialog.Builder installAlert = new AlertDialog.Builder(LoginActivity.this);
            installAlert.setTitle("Please Install.")
                    .setMessage("Please go to your download manager and install the latest application update.")
                    .setNeutralButton("OK.", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialogInterface, int i)
                        {
                            Intent intent = new Intent(getApplicationContext(), LoginActivity.class);
                            intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                            intent.putExtra("EXIT", true);
                            startActivity(intent);

                            if (getIntent().getExtras() != null && getIntent().getExtras().getBoolean("EXIT", false))
                            {
                                finish();
                            }
                        }
                    })
                    .show();
        }
    }


}
