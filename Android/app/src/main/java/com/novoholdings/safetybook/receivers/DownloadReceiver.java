package com.novoholdings.safetybook.receivers;

import android.app.DownloadManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Environment;
import android.support.v4.content.FileProvider;

import com.novoholdings.safetybook.BuildConfig;
import com.novoholdings.safetybook.common.AppProperties;
import com.novoholdings.safetybook.common.MyFileProvider;

import java.io.File;

public class DownloadReceiver extends BroadcastReceiver {

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
            Intent install = new Intent(Intent.ACTION_VIEW);
            // Needs to be changed

            Uri uri = MyFileProvider.getUriForFile(context, BuildConfig.APPLICATION_ID + ".provider", new File(
                    Environment.getExternalStorageDirectory() + AppProperties.SDCARD_APP_FOLDER_NAME +"/app-full-release.apk"));
            install.setDataAndType(uri, "application/vnd.android.package-archive");
            install.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            install.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            context.startActivity(install);
            //Uri photoURI = FileProvider.getUriForFile(context, context.getApplicationContext().getPackageName() + ".my.package.name.provider", createImageFile());

        }
    }

}
