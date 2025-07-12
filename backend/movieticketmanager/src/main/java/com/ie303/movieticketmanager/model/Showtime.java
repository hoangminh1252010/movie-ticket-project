package com.ie303.movieticketmanager.model;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "showtimes")
public class Showtime {

    @Id
    private String id;

    private String movieId;

    private String cinemaId;

    private String roomName;

    private LocalDateTime showTime;

    private List<String> lockedSeats;

    private boolean isHidden;

    // Default constructor
    public Showtime() {
    }

    // Constructor with parameters
    public Showtime(String movieId, String cinemaId, String roomName, LocalDateTime showTime, List<String> lockedSeats, boolean isHidden) {
        this.movieId = movieId;
        this.cinemaId = cinemaId;
        this.roomName = roomName;
        this.showTime = showTime;
        this.lockedSeats = lockedSeats;
        this.isHidden = isHidden;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getMovieId() {
        return movieId;
    }

    public void setMovieId(String movieId) {
        this.movieId = movieId;
    }

    public String getCinemaId() {
        return cinemaId;
    }

    public void setCinemaId(String cinemaId) {
        this.cinemaId = cinemaId;
    }

    public String getRoomName() {
        return roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }

    public LocalDateTime getShowTime() {
        return showTime;
    }

    public void setShowTime(LocalDateTime showTime) {
        this.showTime = showTime;
    }

    public List<String> getLockedSeats() {
        return lockedSeats;
    }

    public void setLockedSeats(List<String> lockedSeats) {
        this.lockedSeats = lockedSeats;
    }

    public boolean isHidden() {
        return isHidden;
    }

    public void setHidden(boolean hidden) {
        isHidden = hidden;
    }
} 