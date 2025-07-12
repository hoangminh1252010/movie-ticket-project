package com.ie303.movieticketmanager.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.ie303.movieticketmanager.model.Movie;

@Repository
public interface MovieRepository extends MongoRepository<Movie, String> {

    // Lấy tất cả phim chưa bị xoá
    List<Movie> findByDeletedFalse();

    // Lấy phim theo ID
    Optional<Movie> findById(String id);

    // Lấy phim theo tiêu đề (case insensitive)
    Optional<Movie> findByTitleIgnoreCaseAndDeletedFalse(String title);

        // Lấy phim sắp chiếu (release date > hiện tại)
    List<Movie> findByReleaseDateAfterAndDeletedFalseOrderByReleaseDateAsc(LocalDateTime currentDate);
    
    // Fixed: Use @Query instead of long method names
    @Query("{'releaseDate': {$gt: ?0}, 'deleted': false}")
    List<Movie> findUpcomingMovies(LocalDateTime currentDate);
    
    @Query("{'releaseDate': {$lte: ?0}, 'deleted': false}")
    List<Movie> findNowPlayingMovies(LocalDateTime currentDate);
}
