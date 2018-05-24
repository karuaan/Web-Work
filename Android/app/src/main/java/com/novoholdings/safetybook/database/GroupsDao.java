package com.novoholdings.safetybook.database;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.util.Log;

import com.novoholdings.safetybook.common.AppProperties;
import com.novoholdings.safetybook.beans.GroupBean;

import java.util.ArrayList;

public class GroupsDao {
    public static String TABLE_NAME="tblGroups";

    public static final String QUERY_TABLE_CREATE = "create table "+ TABLE_NAME + " (server_id INTEGER, name text, modified_on text, is_synced text, status text, admin_name text, admin_email text, book_name text, server_path text, local_path text);";


    public static final String QUERY_GET_ALL="SELECT * from "+TABLE_NAME+ " WHERE status='"+ AppProperties.STATUS_ACTIVE+"'";

    public static final String QUERY_GET_ALL_LABEL_VALUE="SELECT serverId,name from "+TABLE_NAME+ " WHERE status='"+AppProperties.STATUS_ACTIVE+"'";

    public static final String QUERY_GET_MODIFIED="SELECT * from "+TABLE_NAME+ " WHERE isSynced='"+AppProperties.NO+"'";

    private static String COLUMN_ID="id";
    private static String COLUMN_NAME="name";
    private static String COLUMN_MODIFIED_ON="modified_on";
    private static String COLUMN_IS_SYNCED="is_synced";
    private static String COLUMN_STATUS="status";
    private static String COLUMN_ADMIN_NAME="admin_name";
    private static String COLUMN_ADMIN_EMAIL="admin_email";
    private static String COLUMN_SERVER_ID="server_id";

    SQLiteDatabase _database;


    Context mContext;
    public GroupsDao(Context ctx) {
        super();
        mContext=ctx;
        _database = AppDatabase.openDataBase(ctx);

        if (AppProperties.isDemoMode() && !AppDatabase.alreadyExists(TABLE_NAME, "status='"+AppProperties.STATUS_ACTIVE+"'")){
            insertData("Example Group", 1, AppProperties.getCurrentDate(), AppProperties.YES, "Administrator Name", "admin@gmail.com");
        }

    }


    public long insertData(String name, long serverId, String recordTime,String isSynced, String adminName, String adminEmail)
    {
        long res;
        ContentValues values = new ContentValues();

        values.put(COLUMN_NAME, name);

        values.put(COLUMN_STATUS, AppProperties.STATUS_ACTIVE);
        values.put(COLUMN_MODIFIED_ON, recordTime);
        values.put(COLUMN_IS_SYNCED, isSynced);

        values.put(COLUMN_ADMIN_NAME, AppProperties.NVL(adminName, null));
        values.put(COLUMN_ADMIN_EMAIL, AppProperties.NVL(adminEmail, null));

        values.put(COLUMN_SERVER_ID, serverId);

        try
        {
            res = _database.insert(TABLE_NAME, null, values);
            Log.i("Group inserted", "id:" + res);
        }
        catch (Exception e)
        {
            res = 0;
            Log.e("Error while inserting", e.toString());
        }
        return res;
    }

    public long updateData(String name, long serverId, String recordTime,String isSynced, String adminName, String adminEmail)
    {
        long res;
        ContentValues values = new ContentValues();

        values.put(COLUMN_NAME, name);

        values.put(COLUMN_STATUS, AppProperties.STATUS_ACTIVE);
        values.put(COLUMN_MODIFIED_ON, recordTime);
        values.put(COLUMN_IS_SYNCED, isSynced);

        values.put(COLUMN_ADMIN_NAME, AppProperties.NVL(adminName, "-1"));
        values.put(COLUMN_ADMIN_EMAIL, AppProperties.NVL(adminEmail, "-1"));

        values.put(COLUMN_MODIFIED_ON, AppProperties.getCurrentDate());
        values.put(COLUMN_IS_SYNCED, AppProperties.YES);

        try
        {
            res = _database.update(TABLE_NAME, values, COLUMN_SERVER_ID+"=?",new String[] { String.valueOf(serverId) });
        }
        catch (Exception e)
        {
            res = 0;
            Log.e("Error while inserting", e.toString());
        }
        return res;
    }

    public String getNameById(String id)
    {

        if(AppProperties.isNull(id))
            return "";

        Cursor c;
        String name=null;
        c = AppDatabase.get("SELECT "+COLUMN_NAME+ " FROM "+TABLE_NAME+" WHERE "+COLUMN_ID+"="+id,mContext);

        try
        {

            if (c.moveToFirst())
            {
                name = c.getString(0);
            }

        }
        catch (Exception e)
        {
            Log.i("Error in getting data ", e.toString());
        }finally{

            try {

                if(c!=null)
                    c.close();
                AppDatabase.closedatabase();
            } catch (Exception e2) {
            }
        }




        return AppProperties.NVL(name);
    }

    public String getIdByName(String name)
    {
        Cursor c;
        String id=null;
        c = AppDatabase.get("SELECT "+COLUMN_ID+ " FROM "+TABLE_NAME+" WHERE "+COLUMN_NAME+"='"+name+"' ",mContext);

        try
        {
            if (c.moveToFirst())
            {
                id = c.getString(0);
            }
        }
        catch (Exception e)
        {
            Log.i("Error in getting data ", e.toString());
        }finally{

            try {

                if(c!=null)
                    c.close();
                AppDatabase.closedatabase();
            } catch (Exception e2) {
            }
        }

        return AppProperties.NVL(id);
    }

    public long deleteRecord(String id)
    {
//		String whereClause=column+"="+value;
//		AppDatabase.deletedData(TABLE_NAME,whereClause);

        long res;
        ContentValues values = new ContentValues();

        values.put(COLUMN_STATUS, AppProperties.STATUS_DELETED);

        values.put(COLUMN_IS_SYNCED, "No");

        res = _database.update(TABLE_NAME, values, COLUMN_ID+"=?",new String[] { id });

        return res;
    }

    public long deleteColumnValue(String column, String id)
    {

        long res;
        ContentValues values = new ContentValues();
        values.putNull(column);

        values.put(COLUMN_IS_SYNCED, "No");

        res = _database.update(TABLE_NAME, values, COLUMN_ID+"=?",new String[] { id });
//
        return res;
    }

    public static ArrayList<GroupBean> cursorToBean(Cursor cursor) {
        if (null == cursor)
            return null;
        ArrayList<GroupBean> list = new ArrayList<GroupBean>();
        if (cursor.moveToFirst()) {
            do {
                GroupBean f = new GroupBean();

                //SERVER ID
                try {
                    f.setId(cursor.getInt(cursor.getColumnIndex(COLUMN_SERVER_ID)));
                } catch (Exception e) {
                    e.printStackTrace();
                }
                //NAME
                try{

                    f.setName(cursor.getString(cursor.getColumnIndex(COLUMN_NAME)));
                } catch (Exception e) {
                    e.printStackTrace();
                }
                //ADMIN EMAIL
                try {
                    f.setAdminEmail(cursor.getString(cursor.getColumnIndex(COLUMN_ADMIN_EMAIL)));
                } catch (Exception e) {
                    e.printStackTrace();
                }
                //ADMIN NAME
                try{
                    f.setAdminName(cursor.getString(cursor.getColumnIndex(COLUMN_ADMIN_NAME)));
                } catch (Exception e) {
                    e.printStackTrace();
                }
                //STATUS
                try{
                    f.setStatus(cursor.getString(cursor.getColumnIndex(COLUMN_STATUS)).equals("A"));
                } catch (Exception e) {
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

    public ArrayList<GroupBean> getGroupsData() {

        return getGroupItems("");
    }

    public ArrayList<GroupBean> getGroupItems(String grp) {

        String query="";
        if (!AppProperties.isNull(grp))
            query="SELECT * FROM "+TABLE_NAME +" WHERE name like '"+grp+"%'";
        else
            query="SELECT * FROM "+TABLE_NAME;

        ArrayList<GroupBean> arList = null;
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
            arList=new ArrayList<GroupBean>();
        }

//		ArrayList<Step3Bean> dtTemp;
//		for (Step3GroupBean hBean : arList) {
//				dtTemp = getIndustryData(QUERY_GET_ALL+" AND "+CATEGORY_ID+" ="+hBean.getGroupId());
//				if(dtTemp==null)
//				{
//					dtTemp=new ArrayList<Step3Bean>();
//				}
//				hBean.setHazzardItems(dtTemp);
//		}

        return arList;
    }

    public synchronized boolean checkGroupExists(long serverId) {

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
}
