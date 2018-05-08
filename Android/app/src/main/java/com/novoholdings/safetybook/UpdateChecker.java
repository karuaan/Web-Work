package com.novoholdings.safetybook;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.DownloadManager;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.support.v4.app.ActivityCompat;
import android.widget.Button;

import com.android.volley.BuildConfig;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.firebase.ui.auth.AuthUI;
import com.google.firebase.auth.FirebaseAuth;
import com.novoholdings.safetybook.activities.GroupsActivity;
import com.novoholdings.safetybook.activities.LoginActivity;
import com.novoholdings.safetybook.common.AppProperties;
import com.novoholdings.safetybook.database.AssignmentsDao;
import com.novoholdings.safetybook.database.GroupsDao;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Arrays;
import java.util.List;

public class UpdateChecker{

    private Context mContext;

    private FirebaseAuth mAuth;

    DownloadManager downloadManager;

    private static final int RC_SIGN_IN = 123;

    List<AuthUI.IdpConfig> providers = Arrays.asList(
            new AuthUI.IdpConfig.EmailBuilder().setAllowNewAccounts(false).build());

    private static final String TAG = "LoginActivity";

    public UpdateChecker(FirebaseAuth auth, Context ctx, DownloadManager dm)
    {
        mAuth = auth;

        mContext = ctx;

        downloadManager =  (DownloadManager) mContext.getSystemService(Context.DOWNLOAD_SERVICE);

        final int RC_SIGN_IN = 123;

        List<AuthUI.IdpConfig> providers = Arrays.asList(
                new AuthUI.IdpConfig.EmailBuilder().setAllowNewAccounts(false).build());
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
                                        Intent intent = new Intent(mContext, LoginActivity.class);
                                        intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                                        intent.putExtra("EXIT", true);
                                        mContext.startActivity(intent);

                                        if (getIntent().getExtras() != null && getIntent().getExtras().getBoolean("EXIT", false)) {
                                            finish();
                                        }
                                    }
                                })
                                .show();
                    } else {
                        Button loginButton = (Button) findViewById(R.id.loginButton);
                        Button forgotPass = (Button) findViewById(R.id.forgetPass);

                        mAuth = FirebaseAuth.getInstance();

                        if (mAuth.getCurrentUser() == null) {
                            AuthUI.IdpConfig.EmailBuilder emailBuilder = new AuthUI.IdpConfig.EmailBuilder();
                            emailBuilder.setAllowNewAccounts(false);
                            ActivityCompat.startActivityForResult(// Get an instance of AuthUI based on the default app
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

    private void downloadUpdate(Uri uri)
    {
        DownloadManager downloadManager = (DownloadManager) getSystemService(Context.DOWNLOAD_SERVICE);
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
}
