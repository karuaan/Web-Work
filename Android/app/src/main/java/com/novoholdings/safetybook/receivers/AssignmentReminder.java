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
import android.util.Log;

import com.google.firebase.messaging.RemoteMessage;
import com.novoholdings.safetybook.R;
import com.novoholdings.safetybook.activities.AssignmentsActivity;
import com.novoholdings.safetybook.common.AppProperties;
import com.novoholdings.safetybook.database.AssignmentsDao;

import static android.content.Context.NOTIFICATION_SERVICE;

public class AssignmentReminder extends BroadcastReceiver {

    private static final String TAG = "AssignmentReminder";
    private Context mContext;
    public static String NOTIFICATION_ID = "notification_id";
    public static String NOTIFICATION = "notification";
    private RemoteMessage remoteMessage;


    @Override
    public void onReceive(Context context, Intent intent) {
        // TODO Auto-generated method stub

        Bundle extras = intent.getExtras();

        mContext = context;
        long when = System.currentTimeMillis();
        NotificationManager notificationManager = (NotificationManager) context
                .getSystemService(NOTIFICATION_SERVICE);

        this.remoteMessage = intent.getExtras().getParcelable("remoteMessage");
        if (remoteMessage!=null && remoteMessage.getData()!=null && remoteMessage.getData().size() > 0) {
            Log.d(TAG, "Message data payload: " + remoteMessage.getData());

            //{notification_type=expandable, body=Please complete your assignment, title=Safety Reader}
            int notificationId = Integer.parseInt(remoteMessage.getData().get("assignment_id"));
            String groupName = remoteMessage.getData().get("group_name");

            long assignId = Long.parseLong(remoteMessage.getData().get("assignment_id"));
            long groupId = Long.parseLong(remoteMessage.getData().get("group_id"));
            String assignmentName = remoteMessage.getData().get("name");
            String dueDate = remoteMessage.getData().get("due_date");
            int startPage = Integer.parseInt(remoteMessage.getData().get("start_page"));
            int endPage = Integer.parseInt(remoteMessage.getData().get("end_page"));
            int readingTime = Integer.parseInt(remoteMessage.getData().get("reading_time"));
            String bookUrl = remoteMessage.getData().get("book_pdf");
            if (bookUrl.contains("public/")) {
                bookUrl = bookUrl.replace("public/", "");
            }
            if (bookUrl.contains("\\")) {
                bookUrl = bookUrl.replace('\\', '/');
            }

            AssignmentsDao assignmentsDao = new AssignmentsDao(mContext);
            assignmentsDao.insertData(assignId, assignmentName, groupId, AppProperties.YES, readingTime, dueDate, false, startPage, endPage, bookUrl);

            sendNotification(remoteMessage.getData().get("title"), remoteMessage.getData().get("body"), groupName, remoteMessage.getData().get("notes"), (int) assignId, (int) groupId);
        }
    }

    private void sendNotification(String title,String messageBody, String groupName, String notes, int assignId, int groupId) {
        Intent intent = new Intent(mContext, AssignmentsActivity.class);
        intent.putExtra("assignment_id", assignId);
        intent.putExtra("group_id", groupId);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent pendingIntent = PendingIntent.getActivity(mContext, 0 /* Request code */, intent,
                PendingIntent.FLAG_ONE_SHOT);


        Uri defaultSoundUri= RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
        NotificationCompat.Builder notificationBuilder =
                new NotificationCompat.Builder(mContext)
                        .setSmallIcon(R.mipmap.ic_launcher)
                        .setContentTitle(title)
                        .setContentText(messageBody)
                        .setContentInfo(groupName)
                        .setAutoCancel(true)
                        .setSound(defaultSoundUri)
                        .setContentIntent(pendingIntent);

        if (!AppProperties.isNull(notes)){
            String expandedText = messageBody+"\n"+notes;
            notificationBuilder.setStyle(new NotificationCompat.BigTextStyle()
                    .bigText(expandedText));
        }

        NotificationManager notificationManager =
                (NotificationManager) mContext.getSystemService(Context.NOTIFICATION_SERVICE);

        notificationManager.notify(0 /* ID of notification */, notificationBuilder.build());
    }

}
