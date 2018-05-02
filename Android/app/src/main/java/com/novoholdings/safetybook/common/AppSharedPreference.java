package com.novoholdings.safetybook.common;

/**
 * Created by James on 11/19/2017.
 */

import android.content.Context;
import android.content.SharedPreferences;

public class AppSharedPreference {

    private static final String PREF_NAME="SafetyBookReaderApp";
    public static final String FIREBASE_TOKEN="FirebaseToken";
    public static final String USER_EMAIL="Email";
    public static final String USER_ID="ID";
    public static final String USER_FIRSTNAME="FirstName";
    public static final String USER_LAST_NAME="LastName";

    public static void putData(Context ct , String key , String value)
    {
        SharedPreferences myPrefs = ct.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor prefsEditor = myPrefs.edit();
        prefsEditor.putString(key, value);
        prefsEditor.apply();
    }


    public static String getData(Context ct , String key, String defaultStr)
    {
        SharedPreferences myPrefs = ct.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        String prefName = myPrefs.getString(key, defaultStr);
        return prefName;
    }


    public static void putBoolean(Context ct , String key , boolean value)
    {
        SharedPreferences myPrefs = ct.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor prefsEditor = myPrefs.edit();
        prefsEditor.putBoolean(key, value);
        prefsEditor.apply();
    }


    public static boolean getBoolean(Context ct , String key,boolean defaultVal)
    {
        SharedPreferences myPrefs = ct.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        boolean prefName = myPrefs.getBoolean(key, defaultVal);
        return prefName;
    }

    public static void putInteger(Context ct , String key , int value)
    {
        SharedPreferences myPrefs = ct.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor prefsEditor = myPrefs.edit();
        prefsEditor.putInt(key, value);
        prefsEditor.commit();
    }


    public static int getInteger(Context ct , String key, int def)
    {
        SharedPreferences myPrefs = ct.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        int prefName = myPrefs.getInt(key, def);
        return prefName;
    }

    public static void putLong(Context ct , String key , long value)
    {
        SharedPreferences myPrefs = ct.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor prefsEditor = myPrefs.edit();
        prefsEditor.putLong(key, value);
        prefsEditor.apply();
    }


    public static long getLong(Context ct , String key, long def)
    {
        SharedPreferences myPrefs = ct.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        long prefName = myPrefs.getLong(key, def);
        return prefName;
    }

    public static void removeKey(Context ct,String key) {

        SharedPreferences myPrefs = ct.getSharedPreferences(AppSharedPreference.PREF_NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor prefsEditor = myPrefs.edit();
        prefsEditor.remove(key);
        prefsEditor.apply();

    }

    public static void clearAppPrefs(Context ct)
    {
        SharedPreferences myPrefs = ct.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor prefsEditor = myPrefs.edit();
        prefsEditor.clear();
        prefsEditor.apply();
    }
}
