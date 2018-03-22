package com.novoholdings.safetybook.ui;

import android.support.v7.widget.RecyclerView;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import com.novoholdings.safetybook.R;
import com.novoholdings.safetybook.beans.AssignmentBean;

/**
 * Created by James on 12/10/2017.
 */

public class AssignmentViewHolder extends RecyclerView.ViewHolder{
    TextView title, dueDate;
    ImageView calendarIcon;
    View view;
    private AssignmentBean assignmentBean;

    public AssignmentViewHolder(View v, AssignmentBean assignmentBean){
        super(v);
        title = (TextView)v.findViewById(R.id.name);
        dueDate = (TextView)v.findViewById(R.id.dueDate);
        calendarIcon = (ImageView)v.findViewById(R.id.due_date_icon);
        view = v;
        this.assignmentBean = assignmentBean;

    }

    public AssignmentBean getAssignment(){
        return assignmentBean;
    }
}