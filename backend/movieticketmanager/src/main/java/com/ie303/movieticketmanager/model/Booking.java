package com.ie303.movieticketmanager.model;

import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "bookings")
public class Booking {
    
    @Id
    private String id;
    
    private String userId;
    
    private String showtimeId;
    
    private List<String> seatNames;
    
    private String status; // pending | confirmed | cancelled
    
    private Date bookingTime;
    
    private Date updatedAt;

    // Constructors
    public Booking() {
        this.bookingTime = new Date();
        this.updatedAt = new Date();
        this.status = "pending";
    }

    public Booking(String userId, String showtimeId, List<String> seatNames) {
        this.userId = userId;
        this.showtimeId = showtimeId;
        this.seatNames = seatNames;
        this.status = "pending";
        this.bookingTime = new Date();
        this.updatedAt = new Date();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getShowtimeId() {
        return showtimeId;
    }

    public void setShowtimeId(String showtimeId) {
        this.showtimeId = showtimeId;
    }

    public List<String> getSeatNames() {
        return seatNames;
    }

    public void setSeatNames(List<String> seatNames) {
        this.seatNames = seatNames;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
        this.updatedAt = new Date(); // Auto update timestamp when status changes
    }

    public Date getBookingTime() {
        return bookingTime;
    }

    public void setBookingTime(Date bookingTime) {
        this.bookingTime = bookingTime;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }
} 