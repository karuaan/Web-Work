package com.novoholdings.safetybook.database;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.graphics.Bitmap;
import android.util.Log;
import android.widget.TextView;

import com.novoholdings.safetybook.beans.AssignmentBean;
import com.novoholdings.safetybook.common.AppProperties;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;

/**
 * Created by James on 11/14/2017.
 */

public class AssignmentsDao {

    public static String TABLE_NAME="tblAssignments";

    public static final String QUERY_TABLE_CREATE = "create table "+ TABLE_NAME + " (name text, modified_on TIMESTAMP, is_synced text, time_to_read INTEGER, status text, start_page INTEGER, end_page INTEGER, due_date text, server_path text, local_path text, file_name text, complete text, server_id INTEGER, group_id INTEGER);";


    public static final String QUERY_GET_ALL="SELECT * from "+TABLE_NAME;

    public static final String QUERY_GET_ALL_LABEL_VALUE="SELECT serverId,name from "+TABLE_NAME+ " WHERE status='"+AppProperties.STATUS_ACTIVE+"'";

    public static final String QUERY_GET_MODIFIED="SELECT * from "+TABLE_NAME+ " WHERE is_synced='"+AppProperties.NO+"'";

    public static final String QUERY_GET_COMPLETE=QUERY_GET_ALL+" AND "+AssignmentsDao.COLUMN_IS_COMPLETE+"="+AppProperties.NO+" ORDER BY date("+AssignmentsDao.COLUMN_DUE_DATE+") DESC Limit 1";

    public static String COLUMN_ID="server_id";
    public static String COLUMN_NAME="name";
    public static String COLUMN_MODIFIED_ON="modified_on";
    public static String COLUMN_IS_SYNCED="is_synced";
    public static String COLUMN_STATUS="status";
    public static String COLUMN_TIME_TO_READ="time_to_read";
    public static String COLUMN_DUE_DATE="due_date";
    public static String COLUMN_SERVER_PATH ="server_path";
    public static String COLUMN_FILE_NAME="file_name";
    public static String COLUMN_IS_COMPLETE="complete";
    public static String COLUMN_GROUP_ID="group_id";
    public static String COLUMN_START_PAGE="start_page";
    public static String COLUMN_END_PAGE="end_page";

    SQLiteDatabase _database;

    Context mContext;
    public AssignmentsDao(Context ctx) {
        super();
        mContext = ctx;
        _database = AppDatabase.openDataBase(ctx);

        if (AppProperties.isDemoMode() && !AppDatabase.alreadyExists(TABLE_NAME, "status='" + AppProperties.STATUS_ACTIVE + "'")) {
            //insertData("Section 1 - General Safety", 1, 1,  AppProperties.YES, 120, "2018-02-02T00:00.000Z", AppProperties.NO, 8, 13);
            //insertData("Section 2 - Safety Inspections", 2, 1,  AppProperties.YES, 120, "2018-02-09T00:00.000Z", AppProperties.NO, 17, 19);
        }
    }

    public long insertData(long serverId, String name, long groupId, String isSynced, int timeToRead, String dueDate, boolean isComplete, int startPage, int endPage, String bookServerPath)
    {
        long res;
        ContentValues values = new ContentValues();

        String recordTime = AppProperties.getCurrentDate();



        values.put(COLUMN_NAME, name);

        values.put(COLUMN_STATUS, AppProperties.STATUS_ACTIVE);
        values.put(COLUMN_MODIFIED_ON, recordTime);
        values.put(COLUMN_IS_SYNCED, isSynced);
        values.put(COLUMN_TIME_TO_READ, timeToRead);
        values.put(COLUMN_DUE_DATE, dueDate);
        values.put(COLUMN_IS_COMPLETE, isComplete);
        values.put(COLUMN_GROUP_ID, groupId);
        values.put(COLUMN_ID, serverId);
        values.put(COLUMN_START_PAGE, startPage);
        values.put(COLUMN_END_PAGE, endPage);
        values.put(COLUMN_SERVER_PATH, bookServerPath);

        try
        {
            res = _database.insert(TABLE_NAME, null, values);
            Log.i("Assignment inserted:", "id:" + res);
        }
        catch (Exception e)
        {
            res = 0;
            Log.e("Error while inserting", e.toString());
        }
        return res;
    }

    public long updateData(long id, String name,String isSynced, int timeToRead, boolean isComplete, String dueDate, int startPage, int endPage, String bookServerPath)
    {
        long res;
        ContentValues values = new ContentValues();

        values.put(COLUMN_NAME, name);

        values.put(COLUMN_STATUS, AppProperties.STATUS_ACTIVE);

        String recordTime = AppProperties.getCurrentDate();
        if (!AppProperties.isNull(recordTime))
            values.put(COLUMN_MODIFIED_ON, recordTime);
        if (!AppProperties.isNull(isSynced))
            values.put(COLUMN_IS_SYNCED, isSynced);
        if (timeToRead > 0)
            values.put(COLUMN_TIME_TO_READ, timeToRead);

        if (isComplete){
            values.put(COLUMN_IS_COMPLETE, AppProperties.YES);
        }
        else {
            values.put(COLUMN_IS_COMPLETE, AppProperties.NO);
        }

        if (!AppProperties.isNull(dueDate))
            values.put(COLUMN_DUE_DATE, dueDate);
        if (startPage > 0)
            values.put(COLUMN_START_PAGE, startPage);
        if (endPage > 0)
            values.put(COLUMN_END_PAGE, endPage);
        if (!AppProperties.isNull(bookServerPath)){
            values.put(COLUMN_SERVER_PATH, bookServerPath);
        }
        try
        {
            res = _database.update(TABLE_NAME, values, COLUMN_ID+"=?",new String[] { String.valueOf(id) });
        }
        catch (Exception e)
        {
            res = 0;
            Log.e("Error while inserting", e.toString());
        }
        return res;
    }

    public long updateSyncStatus(long id, String status){
        long res;
        ContentValues values = new ContentValues();
        values.put(COLUMN_IS_SYNCED, status);

        try
        {
            res = _database.update(TABLE_NAME, values, COLUMN_ID+"=?",new String[] { String.valueOf(id) });
        }
        catch (Exception e)
        {
            res = 0;
            Log.e("Error while inserting", e.toString());
        }
        return res;

    }


    public long completeReading(long id){
        long res;
        ContentValues values = new ContentValues();

        values.put(COLUMN_IS_COMPLETE, AppProperties.YES);
        values.put(COLUMN_TIME_TO_READ, 0);

        try
        {
            res = _database.update(TABLE_NAME, values, COLUMN_ID+"=?",new String[] { String.valueOf(id) });
        }
        catch (Exception e)
        {
            res = 0;
            Log.e("Error while inserting", e.toString());
        }
        return res;
    }

    public long addFileName(long id, String fileName){
        long res;
        ContentValues values = new ContentValues();

        values.put(COLUMN_FILE_NAME, AppProperties.NVL(fileName, "-1"));
        try
        {
            res = _database.update(TABLE_NAME, values, COLUMN_ID+"=?",new String[] { String.valueOf(id) });
        }
        catch (Exception e)
        {
            res = 0;
            Log.e("Error while inserting", e.toString());
        }
        return res;
    }


    public String getColumnLocalPath(long id){

        String query = "SELECT local_path FROM "+ TABLE_NAME + " WHERE server_id="+id;
        int count = -1;
        try{
            Cursor cursor = _database.rawQuery(query, null);

            if (cursor.moveToFirst()){
                count=cursor.getCount();
            }
            if (count > 0){
                String path = cursor.getString(0);
                return path;
            }
            return null;

        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    public boolean fileExists(long id){
        String query = "SELECT local_path FROM "+ TABLE_NAME + " WHERE server_id="+id;
        int count = -1;
        try{
            Cursor cursor = _database.rawQuery(query, null);

            if (cursor.moveToFirst()){
                count=cursor.getCount();
            }
            if (count > 0){
                return true;
            }
            return false;

        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }

    protected byte[] getBitmapBytes(Bitmap bmp)
    {
        ByteArrayOutputStream stream = new ByteArrayOutputStream();
        bmp.compress(Bitmap.CompressFormat.PNG, 100, stream);
        byte[] bytesIMG = stream.toByteArray();
        Log.i("Image Bytes  ", ""+bytesIMG.toString());

        return bytesIMG;

    }

    public synchronized boolean checkRecExists(long serverId) {

        boolean exists=false;
        int count=-1;
        try {
            Cursor cursor=_database.rawQuery("SELECT COUNT(*) AS num_rows FROM "+TABLE_NAME+" WHERE server_id=" + serverId, null);

            if (cursor.moveToFirst()) {
                count=cursor.getInt(0);
            }

            if(count > 0)
                exists=true;

            if (cursor != null && !cursor.isClosed()) {
                cursor.close();
            }
            return exists;

        } catch (Exception e) {
            return exists;
        }
    }

    public ArrayList<AssignmentBean> getAssignments(long groupId) {

        String query="";
        if (groupId!=0)
            query="SELECT * FROM "+TABLE_NAME +" WHERE group_id="+groupId;
        else
            query="SELECT * FROM "+TABLE_NAME;

        query+=" ORDER BY date(due_date) ASC, name ASC";

        ArrayList<AssignmentBean> arList = null;
        Cursor c;
        c = AppDatabase.get(query,mContext);

        try
        {
            arList = cursorToBean(c);
        }
        catch (Exception e)
        {
            Log.i("Error in getting data ", e.toString());
        }


        c.close();

        if(arList==null)
        {
            arList=new ArrayList<AssignmentBean>();
        }

        return arList;
    }

    public ArrayList<AssignmentBean> getData(String query){
        ArrayList<AssignmentBean> arList = null;
        Cursor c;
        c = AppDatabase.get(query,mContext);

        try
        {
            arList = cursorToBean(c);
        }
        catch (Exception e)
        {
            Log.i("Error in getting data ", e.toString());
        }

        if (c!=null)
            c.close();

        if(arList==null)
        {
            arList=new ArrayList<AssignmentBean>();
        }

        return arList;
    }

    public ArrayList<AssignmentBean> getUnreadAssignments(long id){
        ArrayList<AssignmentBean> arList = null;
        Cursor c;
        String query = QUERY_GET_ALL+" WHERE "+COLUMN_GROUP_ID+"="+id+ " AND "+COLUMN_IS_COMPLETE+"!="+AppProperties.YES;
        query+=" ORDER BY date(due_date) ASC";

        c = AppDatabase.get(query,mContext);

        try
        {
            arList = cursorToBean(c);
        }
        catch (Exception e)
        {
            Log.i("Error in getting data ", e.toString());
        }

        if (c!=null)
            c.close();

        if(arList==null)
        {
            arList=new ArrayList<AssignmentBean>();
        }

        return arList;
    }

    public int getUnreadCount(long groupId){
        ArrayList<AssignmentBean> arList = null;
        Cursor c;
        String query = QUERY_GET_ALL+" AND "+COLUMN_GROUP_ID+"="+groupId + " AND "+COLUMN_IS_COMPLETE+"="+AppProperties.NO;

        c = AppDatabase.get(query,mContext);

        int unread = 0;
        if (c!=null){
            unread = c.getCount();
        }

        return unread;
    }

    public ArrayList<AssignmentBean> getAllAssignments(){
        return getAssignments(0);
    }

    public static ArrayList<AssignmentBean> cursorToBean(Cursor cursor) {
        if (null == cursor)
            return null;
        ArrayList<AssignmentBean> list = new ArrayList<AssignmentBean>();
        if (cursor.moveToFirst()) {
            do {
                AssignmentBean f = new AssignmentBean();

                //SERVER ID
                try {
                    f.setId(cursor.getLong(cursor.getColumnIndex(COLUMN_ID)));
                } catch (Exception e) {
                    e.printStackTrace();
                }
                //GROUP ID
                try {
                    f.setGroupId(cursor.getLong(cursor.getColumnIndex(COLUMN_GROUP_ID)));
                } catch (Exception e) {
                    e.printStackTrace();
                }
                //NAME
                try{
                    f.setName(cursor.getString(cursor.getColumnIndex(COLUMN_NAME)));
                } catch (Exception e) {
                    e.printStackTrace();
                }
                //COMPLETE - Y/N
                try{

                    boolean isComplete = (cursor.getString(cursor.getColumnIndex(COLUMN_IS_COMPLETE)).equals(AppProperties.YES));
                    f.setComplete(isComplete);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                //TIME TO READ
                try {
                    f.setReadingTime(cursor.getInt(cursor.getColumnIndex(COLUMN_TIME_TO_READ)));
                } catch (Exception e) {
                    e.printStackTrace();
                }
                //DUE DATE
                try{
                    f.setDueDate(cursor.getString(cursor.getColumnIndex(COLUMN_DUE_DATE)));
                } catch (Exception e) {
                    e.printStackTrace();
                }
                //START PAGE
                try{
                    f.setStartPage(cursor.getInt(cursor.getColumnIndex(COLUMN_START_PAGE)));
                } catch (Exception e) {
                    e.printStackTrace();
                }
                //END PAGE
                try{
                    f.setEndPage(cursor.getInt(cursor.getColumnIndex(COLUMN_END_PAGE)));
                } catch (Exception e) {
                    e.printStackTrace();
                }
                //BOOK PDF URL
                try{

                    f.setBookServerPath(cursor.getString(cursor.getColumnIndex(COLUMN_SERVER_PATH)));
                }catch (Exception e){
                    e.printStackTrace();
                }



                list.add(f);
            } while (cursor.moveToNext());
        }
        if (cursor != null && !cursor.isClosed()) {
            cursor.close();
        }
        return list;
    }
}