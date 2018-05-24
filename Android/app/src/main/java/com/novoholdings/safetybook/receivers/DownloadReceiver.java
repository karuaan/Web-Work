package com.novoholdings.safetybook.receivers;

import android.app.DownloadManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.support.v4.content.FileProvider;

import com.novoholdings.safetybook.BuildConfig;
import com.novoholdings.safetybook.common.AppProperties;
import com.novoholdings.safetybook.common.MyFileProvider;

import java.io.File;

public class DownloadReceiver extends BroadcastReceiver {

    public String fileName;
    public long apkDownload;
    private Context context;

    public DownloadReceiver(Context context) {
        this.context = context;
    };

    public DownloadReceiver() {};

    @Override
    public void onReceive(Context ctxt, Intent intent) {
        long referenceId = intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1);
        if (referenceId == apkDownload){
            // Needs to be changed

            File appFile = new File(
                    Environment.getExternalStorageDirectory() + AppProperties.SDCARD_APP_FOLDER_NAME +"/"+fileName);

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                Uri apkUri = FileProvider.getUriForFile(context, BuildConfig.APPLICATION_ID + ".provider", appFile);
                Intent installIntent = new Intent(Intent.ACTION_INSTALL_PACKAGE);
                installIntent.setDataAndType(apkUri, "application/vnd.android.package-archive");
                installIntent.setFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                context.startActivity(installIntent);
            } else {
                Uri apkUri = Uri.fromFile(appFile);
                Intent installIntent = new Intent(Intent.ACTION_VIEW);
                installIntent.setDataAndType(apkUri, "application/vnd.android.package-archive");
                installIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                context.startActivity(installIntent);
            }
            //Uri photoURI = FileProvider.getUriForFile(context, context.getApplicationContext().getPackageName() + ".my.package.name.provider", createImageFile());

        }
    }

}
