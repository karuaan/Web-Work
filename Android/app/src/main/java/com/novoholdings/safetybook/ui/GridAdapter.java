package com.novoholdings.safetybook.ui;

import android.app.DownloadManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Environment;
import android.support.constraint.ConstraintLayout;
import android.util.LongSparseArray;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.novoholdings.safetybook.R;
import com.novoholdings.safetybook.activities.AssignmentsActivity;
import com.novoholdings.safetybook.beans.AssignmentBean;
import com.novoholdings.safetybook.beans.GroupBean;
import com.novoholdings.safetybook.common.AppProperties;
import com.novoholdings.safetybook.database.AssignmentsDao;

import java.io.File;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;

import static android.content.Context.DOWNLOAD_SERVICE;

/**
 * Created by James on 11/20/2017.
 */

public class GridAdapter extends BaseAdapter {
    private Context mContext;
    private ArrayList<GroupBean> groupList;
    private HashMap<Long, AssignmentBean> assignmentGroupMap;
    private AssignmentsDao assignmentsDao;
    private long lastDownload;
    private DownloadManager downloadManager;
    private LongSparseArray<AssignmentBean> assignmentDownloadIdServerIdMap;


    public GridAdapter(Context context, AssignmentsDao assignmentsDao, ArrayList<GroupBean> groupList, HashMap<Long, AssignmentBean> assignmentsList) {
        this.assignmentsDao = assignmentsDao;
        this.mContext = context;
        this.groupList = groupList;
        if (assignmentsList!=null)
            assignmentGroupMap = assignmentsList;
    }


    @Override
    public int getCount() {
        return groupList.size();
    }


    @Override
    public GroupBean getItem(int position) {
        return groupList.get(position);
    }


    @Override
    public long getItemId(int position) {
        return groupList.get(position).getId();
    }


    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        if (convertView == null) {
            try{
                LayoutInflater inflater = (LayoutInflater) mContext.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
                convertView = inflater.inflate(R.layout.group_card, parent, false);
            }catch (NullPointerException e){
                e.printStackTrace();
                return null;
            }
        }

        ImageView groupIcon =
                (ImageView) convertView.findViewById(R.id.groupIcon);
        ImageView bookIcon =
                (ImageView) convertView.findViewById(R.id.bookIcon);
        TextView groupName =
                (TextView) convertView.findViewById(R.id.groupName),
                bookName =
                (TextView) convertView.findViewById(R.id.bookName),
                dueDate =
                (TextView)convertView.findViewById(R.id.dueDate),
                completion =
                (TextView)convertView.findViewById(R.id.completion);

        final LinearLayout adminEmail = (LinearLayout) convertView.findViewById(R.id.adminEmail);
        final TextView adminName = (TextView)adminEmail.findViewById(R.id.adminName);

        final GroupBean group = getItem(position);

        if (assignmentGroupMap!=null){

            final AssignmentBean assignment = assignmentGroupMap.get(group.getId());

            String currentChapter = assignment.getName();
            String completionStatus = (assignment.isComplete()) ? "Finished!" : "Incomplete";
            currentChapter+=" ("+completionStatus+")" + "\nDue "+ assignment.getDueDate();
            dueDate.setText(AppProperties.NVL(currentChapter, "Latest assignment due"));


            if (!assignment.isComplete()){

                try{
                    Calendar calendar = Calendar.getInstance();
                    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
                    calendar.setTime(simpleDateFormat.parse(assignment.getDueDateIso()));
                    String date = assignment.getDueDateIso();
                    dueDate.setText(date);

                    if (!assignmentsDao.fileExists(assignment.getId())){
                        //download file
                        Uri uri = Uri.parse(AppProperties.DIR_SERVER_ROOT+assignment.getServerPath());
                        startDownload(uri, assignment, group.getName());
                    }

                } catch (ParseException e){
                    e.printStackTrace();
                }
            }
            else {
                dueDate.setVisibility(View.GONE);
            }
        }

        final String email = group.getAdminEmail();

        groupName.setText(AppProperties.NVL(group.getName(), "Group Name"));
        bookName.setText(AppProperties.NVL(group.getBookName(), "Book Name"));

        adminName.setText(AppProperties.NVL(group.getAdminName(), "Admin Name"));

        if (!AppProperties.isNull(email)){

            adminEmail.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent i = new Intent(Intent.ACTION_SENDTO, Uri.fromParts( "mailto", AppProperties.NVL(email, "email@example.com"), null));
                    mContext.startActivity(Intent.createChooser(i, "Send email..."));
                }
            });
        }

        convertView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent i = new Intent(mContext, AssignmentsActivity.class);
                i.putExtra("groupId", group.getId());
                i.putExtra("adminName", group.getAdminName());
                i.putExtra("adminEmail", group.getAdminEmail());
                i.putExtra("groupName", group.getName());
                mContext.startActivity(i);
            }
        });

        return convertView;
    }

    BroadcastReceiver onComplete=new BroadcastReceiver() {
        public void onReceive(Context ctxt, Intent intent) {
//check if the broadcast message is for our enqueued download
            long referenceId = intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1);

            //update group card
            if (assignmentDownloadIdServerIdMap.get(referenceId) != null){

                assignmentDownloadIdServerIdMap.remove(referenceId);
            }
            Toast toast = Toast.makeText(mContext,
                    "Download Complete", Toast.LENGTH_LONG);
            toast.setGravity(Gravity.TOP, 25, 400);
            toast.show();
        }
    };


    public void startDownload(Uri uri, AssignmentBean assignment, String groupName) {

        if (downloadManager==null)
            downloadManager = (DownloadManager)mContext.getSystemService(DOWNLOAD_SERVICE);

        if (assignmentDownloadIdServerIdMap==null)
            assignmentDownloadIdServerIdMap = new LongSparseArray<AssignmentBean>();

        String fileName = assignment.getFileName();

        String localFilePath = AppProperties.SDCARD_APP_FOLDER_NAME+"/"+groupName;

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
                        .setVisibleInDownloadsUi(false)
                        .setDestinationInExternalPublicDir(localFilePath,
                                fileName));

        assignmentDownloadIdServerIdMap.append(lastDownload, assignment);
    }
}
