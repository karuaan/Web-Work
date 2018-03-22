package com.novoholdings.safetybook.common;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;

/**
 * Created by James on 12/31/2017.
 */

public class Utils {

    public static boolean isOnline(Context ctx) {
        ConnectivityManager cm = (ConnectivityManager) ctx
                .getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo networkInfo = cm.getActiveNetworkInfo();
        if (cm==null || networkInfo == null)
            return false;
        if (!networkInfo.isConnected() || !networkInfo.isAvailable())
            return false;
        return networkInfo.isConnectedOrConnecting();
    }
}
