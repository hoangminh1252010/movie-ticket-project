package com.ie303.movieticketmanager.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.ie303.movieticketmanager.model.Booking;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    
    // Tìm tất cả bookings của một user
    List<Booking> findByUserId(String userId);
    
    // Tìm bookings theo showtime
    List<Booking> findByShowtimeId(String showtimeId);
    
    // Tìm bookings theo status
    List<Booking> findByStatus(String status);
    
    // Tìm bookings của user theo status
    List<Booking> findByUserIdAndStatus(String userId, String status);
    
    // Kiểm tra ghế đã được đặt chưa (chỉ những booking có status confirmed hoặc pending)
    @Query("{ 'showtimeId': ?0, 'seatNames': { $in: ?1 }, 'status': { $in: ['pending', 'confirmed'] } }")
    List<Booking> findConflictingBookings(String showtimeId, List<String> seatNames);
} 