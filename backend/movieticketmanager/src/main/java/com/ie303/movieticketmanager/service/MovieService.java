package com.ie303.movieticketmanager.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ie303.movieticketmanager.model.Movie;
import com.ie303.movieticketmanager.repository.MovieRepository;

@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;

    // Lấy tất cả phim chưa xoá
    public List<Movie> getAllMovies() {
        return movieRepository.findByDeletedFalse();
    }

    // Lấy phim theo ID
    public Optional<Movie> getMovieById(String id) {
        return movieRepository.findById(id);
    }

    // Lấy phim theo tiêu đề
    public Optional<Movie> getMovieByTitle(String title) {
        return movieRepository.findByTitleIgnoreCaseAndDeletedFalse(title);
    }
    
    // Fixed methods
    public List<Movie> getUpcomingMovies() {
        LocalDateTime now = LocalDateTime.now();
        return movieRepository.findUpcomingMovies(now);
    }

    public List<Movie> getNowPlayingMovies() {
        LocalDateTime now = LocalDateTime.now();
        return movieRepository.findNowPlayingMovies(now);
    }

}
