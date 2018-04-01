package com.novoholdings.safetybook.activities;

import android.Manifest;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.support.annotation.MainThread;
import android.support.annotation.NonNull;
import android.support.design.widget.Snackbar;
import android.support.v4.app.ActivityCompat;
import android.support.v4.app.NotificationCompat;
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
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.facebook.stetho.json.ObjectMapper;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.novoholdings.safetybook.MySingleton;
import com.novoholdings.safetybook.R;
import com.novoholdings.safetybook.beans.AssignmentBean;
import com.novoholdings.safetybook.beans.AssignmentJson;
import com.novoholdings.safetybook.beans.GroupBean;
import com.novoholdings.safetybook.beans.GroupJson;
import com.novoholdings.safetybook.common.AppProperties;
import com.novoholdings.safetybook.common.Utils;
import com.novoholdings.safetybook.database.AppDatabase;
import com.novoholdings.safetybook.database.AssignmentsDao;
import com.novoholdings.safetybook.database.GroupsDao;
import com.novoholdings.safetybook.ui.GridAdapter;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;

public class GroupsActivity extends AppCompatActivity {

    private static final String TAG = "GroupsActivity";
    private static final String KEY_USER_INFO = "userInfo";

    private GroupsDao groupsDao;
    private AssignmentsDao assignmentsDao;
    private ArrayList<GroupBean> userGroups;
    private GridLayout gridLayout;
    private GridView studentGrid;
    private TextView studentWelcome;
    private ArrayList<AssignmentJson> assignmentArray = new ArrayList<>();
    private HashMap<Long, AssignmentJson> assignmentGroupsMap;

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
        if (currentUser!=null){
            updateUI(currentUser);
        }
        else {
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

        fetchUserInfo(currentUser);


        int check = ActivityCompat.checkSelfPermission(GroupsActivity.this, Manifest.permission.WRITE_EXTERNAL_STORAGE);
        if (check == PackageManager.PERMISSION_GRANTED) {
            //Do something
        } else if (Build.VERSION.SDK_INT > Build.VERSION_CODES.LOLLIPOP_MR1) {
            requestPermissions(new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE},1024);
        }
    }


    @MainThread
    private void fetchUserInfo(FirebaseUser currentUser) {
        //displayLoading(getString(R.string.user_info_loading));
        if (AppProperties.isDemoMode()){
            runOnUiThread(() -> downloadUserData());
            return;
        }
        // Do whatever you need to do with the user info data

//        AppProperties.saveUserData(GroupsActivity.this, mUserInfoJson.get());

        //get user ID
        String email = AppProperties.getUserEmail(GroupsActivity.this, null);
        if (!AppProperties.isNull(email)){

            String url = AppProperties.DIR_SERVER_ROOT+"getUID";
            JSONObject getUserDataRequest = new JSONObject();
            try{

                getUserDataRequest.put("user_email", "userE1@test.test");
            }catch (JSONException e){
                e.printStackTrace();
            }

            JsonObjectRequest getUserId = new JsonObjectRequest
                    (Request.Method.POST, url, getUserDataRequest, new Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject response) {
                            try{
                                AppProperties.setUserId(GroupsActivity.this, response.getLong("ID"));
                                runOnUiThread(() -> downloadUserData());

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
            MySingleton.getInstance(GroupsActivity.this).addToRequestQueue(getUserId);
        }
    }

    @MainThread
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

    private void downloadUserData(){

        displayUserInfo();

        if (!Utils.isOnline(GroupsActivity.this) ){
            populateGroups();

            findViewById(R.id.loading_container).setVisibility(View.GONE);
            findViewById(R.id.grid_container).setVisibility(View.VISIBLE);

            return;
        }

        if (AppProperties.isDemoMode()){
            populateGroups();

            findViewById(R.id.loading_container).setVisibility(View.GONE);
            findViewById(R.id.grid_container).setVisibility(View.VISIBLE);
            return;
        }

        try{
            //todo
            String email = "userE1@test.test"; //AppProperties.getUserEmail(GroupsActivity.this, "test@test.test");

            JSONObject getUserDataRequest = new JSONObject();
            getUserDataRequest.put("email", email);

            String url = AppProperties.DIR_SERVER_ROOT+"getGroupsUser";

            StringRequest jsObjRequest = new StringRequest
                    (Request.Method.POST, url, new Response.Listener<String>() {

                        @Override
                        public void onResponse(String response) {
                            //  mTxtDisplay.setText("Response: " + response.toString());
                            JSONArray jsonResponse;
                            try{

                                jsonResponse = new JSONArray(response);
                            }catch (JSONException e){
                                e.printStackTrace();
                                return;
                            }

                            Log.d("JSON response: ", response.toString());

                            //success

                            ArrayList<AssignmentBean> assignmentsArray = new ArrayList<>();
                            try{

                                assignmentArray = new ArrayList<>();

                                JSONArray groupsList = jsonResponse;
                                for (int i = 0; i < groupsList.length(); i++){
                                    JSONObject group = groupsList.getJSONObject(i);
                                    long groupId = 0;
                                    if (group!=null){
                                        groupId = group.getLong("group_id");
                                        String name = group.getString("group_name");
                                        String adminName = group.getString("admin_firstname") + " " + group.getString("admin_lastname");
                                        String adminEmail = group.getString("admin_email");
                                        String bookName = group.getString("book_name");
                                        String bookServerPath = group.getString("file");

                                        //add group
                                        if (AppDatabase.alreadyExists(GroupsDao.TABLE_NAME, "server_id="+groupId)){
                                            groupsDao.insertData(name, groupId, AppProperties.getCurrentDate(), AppProperties.YES, adminName, adminEmail, bookName, bookServerPath);
                                            setNewGroupNotifier(name);
                                        }
                                        //update group
                                        else{
                                            groupsDao.updateData(name, groupId, AppProperties.getCurrentDate(), AppProperties.YES, adminName, adminEmail, bookName);
                                        }
                                    }


                                    //get current active assignment
                                    if (group.getJSONObject("assignment")!=null){
                                        AssignmentJson assignment = (AssignmentJson)group.getJSONObject("assignment");

                                        String complete = (assignment.getInt("complete")==1) ? AppProperties.YES : AppProperties.NO;

                                        assignmentArray.add(assignment);

                                        if (!assignmentsDao.checkRecExists(assignment.getServerId())) {
                                            assignmentsDao.insertData(assignment.getName(), assignment.getServerId(), assignment.getGroupId(), AppProperties.YES, assignment.getReadingTime(), assignment.getDueDate(), complete, assignment.getStartPage(), assignment.getEndPage());
                                        }
                                        else
                                            assignmentsDao.updateData(assignment.getServerId(), assignment.getName(), AppProperties.YES, assignment.getReadingTime(), assignment.getDueDate(), assignment.getStartPage(), assignment.getEndPage());
                                    }
                                }

                                populateGroups();
                            }catch (JSONException e){
                                e.printStackTrace();
                                Toast.makeText(GroupsActivity.this, "Error loading data", Toast.LENGTH_LONG).show();

                            }
                        }
                    }, new Response.ErrorListener() {

                        @Override
                        public void onErrorResponse(VolleyError error) {
                            error.getMessage();
                            Toast.makeText(GroupsActivity.this, "Error loading data", Toast.LENGTH_LONG).show();
                        }
                    }){
                        // here is params will add to your url using post method
                        @Override
                        protected Map<String, String> getParams() {
                            Map<String, String> params = new HashMap<>();
                            params.put("user_email", email);
                            //params.put("2ndParamName","valueoF2ndParam");
                            return params;
                        }
            };

            // Access the RequestQueue through your singleton class.
            MySingleton.getInstance(this).addToRequestQueue(jsObjRequest);
        } catch (JSONException e){
            e.printStackTrace();
        }
    }

    public void populateGroups(){
        userGroups = groupsDao.getGroupsData();

        assignmentGroupsMap = new HashMap<>();

        if (AppProperties.isDemoMode() && assignmentArray.size()>0){
            for (AssignmentJson bean : assignmentArray){
                assignmentGroupsMap.put(bean.getGroupId(), bean);
            }
        }
        else{
            for (AssignmentJson bean : assignmentArray){
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

    public void setNewGroupNotifier(String name)
    {
        String message = "Welcome to your new group!";
        String titleText = "Welcome!";
        String notifierText = "You have been added to Group " + name;

        newGroupNotifier.setSmallIcon(R.drawable.ic_group_name);
        newGroupNotifier.setTicker(message);
        newGroupNotifier.setWhen(System.currentTimeMillis());
        newGroupNotifier.setContentTitle(titleText);
        newGroupNotifier.setContentText(notifierText);

        Intent intent = new Intent(this, GroupsActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);
        newGroupNotifier.setContentIntent(pendingIntent);

        //Builds Notification and issues it

        NotificationManager manager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        manager.notify(newGroupNotification, newGroupNotifier.build());
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
