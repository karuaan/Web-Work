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
import com.novoholdings.safetybook.beans.AssignmentBean;
import com.novoholdings.safetybook.beans.GroupBean;
import com.novoholdings.safetybook.common.AppProperties;
import com.novoholdings.safetybook.database.AssignmentsDao;

import org.json.JSONObject;

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
    private AssignmentsDao assignmentsDao;
    private long lastDownload;
    private DownloadManager downloadManager;
    private LongSparseArray<AssignmentBean> assignmentDownloadIdServerIdMap;


    public GridAdapter(Context context, AssignmentsDao assignmentsDao, ArrayList<GroupBean> groupList) {
        this.assignmentsDao = assignmentsDao;
        this.mContext = context;
        this.groupList = groupList;
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
                unreadInfo =
                (TextView) convertView.findViewById(R.id.unread),
                dueDate =
                (TextView)convertView.findViewById(R.id.dueDate);

        final LinearLayout adminEmail = (LinearLayout) convertView.findViewById(R.id.adminEmail);
        final TextView adminName = (TextView)adminEmail.findViewById(R.id.adminName);

        final GroupBean group = getItem(position);

        ArrayList<AssignmentBean> list = assignmentsDao.getAssignments(group.getId());
        int unreadCount = 0;
        AssignmentBean latestUnread = null;
        for (AssignmentBean assignment : list){
            if (!assignment.isComplete()){
                if (unreadCount==0){
                    latestUnread = assignment;
                }
                unreadCount++;
            }
        }

        if (unreadCount>0){

            String unreadText = (unreadCount==1) ? "1 unread assignment" : unreadCount+" unread assignments";
            unreadInfo.setText(unreadText);


            String currentChapter = latestUnread.getName();
           // String completionStatus = (latestUnread.isComplete()) ? "Finished!" : "Incomplete";
            currentChapter+="\nDue "+ latestUnread.getDueDate();
            dueDate.setText(AppProperties.NVL(currentChapter, "Latest assignment due"));


            if (!latestUnread.isComplete()){
/*
                Calendar calendar = Calendar.getInstance();
                SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
                calendar.setTime(simpleDateFormat.parse(assignment.getDueDate()));
*/
                String date = latestUnread.getDueDate();
                dueDate.setText(currentChapter);

            }
            else {
                dueDate.setText(R.string.no_assignments_due);
            }
        }
        else {
            String unreadText = "No unread assignments";
            unreadInfo.setText(unreadText);
            dueDate.setVisibility(View.GONE);
        }

        final String email = group.getAdminEmail();

        groupName.setText(AppProperties.NVL(group.getName(), "Group Name"));

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
                i.putExtra("localPath", group.getLocalPath());
                mContext.startActivity(i);
            }
        });

        return convertView;
    }
}
