package com.novoholdings.safetybook.firebase;

import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.drawable.BitmapDrawable;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.SystemClock;
import android.support.v4.app.NotificationCompat;
import android.support.v4.content.res.ResourcesCompat;
import android.util.Log;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.firebase.jobdispatcher.Constraint;
import com.firebase.jobdispatcher.FirebaseJobDispatcher;
import com.firebase.jobdispatcher.GooglePlayDriver;
import com.firebase.jobdispatcher.Job;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import com.novoholdings.safetybook.R;
import com.novoholdings.safetybook.activities.AssignmentsActivity;
import com.novoholdings.safetybook.activities.GroupsActivity;
import com.novoholdings.safetybook.common.AppProperties;
import com.novoholdings.safetybook.database.AssignmentsDao;
import com.novoholdings.safetybook.receivers.AssignmentReminder;

import org.joda.time.DateTime;
import org.json.JSONException;
import org.json.JSONObject;
import org.mozilla.javascript.ast.Assignment;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class MyFirebaseMessagingService extends FirebaseMessagingService {

    private static final String TAG = "MyFirebaseMsgService";
    private static final int newAssignmentNotification = 5562;
    private static final int newTestNotify = 5588;
    NotificationCompat.Builder threeDayNotification, oneDayNotification, oneHourNotification, overdueNotification, newGroupNotifier, newAssignmentNotifier, testNotifier;
    private static final int newGroupNotification = 5584;
    private static final long oneWeek = 604800000;
    private static final long threeDays = 259200000;
    private static final long oneDay = 129600000;
    private static final long oneHour = 5400000;
    private static final long oneMinute = 45000;


    /**
     * Called when message is received.
     *
     * @param remoteMessage Object representing the message received from Firebase Cloud Messaging.
     */
    // [START receive_message]
    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        // [START_EXCLUDE]
        // There are two types of messages data messages and notification messages. Data messages are handled
        // here in onMessageReceived whether the app is in the foreground or background. Data messages are the type
        // traditionally used with GCM. Notification messages are only received here in onMessageReceived when the app
        // is in the foreground. When the app is in the background an automatically generated notification is displayed.
        // When the user taps on the notification they are returned to the app. Messages containing both notification
        // and data payloads are treated as notification messages. The Firebase console always sends notification
        // messages. For more see: https://firebase.google.com/docs/cloud-messaging/concept-options
        // [END_EXCLUDE]

        // TODO(developer): Handle FCM messages here.
        // Not getting messages here? See why this may be: https://goo.gl/39bRNJ
        Log.d(TAG, "From: " + remoteMessage.getFrom());

        // Check if message contains a data payload.
        if (remoteMessage.getData().size() > 0) {
            Log.d(TAG, "Message data payload: " + remoteMessage.getData());

            //{notification_type=expandable, body=Please complete your assignment, title=Safety Reader}
            int notificationId = Integer.parseInt(remoteMessage.getData().get("assignment_id"));
            long groupId = Long.parseLong(remoteMessage.getData().get("group_id"));
            String groupName = remoteMessage.getData().get("group_name");
            String assignmentName = remoteMessage.getData().get("assignment_name");

            JsonObjectRequest getComplete = new JsonObjectRequest(Request.Method.GET, AppProperties.DIR_SERVER_ROOT+"assignment/"+notificationId, null, new Response.Listener<JSONObject>() {
                public void onResponse(JSONObject assignment) {
                    try {
                        if (assignment!=null){
                            long serverId = assignment.getLong("id");
                            String assignmentName = assignment.getString("name");
                            String dueDate = assignment.getString("due_date");
                            int startPage = assignment.getInt("start_page");
                            int endPage = assignment.getInt("end_page");
                            int readingTime = assignment.getInt("reading_time");

                            AssignmentsDao assignmentsDao = new AssignmentsDao(MyFirebaseMessagingService.this);
                            assignmentsDao.insertData(serverId, assignmentName, groupId, AppProperties.YES, readingTime, dueDate, false, startPage, endPage);
                        }

                    } catch (JSONException e) {
                        e.printStackTrace();
                    }

                }
            }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {

                }
            });

            sendNotification(remoteMessage.getData().get("title"),remoteMessage.getData().get("body"), groupName, remoteMessage.getData().get("notes"), notificationId);
            SimpleDateFormat f = new SimpleDateFormat("yyyy-MM-dd");
            try {
                Date dueDate = f.parse(remoteMessage.getData().get("due_date"));
                long millisecondsUntilDueDate = dueDate.getTime() - Calendar.getInstance().getTimeInMillis();

                if (millisecondsUntilDueDate >= oneWeek){
                    scheduleNotification( millisecondsUntilDueDate - oneWeek, notificationId, assignmentName, "Due in one week", groupName);
                }

                if (millisecondsUntilDueDate >= threeDays){
                    scheduleNotification( millisecondsUntilDueDate - threeDays, notificationId, assignmentName, "Due in 3 days", groupName);
                }

                if (millisecondsUntilDueDate >= oneDay){
                    scheduleNotification(millisecondsUntilDueDate-oneDay, notificationId, assignmentName, "Due tomorrow", groupName);
                }

                if (millisecondsUntilDueDate >= oneMinute){
                    scheduleNotification(oneMinute, notificationId, assignmentName, "Due now", groupName);
                }

            } catch (ParseException e) {
                e.printStackTrace();
            }
        }

        // Check if message contains a notification payload.
        if (remoteMessage.getNotification() != null) {
            Log.d(TAG, "Message Notification Body: " + remoteMessage.getNotification().getBody());
        }

        // Also if you intend on generating your own notifications as a result of a received FCM
        // message, here is where that should be initiated. See sendNotification method below.
    }
    // [END receive_message]

    /**
     * Schedule a job using FirebaseJobDispatcher.
     */


    /**
     * Handle time allotted to BroadcastReceivers.
     */
    private void handleNow() {
        Log.d(TAG, "Short lived task is done.");
    }

    /**
     * Create and show a simple notification containing the received FCM message.
     *
     * @param messageBody FCM message body received.
     */
    private void sendNotification(String title,String messageBody, String groupName, String notes, int id) {
        Intent intent = new Intent(this, AssignmentsActivity.class);
        intent.putExtra("assignment_id", id);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0 /* Request code */, intent,
                PendingIntent.FLAG_ONE_SHOT);


        Uri defaultSoundUri= RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
        NotificationCompat.Builder notificationBuilder =
                new NotificationCompat.Builder(this)
                        .setSmallIcon(R.mipmap.ic_launcher)
                        .setContentTitle(title)
                        .setContentText(messageBody)
                        .setContentInfo(groupName)
                        .setAutoCancel(true)
                        .setSound(defaultSoundUri)
                        .setContentIntent(pendingIntent);

        if (!AppProperties.isNull(notes)){
            notificationBuilder.setStyle(new NotificationCompat.BigTextStyle()
                    .bigText(notes));
        }

        NotificationManager notificationManager =
                (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

        notificationManager.notify(0 /* ID of notification */, notificationBuilder.build());
    }

    public void setNewAssignmentNotifier(String groupName)
    {
        String message = "New Assignment has been added!";
        String titleText = "New Assignment!";
        String notifierText = "Assignment has been added to Group " + groupName;

        newAssignmentNotifier.setSmallIcon(R.drawable.ic_assignment);
        newAssignmentNotifier.setTicker(message);
        newAssignmentNotifier.setWhen(System.currentTimeMillis());
        newAssignmentNotifier.setContentTitle(titleText);
        newAssignmentNotifier.setContentText(notifierText);

        Intent intent = new Intent(this, GroupsActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);
        newAssignmentNotifier.setContentIntent(pendingIntent);

        //Builds Notification and issues it

        NotificationManager manager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        manager.notify(newAssignmentNotification, newAssignmentNotifier.build());
    }

    public void scheduleNotification(long delay, int notificationId, String assignmentName, String message, String groupName) {//delay is after how much time(in millis) from current time you want to schedule the notification
        NotificationCompat.Builder builder = new NotificationCompat.Builder(MyFirebaseMessagingService.this)
                .setContentTitle(assignmentName)
                .setContentText(message)
                .setContentInfo(groupName)
                .setAutoCancel(true)
                .setSmallIcon(R.drawable.ic_assignment)
                .setSound(RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION));

        Intent intent = new Intent(MyFirebaseMessagingService.this, AssignmentsActivity.class);
        PendingIntent activity = PendingIntent.getActivity(MyFirebaseMessagingService.this, notificationId, intent, PendingIntent.FLAG_CANCEL_CURRENT);
        builder.setContentIntent(activity);

        Notification notification = builder.build();

        Intent notificationIntent = new Intent(MyFirebaseMessagingService.this, AssignmentReminder.class);
        notificationIntent.putExtra(AssignmentReminder.NOTIFICATION_ID, notificationId);
        notificationIntent.putExtra(AssignmentReminder.NOTIFICATION, notification);
        PendingIntent pendingIntent = PendingIntent.getBroadcast(MyFirebaseMessagingService.this, notificationId, notificationIntent, PendingIntent.FLAG_CANCEL_CURRENT);

        long futureInMillis = SystemClock.elapsedRealtime() + delay;
        AlarmManager alarmManager = (AlarmManager) MyFirebaseMessagingService.this.getSystemService(Context.ALARM_SERVICE);
        alarmManager.set(AlarmManager.ELAPSED_REALTIME_WAKEUP, futureInMillis, pendingIntent);
    }
}