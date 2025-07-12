package com.ie303.movieticketmanager.model;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "users")
public class User {

    @Id
    private String id;
    
    private String name;
    
    private String email;
    
    @Field("passwordHash")  // Map sang field "passwordHash" trong MongoDB
    private String passwordHash;
    
    private String phone;
    
    @Field("birthdate")     // Map sang field "birthdate" trong MongoDB
    private Date birthdate; // Sử dụng Date thay vì String
    
    private String account; // Thêm field account
    
    private boolean blocked = false;  // Thay thế active
    
    private boolean deleted = false;  // Thêm field deleted

    // Constructors
    public User() {
        this.blocked = false;
        this.deleted = false;
    }

    public User(String name, String email, String passwordHash, String phone, Date birthdate, String account) {
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.phone = phone;
        this.birthdate = birthdate;
        this.account = account;
        this.blocked = false;
        this.deleted = false;
    }

    // Getters and Setters
    public String getId() { 
        return id; 
    }
    
    public void setId(String id) { 
        this.id = id; 
    }

    public String getName() { 
        return name; 
    }
    
    public void setName(String name) { 
        this.name = name; 
    }

    public String getEmail() { 
        return email; 
    }
    
    public void setEmail(String email) { 
        this.email = email; 
    }

    public String getPasswordHash() { 
        return passwordHash; 
    }
    
    public void setPasswordHash(String passwordHash) { 
        this.passwordHash = passwordHash; 
    }

    public String getPhone() { 
        return phone; 
    }
    
    public void setPhone(String phone) { 
        this.phone = phone; 
    }

    public Date getBirthdate() { 
        return birthdate; 
    }
    
    public void setBirthdate(Date birthdate) { 
        this.birthdate = birthdate; 
    }

    public String getAccount() { 
        return account; 
    }
    
    public void setAccount(String account) { 
        this.account = account; 
    }

    public boolean isBlocked() { 
        return blocked; 
    }
    
    public void setBlocked(boolean blocked) { 
        this.blocked = blocked; 
    }

    public boolean isDeleted() { 
        return deleted; 
    }
    
    public void setDeleted(boolean deleted) { 
        this.deleted = deleted; 
    }

    // Utility methods
    public boolean isActive() {
        return !blocked && !deleted;
    }
    
    @Override
    public String toString() {
        return "User{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", account='" + account + '\'' +
                ", blocked=" + blocked +
                ", deleted=" + deleted +
                '}';
    }
}