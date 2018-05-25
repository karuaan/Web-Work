package com.novoholdings.safetybook.common;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.math.BigInteger;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;

import org.joda.time.DateTime;
import org.joda.time.format.ISODateTimeFormat;
import org.json.JSONException;
import org.json.JSONObject;

import android.annotation.SuppressLint;
import android.annotation.TargetApi;
import android.app.Activity;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.graphics.drawable.StateListDrawable;
import android.os.Build;
import android.os.Environment;
import android.os.Vibrator;
import android.util.Log;
import android.view.View;
import android.view.View.MeasureSpec;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.inputmethod.InputMethodManager;
import android.widget.ListAdapter;
import android.widget.ListView;

import com.novoholdings.safetybook.BuildConfig;
import com.novoholdings.safetybook.LabelValueBean;


@SuppressLint("SimpleDateFormat")
public class AppProperties {

    private static AppProperties mInstance= null;

    public static final String SDCARD_APP_FOLDER_NAME="/Safety Book Reader";

    public static final String APP_DISPLAY_NAME="Safety Book Reader";

    //public static final String DIR_SERVER_ROOT="https://safetytraining.libertyelevator.com:3000/";

    public static final String DIR_SERVER_ROOT="http://192.168.0.110:3000/";

    public static final String DIR_PDF="http://ec2-54-191-3-208.us-west-2.compute.amazonaws.com:3000/pdfs";

    public static int SYNC_TIME_LIMIT=12 * 1000;

    public static final int TIME_MINUTES_MULTIPLIER=60 * 1000;
    public static final int TIME_SECONDS_MULTIPLIER=1000;

    public static final String PHOTO_PATH = "PHOTO_PATH";

    public static final String path_key = "paths" ;


    public static final String IMAGES_DIRECTORY=Environment.getExternalStorageDirectory().getPath()+"JSA/";

    public static final String NO="No";
    public static final String YES="Yes";

    public static final String STATUS_DELETED="D";
    public static final String STATUS_ACTIVE="A";
    public static final String STATUS_INITIALIZED="I";

    public static final int SAVE_TYPE_PDF=1;
    public static final int SAVE_TYPE_CSV=2;
    public static final int SAVE_TYPE_EMAIL=3;

    public static final String JSA_INCOMPLETE="I";
    public static final String JSA_COMPLETE="C";
    public static final String JSA_SAVED="S";


    public final static String DB_DATE_FORMAT="yyyy-MM-dd";//MM/dd/yyyy
    public final static String DB_DATE_FORMAT_REV="MM/dd/yyyy";
    public final static String DISPLAY_DATE_TIME_FORMAT="EEE, MM/dd/yyyy hh:mm a";
    public final static String DB_DATE_TIME_FORMAT="yyyy-MM-dd HH:mm:ss";   //MM/dd/yyyy HH:mm:ss
    public final static String MYSQL_DATE_TIME_FORMAT="yyyy-MM-dd HH:mm:ss";

    public final static String ISO_DATE_TIME_FORMAT="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";

    public final static String ISO_DATE_TIME_FORMAT_FULL="'ISODate(\"'yyyy-MM-dd'T'HH:mm:ss.SSS'Z\")'";//ISODate("2014-11-11T14:30:33.397Z")

    final static long MILLISECONDS_IN_A_DAY = 1000*60*60*24;
    //////////////////////////////////////////////////////////////////////////////////

    public static final String CRUD_ACTION_CREAT="Create";
    public static final String CRUD_ACTION_UPDATE="Update";
    public static final String CRUD_ACTION_DELETE="Delete";

    //////////////////////////////////////////////////////////////////////////////////
    protected AppProperties(){}

    public static synchronized AppProperties getInstance(){
        if(null == mInstance){
            mInstance = new AppProperties();
        }
        return mInstance;
    }

    private static Vibrator vibe;
    public static Vibrator getVibrator(Context context){
        if(vibe==null)
            vibe = (Vibrator) context.getSystemService(Context.VIBRATOR_SERVICE) ;
        return vibe;
    }

    private static Animation cAnimation;
/* public static Animation getAnimation(Context context){
        if(cAnimation==null)
            cAnimation = AnimationUtils.loadAnimation(context, R.anim.click_anim);
        return cAnimation;
    }*/


    public static boolean isDemoMode(){
        return BuildConfig.FLAVOR.equals("demo");
    }
    public static boolean isNull(String str) {
        if (null == str || str.trim().equals("")|| str.trim().equals("null") || str.trim().equals("<null>")|| str.trim().equals("(null)")) {
            return true;
        } else {
            return false;
        }
    }

    public static boolean isNullOrNegative(String str) {
        if (null == str || str.trim().equals("")|| str.trim().equals("null") || str.trim().equals("<null>")
                || str.trim().equals("(null)") || str.trim().equals("-1")) {
            return true;
        } else {
            return false;
        }
    }

    public static String NVL(String str) {
        if (null == str || str.trim().equals("")|| str.trim().equals("null") || str.trim().equals("<null>")|| str.trim().equals("(null)")) {
            return "";
        } else {
            return str.trim();
        }
    }

    public static String NVL(String str, String defaultStr) {
        if (null == str || str.trim().equals("")|| str.trim().equals("null") || str.trim().equals("<null>")|| str.trim().equals("(null)")) {
            return defaultStr;
        } else {
            return str.trim();
        }
    }

    public static int getInteger(String str,int val) {
        int ret=val;
        if (null == str || str.trim().equals("")) {
            return ret;
        } else {
            try {
                ret=Integer.parseInt(str.trim());
            } catch (Exception e) {
            }
            return ret;
        }
    }

    public static String getString(int org,String val) {
        String ret=val;
        try {
            ret=String.valueOf(org);
            if(isNull(ret))
                ret=val;
            else
                ret=ret.trim();
        } catch (Exception e) {
        }
        return ret;
    }


    public static String getDateTimeZero(String str) {
        int ret=0;
        try {
            ret=Integer.parseInt(str);
        } catch (Exception e) {
        }

        if (ret<10) {
            return "0"+ret;
        } else {

            return ret+"";
        }
    }

    public static String getDateTimeZero(int str) {
        int ret=str;

        if (ret<10) {
            return "0"+ret;
        } else {

            return ret+"";
        }
    }

    public static int getLblValIndex(LabelValueBean[] lbl, String searchValue) {

        int ret=-1;

        for (int i = 0; i < lbl.length; i++) {
            LabelValueBean labelValueBean = lbl[i];

            if(labelValueBean.getValue().equals(searchValue))
            {
                ret=i;
                break;
            }
        }

        return ret;
    }

    public static Date parseEventDate(String dt,String sourceFormat){
        Date date =null;
        DateFormat formatter = new SimpleDateFormat(sourceFormat);
        try {
            date = (Date)formatter.parse(dt);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return date;
    }

    public static String getDateKmd(String kmd){

        return kmd.substring(0,10);
    }


    public static String getLocalTime(String dt){
        String timeString = "";
        Date localDate;
        SimpleDateFormat dateFormatOutput;
        try {
            //create new Date object with UTC timezone
            SimpleDateFormat dateFormatInput = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
            dateFormatInput.setTimeZone(TimeZone.getTimeZone("UTC"));
            localDate = dateFormatInput.parse(dt);

            //set output format
            dateFormatOutput = new SimpleDateFormat("HH:mm");
            dateFormatOutput.setTimeZone(TimeZone.getDefault());
            timeString = dateFormatOutput.format(localDate);

        } catch (Exception e){
            e.printStackTrace();
        }
        if (!AppProperties.isNull(timeString)) {

            return timeString;
        }
        return "00:00";
    }

    public static String changeDateFormat(String dt,String sourceFormat,String dest){

        if(isNull(dt))
            return "";

        if(AppProperties.ISO_DATE_TIME_FORMAT.equals(sourceFormat))
        {
            if(dt.contains("ISODate"))
            {
                dt=dt.replace("ISODate(", "");
                dt=dt.replace(")", "");
                dt=dt.replaceAll("\"", "");
            }
            try {


                DateTime dtime = ISODateTimeFormat.dateTime().parseDateTime(dt);
                return dtime.toString(dest);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        String finalDate =null;
        DateFormat formatter = new SimpleDateFormat(sourceFormat);
        DateFormat dateShow = new SimpleDateFormat(dest);

        try {
            Date date = (Date)formatter.parse(dt);
            finalDate=dateShow.format(date);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return finalDate;
    }



    public static String changeDateFormatISO(String jDate,String dest){

        if(isNull(jDate))
            return "";

        String sourceFormat="yyyy-MM-dd HH:mm:ss";


        if (jDate.contains("ISODate"))
            jDate=jDate.replace("ISODate(\"", "");
        if (jDate.contains(".")) {
            //jDate=jDate.replace(".000Z\")", "");
            jDate=jDate.substring(0,jDate.lastIndexOf("."));
        }
        if (jDate.contains("T"))
            jDate=jDate.replace("T", " ");
        String finalDate =null;

        DateFormat formatter = new SimpleDateFormat(sourceFormat);
        DateFormat dateShow = new SimpleDateFormat(dest);

        try {
            Date date = (Date)formatter.parse(jDate);
            finalDate=dateShow.format(date);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return finalDate;
    }

    @SuppressWarnings("deprecation")
    public static String getDateShowFormat(Date date){

        DateFormat dateShow = new SimpleDateFormat("EEEEEEEEEE MMMMMMMMMM dd, yyyy");
        String finalDate="";
        try {
            finalDate=dateShow.format(date);
            int day = date.getDate();
            String dayString=day+suffixes[day]+",";
            finalDate=finalDate.replace(day+",", dayString);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return finalDate;
    }
    @SuppressWarnings("deprecation")
    public static String changeDateShowFormat(Date date, String dateFormat){

        DateFormat dateShow = new SimpleDateFormat(dateFormat);
        String finalDate="";
        try {
            finalDate=dateShow.format(date);
            int day = date.getDate();
            String dayString=day+suffixes[day]+",";
            finalDate=finalDate.replace(day+",", dayString);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return finalDate;
    }
    static String[] suffixes =
            //    0     1     2     3     4     5     6     7     8     9
            { "th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th",
                    //    10    11    12    13    14    15    16    17    18    19
                    "th", "th", "th", "th", "th", "th", "th", "th", "th", "th",
                    //    20    21    22    23    24    25    26    27    28    29
                    "th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th",
                    //    30    31
                    "th", "st" };


//			public static void removeUserSession(Context ct) {
//
//				SharedPreferences myPrefs = ct.getSharedPreferences(AppSharedPreference.PREF_NAME, 1);
//		        SharedPreferences.Editor prefsEditor = myPrefs.edit();
//		        prefsEditor.remove("m_id");
//		        prefsEditor.remove("m_username");
//		        prefsEditor.remove("m_email");
//		        prefsEditor.remove("m_surv_id");
//		        prefsEditor.commit();
//
//			}


    public static double getDouble(String str,double val) {
        double ret=val;
        if (null == str || str.trim().equals("")) {
            return ret;
        } else {
            try {
                ret=Double.parseDouble(str);
            } catch (Exception e) {
            }
            return ret;
        }
    }

    public static File getTempFile(Context cont, String fileName) {
        // it will return /sdcard/image.tmp
        final File path = new File(Environment.getExternalStorageDirectory(), SDCARD_APP_FOLDER_NAME);
        if (!path.exists()) {
            path.mkdir();
        }
        return new File(path, fileName+".tmp");
    }
    public static File getTempFile(Context cont) {
        // it will return /sdcard/image.tmp\
        String root = Environment.getExternalStorageDirectory().toString();

        final File path = new File(root, SDCARD_APP_FOLDER_NAME);
        if (!path.exists()) {
            path.mkdirs();
        }
        return new File(path, "image.tmp");
    }
    public static File getPDFFile(Context cont,String tourId, String tourName, String guardName) {
        // it will return /sdcard/image.tmp
        final File path = new File(Environment.getExternalStorageDirectory(), SDCARD_APP_FOLDER_NAME);
        if (!path.exists()) {
            path.mkdir();
        }
        DateFormat dateShow = new SimpleDateFormat("MMMdd_hhmm");
        String dateChunk=dateShow.format(new Date());
        return new File(path, "SOVA - "+tourName+" - "+getNameInitials(guardName)+" - "+dateChunk+".pdf");
    }

    public static String getNameInitials(String name) {
        if(isNull(name))
            return"USER";
//					String name="Iftikhar Babur";
        String[] splitStringArray = name.split(" ");
        StringBuilder builder = new StringBuilder(3);
        for(int i = 0; i < splitStringArray.length; i++)
        {
            builder.append(splitStringArray[i].substring(0,1));
        }

        return builder.toString();
    }

    public static File getQuestionFile(Context cont,String name) {
        // it will return /sdcard/image.tmp
        final File path = new File(Environment.getExternalStorageDirectory(), SDCARD_APP_FOLDER_NAME);
        if (!path.exists()) {
            path.mkdir();
        }
        return new File(path, name+".tmp");
    }
    public static File getAppFolder() {
        final File path = new File(Environment.getExternalStorageDirectory(), SDCARD_APP_FOLDER_NAME);
        if (!path.exists()) {
            path.mkdir();
        }
        return path;
    }
    public static File getFileName(Context cont,String name) {
        // it will return /sdcard/image.tmp

//				 	name=name+"_"+System.currentTimeMillis();

        final File path = new File(Environment.getExternalStorageDirectory(), SDCARD_APP_FOLDER_NAME);
        if (!path.exists()) {
            path.mkdir();
        }
        return new File(path, name+".jpg");
    }


    public static Bitmap decodeFileHQ(File f){
        try {
            //decode image size
            BitmapFactory.Options o = new BitmapFactory.Options();
            o.inJustDecodeBounds = true;
            BitmapFactory.decodeStream(new FileInputStream(f),null,o);

            //Find the correct scale value. It should be the power of 2.
            final int REQUIRED_SIZE=1200;
            int width_tmp=o.outWidth, height_tmp=o.outHeight;
            int scale=1;
            while(true){
                if(width_tmp/2<REQUIRED_SIZE || height_tmp/2<REQUIRED_SIZE)
                    break;
                width_tmp/=2;
                height_tmp/=2;
                scale*=2;
            }

            //decode with inSampleSize
            BitmapFactory.Options o2 = new BitmapFactory.Options();
            o2.inSampleSize=scale;
            return BitmapFactory.decodeStream(new FileInputStream(f), null, o2);
        } catch (FileNotFoundException e) {}
        return null;
    }

    public static Bitmap decodeFile(File f){
        try {
            //decode image size
            BitmapFactory.Options o = new BitmapFactory.Options();
            o.inJustDecodeBounds = true;
            BitmapFactory.decodeStream(new FileInputStream(f),null,o);

            //Find the correct scale value. It should be the power of 2.
            final int REQUIRED_SIZE=400;
            int width_tmp=o.outWidth, height_tmp=o.outHeight;
            int scale=1;
            while(true){
                if(width_tmp/2<REQUIRED_SIZE || height_tmp/2<REQUIRED_SIZE)
                    break;
                width_tmp/=2;
                height_tmp/=2;
                scale*=2;
            }

            //decode with inSampleSize
            BitmapFactory.Options o2 = new BitmapFactory.Options();
            o2.inSampleSize=scale;
            return BitmapFactory.decodeStream(new FileInputStream(f), null, o2);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        return null;
    }

    final protected static char[] hexArray = {'0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'};
    public static String bytesToHex(byte[] bytes) {
        char[] hexChars = new char[bytes.length * 2];
        int v;
        for ( int j = 0; j < bytes.length; j++ ) {
            v = bytes[j] & 0xFF;
            hexChars[j * 2] = hexArray[v >>> 4];
            hexChars[j * 2 + 1] = hexArray[v & 0x0F];
        }
        return new String(hexChars);
    }

    public String toHex(String arg) {
        return String.format("%040x", new BigInteger(arg.getBytes()));
    }

    private static final char[] HEX_CHARS = "0123456789abcdef".toCharArray();

    public static String asHex(byte[] buf)
    {
        char[] chars = new char[2 * buf.length];
        for (int i = 0; i < buf.length; ++i)
        {
            chars[2 * i] = HEX_CHARS[(buf[i] & 0xF0) >>> 4];
            chars[2 * i + 1] = HEX_CHARS[buf[i] & 0x0F];
        }
        return new String(chars);
    }


    public static java.sql.Date convertStringToDate(String newDate )  {
        java.sql.Date returnValue = null;
        try {
            returnValue = new java.sql.Date(new SimpleDateFormat(DB_DATE_FORMAT).parse(newDate).getTime());
        } catch (Exception e){}
        return returnValue;
    }

    public static java.sql.Date convertStringToDateTime(String newDate )  {
        java.sql.Date returnValue = null;
        try {
            returnValue = new java.sql.Date(new SimpleDateFormat(DB_DATE_TIME_FORMAT).parse(newDate).getTime());
        } catch (Exception e){
            try{
                returnValue = new java.sql.Date(new SimpleDateFormat(DB_DATE_TIME_FORMAT).parse(newDate+":00").getTime());
            } catch (Exception e2){ }
        }
        return returnValue;
    }
    public static String convertDateToString(java.sql.Date newDate )  {
        return new SimpleDateFormat(DB_DATE_TIME_FORMAT).format(newDate);
    }
    public static String convertDateToStringISO(java.util.Date newDate){
        return new SimpleDateFormat(ISO_DATE_TIME_FORMAT).format(newDate);
    }
    public static String convertDateToString(java.util.Date newDate )  {
        return new SimpleDateFormat(ISO_DATE_TIME_FORMAT).format(newDate);
    }
    public static String getCurrentDate() {
        Date d = getCurrentSqlDate();
        return convertDateToString(d);
    }
    public static String getCurrentDate(String format) {
        Date d = getCurrentSqlDate();
        return new SimpleDateFormat(format).format(d);
    }
    public static java.sql.Date getCurrentSqlDate()  {
        return new java.sql.Date(System.currentTimeMillis());
    }

    public static int compareDates(java.util.Date firstDate, java.util.Date secondDate) {
        int returnValue = 0;

        if(firstDate.after(secondDate)){
            returnValue = 1;
        } else {
            if(firstDate.before(secondDate)){
                returnValue = -1;
            }
        }

        return returnValue;
    }

    public static int compareDatesPart(java.util.Date firstDateW, java.util.Date secondDateW) {
        Calendar c=Calendar.getInstance();
        c.setTime(firstDateW);
        c.set(Calendar.HOUR, 0);
        c.set(Calendar.HOUR_OF_DAY, 0);
        c.set(Calendar.MINUTE, 0);
        c.set(Calendar.SECOND, 0);
        c.set(Calendar.MILLISECOND, 0);
        java.util.Date firstDate = c.getTime();

        c.setTime(secondDateW);
        c.set(Calendar.HOUR, 0);
        c.set(Calendar.HOUR_OF_DAY, 0);
        c.set(Calendar.MINUTE, 0);
        c.set(Calendar.SECOND, 0);
        c.set(Calendar.MILLISECOND, 0);
        java.util.Date secondDate = c.getTime();

        int returnValue = 0;

        if(firstDate.after(secondDate)){
            returnValue = 1;
        } else {
            if(firstDate.before(secondDate)){
                returnValue = -1;
            }
        }

        return returnValue;
    }

    public static Date getSQLDateValue(String param){
        Date date = null;
        if(param == null || param.equals("")){

        }else{
            date = convertStringToDate(param);
        }
        return date;
    }

    public static String getOrdinalFor(int value) {
        int hundredRemainder = value % 100;
        int tenRemainder = value % 10;
        if(hundredRemainder - tenRemainder == 10) {
            return value+"th";
        }

        switch (tenRemainder) {
            case 1:
                return value+"st";
            case 2:
                return value+"nd";
            case 3:
                return value+"rd";
            default:
                return value+"th";
        }
    }



/*
public static void animateClick(View v, Context ctx) {
        v.startAnimation(getAnimation(ctx));
//			AppProperties.getVibrator(ctx).vibrate(20);
    }
*/


    public static String trimLastComma(String a) {
        if (a == null || a.equals("")) {
            return "";
        } else {
            try{
                a=a.substring(0,a.length()-1);
            }catch (Exception e) {
                a= "";
            }
            return a;
        }
    }

    public static String getStringWithComma(String a,String b) {
        if (isNull(a) && isNull(b)) {
            return "";
        }else if (!isNull(a)) {
            return a;
        }else if (!isNull(b)) {
            return b;
        } else {
            return a+","+b;
        }
    }

    public static String appendComma(String... str) {
        String finalString="";
        for (int i = 0; i < str.length; i++) {
            if (isNull(str[i]))
                continue;

            if(isNull(finalString))
                finalString=str[i];
            else
                finalString=finalString+", "+str[i];
        }
        return finalString;
    }


    public static String getUserNameFromPrefs(Context ctx){
        return AppSharedPreference.getData(ctx, "userNameSelected","");
    }

    public static String getUserIdFromPrefs(Context ctx){
        return AppSharedPreference.getData(ctx, "userIdSelected","");
    }

    public static void hideSoftKeyboard(Activity activity) {
        try {
            InputMethodManager inputMethodManager = (InputMethodManager)  activity.getSystemService(Activity.INPUT_METHOD_SERVICE);
            inputMethodManager.hideSoftInputFromWindow(activity.getCurrentFocus().getWindowToken(), 0);

        } catch (Exception e) {
//					e.printStackTrace();
        }
    }

    public static String getCsvFromArrayList(List<String> lst){

        if(lst==null || lst.size()==0)
            return "";

        String idList=lst.toString();
        String csv = idList.substring(1, idList.length() - 1).replace(", ", ",");

        return csv;
    }
    public static String getCsvQueryStringFromArrayList(List<String> lst){

        if(lst==null || lst.size()==0)
            return "";

        String idList=lst.toString();
        String csv = idList.substring(1, idList.length() - 1).replace(", ", ",");
        getQueryString(csv);

        return csv;
    }

    public static String getFileNameFromPath(String filePath){
        return filePath.substring(filePath.lastIndexOf("/")+1);
    }
    public static String getQueryString(String str){

        if(isNull(str))
            return "''";

        str=str.replaceAll(",","','");
        str="'"+str+"'";

        return str;
    }


    public static List<String> getArrayListFromCSV(String str){

        if(isNull(str))
            return new ArrayList<String>();

        List<String> items = Arrays.asList(str.split("\\s*,\\s*"));
        return items;
    }


    public static void getTotalHeightofListView(ListView listView) {

        ListAdapter mAdapter = listView.getAdapter();

        int totalHeight = 0;

        for (int i = 0; i < mAdapter.getCount(); i++) {
            View mView = mAdapter.getView(i, null, listView);

            mView.measure(
                    MeasureSpec.makeMeasureSpec(0, MeasureSpec.UNSPECIFIED),

                    MeasureSpec.makeMeasureSpec(0, MeasureSpec.UNSPECIFIED));

            totalHeight += mView.getMeasuredHeight();
            Log.w("HEIGHT" + i, String.valueOf(totalHeight));

        }

        ViewGroup.LayoutParams params = listView.getLayoutParams();
        params.height = totalHeight
                + (listView.getDividerHeight() * (mAdapter.getCount() - 1));
        listView.setLayoutParams(params);
        listView.requestLayout();

    }



    private static StateListDrawable states;
    public static StateListDrawable getButtonStateList(Context ctx){

        if(states==null)
            states =refreshButtonStateList(ctx);
        return states;

    }

    public static StateListDrawable refreshButtonStateList(Context ctx){

        int normal = Color.parseColor("#FF0000");
        int pressed = Color.parseColor("#00FF00");
        int focused = Color.parseColor("#FFFF00");


        states = new StateListDrawable();




        states.addState(new int[] {android.R.attr.state_pressed},new ColorDrawable(pressed));
        states.addState(new int[] {android.R.attr.state_focused},new ColorDrawable(focused));
        states.addState(new int[] { },new ColorDrawable(normal));


        return states;
    }

    @TargetApi(Build.VERSION_CODES.JELLY_BEAN)

    @SuppressWarnings("rawtypes")
    public static void saveUserData(Context ct, JSONObject userObj2Save) {

        try{

            String fullname = userObj2Save.getString("given_name");
            AppSharedPreference.putData(ct, "u_name", fullname);
        }catch (JSONException e){
            e.printStackTrace();
        }

        try{
                AppSharedPreference.putData(ct, "u_email", (String)userObj2Save.getString("preferred_username"));

        }catch (JSONException e){
            e.printStackTrace();
        }
    }

    public static void removeUserSession(Context ct) {

        AppSharedPreference.removeKey(ct, "u_id");
        AppSharedPreference.removeKey(ct, "u_name");
        AppSharedPreference.removeKey(ct, "u_is_admin");
        AppSharedPreference.removeKey(ct, "u_owner_key");
        AppSharedPreference.removeKey(ct, "u_is_active");
        AppSharedPreference.removeKey(ct, "u_customer_id");

        AppSharedPreference.removeKey(ct, "hasDefaultGroupAssigned");
        AppSharedPreference.removeKey(ct, "hasUploadSyncDone");

        AppSharedPreference.removeKey(ct, "u_is_archived");
        AppSharedPreference.removeKey(ct, "u_free_trial");
        AppSharedPreference.removeKey(ct, "u_user_type");
        AppSharedPreference.removeKey(ct, "u_status");

    }

    public static long getUserId(Context ct) {
        return AppSharedPreference.getLong(ct, "u_id", 0);
    }
    public static long getUserId(Context ct, long defaultVal) {
        return AppSharedPreference.getLong(ct, "u_id", defaultVal);
    }
    public static void setUserId(Context ct, long uId){
        AppSharedPreference.putLong(ct, "u_id", uId);
    }
    public static String getUserName(Context ct) {
        return AppSharedPreference.getData(ct, "u_name", null);
    }
    public static String getUserEmail(Context ct, String defaultVal) {
        return AppSharedPreference.getData(ct, "u_email", defaultVal);
    }


    /*public static boolean isUserLoggedIn(Context ct) {

        try {

            if(!getKinveyClient(ct).isUserLoggedIn())
                return false;
        } catch (Exception e) {
//					return false;
        }

        String uid=getUserId(ct);
        return  uid==null?false:true;
    }*/

    public static String changeDateToISOFormat(String jDate,String dest){

        if(isNull(jDate))
            return "";

        String sourceFormat="yyyy-MM-dd HH:mm:ss";

        jDate=jDate.replace("ISODate(\"", "");
        jDate=jDate.replace(".000Z\")", "");
        jDate=jDate.replace("T", " ");

        String finalDate =null;
        DateFormat formatter = new SimpleDateFormat(sourceFormat);
        DateFormat dateShow = new SimpleDateFormat(dest);

        try {
            Date date = (Date)formatter.parse(jDate);
            finalDate=dateShow.format(date);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return finalDate;
    }

//			  public static String changeDateToWebFormat(String jDate,String sourceFormat){
//
//				    	if(isNull(jDate))
//				    		return "";
//
//				    	String dest="yyyy-MM-dd HH:mm:ss";
//
//						jDate=jDate.replace("ISODate(\"", "");
//						jDate=jDate.replace(".000Z\")", "");
//						jDate=jDate.replace("T", " ");
//
//				    	String finalDate =null;
//						  DateFormat formatter = new SimpleDateFormat(sourceFormat);
//						  DateFormat dateShow = new SimpleDateFormat(dest);
//
//						  try {
//							  Date date = (Date)formatter.parse(jDate);
//							  finalDate=dateShow.format(date);
//						} catch (ParseException e) {
//							e.printStackTrace();
//						}
//
//						  finalDate=finalDate+".000Z";
//						  finalDate=finalDate.replace(" ", "T");
//
//						  return finalDate;
//					  }

}
