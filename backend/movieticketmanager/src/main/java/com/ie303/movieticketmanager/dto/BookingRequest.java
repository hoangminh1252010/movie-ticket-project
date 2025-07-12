package com.ie303.movieticketmanager.dto;

import java.util.List;

public class BookingRequest {
    private String userId;
    private String showtimeId;
    private List<String> seatNames;

    // Constructors
    public BookingRequest() {}

    public BookingRequest(String userId, String showtimeId, List<String> seatNames) {
        this.userId = userId;
        this.showtimeId = showtimeId;
        this.seatNames = seatNames;
    }

    // Getters and Setters
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

    @Override
    public String toString() {
        return "BookingRequest{" +
            "userId='" + userId + '\'' +
            ", showtimeId='" + showtimeId + '\'' +
            ", seatNames=" + seatNames +
            '}';
    }
} 