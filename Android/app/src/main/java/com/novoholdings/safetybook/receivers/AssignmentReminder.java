package com.novoholdings.safetybook.receivers;

import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.NotificationCompat;

import com.novoholdings.safetybook.R;
import com.novoholdings.safetybook.activities.AssignmentsActivity;

import static android.content.Context.NOTIFICATION_SERVICE;

public class AssignmentReminder extends BroadcastReceiver {
    
    private Context mContext;
    public static String NOTIFICATION_ID = "notification_id";
    public static String NOTIFICATION = "notification";


    @Override
    public void onReceive(Context context, Intent intent) {
        // TODO Auto-generated method stub

        Bundle extras = intent.getExtras();

        mContext = context;
        long when = System.currentTimeMillis();
        NotificationManager notificationManager = (NotificationManager) context
                .getSystemService(NOTIFICATION_SERVICE);

        Intent notificationIntent = new Intent(context, AssignmentsActivity.class);
        notificationIntent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        notificationIntent.putExtra("assignment_id", intent.getExtras().getLong("assignment_id"));

        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0,
                notificationIntent, PendingIntent.FLAG_UPDATE_CURRENT);


        Uri alarmSound = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);

        NotificationCompat.Builder mNotifyBuilder = new NotificationCompat.Builder(
                context, "assignment").setSmallIcon(R.drawable.ic_assignment)
                .setContentTitle(extras.getString("title"))
                .setContentText(extras.getString("body")).setSound(alarmSound)
                .setAutoCancel(true).setWhen(when)
                .setContentIntent(pendingIntent)
                .setVibrate(new long[]{1000, 1000, 1000, 1000, 1000});
        notificationManager.notify((int)extras.getLong("assignment_id"), mNotifyBuilder.build());
    }

}
