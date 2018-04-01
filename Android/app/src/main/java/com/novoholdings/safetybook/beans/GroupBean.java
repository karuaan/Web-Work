package com.novoholdings.safetybook.beans;

/**
 * Created by James on 11/14/2017.
 */

public class GroupBean {

    private String name,
            adminName,
            adminEmail,
            bookName,
            dueDate,
            serverPath,
            localPath,
            fileName;
    boolean status;

    private long id;

    public String getName(){
        return name;
    }
    public void setName(String name){
        this.name = name;
    }

    public String getAdminName(){
        return adminName;
    }
    public void setAdminName(String name){
        adminName = name;
    }

    public String getAdminEmail(){
        return adminEmail;
    }
    public void setAdminEmail(String email){
        adminEmail = email;
    }

    public boolean getStatus(){
        return status;
    }
    public void setStatus(boolean status){
        this.status = status;
    }

    public long getId(){
        return id;
    }
    public void setId(int id){
        this.id = id;
    }

    public String getBookName(){
        return bookName;
    }
    public void setBookName(String bookName){
        this.bookName= bookName;
    }

    public String getServerPath() {
        return serverPath;
    }
    public void setServerPath(String serverPath){
        this.serverPath = serverPath;
    }

    public void setLocalPath(String path) {
        this.serverPath = path;
    }

    public String getLocalPath(){
        return localPath;
    }

    public String getFileName(){
        return fileName;
    }
    public void setFileName(String fileName){
        this.fileName = fileName;
    }
}
