package com.novoholdings.safetybook.activities;

import android.Manifest;
import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.app.ActionBar;
import android.app.AlertDialog;
import android.app.DownloadManager;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.graphics.Canvas;
import android.graphics.Point;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.os.Environment;
import android.os.Handler;
import android.support.constraint.solver.widgets.ConstraintTableLayout;
import android.support.design.widget.CoordinatorLayout;
import android.support.design.widget.FloatingActionButton;
import android.support.v4.app.ActivityCompat;
import android.support.v4.app.NotificationCompat;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.DividerItemDecoration;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.util.LongSparseArray;
import android.util.TimeUtils;
import android.view.Gravity;
import android.view.Menu;
import android.view.MenuItem;
import android.view.MotionEvent;
import android.view.View;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.*;
import com.novoholdings.safetybook.MySingleton;
import com.novoholdings.safetybook.beans.AssignmentJson;
import com.novoholdings.safetybook.R;
import com.novoholdings.safetybook.beans.AssignmentBean;
import com.novoholdings.safetybook.common.AppProperties;
import com.novoholdings.safetybook.database.AssignmentsDao;
import com.novoholdings.safetybook.ui.AssignmentListAdapter;
import com.github.barteksc.pdfviewer.PDFView;
import com.github.barteksc.pdfviewer.listener.OnDrawListener;
import com.github.barteksc.pdfviewer.listener.OnErrorListener;
import com.github.barteksc.pdfviewer.listener.OnLoadCompleteListener;
import com.github.barteksc.pdfviewer.listener.OnPageChangeListener;
import com.github.barteksc.pdfviewer.listener.OnPageErrorListener;
import com.github.barteksc.pdfviewer.listener.OnPageScrollListener;
import com.github.barteksc.pdfviewer.listener.OnRenderListener;
import com.github.barteksc.pdfviewer.listener.OnTapListener;
import com.github.barteksc.pdfviewer.scroll.DefaultScrollHandle;

import org.joda.time.DateTime;
import org.joda.time.Days;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * Created by James on 11/25/2017.
 */

public class AssignmentsActivity extends AppCompatActivity{
    private String groupName, adminName, adminEmail, localFilePath, currentAssignmentPath;
    private long groupId, userId, currentAssignmentId,  lastDownload=-1L;
    private LongSparseArray<AssignmentBean> assignmentDownloadIdServerIdMap;

    private PDFView pdfView;
    private LinearLayout lastPageBottomBar;
    private CoordinatorLayout pdfContainerLayout;
    private TextView timerLabelTV, chapterNameTV, relativeDueDateTV, pageCountTV, readingTimeTV;

    private AssignmentsDao assignmentsDao;

    private DownloadManager downloadManager;

    private ArrayList<AssignmentBean> assignmentsList;

    ArrayList<Long> downloadList = new ArrayList<>();
    boolean assignmentsDueSoon;

    AssignmentListAdapter adapter;
    RecyclerView recyclerView;
    View infoPane;
    Button startButton;

    private boolean isFabShowing, lastPageReached, immersiveMode, readingStarted, readingFinished;
    private FloatingActionButton fab;
    private int timeToRead;

    private CountDownTimer countDownTimer;

    NotificationCompat.Builder threeDayNotification, oneDayNotification, oneHourNotification, overdueNotification, newGroupNotifier, newAssignmentNotifier;
    private static final int threeDay = 5548;
    private static final int oneDay = 5546;
    private static final int oneHour = 5542;
    private static final int overdueNotifi = 5524;
    private static final int newGroupNotification = 5584;
    private static final int newAssignmentNotification = 5562;



    @Override
    protected void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_assignments);
        getIntentExtras();

        android.support.v7.app.ActionBar actionBar = getSupportActionBar();
        if (actionBar!=null){
            actionBar.setTitle(groupName);
            actionBar.setSubtitle("Choose an assignment");
        }

        /*
         * initialize layout variables
         */

        //three main layouts
        infoPane = (View) findViewById(R.id.infoPane);
        recyclerView=(RecyclerView)findViewById(R.id.expandedList);
        pdfContainerLayout = (CoordinatorLayout) findViewById(R.id.pdf_layout);

        //assignment preview panel elements
        chapterNameTV = (TextView)infoPane.findViewById(R.id.chapterName);
        relativeDueDateTV = (TextView)infoPane.findViewById(R.id.relativeDueDateTv);
        pageCountTV = (TextView)infoPane.findViewById(R.id.numOfPages);
        readingTimeTV = (TextView)infoPane.findViewById(R.id.timeLimit);
        startButton = (Button)infoPane.findViewById(R.id.startButton);

        //pdf view elements
        pdfView = (PDFView)pdfContainerLayout.findViewById(R.id.pdfView);
        fab = (FloatingActionButton) pdfContainerLayout.findViewById(R.id.completionButton);
        timerLabelTV = (TextView)pdfContainerLayout.findViewById(R.id.timeToRead);

        setupRecycler();


        localFilePath = AppProperties.SDCARD_APP_FOLDER_NAME+"/"+groupName;

        //get assignments from local storage
        assignmentsDao = new AssignmentsDao(AssignmentsActivity.this);
        //assignmentsDao.insertData("Chapter Name", 1, groupId, YES, 900, "11-30-17T00:00.000Z", YES, "filename.pdf", 1, 10);
        assignmentsList = assignmentsDao.getAssignments(groupId);
        assignmentsDueSoon = assignmentsList.size() > 0;

        if (assignmentsDueSoon){
            adapter = new AssignmentListAdapter(AssignmentsActivity.this, assignmentsList);
            recyclerView.setAdapter(adapter);
            //todo
            if (assignmentsList.size()==1)
                recyclerView.findViewHolderForAdapterPosition(0).itemView.performClick();

        }

        downloadAssignmentMetadata();

        IntentFilter intentFilter = new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE);

        registerReceiver(onComplete, intentFilter);

        //download new assignments
        assignmentDownloadIdServerIdMap = new LongSparseArray<AssignmentBean>();
        downloadList = new ArrayList<>();

        downloadManager =  (DownloadManager) getSystemService(Context.DOWNLOAD_SERVICE);
        int check = ActivityCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE);
        if (check == PackageManager.PERMISSION_GRANTED) {
            //Do something
        } else if (Build.VERSION.SDK_INT > Build.VERSION_CODES.LOLLIPOP_MR1) {
            requestPermissions(new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE},1024);
        }

        threeDayNotification = new NotificationCompat.Builder(this);
        threeDayNotification.setAutoCancel(true);

        oneDayNotification = new NotificationCompat.Builder(this);
        oneDayNotification.setAutoCancel(true);

        oneHourNotification = new NotificationCompat.Builder(this);
        oneHourNotification.setAutoCancel(true);

        overdueNotification = new NotificationCompat.Builder(this);
        overdueNotification.setAutoCancel(false);

        newGroupNotifier = new NotificationCompat.Builder(this);
        newGroupNotifier.setAutoCancel(true);

        newAssignmentNotifier = new NotificationCompat.Builder(this);
        newAssignmentNotifier.setAutoCancel(true);
    }
    private void getIntentExtras(){
        Bundle extras = getIntent().getExtras();
        groupName = AppProperties.NVL(extras.getString("groupName"), "Not Found");
        adminName = AppProperties.NVL(extras.getString("adminEmail"), "Not Found");
        adminEmail = extras.getString("adminEmail");
        groupId = extras.getLong("groupId");
        groupId=extras.getLong("groupId");
        userId = AppProperties.getUserId(AssignmentsActivity.this);
    }
    private void setupRecycler(){
        LinearLayoutManager linearLayoutManager = new LinearLayoutManager(AssignmentsActivity.this);
        recyclerView.setLayoutManager(linearLayoutManager);

        DividerItemDecoration dividerItemDecoration = new DividerItemDecoration(recyclerView.getContext(),
                linearLayoutManager.getOrientation());
        recyclerView.addItemDecoration(dividerItemDecoration);
    }

    private void downloadAssignmentMetadata(){
        final String groupUrl = AppProperties.DIR_SERVER_ROOT+"getAssignments";
        long userId = AppProperties.getUserId(AssignmentsActivity.this);

        JSONArray requestParams = new JSONArray();
        requestParams.put(groupId);
        requestParams.put(userId);
        JsonArrayRequest assignmentsRequest = new JsonArrayRequest(Request.Method.POST, groupUrl, requestParams, new Response.Listener<JSONArray>() {
            @Override
            public void onResponse(JSONArray response) {
                for (int i = 0; i < response.length(); i++){
                    /*try{
                        AssignmentJson assignment = (AssignmentJson)response.getJSONObject(i);

                        String path = assignment.getString("file");
                        AssignmentBean assignmentBean = new AssignmentBean(groupId, path);

                        String complete = (assignment.getCompletionStatus()==1) ? AppProperties.YES : AppProperties.NO;
                        assignmentBean.setId(assignment.getServerId());
                        assignmentBean.setStartPage(assignment.getStartPage());
                        assignmentBean.setEndPage(assignment.getEndPage());
                        assignmentBean.setName(assignment.getName());
                        assignmentBean.setReadingTime(assignment.getReadingTime());
                        assignmentBean.setDueDate(assignment.getDueDate());
                        assignmentBean.setGroupId(groupId);
                        assignmentBean.setComplete(assignment.getCompletionStatus()==1);

                        if (!assignmentsDao.checkRecExists(assignmentBean.getId())){
                            assignmentsDao.insertData(assignmentBean.getName(), assignment.getServerId(), groupId, AppProperties.YES, assignmentBean.getReadingTime(), assignment.getDueDate(), complete, assignmentBean.getServerPath(), assignment.getStartPage(), assignment.getEndPage());
                            setNewAssignmentNotifier(assignmentBean.getName());
                        }
                        else {
                            assignmentsDao.updateData(assignmentBean.getId(), assignmentBean.getName(), AppProperties.getCurrentDate(), AppProperties.YES, assignmentBean.getReadingTime(), assignment.getDueDate(), assignmentBean.getServerPath());
                        }

                    }catch (JSONException e){
                        e.printStackTrace();
                    }*/
                }
                populateRecyclerView();
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                error.printStackTrace();
            }
        });

        // Access the RequestQueue through your singleton class.
        MySingleton.getInstance(this).addToRequestQueue(assignmentsRequest);
    }

    private void populateRecyclerView(){
        assignmentsList = assignmentsDao.getAssignments(groupId);

        if (adapter==null) {
            adapter = new AssignmentListAdapter(AssignmentsActivity.this, assignmentsList);
            recyclerView.setAdapter(adapter);
        }
        else
            adapter.notifyDataSetChanged();
    }
    public void showAssignmentInfo(AssignmentBean assignmentBean){
        findViewById(R.id.infoContainer).setVisibility(View.VISIBLE);
        findViewById(R.id.startButton).setVisibility(View.VISIBLE);

        currentAssignmentId = assignmentBean.getId();
        currentAssignmentPath = assignmentBean.getServerPath();

        String label = getMinutes(assignmentBean.getReadingTime()) + ":" + getSeconds(assignmentBean.getReadingTime());
        String pageCount = assignmentBean.getPageCount() + " pages";
        String days = getRelativeDueDate(assignmentBean.getDueDateIso(), DateTime.parse(AppProperties.getCurrentDate()));

        chapterNameTV.setText(assignmentBean.getName());
        readingTimeTV.setText(label);
        pageCountTV.setText(String.valueOf(pageCount));
        relativeDueDateTV.setText(days);

        String localPath = AppProperties.NVL(assignmentBean.getLocalPath());

        if (AppProperties.isDemoMode())
            //set start button on click
            startButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    startReading(assignmentBean.getFileName(), assignmentBean.getReadingTime());
                }
            });
        else{

            File file = new File(localPath);

            if (file.exists()){
                //set start button on click
                startButton.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        startReading(file, assignmentBean.getReadingTime());
                    }
                });
            }
            else {
                Uri uri = Uri.parse(assignmentBean.getServerPath());
                String serverPath = assignmentBean.getServerPath();
                String fileName = AppProperties.getFileNameFromPath(serverPath);

                //set download button on click
                startButton.setText(R.string.download);
                startButton.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        startDownload(uri, fileName, assignmentBean);
                    }
                });
            }
        }

    }

    private String getRelativeDueDate(String dueDateStr, DateTime currentDate){
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'00:00.000'Z'", Locale.US);
        String due = "";
        try{

            DateTime dueDate = DateTime.parse(dueDateStr);

            Days d = Days.daysBetween(currentDate, dueDate);
            int days = d.getDays();

            if (days<0){
                //assignment past due
                days = -days;
                if(days==1)
                    due = days+" day ago";
                else
                    due = days+" days ago";
            }
            else if (days>0){
                //assignment due in the future
                if (days==1)
                    due = days + " day";
                else
                    due = days + " days";
            }
            else if (days==0){
                //assignment due today
                due = "Today";
            }
            else {
                due = "Not available";
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return due;
    }
    private class DownloadAssignmentTask{

    }
    @Override
    public void onDestroy() {
        super.onDestroy();

        unregisterReceiver(onComplete);
    }

    BroadcastReceiver onComplete=new BroadcastReceiver() {
        public void onReceive(Context ctxt, Intent intent) {
//check if the broadcast message is for our enqueued download
            long referenceId = intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1);

            //is the assignment currently showing in the preview pane?
            if (assignmentDownloadIdServerIdMap.get(referenceId) != null && assignmentDownloadIdServerIdMap.get(referenceId).getId() == currentAssignmentId){
                File file = new File(currentAssignmentPath);
                //change start button appearance and behavior
                startButton.setText("Start");
                startButton.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        startReading(file, assignmentDownloadIdServerIdMap.get(referenceId).getReadingTime());
                    }
                });
                startButton.setEnabled(true);
                assignmentDownloadIdServerIdMap.remove(referenceId);
            }

// remove it from our list
            downloadList.remove(referenceId);


            Toast toast = Toast.makeText(AssignmentsActivity.this,
                    "Image Download Complete", Toast.LENGTH_LONG);
            toast.setGravity(Gravity.TOP, 25, 400);
            toast.show();
        }
    };

    public void startDownload(Uri uri, String fileName, AssignmentBean assignment) {

        startButton.setEnabled(false);
        startButton.setText("Downloading...");

        Environment
                .getExternalStoragePublicDirectory(localFilePath)
                .mkdirs();

        lastDownload=
                downloadManager.enqueue(new DownloadManager.Request(uri)
                        .setAllowedNetworkTypes(DownloadManager.Request.NETWORK_WIFI |
                                DownloadManager.Request.NETWORK_MOBILE)
                        .setAllowedOverRoaming(false)
                        .setTitle(fileName)
                        .setDescription("Safety Handbook Chapter")
                        .setVisibleInDownloadsUi(true)
                        .setDestinationInExternalPublicDir(localFilePath,
                                fileName));

        assignmentDownloadIdServerIdMap.append(lastDownload, assignment);

        downloadList.add(lastDownload);
    }

    //todo remove

    /*private long downloadData(Uri uri, String fileName) {

        long downloadReference;

        // Create request for android download manager
        downloadManager = (DownloadManager)getSystemService(DOWNLOAD_SERVICE);
        DownloadManager.Request request = new DownloadManager.Request(uri);

        //Setting title of request
        request.setTitle("PDF download");

        //Setting description of request
        request.setDescription("PDF download using DownloadManager.");

        //Set the local destination for the downloaded file to a localFilePath
        //within the application's external files directory
        String path = groupName+"/"+fileName+".pdf";
        request.setDestinationInExternalFilesDir(AssignmentsActivity.this,
                AppProperties.SDCARD_APP_FOLDER_NAME,path);

        //Enqueue download and save into referenceId
        downloadReference = downloadManager.enqueue(request);

        return downloadReference;
    }*/

    private void checkDownloadStatus(long downloadId) {

        DownloadManager.Query pdfDownloadQuery = new DownloadManager.Query();
        //set the query filter to our previously Enqueued download
        pdfDownloadQuery.setFilterById(downloadId);

        //Query the download manager about downloads that have been requested.
        Cursor cursor = downloadManager.query(pdfDownloadQuery);
        if(cursor.moveToFirst()){
            downloadStatus(cursor, downloadId);
        }
    }

    private void completeAssignment(){
        assignmentsDao.completeReading(currentAssignmentId);
        Toast.makeText(AssignmentsActivity.this, "Reading complete!", Toast.LENGTH_LONG).show();
        syncCompletionStatus();
        populateRecyclerView();
        stopReading();
    }

    private void stopReading(){

        showSystemUI();
        showAssignmentMenu();
        readingStarted = false;
        countDownTimer.cancel();

    }

    private void syncCompletionStatus(){
        String  url = AppProperties.DIR_SERVER_ROOT+"update/status";
        JSONObject body = new JSONObject();
        try{
            body.put("user_id", userId);
            body.put("asssignment_id", currentAssignmentId);

        }catch (JSONException e){
            e.printStackTrace();
        }
        JsonObjectRequest postComplete = new JsonObjectRequest(Request.Method.POST, url, body, new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                assignmentsDao.updateData(currentAssignmentId, null, AppProperties.getCurrentDate(), AppProperties.YES, 0, null, null);
                Toast.makeText(AssignmentsActivity.this, "Reading progress synchronized", Toast.LENGTH_LONG).show();
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                AlertDialog.Builder alert = new AlertDialog.Builder(AssignmentsActivity.this);
                alert.setTitle("Could not synchronize reading progress")
                        .setMessage(error.getMessage()+"\n\nPlease check your network connection and try again.")
                        .setPositiveButton("Try Again", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                syncCompletionStatus();
                            }
                        })
                        .setNegativeButton("Later", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {

                            }
                        })
                        .show();
            }
        });
        MySingleton.getInstance(AssignmentsActivity.this).addToRequestQueue(postComplete);
    }

    public void startReading(File file, int timeToRead){

        final AssignmentBean assignmentBean = new AssignmentBean();
        assignmentBean.setLastReadPosition(0);

        pdfView.fromFile(file)
                .enableSwipe(true) // allows to block changing pages using swipe
                .swipeHorizontal(false)
                .defaultPage(0)
                // allows to draw something on the current page, usually visible in the middle of the screen
                .onDraw(new OnDrawListener() {
                    @Override
                    public void onLayerDrawn(Canvas canvas, float pageWidth, float pageHeight, int displayedPage) {
                       /* if (!startMessageShown){
                            //draw overlay showing page count, reading time, start button
                        }*/

                    }
                })
                .onLoad(new OnLoadCompleteListener() {
                    @Override
                    public void loadComplete(int nbPages) {

                        hideAssignmentMenu(false);

                        hideSystemUI();

                        startTimer(timeToRead);
                    }
                }) // called after document is loaded and starts to be rendered
                .onPageChange(new OnPageChangeListener() {
                    @Override
                    public void onPageChanged(int page, int pageCount) {

                        if (page==pageCount-1){
                            lastPageReached=true;
                            showFab();
                        }
                    }
                })
                .onPageScroll(new OnPageScrollListener() {
                    @Override
                    public void onPageScrolled(int page, float positionOffset) {

                        if (immersiveMode)
                            hideSystemUI();

                        if (positionOffset==1){
                            lastPageReached=true;
                            showFab();
                        }

                        if (lastPageReached){
                            if (positionOffset > assignmentBean.getLastReadPosition()){
                                hideFab();
                                assignmentBean.setLastReadPosition(positionOffset);
                            }
                            else if (positionOffset < assignmentBean.getLastReadPosition()){
                                showFab();
                                assignmentBean.setLastReadPosition(positionOffset);
                            }
                        }
                    }
                })
                .onError(new OnErrorListener() {
                    @Override
                    public void onError(Throwable t) {
                        AlertDialog.Builder dialog = new AlertDialog.Builder(AssignmentsActivity.this);
                        dialog.setTitle("Error loading assignment")
                                .setMessage("The assignment could not be loaded due to the following error:\n\n"+t.getMessage()+"\n\nPlease try downloading again or contact your administrator.")
                                .setPositiveButton("Download", new DialogInterface.OnClickListener() {
                                    @Override
                                    public void onClick(DialogInterface dialog, int which) {
                                        //todo download assignment
                                        Uri uri = Uri.parse(assignmentBean.getServerPath());
                                        startDownload(uri, file.getName(), assignmentBean);
                                    }
                                })
                                .setNeutralButton("Contact", new DialogInterface.OnClickListener() {
                                    @Override
                                    public void onClick(DialogInterface dialog, int which) {
                                        emailAdmin();
                                    }
                                })
                                .setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                                    @Override
                                    public void onClick(DialogInterface dialog, int which) {

                                    }
                                }).show();
                    }
                })
                .onPageError(new OnPageErrorListener() {
                    @Override
                    public void onPageError(int page, Throwable t) {

                    }
                })
                .onRender(new OnRenderListener() {
                    @Override
                    public void onInitiallyRendered(int nbPages, float pageWidth, float pageHeight) {

                    }
                }) // called after document is rendered for the first time
                // called on single tap, return true if handled, false to toggle scroll handle visibility
                .onTap(new OnTapListener() {
                    @Override
                    public boolean onTap(MotionEvent e) {

                        showSystemUI();

                        if (isFabShowing)
                            hideFab();
                        else if (lastPageReached)
                            showFab();
                        return false;
                    }
                })
                .enableAnnotationRendering(false) // render annotations (such as comments, colors or forms)
                .password(null)
                .scrollHandle(new DefaultScrollHandle(AssignmentsActivity.this))
                .enableAntialiasing(true) // improve rendering a little bit on low-res screens
                // spacing between pages in dp. To define spacing color, set view background
                .spacing(2)
                //.pageFitPolicy(WIDTH)
                .load();

        /*.setListener(new AnimatorListenerAdapter() {
            @Override
            public void onAnimationEnd(Animator animation) {
                super.onAnimationEnd(animation);
                listParent.setVisibility(View.GONE);
            }
        });*/
    }
    public void startReading(String fileName, int timeToRead){
        findViewById(R.id.parentPanel).setVisibility(View.INVISIBLE);
        readingFinished = false;

        final AssignmentBean assignmentBean = new AssignmentBean();
        assignmentBean.setLastReadPosition(0);

        isFabShowing =true;
        hideFab();

        pdfView.fromAsset(fileName)
                .enableSwipe(true) // allows to block changing pages using swipe
                .swipeHorizontal(false)
                .defaultPage(0)
                // allows to draw something on the current page, usually visible in the middle of the screen
                .onDraw(new OnDrawListener() {
                    @Override
                    public void onLayerDrawn(Canvas canvas, float pageWidth, float pageHeight, int displayedPage) {
                       /* if (!startMessageShown){
                            //draw overlay showing page count, reading time, start button
                        }*/

                    }
                })
                .onLoad(new OnLoadCompleteListener() {
                    @Override
                    public void loadComplete(int nbPages) {

                        hideAssignmentMenu(false);

                        hideSystemUI();

                        startTimer(timeToRead);
                    }
                }) // called after document is loaded and starts to be rendered
                .onPageChange(new OnPageChangeListener() {
                    @Override
                    public void onPageChanged(int page, int pageCount) {

                        if (page==pageCount-1){
                            lastPageReached=true;
                            showFab();
                        }
                    }
                })
                .onPageScroll(new OnPageScrollListener() {
                    @Override
                    public void onPageScrolled(int page, float positionOffset) {

                        if (immersiveMode)
                            hideSystemUI();

                        if (positionOffset==1){
                            lastPageReached=true;
                            showFab();
                        }

                        if (lastPageReached){
                            if (positionOffset > assignmentBean.getLastReadPosition()){
                                hideFab();
                                assignmentBean.setLastReadPosition(positionOffset);
                            }
                            else if (positionOffset < assignmentBean.getLastReadPosition()){
                                showFab();
                                assignmentBean.setLastReadPosition(positionOffset);
                            }
                        }
                    }
                })
                .onError(new OnErrorListener() {
                    @Override
                    public void onError(Throwable t) {
                        AlertDialog.Builder dialog = new AlertDialog.Builder(AssignmentsActivity.this);
                        dialog.setTitle("Error loading assignment")
                                .setMessage("The assignment could not be loaded due to the following error:\n\n"+t.getMessage()+"\n\nPlease try downloading again or contact your administrator.")
                                .setNeutralButton("Contact", new DialogInterface.OnClickListener() {
                                    @Override
                                    public void onClick(DialogInterface dialog, int which) {
                                        emailAdmin();
                                    }
                                })
                                .setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                                    @Override
                                    public void onClick(DialogInterface dialog, int which) {

                                    }
                                }).show();
                    }
                })
                .onPageError(new OnPageErrorListener() {
                    @Override
                    public void onPageError(int page, Throwable t) {
                        t.printStackTrace();
                    }
                })
                .onRender(new OnRenderListener() {
                    @Override
                    public void onInitiallyRendered(int nbPages, float pageWidth, float pageHeight) {

                    }
                }) // called after document is rendered for the first time
                // called on single tap, return true if handled, false to toggle scroll handle visibility
                .onTap(new OnTapListener() {
                    @Override
                    public boolean onTap(MotionEvent e) {

                        if (immersiveMode)
                            hideSystemUI();

                        if (isFabShowing)
                            hideFab();
                        else if (lastPageReached)
                            showFab();
                        return false;
                    }
                })
                .enableAnnotationRendering(false) // render annotations (such as comments, colors or forms)
                .password(null)
                .scrollHandle(new DefaultScrollHandle(AssignmentsActivity.this))
                .enableAntialiasing(true) // improve rendering a little bit on low-res screens
                // spacing between pages in dp. To define spacing color, set view background
                .spacing(2)
                //.pageFitPolicy(WIDTH)
                .load();

        /*.setListener(new AnimatorListenerAdapter() {
            @Override
            public void onAnimationEnd(Animator animation) {
                super.onAnimationEnd(animation);
                listParent.setVisibility(View.GONE);
            }
        });*/
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == android.R.id.home) {
            // do something here, such as start an Intent to the parent activity.
            if (readingFinished){
                completeAssignment();
            }
            else if (readingStarted){
                //prompt user to confirm exit
                AlertDialog.Builder dialog = new AlertDialog.Builder(AssignmentsActivity.this);
                dialog.setTitle("Are you sure you want to stop reading?")
                        .setMessage("Your progress will not be saved")
                        .setPositiveButton("Yes", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                stopReading();
                            }
                        })
                        .setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {

                            }
                        }).show();
            }
            else{
                finish();
            }
        }
        return super.onOptionsItemSelected(item);
    }

    @Override
    public void onBackPressed(){
        if (readingStarted && readingFinished){
            completeAssignment();
        }
        else if (readingStarted){
            //prompt user to confirm exit
            AlertDialog.Builder dialog = new AlertDialog.Builder(AssignmentsActivity.this);
            dialog.setTitle("Are you sure you want to stop reading?")
                    .setMessage("Your progress will not be saved")
                    .setPositiveButton("Yes", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            stopReading();
                        }
                    })
                    .setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {

                        }
                    }).show();
        }
        else{
            finish();
        }
    }
    private void emailAdmin(){
        Intent i = new Intent(Intent.ACTION_SENDTO, Uri.fromParts( "mailto", AppProperties.NVL(adminEmail, "email@example.com"), null));
        startActivity(Intent.createChooser(i, "Send email..."));

    }

    @Override
    protected void onSaveInstanceState(Bundle outState){
        outState.putBoolean("isReading", readingStarted);
    }

    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState){
        if (savedInstanceState.getBoolean("isReading")){
            hideAssignmentMenu(true);
        }
    }

    private void hideAssignmentMenu(boolean orientationChange){
        final LinearLayout listParent = (LinearLayout)recyclerView.getParent();
        final int listwidth = -listParent.getWidth(), infoPaneWidth = infoPane.getWidth();

        if (orientationChange){


            listParent.post(new Runnable() {
                @Override
                public void run() {
                    int listwidthRotate = -listParent.getWidth();

                    infoPane.post(new Runnable() {
                        @Override
                        public void run() {
                            int infoPaneWidthRotate = infoPane.getWidth();
                            listParent.animate().translationXBy(listwidthRotate).withStartAction(new Runnable() {
                                @Override
                                public void run() {
                                    infoPane.animate().translationXBy(infoPaneWidthRotate);
                                }
                            });
                        }
                    });
                }
            });
        }
        else
            listParent.animate().translationXBy(listwidth).withStartAction(new Runnable() {
                @Override
                public void run() {
                    infoPane.animate().translationXBy(infoPaneWidth);
                }
            });

    }

    private void showAssignmentMenu(){
        populateRecyclerView();
        final LinearLayout listParent = (LinearLayout)recyclerView.getParent();
        final int listwidth = listParent.getWidth(), infoPaneWidth = -infoPane.getWidth();

        listParent.animate().translationXBy(listwidth).withStartAction(new Runnable() {
            @Override
            public void run() {
                infoPane.animate().translationXBy(infoPaneWidth);
            }
        });
    }

    private void startTimer(int readingTime){

        readingStarted = true;

        int readingTimeMilliseconds = readingTime*1000;

        countDownTimer = new CountDownTimer(readingTimeMilliseconds, 1000) {

            public void onTick(long millisUntilFinished) {
                if (!readingStarted){
                    cancel();
                }
                String timeRemaining = String.format(Locale.US,"%02d:%02d",
                        TimeUnit.MILLISECONDS.toMinutes(millisUntilFinished) -
                                TimeUnit.HOURS.toMinutes(TimeUnit.MILLISECONDS.toHours(millisUntilFinished)), // The change is in this line
                        TimeUnit.MILLISECONDS.toSeconds(millisUntilFinished) -
                                TimeUnit.MINUTES.toSeconds(TimeUnit.MILLISECONDS.toMinutes(millisUntilFinished)));



                timerLabelTV.setText(timeRemaining);
                //timeToRead-=1;
            }

            public void onFinish() {
                readingFinished = true;
                timerLabelTV.setVisibility(View.GONE);
                FloatingActionButton floatingActionButton = (FloatingActionButton)fab.findViewById(R.id.completionButton);
                floatingActionButton.setImageResource(R.drawable.fab_complete);
                fab.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        completeAssignment();
                    }
                });

            }

        }.start();
    }

    private void showSystemUI() {
        /*immersiveMode = true;
        getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN);*/
    }

    private void hideSystemUI() {
        // Set the IMMERSIVE flag.
        // Set the content to appear under the system bars so that the content
        // doesn't resize when the system bars hide and show.   
        /*immersiveMode = false;
        //todo fix actionbar overlapping elements
        getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION // hide nav bar
                        | View.SYSTEM_UI_FLAG_FULLSCREEN // hide status bar
                        | View.SYSTEM_UI_FLAG_IMMERSIVE);*/
    }

    private void showFab() {
        if (!isFabShowing) {
            isFabShowing = true;
            timerLabelTV.animate().setDuration(200).alpha(1).setListener(new AnimatorListenerAdapter() {
                @Override
                public void onAnimationEnd(Animator animation) {
                    timerLabelTV.setVisibility(View.VISIBLE);
                }
            });
            fab.show();
            //timerLabelTV.setAlpha(0);
        }
    }

    private void hideFab() {
        if (isFabShowing) {
            isFabShowing = false;
            fab.hide();
            timerLabelTV.animate().setDuration(200).alpha(0).setListener(new AnimatorListenerAdapter() {
                @Override
                public void onAnimationEnd(Animator animation) {
                    timerLabelTV.setVisibility(View.GONE);
                }
            });
        }
    }

    private int getMinutes(int timeToRead){
        return (int)Math.floor(timeToRead/60);
    }
    private int getSecondsInt(int timeToRead){
        return timeToRead - getMinutes(timeToRead) * 60;
    }
    private String getSeconds(int timeToRead){
        int seconds = getSecondsInt(timeToRead);
        if (seconds<10){
            return "0"+seconds;
        }
        return String.valueOf(seconds);

    }
    private void downloadStatus(Cursor cursor, long downloadId){

        //column for download  status
        int columnIndex = cursor.getColumnIndex(DownloadManager.COLUMN_STATUS);
        int status = cursor.getInt(columnIndex);
        //column for reason code if the download failed or paused
        int columnReason = cursor.getColumnIndex(DownloadManager.COLUMN_REASON);
        int reason = cursor.getInt(columnReason);
        //get the download filename
        int filenameIndex = cursor.getColumnIndex(DownloadManager.COLUMN_LOCAL_FILENAME);
        String filename = cursor.getString(filenameIndex);

        String statusText = "";
        String reasonText = "";

        switch(status){
            case DownloadManager.STATUS_FAILED:
                statusText = "STATUS_FAILED";
                switch(reason){
                    case DownloadManager.ERROR_CANNOT_RESUME:
                        reasonText = "ERROR_CANNOT_RESUME";
                        break;
                    case DownloadManager.ERROR_DEVICE_NOT_FOUND:
                        reasonText = "ERROR_DEVICE_NOT_FOUND";
                        break;
                    case DownloadManager.ERROR_FILE_ALREADY_EXISTS:
                        reasonText = "ERROR_FILE_ALREADY_EXISTS";
                        break;
                    case DownloadManager.ERROR_FILE_ERROR:
                        reasonText = "ERROR_FILE_ERROR";
                        break;
                    case DownloadManager.ERROR_HTTP_DATA_ERROR:
                        reasonText = "ERROR_HTTP_DATA_ERROR";
                        break;
                    case DownloadManager.ERROR_INSUFFICIENT_SPACE:
                        reasonText = "ERROR_INSUFFICIENT_SPACE";
                        break;
                    case DownloadManager.ERROR_TOO_MANY_REDIRECTS:
                        reasonText = "ERROR_TOO_MANY_REDIRECTS";
                        break;
                    case DownloadManager.ERROR_UNHANDLED_HTTP_CODE:
                        reasonText = "ERROR_UNHANDLED_HTTP_CODE";
                        break;
                    case DownloadManager.ERROR_UNKNOWN:
                        reasonText = "ERROR_UNKNOWN";
                        break;
                }
                break;
            case DownloadManager.STATUS_PAUSED:
                statusText = "STATUS_PAUSED";
                switch(reason){
                    case DownloadManager.PAUSED_QUEUED_FOR_WIFI:
                        reasonText = "PAUSED_QUEUED_FOR_WIFI";
                        break;
                    case DownloadManager.PAUSED_UNKNOWN:
                        reasonText = "PAUSED_UNKNOWN";
                        break;
                    case DownloadManager.PAUSED_WAITING_FOR_NETWORK:
                        reasonText = "PAUSED_WAITING_FOR_NETWORK";
                        break;
                    case DownloadManager.PAUSED_WAITING_TO_RETRY:
                        reasonText = "PAUSED_WAITING_TO_RETRY";
                        break;
                }
                break;
            case DownloadManager.STATUS_PENDING:
                statusText = "STATUS_PENDING";
                break;
            case DownloadManager.STATUS_RUNNING:
                statusText = "STATUS_RUNNING";
                break;
            case DownloadManager.STATUS_SUCCESSFUL:
                statusText = "STATUS_SUCCESSFUL";
                reasonText = "Filename:\n" + filename;
                break;
        }

        Toast toast = Toast.makeText(AssignmentsActivity.this,
                "PDF Status:"+ "\n" + statusText + "\n" +
                        reasonText,
                Toast.LENGTH_LONG);
        toast.setGravity(Gravity.TOP, 25, 400);
        toast.show();

        // Make a delay of 3 seconds so that next toast (Music Status) will not merge with this one.
        final Handler handler = new Handler();
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
            }
        }, 3000);
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

}
