package com.novoholdings.safetybook.ui;

import android.content.Context;
import android.graphics.Color;
import android.support.annotation.ColorInt;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.novoholdings.safetybook.R;
import com.novoholdings.safetybook.activities.AssignmentsActivity;
import com.novoholdings.safetybook.beans.AssignmentBean;

import java.util.ArrayList;

/**
 * Created by James on 11/26/2017.
 */

public class AssignmentListAdapter extends RecyclerView.Adapter<AssignmentViewHolder> {

    private ArrayList<AssignmentBean> assignmentList;
    private Context mContext;
    private AssignmentsActivity activity;

    private int selectedPos = RecyclerView.NO_POSITION;

    @Override
    public AssignmentViewHolder onCreateViewHolder(ViewGroup viewGroup, int position){
        //todo
        View itemView = LayoutInflater.from(viewGroup.getContext())
                .inflate(R.layout.pdf_list_item, viewGroup, false);

        AssignmentBean assignmentBean = assignmentList.get(position);


        return new AssignmentViewHolder(itemView, assignmentBean);
    }



    @Override
    public void onBindViewHolder(AssignmentViewHolder viewHolder, int position) {
        final AssignmentBean assignmentBean = assignmentList.get(position);
        String dueDateText = (assignmentBean.isComplete()) ? "Complete" : assignmentBean.getDueDate();

        if (assignmentBean.isComplete())
            viewHolder.calendarIcon.setImageResource(R.drawable.ic_complete);

        viewHolder.title.setText(assignmentBean.getName());
        viewHolder.dueDate.setText(dueDateText);
        viewHolder.itemView.setSelected(selectedPos == position);
        if (selectedPos == position)
        {
            viewHolder.itemView.setBackgroundColor(Color.LTGRAY);
        }

        else {
            viewHolder.itemView.setBackgroundColor(Color.WHITE);
        }
        viewHolder.view.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                selectedPos = position;
                activity.showAssignmentInfo(assignmentBean);
                notifyDataSetChanged();
            }
        });


    }

    @Override
    public int getItemCount(){
        return assignmentList.size();
    }

    public AssignmentListAdapter(Context context, ArrayList<AssignmentBean> assignmentList){
        super();
        this.assignmentList = assignmentList;
        mContext = context;
        activity = (AssignmentsActivity)mContext;
    }
}
