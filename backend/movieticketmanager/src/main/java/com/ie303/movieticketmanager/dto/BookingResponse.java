package com.ie303.movieticketmanager.dto;

import java.util.Date;
import java.util.List;

public class BookingResponse {
    private boolean success;
    private String message;
    private BookingInfo booking;

    // Constructors
    public BookingResponse() {}

    public BookingResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public BookingResponse(boolean success, String message, BookingInfo booking) {
        this.success = success;
        this.message = message;
        this.booking = booking;
    }

    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public BookingInfo getBooking() {
        return booking;
    }

    public void setBooking(BookingInfo booking) {
        this.booking = booking;
    }

    // Inner class for booking info
    public static class BookingInfo {
        private String id;
        private String userId;
        private String showtimeId;
        private List<String> seatNames;
        private String status;
        private Date bookingTime;
        private Date updatedAt;

        public BookingInfo() {}

        public BookingInfo(String id, String userId, String showtimeId, List<String> seatNames, 
                          String status, Date bookingTime, Date updatedAt) {
            this.id = id;
            this.userId = userId;
            this.showtimeId = showtimeId;
            this.seatNames = seatNames;
            this.status = status;
            this.bookingTime = bookingTime;
            this.updatedAt = updatedAt;
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
} 