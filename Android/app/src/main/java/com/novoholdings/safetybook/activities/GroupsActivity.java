package com.novoholdings.safetybook.activities;

import android.Manifest;
import android.app.AlertDialog;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.support.annotation.MainThread;
import android.support.design.widget.Snackbar;
import android.support.v4.app.ActivityCompat;
import android.support.v4.app.NotificationCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.GridLayout;
import android.widget.GridView;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.firebase.ui.auth.IdpResponse;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.messaging.FirebaseMessaging;
import com.novoholdings.safetybook.RequestQueue;
import com.novoholdings.safetybook.R;
import com.novoholdings.safetybook.beans.AssignmentBean;
import com.novoholdings.safetybook.beans.AssignmentJson;
import com.novoholdings.safetybook.beans.GroupBean;
import com.novoholdings.safetybook.common.AppProperties;
import com.novoholdings.safetybook.common.Utils;
import com.novoholdings.safetybook.database.AppDatabase;
import com.novoholdings.safetybook.database.AssignmentsDao;
import com.novoholdings.safetybook.database.GroupsDao;
import com.novoholdings.safetybook.ui.GridAdapter;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.security.acl.Group;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

public class GroupsActivity extends AppCompatActivity {

    private static final String TAG = "GroupsActivity";
    private static final String KEY_USER_INFO = "userInfo";

    private GroupsDao groupsDao;
    private AssignmentsDao assignmentsDao;
    private ArrayList<GroupBean> userGroups;
    private GridLayout gridLayout;
    private GridView studentGrid;
    private TextView studentWelcome;
    private ArrayList<AssignmentBean> assignmentArray = new ArrayList<>();
    private HashMap<Long, AssignmentBean> assignmentGroupsMap;

    private FirebaseAuth mAuth;

    Bundle extras;

    NotificationCompat.Builder threeDayNotification, oneDayNotification, oneHourNotification, overdueNotification, newGroupNotifier, newAssignmentNotifier, testNotifier;
    private static final int threeDay = 5548;
    private static final int oneDay = 5546;
    private static final int oneHour = 5542;
    private static final int overdueNotifi = 5524;
    private static final int newGroupNotification = 5584;
    private static final int newAssignmentNotification = 5562;
    private static final int newTestNotify = 5588;

    private final int REQUEST_PERMISSION_WRITE_EXTERNAL_STORAGE=2233;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_student);

        mAuth = FirebaseAuth.getInstance();

        if (mAuth.getCurrentUser()==null){
            Intent i = new Intent(GroupsActivity.this, LoginActivity.class);
            startActivity(i);
        }
        else {
            updateUI(mAuth.getCurrentUser());
        }

        threeDayNotification = new NotificationCompat.Builder(GroupsActivity.this);
        threeDayNotification.setAutoCancel(true);

        oneDayNotification = new NotificationCompat.Builder(GroupsActivity.this);
        oneDayNotification.setAutoCancel(true);

        oneHourNotification = new NotificationCompat.Builder(GroupsActivity.this);
        oneHourNotification.setAutoCancel(true);

        overdueNotification = new NotificationCompat.Builder(GroupsActivity.this);
        overdueNotification.setAutoCancel(false);

        newGroupNotifier = new NotificationCompat.Builder(GroupsActivity.this);
        newGroupNotifier.setAutoCancel(true);

        newAssignmentNotifier = new NotificationCompat.Builder(GroupsActivity.this);
        newAssignmentNotifier.setAutoCancel(true);

        testNotifier = new NotificationCompat.Builder(GroupsActivity.this);
        testNotifier.setAutoCancel(true);
    }

    @Override
    protected void onStart() {
        super.onStart();

        setTestNotifier();

        if (!AppProperties.isDemoMode() && mAuth.getCurrentUser()==null) {
            Log.i(TAG, "No authorization state retained - reauthorization required");
            startActivity(new Intent(this, LoginActivity.class));
            finish();
        }

        // Check if user is signed in (non-null) and update UI accordingly.
        FirebaseUser currentUser = mAuth.getCurrentUser();
        if (currentUser==null){
            Intent i = new Intent(GroupsActivity.this, LoginActivity.class);
            startActivity(i);
        }
    }

    private void updateUI(FirebaseUser currentUser){
        extras = getIntent().getExtras();

        groupsDao = new GroupsDao(GroupsActivity.this);
        assignmentsDao = new AssignmentsDao(GroupsActivity.this);

        studentGrid = (GridView) findViewById(R.id.studentGrid);
        studentWelcome = (TextView) findViewById(R.id.studentWelcome);

        int permissionCheck = ContextCompat.checkSelfPermission(
                this, Manifest.permission.WRITE_EXTERNAL_STORAGE);
        if (permissionCheck != PackageManager.PERMISSION_GRANTED){
            ActivityCompat.shouldShowRequestPermissionRationale(this,
                    Manifest.permission.WRITE_EXTERNAL_STORAGE);
            showExplanation("Storage permission needed", "", Manifest.permission.READ_PHONE_STATE, REQUEST_PERMISSION_WRITE_EXTERNAL_STORAGE);
        } else {
            fetchUserInfo(currentUser);
        }

    }

    private void showExplanation(String title,
                                 String message,
                                 final String permission,
                                 final int permissionRequestCode) {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle(title)
                .setMessage(message)
                .setPositiveButton(android.R.string.ok, new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        requestPermission(permissionRequestCode);
                    }
                });
        builder.create().show();
    }

    private void requestPermission(int permissionRequestCode) {
        ActivityCompat.requestPermissions(this,
                new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, permissionRequestCode);
        }

    @Override
    public void onRequestPermissionsResult(
            int requestCode,
            String permissions[],
            int[] grantResults) {
        switch (requestCode) {
            case REQUEST_PERMISSION_WRITE_EXTERNAL_STORAGE:
                if (grantResults.length > 0
                        && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    fetchUserInfo(mAuth.getCurrentUser());

                    Toast.makeText(GroupsActivity.this, "Permission granted", Toast.LENGTH_SHORT).show();
                } else {
                    requestPermission(REQUEST_PERMISSION_WRITE_EXTERNAL_STORAGE);
                    Toast.makeText(GroupsActivity.this, "Permission denied", Toast.LENGTH_SHORT).show();
                }
        }
    }

    private void fetchUserInfo(FirebaseUser currentUser) {
        //displayLoading(getString(R.string.user_info_loading));
        if (AppProperties.isDemoMode()){
            downloadUserData();
            return;
        }
        // Do whatever you need to do with the user info data

//        AppProperties.saveUserData(GroupsActivity.this, mUserInfoJson.get());

        //get user ID
        String email = AppProperties.getUserEmail(GroupsActivity.this, currentUser.getEmail());
        if (!AppProperties.isNull(email)){

            String url = AppProperties.DIR_SERVER_ROOT+"getUID";
            JSONObject getUserDataRequest = new JSONObject();
            try{

                getUserDataRequest.put("user_email", email);
            }catch (JSONException e){
                e.printStackTrace();
            }

            JsonObjectRequest getUserId = new JsonObjectRequest
                    (Request.Method.POST, url, getUserDataRequest, new Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject response) {
                            try{
                                AppProperties.setUserId(GroupsActivity.this, response.getLong("ID"));
                                downloadUserData();

                            }catch (JSONException e){
                                e.printStackTrace();
                            }
                        }
                    }, new Response.ErrorListener() {
                        @Override
                        public void onErrorResponse(VolleyError error) {
                            error.printStackTrace();
                        }
                    });
            RequestQueue.getInstance(GroupsActivity.this).addToRequestQueue(getUserId);
        }
    }

    private void showSnackbar(String message) {
        Snackbar.make(findViewById(R.id.coordinator),
                message,
                Snackbar.LENGTH_SHORT)
                .show();
    }

    private void displayLoading(String message) {
        findViewById(R.id.loading_container).setVisibility(View.VISIBLE);
        //findViewById(R.id.grid_container).setVisibility(View.GONE);

        ((TextView)findViewById(R.id.loading_description)).setText(message);
    }

    @MainThread
    private void displayUserInfo(){
        if (AppProperties.isDemoMode()){
            studentWelcome.setText("Choose a group");
            return;
        }
        String name = AppProperties.getUserName(GroupsActivity.this);
        if (!AppProperties.isNull(name))
            studentWelcome.setText(name);
    }

    private void downloadUserData() {

        displayUserInfo();

        if (!Utils.isOnline(GroupsActivity.this)) {
            populateGroups();

            findViewById(R.id.loading_container).setVisibility(View.GONE);
            findViewById(R.id.grid_container).setVisibility(View.VISIBLE);

            return;
        }

        if (AppProperties.isDemoMode()) {
            populateGroups();

            findViewById(R.id.loading_container).setVisibility(View.GONE);
            findViewById(R.id.grid_container).setVisibility(View.VISIBLE);
            return;
        }


        long userId = AppProperties.getUserId(GroupsActivity.this);
        //post un-synchronized complete assignments
        ArrayList<AssignmentBean> assignmentsList = assignmentsDao.getData(AssignmentsDao.QUERY_GET_MODIFIED + " AND complete='"+AppProperties.YES+"'");


        String url = AppProperties.DIR_SERVER_ROOT + "groups/"+userId;
        try {

            int requestType = assignmentsList.size()>0 ? Request.Method.POST : Request.Method.GET;
            StringRequest request = new StringRequest(requestType, url, groupsResponse, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    error.getMessage();
                    Toast.makeText(GroupsActivity.this, "Error loading data", Toast.LENGTH_LONG).show();
                }
            }) {
                // here is params will add to your url using post method
                @Override
                protected Map<String, String> getParams() {
                    Map<String, String> params = new HashMap<>();
                    if (assignmentsList.size()>0){
                        int i = 0;
                        for (AssignmentBean assignmentBean : assignmentsList){
                            params.put("completed_assignments["+(i++)+"]",String.valueOf(assignmentBean.getId()));
                        }
                    }
                    //params.put("2ndParamName","valueoF2ndParam");
                    return params;
                }
            };

            // Access the RequestQueue through your singleton class.
            RequestQueue.getInstance(this).addToRequestQueue(request);


        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    Response.Listener<String> groupsResponse = new Response.Listener<String>() {

        @Override
        public void onResponse(String response) {
            //  mTxtDisplay.setText("Response: " + response.toString());
            JSONArray jsonResponse;
            try {

                jsonResponse = new JSONArray(response);
            } catch (JSONException e) {
                e.printStackTrace();
                return;
            }

            Log.d("JSON response: ", response);

            //success

            ArrayList<AssignmentBean> assignmentsArray = new ArrayList<>();
            try {

                assignmentArray = new ArrayList<>();

                JSONArray groupsList = jsonResponse;
                for (int i = 0; i < groupsList.length(); i++) {
                    JSONObject group = groupsList.getJSONObject(i);
                    long groupId = 0;
                    if (group != null) {
                        groupId = group.getLong("group_id");
                        String groupName = group.getString("group_name");
                        String adminName = group.getString("admin_first_name") + " " + group.getString("admin_last_name");
                        String adminEmail = group.getString("admin_email");
                        String bookName = group.getString("book_name");
                        String bookServerPath = group.getString("book_path");

                        //add group
                        if (!AppDatabase.alreadyExists(GroupsDao.TABLE_NAME, "server_id=" + groupId)) {
                            groupsDao.insertData(groupName, groupId, AppProperties.getCurrentDate(), AppProperties.YES, adminName, adminEmail, bookName, bookServerPath);
                            subscribeToGroupNotifications(groupId);
                        }
                        //update group
                        else {
                            groupsDao.updateData(groupName, groupId, AppProperties.getCurrentDate(), AppProperties.YES, adminName, adminEmail, bookName, bookServerPath);
                        }

                        if (group.getJSONArray("assignments")!=null){
                            JSONArray assignmentsFromServer = group.getJSONArray("assignments");
                            JSONObject assignment = null;
                            for (int j = 0; i<  assignmentsFromServer.length(); i++){
                                 assignment = (JSONObject) assignmentsFromServer.getJSONObject(j);
                            }

                            if (assignment!=null){
                                long serverId = assignment.getLong("id");
                                String assignmentName = assignment.getString("name");
                                String dueDate = assignment.getString("due_date");
                                int startPage = assignment.getInt("start_page");
                                int endPage = assignment.getInt("end_page");
                                int readingTime = assignment.getInt("reading_time");
                                boolean complete = assignment.getBoolean("is_complete");

                                if (!assignmentsDao.checkRecExists(serverId)) {
                                    assignmentsDao.insertData(serverId, assignmentName, groupId, AppProperties.YES, readingTime, dueDate, complete, startPage, endPage);
                                }
                                else
                                    assignmentsDao.updateData(serverId, assignmentName, AppProperties.YES, readingTime, complete, dueDate, startPage, endPage);
                            }
                        }
                    }
                }

                populateGroups();
            } catch (JSONException e) {
                e.printStackTrace();
                Toast.makeText(GroupsActivity.this, "Error loading data", Toast.LENGTH_LONG).show();

            }
        }
    };

    public void populateGroups(){
        userGroups = groupsDao.getGroupsData();

        assignmentGroupsMap = new HashMap<>();

        if (AppProperties.isDemoMode() && assignmentArray.size()>0){
            for (AssignmentBean bean : assignmentArray){
                assignmentGroupsMap.put(bean.getGroupId(), bean);
            }
        }
        else{
            for (AssignmentBean bean : assignmentArray){
                assignmentGroupsMap.put(bean.getGroupId(), bean);
            }
        }

        GridAdapter gridAdapter = new GridAdapter(GroupsActivity.this, assignmentsDao, userGroups, assignmentGroupsMap);
        studentGrid = (GridView)findViewById(R.id.studentGrid);

        studentGrid.setAdapter(gridAdapter);

    }

    public void setThreeDayNotifier(String name)
    {
        String message = "Assignment due date is creeping close!";
        String titleText = "Group " + name + " Assignment";
        String notifierText = "Group " + name + "'s Assignment is due in 3 days. Don't be late!";

        threeDayNotification.setSmallIcon(R.drawable.ic_assignment);
        threeDayNotification.setTicker(message);
        threeDayNotification.setWhen(System.currentTimeMillis());
        threeDayNotification.setContentTitle(titleText);
        threeDayNotification.setContentText(notifierText);

        Intent intent = new Intent(this, GroupsActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);
        threeDayNotification.setContentIntent(pendingIntent);

        //Builds Notification and issues it

        NotificationManager nm = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        nm.notify(threeDay, threeDayNotification.build());
    }

    public void setOneDayNotifier(String name)
    {
        String message = "Assignment due date is creeping close!";
        String titleText = "Group " + name + " Assignment";
        String notifierText = "Group " + name + "'s Assignment is due in 1 day. Don't be late!";

        oneDayNotification.setSmallIcon(R.drawable.ic_assignment);
        oneDayNotification.setTicker(message);
        oneDayNotification.setWhen(System.currentTimeMillis());
        oneDayNotification.setContentTitle(titleText);
        oneDayNotification.setContentText(notifierText);

        Intent intent = new Intent(this, GroupsActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);
        oneDayNotification.setContentIntent(pendingIntent);

        //Builds Notification and issues it

        NotificationManager manager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        manager.notify(oneDay, oneDayNotification.build());
    }

    public void setOneHourNotifier(String name)
    {
        String message = "Assignment due date is creeping close!";
        String titleText = "Group " + name + " Assignment";
        String notifierText = "Group " + name + "'s Assignment is due in 1 hour. Don't be late!";

        oneHourNotification.setSmallIcon(R.drawable.ic_assignment);
        oneHourNotification.setTicker(message);
        oneHourNotification.setWhen(System.currentTimeMillis());
        oneHourNotification.setContentTitle(titleText);
        oneHourNotification.setContentText(notifierText);

        Intent intent = new Intent(this, GroupsActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);
        oneHourNotification.setContentIntent(pendingIntent);

        //Builds Notification and issues it

        NotificationManager manager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        manager.notify(oneHour, oneHourNotification.build());
    }

    public void setOverdueNotifier(String name)
    {
        String message = "Assignment due date is creeping close!";
        String titleText = "Group " + name + " Assignment";
        String notifierText = "Group " + name + "'s Assignment is due in 1 hour. Don't be late!";

        overdueNotification.setSmallIcon(R.drawable.ic_assignment);
        overdueNotification.setTicker(message);
        overdueNotification.setWhen(System.currentTimeMillis());
        overdueNotification.setContentTitle(titleText);
        overdueNotification.setContentText(notifierText);

        Intent intent = new Intent(this, GroupsActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);
        overdueNotification.setContentIntent(pendingIntent);

        //Builds Notification and issues it

        NotificationManager manager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        manager.notify(overdueNotifi, overdueNotification.build());
    }

    public void subscribeToGroupNotifications(long groupId)
    {
        FirebaseMessaging.getInstance().subscribeToTopic("group"+groupId);
    }

    public static Intent createIntent(Context ctx, IdpResponse response){
        Bundle bundle = new Bundle();
        bundle.putParcelable("loginResponse", response);
        return new Intent(ctx, GroupsActivity.class);
    }

    public void setNewAssignmentNotifier(String groupName)
    {
        String message = "New Assignment has been added!";
        String titleText = "New Assignment!";
        String notifierText = "Assignment has been added to Group " + groupName;

        newAssignmentNotifier.setSmallIcon(R.drawable.ic_assignment);
        newAssignmentNotifier.setTicker(message);
        newAssignmentNotifier.setWhen(System.currentTimeMillis());
        newAssignmentNotifier.setContentTitle(titleText);
        newAssignmentNotifier.setContentText(notifierText);

        Intent intent = new Intent(this, GroupsActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);
        newAssignmentNotifier.setContentIntent(pendingIntent);

        //Builds Notification and issues it

        NotificationManager manager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        manager.notify(newAssignmentNotification, newAssignmentNotifier.build());
    }

    public void setTestNotifier()
    {
        String message = "You are now in the Groups Page!";
        String titleText = "Groups Page";
        String notifierText = "This is the groups page!";

        testNotifier.setSmallIcon(R.drawable.ic_assignment);
        testNotifier.setTicker(message);
        testNotifier.setWhen(System.currentTimeMillis());
        testNotifier.setContentTitle(titleText);
        testNotifier.setContentText(notifierText);

        Intent intent = new Intent(this, GroupsActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);
        testNotifier.setContentIntent(pendingIntent);

        //Builds Notification and issues it

        NotificationManager manager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        manager.notify(newTestNotify, testNotifier.build());
    }
}
