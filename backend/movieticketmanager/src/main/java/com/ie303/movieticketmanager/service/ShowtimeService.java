package com.ie303.movieticketmanager.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ie303.movieticketmanager.dto.ShowtimeDTO;
import com.ie303.movieticketmanager.model.Showtime;
import com.ie303.movieticketmanager.repository.ShowtimeRepository;

@Service
public class ShowtimeService {

    @Autowired
    private ShowtimeRepository showtimeRepository;

    // Get all showtimes
    public List<Showtime> getAllShowtimes() {
        return showtimeRepository.findAll();
    }

    // Get showtime by ID
    public Optional<Showtime> getShowtimeById(String id) {
        return showtimeRepository.findById(id);
    }

    // Get showtimes by movie ID
    public List<Showtime> getShowtimesByMovieId(String movieId) {
        return showtimeRepository.findByMovieIdAndIsHiddenFalse(movieId);
    }

    // Get showtimes by cinema ID
    public List<Showtime> getShowtimesByCinemaId(String cinemaId) {
        return showtimeRepository.findByCinemaIdAndIsHiddenFalse(cinemaId);
    }

    // Get showtimes by date
    public List<Showtime> getShowtimesByDate(LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
        return showtimeRepository.findByShowTimeBetweenAndIsHiddenFalse(startOfDay, endOfDay);
    }

    // Get showtimes by movie and date
    public List<Showtime> getShowtimesByMovieAndDate(String movieId, LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
        return showtimeRepository.findByMovieIdAndShowTimeBetweenAndIsHiddenFalse(movieId, startOfDay, endOfDay);
    }

    // Get showtimes by cinema and date
    public List<Showtime> getShowtimesByCinemaAndDate(String cinemaId, LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
        return showtimeRepository.findByCinemaIdAndShowTimeBetweenAndIsHiddenFalse(cinemaId, startOfDay, endOfDay);
    }

    // Create new showtime
    public Showtime createShowtime(ShowtimeDTO showtimeDTO) {
        Showtime showtime = new Showtime();
        showtime.setMovieId(showtimeDTO.getMovieId());
        showtime.setCinemaId(showtimeDTO.getCinemaId());
        showtime.setRoomName(showtimeDTO.getRoomName());
        showtime.setShowTime(showtimeDTO.getShowTime());
        showtime.setLockedSeats(showtimeDTO.getLockedSeats());
        showtime.setHidden(showtimeDTO.isHidden());
        
        return showtimeRepository.save(showtime);
    }

    // Update showtime
    public Showtime updateShowtime(String id, ShowtimeDTO showtimeDTO) {
        Optional<Showtime> optionalShowtime = showtimeRepository.findById(id);
        if (optionalShowtime.isPresent()) {
            Showtime showtime = optionalShowtime.get();
            showtime.setMovieId(showtimeDTO.getMovieId());
            showtime.setCinemaId(showtimeDTO.getCinemaId());
            showtime.setRoomName(showtimeDTO.getRoomName());
            showtime.setShowTime(showtimeDTO.getShowTime());
            showtime.setLockedSeats(showtimeDTO.getLockedSeats());
            showtime.setHidden(showtimeDTO.isHidden());
            
            return showtimeRepository.save(showtime);
        }
        return null;
    }

    // Delete showtime (soft delete by hiding)
    public boolean hideShowtime(String id) {
        Optional<Showtime> optionalShowtime = showtimeRepository.findById(id);
        if (optionalShowtime.isPresent()) {
            Showtime showtime = optionalShowtime.get();
            showtime.setHidden(true);
            showtimeRepository.save(showtime);
            return true;
        }
        return false;
    }

    // Hard delete showtime
    public boolean deleteShowtime(String id) {
        try {
            showtimeRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // Update locked seats
    public Showtime updateLockedSeats(String id, List<String> lockedSeats) {
        Optional<Showtime> optionalShowtime = showtimeRepository.findById(id);
        if (optionalShowtime.isPresent()) {
            Showtime showtime = optionalShowtime.get();
            showtime.setLockedSeats(lockedSeats);
            return showtimeRepository.save(showtime);
        }
        return null;
    }
    
    // Get or create default showtime for a movie (for simple booking)
    public Showtime getOrCreateDefaultShowtime(String movieId) {
        // Try to find existing showtime
        Showtime existingShowtime = showtimeRepository.findFirstByMovieIdAndIsHiddenFalse(movieId);
        
        if (existingShowtime != null) {
            return existingShowtime;
        }
        
        // Create a default showtime if none exists
        Showtime defaultShowtime = new Showtime();
        defaultShowtime.setMovieId(movieId);
        defaultShowtime.setCinemaId("default-cinema");
        defaultShowtime.setRoomName("Phòng chiếu 1");
        defaultShowtime.setShowTime(LocalDateTime.now().plusHours(2)); // 2 hours from now
        defaultShowtime.setLockedSeats(List.of()); // No locked seats initially
        defaultShowtime.setHidden(false);
        
        return showtimeRepository.save(defaultShowtime);
    }
} 