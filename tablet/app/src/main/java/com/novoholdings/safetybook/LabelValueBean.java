package com.novoholdings.safetybook;

import android.os.Parcel;
import android.os.Parcelable;

/**
 * Created by James on 11/13/2017.
 */

public class LabelValueBean implements Parcelable {


    /**
     * Construct a new LabelValueBean with the specified values.
     *
     * @param label The label to be displayed to the user
     * @param value The value to be returned to the server
     */
    public LabelValueBean(){

    }

    public LabelValueBean(String label, String value) {
        this.label = label;
        this.value = value;
    }

    /**
     * The label to be displayed to the user.
     */
    protected String label = null;

    public String getLabel() {
        return (this.label);
    }


    /**
     * The value to be returned to the server.
     */
    protected String value = null;

    public String getValue() {
        return (this.value);
    }

    /**
     * Return a string representation of this object.
     */
//    public String toString() {
//        StringBuffer sb = new StringBuffer("LabelValueBean[");
//        sb.append(this.label);
//        sb.append(", ");
//        sb.append(this.value);
//        sb.append("]");
//        return (sb.toString());
//    }
    public String toString() {
        return (this.label);
    }


    protected LabelValueBean(Parcel in) {
        label = in.readString();
        value = in.readString();
    }

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeString(label);
        dest.writeString(value);
    }

    @SuppressWarnings("unused")
    public static final Parcelable.Creator<LabelValueBean> CREATOR = new Parcelable.Creator<LabelValueBean>() {
        @Override
        public LabelValueBean createFromParcel(Parcel in) {
            return new LabelValueBean(in);
        }

        @Override
        public LabelValueBean[] newArray(int size) {
            return new LabelValueBean[size];
        }
    };
}
