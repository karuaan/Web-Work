package com.novoholdings.safetybook.http;

import android.app.AlertDialog;
import android.app.DownloadManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.os.Environment;

import com.android.volley.Response;
import com.novoholdings.safetybook.BuildConfig;
import com.novoholdings.safetybook.activities.LoginActivity;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;

public class UpdateResponse implements Response.Listener<JSONObject> {

    private Context mContext;

    private long apkDownload;

    public UpdateResponse(Context ctx){
        mContext = ctx;
    }
    public void onResponse(JSONObject response) {
        int currentVersionNumber = BuildConfig.VERSION_CODE;

        try {
            int latestVersionNumber = response.getInt("version_number");
            String downloadLinkStr = response.getString("version_url");
            Uri downloadLinkUri = Uri.parse(downloadLinkStr);

            if (currentVersionNumber < latestVersionNumber) {
                AlertDialog.Builder downloadAlert = new AlertDialog.Builder(mContext);
                downloadAlert.setTitle("Update Available.")
                        .setMessage("Please download the latest update to continue using Safety Book Reader.")
                        .setPositiveButton("Download", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialogInterface, int i) {
                                downloadUpdate(downloadLinkUri);
                            }
                        })
                        .setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialogInterface, int i) {
                                Intent intent = new Intent(mContext, LoginActivity.class);
                                intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                                intent.putExtra("EXIT", true);
                                mContext.startActivity(intent);

                            }
                        })
                        .show();
            } else {

            }

        } catch (JSONException e) {
            e.printStackTrace();
        }

    }

    private void downloadUpdate(Uri uri)
    {
        try {
            DownloadManager downloadManager = (DownloadManager) mContext.getSystemService(Context.DOWNLOAD_SERVICE);
            DownloadManager.Request request = new DownloadManager.Request(uri);
            File file = new File(Environment.getExternalStorageDirectory(), "reader");
            request.setDestinationUri(Uri.fromFile(file));
            request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
            Long reference = downloadManager.enqueue(request);
            apkDownload = reference;
        }
        catch (IllegalArgumentException e) {
            e.printStackTrace();
        }

    }

    BroadcastReceiver onComplete=new BroadcastReceiver() {
        public void onReceive(Context ctxt, Intent intent) {
            long referenceId = intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1);
            if (referenceId == apkDownload){
                Intent install = new Intent(Intent.ACTION_VIEW);
                // Needs to be changed
                install.setDataAndType(Uri.fromFile(new File(Environment.getExternalStorageDirectory() + "/Android/data/com.temp.tempaa/files/Download/update.apk")), "application/vnd.android.package-archive");
                install.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                mContext.startActivity(install);
            }
        }
    };
}
