package com.ie303.movieticketmanager.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.ie303.movieticketmanager.model.Showtime;

@Repository
public interface ShowtimeRepository extends MongoRepository<Showtime, String> {

    // Find all showtimes for a specific movie that are not hidden
    @Query("{ 'movieId': ?0, 'isHidden': false }")
    List<Showtime> findByMovieIdAndIsHiddenFalse(String movieId);

    // Find all showtimes for a specific cinema that are not hidden
    @Query("{ 'cinemaId': ?0, 'isHidden': false }")
    List<Showtime> findByCinemaIdAndIsHiddenFalse(String cinemaId);

    // Find showtimes by date range (start of day to end of day)
    @Query("{ 'showTime': { $gte: ?0, $lt: ?1 }, 'isHidden': false }")
    List<Showtime> findByShowTimeBetweenAndIsHiddenFalse(LocalDateTime startDate, LocalDateTime endDate);

    // Find showtimes by movie and date range
    @Query("{ 'movieId': ?0, 'showTime': { $gte: ?1, $lt: ?2 }, 'isHidden': false }")
    List<Showtime> findByMovieIdAndShowTimeBetweenAndIsHiddenFalse(String movieId, LocalDateTime startDate, LocalDateTime endDate);

    // Find showtimes by cinema and date range
    @Query("{ 'cinemaId': ?0, 'showTime': { $gte: ?1, $lt: ?2 }, 'isHidden': false }")
    List<Showtime> findByCinemaIdAndShowTimeBetweenAndIsHiddenFalse(String cinemaId, LocalDateTime startDate, LocalDateTime endDate);

    // Find all showtimes including hidden ones (for admin purposes)
    List<Showtime> findByMovieId(String movieId);

    List<Showtime> findByCinemaId(String cinemaId);

    // Find showtimes by room name
    @Query("{ 'roomName': ?0, 'isHidden': false }")
    List<Showtime> findByRoomNameAndIsHiddenFalse(String roomName);
    
    // Find first available showtime for a movie (for simple booking)
    @Query(value = "{ 'movieId': ?0, 'isHidden': false }", sort = "{ 'showTime': 1 }")
    Showtime findFirstByMovieIdAndIsHiddenFalse(String movieId);
} 