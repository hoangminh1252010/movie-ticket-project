package com.ie303.movieticketmanager.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.ie303.movieticketmanager.model.User;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    
    User findByEmail(String email);
    
    User findByAccount(String account);  // Thêm method tìm theo account
    
    // Tìm user active (không bị block hoặc delete)
    @Query("{ 'email': ?0, 'blocked': false, 'deleted': false }")
    User findActiveUserByEmail(String email);
    
    @Query("{ 'account': ?0, 'blocked': false, 'deleted': false }")
    User findActiveUserByAccount(String account);
    
    // Kiểm tra email đã tồn tại
    boolean existsByEmail(String email);
    
    // Kiểm tra account đã tồn tại
    boolean existsByAccount(String account);
}