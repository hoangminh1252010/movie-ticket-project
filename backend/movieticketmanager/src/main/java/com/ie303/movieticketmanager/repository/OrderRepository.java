package com.ie303.movieticketmanager.repository;

import com.ie303.movieticketmanager.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByUserId(String userId);
    List<Order> findByShowtimeId(String showtimeId);
}