package com.novoholdings.safetybook.ui;

import android.content.Context;
import android.support.v7.widget.RecyclerView;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import com.novoholdings.safetybook.R;
import com.novoholdings.safetybook.activities.AssignmentsActivity;
import com.novoholdings.safetybook.beans.AssignmentBean;

/**
 * Created by James on 12/10/2017.
 */

public class AssignmentViewHolder extends RecyclerView.ViewHolder{
    TextView title, dueDate;
    ImageView calendarIcon;
    View view;
    private AssignmentBean assignmentBean;
    private AssignmentsActivity mContext;

    public AssignmentViewHolder(Context context, View v){
        super(v);
        title = (TextView)v.findViewById(R.id.name);
        dueDate = (TextView)v.findViewById(R.id.dueDate);
        calendarIcon = (ImageView)v.findViewById(R.id.due_date_icon);
        mContext = (AssignmentsActivity)context;
        view = v;
    }

    public AssignmentBean getAssignment(){
        return assignmentBean;
    }
}