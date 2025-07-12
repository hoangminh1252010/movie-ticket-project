package com.ie303.movieticketmanager.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ie303.movieticketmanager.model.Cinema;
import com.ie303.movieticketmanager.service.CinemaService;

@RestController
@RequestMapping("/api/cinemas")
@CrossOrigin(origins = "*")
public class CinemaController {

    @Autowired
    private CinemaService cinemaService;

    // Lấy tất cả cinema
    @GetMapping
    public ResponseEntity<List<Cinema>> getAllCinemas() {
        try {
            List<Cinema> cinemas = cinemaService.getAllCinemas();
            return new ResponseEntity<>(cinemas, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Lấy cinema theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Cinema> getCinemaById(@PathVariable String id) {
        try {
            Optional<Cinema> cinema = cinemaService.getCinemaById(id);
            if (cinema.isPresent()) {
                return new ResponseEntity<>(cinema.get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Tìm cinema theo tên
    @GetMapping("/search")
    public ResponseEntity<List<Cinema>> searchCinemasByName(@RequestParam String name) {
        try {
            List<Cinema> cinemas = cinemaService.searchCinemasByName(name);
            return new ResponseEntity<>(cinemas, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Lấy cinema theo thành phố
    @GetMapping("/city/{city}")
    public ResponseEntity<List<Cinema>> getCinemasByCity(@PathVariable String city) {
        try {
            List<Cinema> cinemas = cinemaService.getCinemasByCity(city);
            return new ResponseEntity<>(cinemas, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Lấy danh sách thành phố
    @GetMapping("/cities")
    public ResponseEntity<List<String>> getAvailableCities() {
        try {
            List<String> cities = cinemaService.getAvailableCities();
            return new ResponseEntity<>(cities, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Tạo cinema mới
    @PostMapping
    public ResponseEntity<Cinema> createCinema(@RequestBody Cinema cinema) {
        try {
            Cinema newCinema = cinemaService.createCinema(cinema);
            return new ResponseEntity<>(newCinema, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Cập nhật cinema
    @PutMapping("/{id}")
    public ResponseEntity<Cinema> updateCinema(@PathVariable String id, @RequestBody Cinema cinema) {
        try {
            Cinema updatedCinema = cinemaService.updateCinema(id, cinema);
            if (updatedCinema != null) {
                return new ResponseEntity<>(updatedCinema, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Deactivate cinema (soft delete)
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<String> deactivateCinema(@PathVariable String id) {
        try {
            boolean success = cinemaService.deactivateCinema(id);
            if (success) {
                return new ResponseEntity<>("Cinema deactivated successfully", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Cinema not found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error deactivating cinema", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Xóa cinema vĩnh viễn
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCinema(@PathVariable String id) {
        try {
            boolean success = cinemaService.deleteCinema(id);
            if (success) {
                return new ResponseEntity<>("Cinema deleted successfully", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Cinema not found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error deleting cinema", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Tạo dữ liệu mẫu
    @PostMapping("/sample-data")
    public ResponseEntity<String> createSampleData() {
        try {
            cinemaService.createSampleCinemas();
            return new ResponseEntity<>("Sample cinemas created successfully", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error creating sample data", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
} 