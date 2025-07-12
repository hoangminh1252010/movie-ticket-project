package com.ie303.movieticketmanager.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ie303.movieticketmanager.dto.ShowtimeDTO;
import com.ie303.movieticketmanager.model.Showtime;
import com.ie303.movieticketmanager.service.ShowtimeService;

@RestController
@RequestMapping("/api/showtimes")
@CrossOrigin(origins = "*")
public class ShowtimeController {

    @Autowired
    private ShowtimeService showtimeService;

    // Get all showtimes
    @GetMapping
    public ResponseEntity<List<Showtime>> getAllShowtimes() {
        try {
            List<Showtime> showtimes = showtimeService.getAllShowtimes();
            return new ResponseEntity<>(showtimes, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get showtime by ID
    @GetMapping("/{id}")
    public ResponseEntity<Showtime> getShowtimeById(@PathVariable String id) {
        try {
            Optional<Showtime> showtime = showtimeService.getShowtimeById(id);
            if (showtime.isPresent()) {
                return new ResponseEntity<>(showtime.get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get showtimes by movie ID
    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<Showtime>> getShowtimesByMovieId(@PathVariable String movieId) {
        try {
            List<Showtime> showtimes = showtimeService.getShowtimesByMovieId(movieId);
            return new ResponseEntity<>(showtimes, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get showtimes by cinema ID
    @GetMapping("/cinema/{cinemaId}")
    public ResponseEntity<List<Showtime>> getShowtimesByCinemaId(@PathVariable String cinemaId) {
        try {
            List<Showtime> showtimes = showtimeService.getShowtimesByCinemaId(cinemaId);
            return new ResponseEntity<>(showtimes, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get showtimes by date
    @GetMapping("/date/{date}")
    public ResponseEntity<List<Showtime>> getShowtimesByDate(
            @PathVariable @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate date) {
        try {
            List<Showtime> showtimes = showtimeService.getShowtimesByDate(date);
            return new ResponseEntity<>(showtimes, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get showtimes by movie and date
    @GetMapping("/movie/{movieId}/date/{date}")
    public ResponseEntity<List<Showtime>> getShowtimesByMovieAndDate(
            @PathVariable String movieId,
            @PathVariable @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate date) {
        try {
            List<Showtime> showtimes = showtimeService.getShowtimesByMovieAndDate(movieId, date);
            return new ResponseEntity<>(showtimes, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get showtimes by cinema and date
    @GetMapping("/cinema/{cinemaId}/date/{date}")
    public ResponseEntity<List<Showtime>> getShowtimesByCinemaAndDate(
            @PathVariable String cinemaId,
            @PathVariable @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate date) {
        try {
            List<Showtime> showtimes = showtimeService.getShowtimesByCinemaAndDate(cinemaId, date);
            return new ResponseEntity<>(showtimes, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Create new showtime
    @PostMapping
    public ResponseEntity<Showtime> createShowtime(@RequestBody ShowtimeDTO showtimeDTO) {
        try {
            Showtime newShowtime = showtimeService.createShowtime(showtimeDTO);
            return new ResponseEntity<>(newShowtime, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update showtime
    @PutMapping("/{id}")
    public ResponseEntity<Showtime> updateShowtime(@PathVariable String id, @RequestBody ShowtimeDTO showtimeDTO) {
        try {
            Showtime updatedShowtime = showtimeService.updateShowtime(id, showtimeDTO);
            if (updatedShowtime != null) {
                return new ResponseEntity<>(updatedShowtime, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Hide showtime (soft delete)
    @PatchMapping("/{id}/hide")
    public ResponseEntity<String> hideShowtime(@PathVariable String id) {
        try {
            boolean success = showtimeService.hideShowtime(id);
            if (success) {
                return new ResponseEntity<>("Showtime hidden successfully", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Showtime not found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error hiding showtime", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete showtime permanently
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteShowtime(@PathVariable String id) {
        try {
            boolean success = showtimeService.deleteShowtime(id);
            if (success) {
                return new ResponseEntity<>("Showtime deleted successfully", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Showtime not found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error deleting showtime", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update locked seats
    @PatchMapping("/{id}/locked-seats")
    public ResponseEntity<Showtime> updateLockedSeats(@PathVariable String id, @RequestBody List<String> lockedSeats) {
        try {
            Showtime updatedShowtime = showtimeService.updateLockedSeats(id, lockedSeats);
            if (updatedShowtime != null) {
                return new ResponseEntity<>(updatedShowtime, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get or create default showtime for a movie
    @GetMapping("/movie/{movieId}/default")
    public ResponseEntity<Showtime> getDefaultShowtimeForMovie(@PathVariable String movieId) {
        try {
            Showtime showtime = showtimeService.getOrCreateDefaultShowtime(movieId);
            return new ResponseEntity<>(showtime, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
} 