package com.ie303.movieticketmanager.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.ie303.movieticketmanager.model.Cinema;

@Repository
public interface CinemaRepository extends MongoRepository<Cinema, String> {
    
    // Tìm tất cả cinema đang hoạt động
    List<Cinema> findByIsActiveTrue();
    
    // Tìm cinema theo tên
    List<Cinema> findByNameContainingIgnoreCase(String name);
    
    // Tìm cinema theo thành phố
    List<Cinema> findByCityAndIsActiveTrue(String city);
    
    // Tìm cinema theo tên và thành phố
    @Query("{ 'name': { $regex: ?0, $options: 'i' }, 'city': ?1, 'isActive': true }")
    List<Cinema> findByNameAndCityAndIsActiveTrue(String name, String city);
    
    // Tìm tất cả thành phố có cinema
    @Query(value = "{ 'isActive': true }", fields = "{ 'city': 1 }")
    List<Cinema> findDistinctCities();
} 