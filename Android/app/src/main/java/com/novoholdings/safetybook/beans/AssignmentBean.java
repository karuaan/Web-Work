package com.novoholdings.safetybook.beans;

import android.graphics.pdf.PdfDocument;
import android.os.Parcel;
import android.os.Parcelable;

import org.joda.time.DateTime;

/**
 * Created by James on 11/19/2017.
 */

public class AssignmentBean implements Parcelable {

    private int mData;
    private int pageStart, pageEnd, readingTime;
    long groupId, id;
    private String name,  dueDate, bookServerPath;
    private PdfDocument pdf;
    private boolean isComplete;
    private float lastReadPosition;

    public int getStartPage() {
        return pageStart;
    }

    public void setStartPage(int startPage) {
        pageStart = startPage;
    }

    public int getEndPage() {
        return pageEnd;
    }

    public void setEndPage(int endPage) {
        pageEnd = endPage;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isComplete() {
        return isComplete;
    }

    public void setComplete(boolean complete) {
        this.isComplete = complete;
    }

    public PdfDocument getPdf() {
        return pdf;
    }

    public void setPdf(PdfDocument pdf) {
        this.pdf = pdf;
    }

    public int getReadingTime(){
        return readingTime;
    }
    public void setReadingTime(int readingTime){
        this.readingTime = readingTime;
    }

    public String getDueDateIso(){
        return dueDate;
    }
    public void setDueDate(String dueDate){
        this.dueDate = dueDate;
    }

    public String getDueDate(){
        DateTime date = DateTime.parse(dueDate);
        String ret = date.getMonthOfYear() + "/" + date.getDayOfMonth() + "/" + date.getYear();
        return ret;
    }

    public long getGroupId(){
        return groupId;
    }
    public void setGroupId(long groupId){
        this.groupId = groupId;
    }

    public long getId(){
        return id;
    }
    public void setId(long id){
        this.id = id;
    }

    public int getPageCount(){
        return pageEnd - pageStart + 1;
    }

    public float getLastReadPosition(){
        return lastReadPosition;
    }
    public void setLastReadPosition(float lastReadPosition){
        this.lastReadPosition = lastReadPosition;
    }

    public String getBookServerPath(){
        return bookServerPath;
    }
    public void setBookServerPath(String serverPath){
        bookServerPath = serverPath;
    }


    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeLong(groupId);
        dest.writeString(dueDate);
        dest.writeString(name);
    }

    public static final Parcelable.Creator<AssignmentBean> CREATOR
            = new Parcelable.Creator<AssignmentBean>() {
        public AssignmentBean createFromParcel(Parcel in) {
            return new AssignmentBean(in);
        }

        public AssignmentBean[] newArray(int size) {
            return new AssignmentBean[size];
        }
    };

    private AssignmentBean(Parcel in) {
        groupId = in.readLong();
        dueDate = in.readString();
        name = in.readString();
    }

    public AssignmentBean(long groupId){
        this.groupId = groupId;
    }

    public AssignmentBean(){

    }
}