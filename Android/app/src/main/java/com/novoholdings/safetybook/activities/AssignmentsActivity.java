package com.novoholdings.safetybook.activities;

import android.Manifest;
import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
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
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.os.Environment;
import android.os.Handler;
import android.support.design.widget.CoordinatorLayout;
import android.support.design.widget.FloatingActionButton;
import android.support.v4.app.ActivityCompat;
import android.support.v4.app.NotificationCompat;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.DividerItemDecoration;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.LongSparseArray;
import android.view.Gravity;
import android.view.Menu;
import android.view.MenuItem;
import android.view.MotionEvent;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.*;
import com.novoholdings.safetybook.RequestQueue;
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
import java.util.Locale;
import java.util.concurrent.TimeUnit;

import static com.novoholdings.safetybook.common.AppProperties.YES;
import static com.novoholdings.safetybook.common.AppProperties.getFileNameFromPath;

/**
 * Created by James on 11/25/2017.
 */

public class AssignmentsActivity extends AppCompatActivity{
    private String groupName, adminName, adminEmail, localFilePath = "", serverFilePath, fileName;
    private long groupId, userId, currentAssignmentId,  bookDownload=-1L;

    private PDFView pdfView;
    private LinearLayout lastPageBottomBar;
    private CoordinatorLayout pdfContainerLayout;
    private TextView timerLabelTV, chapterNameTV, relativeDueDateTV, pageCountTV, readingTimeTV;

    private AssignmentsDao assignmentsDao;

    private DownloadManager downloadManager;

    private ArrayList<AssignmentBean> assignmentsList;

    AssignmentListAdapter adapter;
    RecyclerView recyclerView;
    View infoPane;
    Button startButton;

    private boolean isFabShowing, lastPageReached, immersiveMode, readingStarted, readingFinished, assignmentsDueSoon;
    private FloatingActionButton fab;
    private int timeToRead;

    private CountDownTimer countDownTimer;


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

        //get assignments from local storage
        assignmentsDao = new AssignmentsDao(AssignmentsActivity.this);
        //assignmentsDao.insertData("Chapter Name", 1, groupId, YES, 900, "11-30-17T00:00.000Z", YES, "filename.pdf", 1, 10);
        assignmentsList = assignmentsDao.getAssignments(groupId);
        assignmentsDueSoon = assignmentsList.size() > 0;

        if (assignmentsDueSoon){
            adapter = new AssignmentListAdapter(AssignmentsActivity.this, assignmentsList);
            recyclerView.setAdapter(adapter);
            //todo
            /*if (assignmentsList.size()==1)
                recyclerView.requestChildFocus();
                postAndNotifyAdapter(new Handler(), recyclerView);*/


        }

        //if book is not downloaded, show download button
        if (!AppProperties.isDemoMode())
            checkBookFile();

        IntentFilter intentFilter = new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE);

        registerReceiver(onComplete, intentFilter);


        downloadManager =  (DownloadManager) getSystemService(Context.DOWNLOAD_SERVICE);
       /* int check = ActivityCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE);
        if (check == PackageManager.PERMISSION_GRANTED) {
            //Do something
        } else {
            requestPermissions(new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE},1024);
        }*/
    }

    protected void postAndNotifyAdapter(final Handler handler, final RecyclerView recyclerView) {
        handler.post(new Runnable() {
            @Override
            public void run() {
                if (!recyclerView.isComputingLayout()) {
                    // This will call first item by calling "performClick()" of view.
                    ((RecyclerView.ViewHolder) recyclerView.findViewHolderForLayoutPosition(0)).itemView.performClick();
                } else {
                    postAndNotifyAdapter(handler, recyclerView);
                }
            }
        });
    }

    private void getIntentExtras(){
        Bundle extras = getIntent().getExtras();
        try{
            groupName = AppProperties.NVL(extras.getString("groupName"), "Not Found");
        }catch (NullPointerException e){
            e.printStackTrace();
        }
        try{
            adminName = AppProperties.NVL(extras.getString("adminEmail"), "Not Found");

        }catch (NullPointerException e){
            e.printStackTrace();
        }
        try{
            adminEmail = extras.getString("adminEmail");

        }catch (NullPointerException e){
            e.printStackTrace();
        }
        try{
            groupId=extras.getLong("groupId");

        }catch (NullPointerException e){
            e.printStackTrace();
        }
        try{
            serverFilePath = extras.getString("serverPath");
        }catch (NullPointerException e){
            e.printStackTrace();
        }
        try{
            localFilePath = AppProperties.SDCARD_APP_FOLDER_NAME+"/"+groupName + "/" + AppProperties.getFileNameFromPath(serverFilePath);
            fileName = getFileNameFromPath(localFilePath);
        }catch (NullPointerException e){
            e.printStackTrace();
        }
        try{
            userId = AppProperties.getUserId(AssignmentsActivity.this);

        }catch (NullPointerException e){
            e.printStackTrace();
        }
    }
    private void setupRecycler(){
        LinearLayoutManager linearLayoutManager = new LinearLayoutManager(AssignmentsActivity.this);
        recyclerView.setLayoutManager(linearLayoutManager);

        DividerItemDecoration dividerItemDecoration = new DividerItemDecoration(recyclerView.getContext(),
                linearLayoutManager.getOrientation());
        recyclerView.addItemDecoration(dividerItemDecoration);
    }

    private void checkBookFile(){
        String localPath = localFilePath;

        File file = new File(localPath);

        if (!file.exists() && !AppProperties.isNull(serverFilePath)){
            String message = "Download book";
            chapterNameTV.setText(message);
            serverFilePath = AppProperties.DIR_SERVER+serverFilePath;
            Uri uri = Uri.parse(serverFilePath);

            //set download button on click
            startButton.setText(R.string.download);
            startButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    startDownload(uri, fileName);
                }
            });
            startButton.setVisibility(View.VISIBLE);
        }
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

        String label = getMinutes(assignmentBean.getReadingTime()) + ":" + getSeconds(assignmentBean.getReadingTime());
        String pageCount = assignmentBean.getPageCount() + " pages";
        String days = getRelativeDueDate(assignmentBean.getDueDateIso(), DateTime.parse(AppProperties.getCurrentDate()));

        chapterNameTV.setText(assignmentBean.getName());
        readingTimeTV.setText(label);
        pageCountTV.setText(String.valueOf(pageCount));
        relativeDueDateTV.setText(days);

        if (AppProperties.isDemoMode())
            //set start button on click
            startButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    startReading("section1.pdf", assignmentBean.getReadingTime());
                }
            });
        else{

            File file = new File(localFilePath);

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
                serverFilePath = AppProperties.DIR_SERVER+serverFilePath;
                Uri uri = Uri.parse(serverFilePath);

                //set download button on click
                startButton.setText(R.string.download);
                startButton.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        startDownload(uri, fileName);
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
            if (referenceId == bookDownload){
                File file = new File(localFilePath);
                //change start button appearance and behavior
                checkBookFile();
                if (file.exists()){
                    startButton.setText("Start");
                    startButton.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            startReading(file, timeToRead);
                        }
                    });
                    startButton.setEnabled(true);

                }
            }
            Toast toast = Toast.makeText(AssignmentsActivity.this,
                    "Download complete", Toast.LENGTH_LONG);
            toast.setGravity(Gravity.TOP, 25, 400);
            toast.show();
        }
    };

    public void startDownload(Uri uri, String fileName) {

        startButton.setEnabled(false);
        startButton.setText("Downloading...");

        Environment
                .getExternalStoragePublicDirectory(localFilePath)
                .mkdirs();

        bookDownload=
                downloadManager.enqueue(new DownloadManager.Request(uri)
                        .setAllowedNetworkTypes(DownloadManager.Request.NETWORK_WIFI |
                                DownloadManager.Request.NETWORK_MOBILE)
                        .setAllowedOverRoaming(false)
                        .setTitle(fileName)
                        .setDescription(groupName)
                        .setVisibleInDownloadsUi(true)
                        .setDestinationInExternalPublicDir(localFilePath,
                                fileName));
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
                assignmentsDao.updateSyncStatus(currentAssignmentId, YES);
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
        RequestQueue.getInstance(AssignmentsActivity.this).addToRequestQueue(postComplete);
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
                                        Uri uri = Uri.parse(serverFilePath);
                                        startDownload(uri, file.getName());
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
        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState){
        super.onRestoreInstanceState(savedInstanceState);
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

}
