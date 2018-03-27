package com.novoholdings.safetybook.beans;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by James on 12/6/2017.
 */

public class GroupJson extends JSONObject {

    public long getServerId(){
        try{

            return getLong("group_id");
        }catch (JSONException e){
            return 0;
        }
    }

    public String getName(){
        try{
            return getString("group_name");
        }catch (JSONException e){
            return "Not found";
        }
    }

    public String getAdminFirstName(){
        try{
            return getString("admin_firstname");
        }catch (JSONException e){
            return "Not found";
        }
    }

    public String getAdminLastName(){
        try{
            return getString("admin_lastname");
        }catch (JSONException e){
            return "Not found";
        }
    }

    public String getAdminFullName(){
        return getAdminFirstName()+" "+getAdminLastName();
    }

    public String getAdminEmail(){
        try{
            return getString("admin_email");
        }catch (JSONException e){
            return "Not found";
        }
    }

    public String getBookName(){
        try{
            return getString("book_name");
        }catch (JSONException e){
            return "Not found";
        }
    }
}
