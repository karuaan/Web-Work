package com.novoholdings.safetybook.beans;

import com.fasterxml.jackson.annotation.JsonProperty;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by James on 12/6/2017.
 */

public class AssignmentJson {

    @JsonProperty("assignment_name")
    public String name;

    @JsonProperty("group_name")
    public String groupName;

    @JsonProperty("group_id")
    public long groupId;

    @JsonProperty("assignment_id")
    public long serverId;

    @JsonProperty("start_page")
    public int startPage;

    @JsonProperty("end_page")
    public int endPage;

    @JsonProperty("reading_time")
    public int readingTime;

    @JsonProperty("due_date")
    public String dueDate;

    @JsonProperty("status")
    public int isComplete;


    /*public String getPath(){
        try{
            return getString("group_name");
        }catch (JSONException e){
            return "Not found";
        }
    }

    public long getGroupId(){
        try{
            return getLong("group_id");
        }catch (JSONException e){
            return 0;
        }
    }

    public long getServerId(){
        try{
            return getLong("assignment_id");
        }catch (JSONException e){
            return 0;
        }
    }

    public int getStartPage(){
        try{
            return getInt("start_page");
        }catch (JSONException e){
            return 0;
        }
    }

    public int getEndPage(){
        try{
            return getInt("end_page");
        }catch (JSONException e){
            return 0;
        }
    }

    public int getReadingTime(){
        try{
            return getInt("reading_time");
        }catch (JSONException e){
            return 0;
        }
    }

    public String getDueDate(){
        try{
            return getString("due_date");
        }catch (JSONException e){
            return "Not found";
        }
    }

    public int getCompletionStatus(){
        try{
            return getInt("status");
        }catch (JSONException e){
            return 0;
        }
    }

    public String getName(){
        try{
            return getString("assignment_name");
        }catch (JSONException e){
            return "Not found";
        }
    }*/
}
