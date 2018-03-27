package com.novoholdings.safetybook.database;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.SQLException;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Log;

import com.novoholdings.safetybook.common.AppProperties;

import java.io.File;
import java.util.Date;

public class AppDatabase extends SQLiteOpenHelper {


    private static final int DATABASE_VERSION = 2;
    static final int BUNDLE_INT = 0;
    private static final String DATABASE_NAME = "safety_book_data.db";
    public static SQLiteDatabase sqLiteDb;
    private Context ctx;
//		private final Context HCtx;



    AppDatabase(Context ctx)
    {
        super(ctx, DATABASE_NAME, null, DATABASE_VERSION);
        this.ctx = ctx;
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVesrsion, int newVersion){

    }

    public static void truncateUserInfo(){
        truncateTable(GroupsDao.TABLE_NAME);
        truncateTable(AssignmentsDao.TABLE_NAME);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        //form data
        db.execSQL(GroupsDao.QUERY_TABLE_CREATE);
        db.execSQL(AssignmentsDao.QUERY_TABLE_CREATE);
    }


    public static SQLiteDatabase openDataBase(Context ctx) throws SQLException {
        if(sqLiteDb==null || !sqLiteDb.isOpen())
        {
            AppDatabase helper=new AppDatabase(ctx);
            sqLiteDb = helper.getWritableDatabase();
        }
        return sqLiteDb;
    }

    public synchronized  void cleanTable(String tableName) {
        sqLiteDb.delete(tableName, null, null);
    }
    public static void closedatabase() {
    }
    public static void forceCloseDatabase() {

        if (sqLiteDb != null && sqLiteDb.isOpen())
            sqLiteDb.close();
    }

    public synchronized  static Cursor get(String query_str, Context ctx)
    {
        Cursor c;
        if (sqLiteDb != null)
        {
            try
            {
                openDataBase(ctx);
                c = sqLiteDb.rawQuery(query_str, null);
                return c;
            }
            catch (Exception e)
            {
                e.printStackTrace();
                return null;
            }finally
            {
//			closedatabase();
            }
        }
        else
            return null;
    }

    public static synchronized  void deletedData(String TABLE_NAME, String whereClause) {
        try {
            sqLiteDb.delete(TABLE_NAME, whereClause, null);
        } catch (Exception e) {
            Log.e("DB Error", e.toString());
            e.printStackTrace();
        }
    }
    public static synchronized long deleteDataLazy(String TABLE_NAME, String whereClause)
    {
        long res;
        ContentValues values = new ContentValues();

        values.put("status", AppProperties.STATUS_DELETED);
        values.put("isSynced", AppProperties.NO);

        res = sqLiteDb.update(TABLE_NAME, values, whereClause,null);

        return res;
    }

    public static synchronized  boolean deleteDir(File dir) {
        if (dir.isDirectory()) {
            String[] children = dir.list();
            for (int i = 0; i < children.length; i++) {
                boolean success = deleteDir(new File(dir, children[i]));
                if (!success) {
                    return false;
                }
            }
        }
        // The directory is now empty so delete it return dir.delete(); }
        return dir.delete();
    }

    public static synchronized  void truncateTable(String TABLE_NAME) {

        try {
            sqLiteDb.delete(TABLE_NAME, null, null);
            sqLiteDb.execSQL("DELETE FROM SQLITE_SEQUENCE WHERE name='"+TABLE_NAME+"';");
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    public static synchronized boolean isSyncedTable(String TABLE_NAME) {

        boolean isSynced=true;
        int count=-1;
        try {
            Cursor cursor=sqLiteDb.rawQuery("SELECT COUNT(*) AS num_rows FROM "+TABLE_NAME+" WHERE isSynced='No' ",null);

            if (cursor.moveToFirst()) {
                count=cursor.getInt(0);
            }

            if(count > 0)
                isSynced=false;

            if (cursor != null && !cursor.isClosed()) {
                cursor.close();
            }
            return isSynced;

        } catch (Exception e) {
            return isSynced;
        }
    }


    public static synchronized String getMaxId(String TABLE_NAME) {
        try {
            Cursor cursor=sqLiteDb.rawQuery("SELECT MAX(id) AS max_id FROM "+TABLE_NAME, null);
            String s=null;
            if (cursor.moveToFirst()) {
                s=cursor.getString(0);
            }

            if (cursor != null && !cursor.isClosed()) {
                cursor.close();
            }
            return s;

        } catch (Exception e) {
            return null;
        }
    }

    public static synchronized String getLastSyncDate(String TABLE_NAME) {
        try {
            Cursor cursor=sqLiteDb.rawQuery("SELECT MAX(modified_on) AS max_dt FROM "+TABLE_NAME+" WHERE isSynced='Yes' ", null);
            String s=null;
            if (cursor.moveToFirst()) {
                s=cursor.getString(0);
            }

            if (cursor != null && !cursor.isClosed()) {
                cursor.close();
            }
            return s;

        } catch (Exception e) {
            return null;
        }
    }

    public static synchronized boolean alreadyExists(String TABLE_NAME, String whereClause) {

        boolean exists=false;
        int count=-1;
        try {
            Cursor cursor=sqLiteDb.rawQuery("SELECT COUNT(*) AS num_rows FROM "+TABLE_NAME+" WHERE "+whereClause, null);

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
            e.printStackTrace();
            return exists;
        }
    }
    public static synchronized boolean alreadyExists(String TABLE_NAME, String whereClause, SQLiteDatabase sqLiteDbExt) {

        boolean exists=false;
        int count=-1;
        try {
            Cursor cursor=sqLiteDbExt.rawQuery("SELECT COUNT(*) AS num_rows FROM "+TABLE_NAME+" WHERE "+whereClause, null);

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
            e.printStackTrace();
            return exists;
        }
    }

    public synchronized Cursor getModifiedData(String TABLE_NAME) {
        try {
            return sqLiteDb.rawQuery("SELECT * FROM "+TABLE_NAME+" WHERE isSynced ='No' ", null);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    public synchronized  boolean updateStatus(String TABLE_NAME,String whereClause, String newStatus) {

        try {
            ContentValues vals = new ContentValues();

            vals.put("isSynced", AppProperties.convertDateToString(new Date()));
            vals.put("modified_on", AppProperties.convertDateToString(new Date()));
            vals.put("status", newStatus);

            return sqLiteDb.update(TABLE_NAME, vals, whereClause, null) > 0;

        } catch (Exception e) {
            Log.e("DB Error", e.toString());
            e.printStackTrace();
            return false;
        }
    }


    public synchronized  void updateSynced(String TABLE_NAME, String whereClause) {
        try {
            String sqlString="UPDATE " + TABLE_NAME + " SET ";
            sqlString+= " isSynced='Yes'";
            sqlString+= " WHERE "+whereClause+" ";

            sqLiteDb.execSQL(sqlString);
        } catch (Exception e) {
            Log.e("DB Error", e.toString());
            e.printStackTrace();
        }
    }


    public static synchronized  void updateTableField(String TABLE_NAME, String field,String value,String whereClause) {
        try {
            StringBuffer sb=new StringBuffer("UPDATE ");
            sb.append(TABLE_NAME);
            sb.append(" SET ");
            sb.append(field);
            sb.append(" = '");
            sb.append(value);

            sb.append("',modified_on = '");
            sb.append(AppProperties.convertDateToString(new Date()));
            sb.append("' WHERE ");
            sb.append(whereClause);

            sqLiteDb.execSQL(sb.toString());
        } catch (Exception e) {
            Log.e("DB Error", e.toString());
            e.printStackTrace();
        }
    }

    public static synchronized  long updateTableFieldSync(String TABLE_NAME, String field,String value,String whereClause) {

        long res;
        ContentValues values = new ContentValues();
        values.put(field, value);
//	values.put(COLUMN_MODIFIED_ON, AppProperties.convertDateToString(new Date()));
        values.put("isSynced", AppProperties.NO);

        try
        {
            res = sqLiteDb.update(TABLE_NAME, values, whereClause,null);
//		res = _database.update(TABLE_NAME, null, values);
            //Log.i("group_card inserted in Company Table ", "group_card id:" + res);
        }
        catch (Exception e)
        {
            res = 0;
            Log.e("Error while inserting", e.toString());
        }
        return res;
    }

    public static synchronized  long updateTableFieldNoSync(String TABLE_NAME, String field,String value,String whereClause) {

        long res;
        ContentValues values = new ContentValues();
        values.put(field, value);
//	values.put(COLUMN_MODIFIED_ON, AppProperties.convertDateToString(new Date()));
//	values.put("isSynced", AppProperties.NO);

        try
        {
            res = sqLiteDb.update(TABLE_NAME, values, whereClause,null);
//		res = _database.update(TABLE_NAME, null, values);
            //Log.i("group_card inserted in Company Table ", "group_card id:" + res);
        }
        catch (Exception e)
        {
            res = 0;
            Log.e("Error while inserting", e.toString());
        }
        return res;
    }
    public synchronized  void deletedSynced(String TABLE_NAME, String whereClause) {
        try {
            sqLiteDb.delete(TABLE_NAME, whereClause, null);
        } catch (Exception e) {
            Log.e("DB Error", e.toString());
            e.printStackTrace();
        }
    }

    public static synchronized long getLastInsertedId(String tableName) {

        long lastId = 0;
        String query = "SELECT ROWID from " + tableName + " order by ROWID DESC limit 1";
        Cursor c = sqLiteDb.rawQuery(query, null);
        if (c != null && c.moveToFirst()) {
            lastId = c.getLong(0); // The 0 is the column index, we only have 1
            // column, so the index is 0
        }
        return lastId;
    }


    //	public static synchronized String getColumnValue(String TABLE_NAME, String columnName,String whereClause) {
//
//		String returnValue="";
//		try {
//			Cursor cursor=sqLiteDb.rawQuery("SELECT "+columnName+" AS result_value FROM "+TABLE_NAME+" WHERE "+whereClause, null);
//
//			if (cursor.moveToFirst()) {
//				returnValue=cursor.getString(0);
//	        }
//
//	        if (cursor != null && !cursor.isClosed()) {
//	            cursor.close();
//	        }
//	        return returnValue;
//
//		} catch (Exception e) {
//			return "";
//		}
//	}
    public static synchronized String getColumnValue(String TABLE_NAME, String columnName,String whereClause, SQLiteDatabase dbConn) {

        String returnValue="";
        try {
            Cursor cursor=dbConn.rawQuery("SELECT "+columnName+" AS result_value FROM "+TABLE_NAME+" WHERE "+whereClause, null);

            if (cursor.moveToFirst()) {
                if (cursor.getCount()>0){

                }
                returnValue=cursor.getString(0);
            }

            if (cursor != null && !cursor.isClosed()) {
                cursor.close();
            }
            return returnValue;

        } catch (Exception e) {
            return "";
        }
    }

}
