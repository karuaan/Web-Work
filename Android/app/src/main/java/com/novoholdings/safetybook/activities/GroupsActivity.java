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
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.MenuItem;
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
    private SwipeRefreshLayout swipeRefreshLayout;
    private GridView studentGrid;
    private TextView studentWelcome;
    private ArrayList<AssignmentBean> assignmentArray = new ArrayList<>();
    private HashMap<Long, AssignmentBean> assignmentGroupsMap;

    private FirebaseAuth mAuth;

    Bundle extras;

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
            updateUI();
        }


    }

    @Override
    protected void onStart() {
        super.onStart();

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

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {

            // Check if user triggered a refresh:
            case R.id.sync:
                Log.i("Input", "Refresh menu item selected");

                // Signal SwipeRefreshLayout to start the progress indicator
                swipeRefreshLayout.setRefreshing(true);

                // Start the refresh background task.
                // This method calls setRefreshing(false) when it's finished.
                fetchUserInfo(mAuth.getCurrentUser());

                return true;

            case R.id.log_out:

                mAuth.signOut();
        }

        // User didn't trigger a refresh, let the superclass handle this action
        return super.onOptionsItemSelected(item);

    }
    private void updateUI(){
        extras = getIntent().getExtras();

        groupsDao = new GroupsDao(GroupsActivity.this);
        assignmentsDao = new AssignmentsDao(GroupsActivity.this);

        swipeRefreshLayout = (SwipeRefreshLayout)findViewById(R.id.swipe_layout);
        studentGrid = (GridView) findViewById(R.id.studentGrid);
        studentWelcome = (TextView) findViewById(R.id.studentWelcome);

        swipeRefreshLayout.setOnRefreshListener(
                new SwipeRefreshLayout.OnRefreshListener() {
                    @Override
                    public void onRefresh() {
                        Log.i("Input", "onRefresh called from SwipeRefreshLayout");

                        // This method performs the actual data-refresh operation.
                        // The method calls setRefreshing(false) when it's finished.
                        fetchUserInfo(mAuth.getCurrentUser());
                    }
                }
        );
        swipeRefreshLayout.setRefreshing(true);
        fetchUserInfo(mAuth.getCurrentUser());
    }

    @Override
    public void onBackPressed(){
        finish();
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
        int permissionCheck = ContextCompat.checkSelfPermission(
                this, Manifest.permission.WRITE_EXTERNAL_STORAGE);
        if (permissionCheck != PackageManager.PERMISSION_GRANTED){
            ActivityCompat.shouldShowRequestPermissionRationale(this,
                    Manifest.permission.WRITE_EXTERNAL_STORAGE);
            showExplanation("Storage permission needed", "", Manifest.permission.READ_PHONE_STATE, REQUEST_PERMISSION_WRITE_EXTERNAL_STORAGE);
        } else {
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
                                    swipeRefreshLayout.setRefreshing(false);
                                    e.printStackTrace();
                                }
                            }
                        }, new Response.ErrorListener() {
                            @Override
                            public void onErrorResponse(VolleyError error) {
                                swipeRefreshLayout.setRefreshing(false);
                                error.printStackTrace();
                            }
                        });
                RequestQueue.getInstance(GroupsActivity.this).addToRequestQueue(getUserId);
            }
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
            swipeRefreshLayout.setRefreshing(false);

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
                    swipeRefreshLayout.setRefreshing(false);
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
            swipeRefreshLayout.setRefreshing(false);
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


                        //add group
                        if (!AppDatabase.alreadyExists(GroupsDao.TABLE_NAME, "server_id=" + groupId)) {
                            groupsDao.insertData(groupName, groupId, AppProperties.getCurrentDate(), AppProperties.YES, adminName, adminEmail);
                            subscribeToGroupNotifications(groupId);
                        }
                        //update group
                        else {
                            groupsDao.updateData(groupName, groupId, AppProperties.getCurrentDate(), AppProperties.YES, adminName, adminEmail);
                        }

                        if (group.getJSONArray("assignments")!=null){
                            JSONArray assignmentsFromServer = group.getJSONArray("assignments");
                            JSONObject assignment = null;
                            for (int j = 0; j<  assignmentsFromServer.length(); j++) {
                                assignment = (JSONObject) assignmentsFromServer.getJSONObject(j);


                                if (assignment != null) {
                                    long serverId = assignment.getLong("id");
                                    String assignmentName = assignment.getString("name");
                                    String dueDate = assignment.getString("due_date");
                                    int startPage = assignment.getInt("start_page");
                                    int endPage = assignment.getInt("end_page");
                                    int readingTime = assignment.getInt("reading_time");
                                    boolean complete = assignment.getBoolean("is_complete");
                                    String bookServerPath = assignment.getString("book_pdf");
                                    if (bookServerPath.contains("public/")) {
                                        bookServerPath = bookServerPath.replace("public/", "");
                                    }
                                    if (bookServerPath.contains("\\")) {
                                        bookServerPath = bookServerPath.replace("\\", "/");
                                    }

                                    if (!assignmentsDao.checkRecExists(serverId)) {
                                        assignmentsDao.insertData(serverId, assignmentName, groupId, AppProperties.YES, readingTime, dueDate, complete, startPage, endPage, bookServerPath);
                                    } else
                                        assignmentsDao.updateData(serverId, assignmentName, AppProperties.YES, readingTime, complete, dueDate, startPage, endPage, bookServerPath);
                                }
                            }
                        }
                    }
                }

                populateGroups();
            } catch (JSONException e) {
                swipeRefreshLayout.setRefreshing(false);
                e.printStackTrace();
                Toast.makeText(GroupsActivity.this, "Error loading data", Toast.LENGTH_LONG).show();

            }
        }
    };

    public void populateGroups(){
        userGroups = groupsDao.getGroupsData();

        GridAdapter gridAdapter = new GridAdapter(GroupsActivity.this, assignmentsDao, userGroups);
        studentGrid = (GridView)findViewById(R.id.studentGrid);

        studentGrid.setAdapter(gridAdapter);
        swipeRefreshLayout.setRefreshing(false);

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
}
