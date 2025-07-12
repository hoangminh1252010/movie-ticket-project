package com.ie303.movieticketmanager.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ie303.movieticketmanager.dto.AuthResponse;
import com.ie303.movieticketmanager.dto.LoginRequest;
import com.ie303.movieticketmanager.dto.RegisterRequest;
import com.ie303.movieticketmanager.model.User;
import com.ie303.movieticketmanager.repository.UserRepository;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public AuthResponse login(LoginRequest request) {
        try {
            // Tìm user active (không bị block hoặc delete)
            User user = userRepository.findActiveUserByEmail(request.getEmail());
            
            if (user == null) {
                return new AuthResponse(false, "Email không tồn tại hoặc tài khoản đã bị khóa");
            }

            // Kiểm tra mật khẩu với passwordHash
            if (!user.getPasswordHash().equals(request.getPassword())) {
                return new AuthResponse(false, "Mật khẩu không chính xác");
            }

            // Tạo user info (loại trừ passwordHash)
            String birthdateStr = user.getBirthdate() != null
    ? new SimpleDateFormat("yyyy-MM-dd").format(user.getBirthdate())
    : null;

AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(
    user.getId(),
    user.getName(),
    user.getEmail(),
    "USER",
    user.getPhone(),
    birthdateStr
);

            // Tạo token đơn giản (production nên dùng JWT)
            String token = "token_" + user.getId() + "_" + System.currentTimeMillis();

            return new AuthResponse(true, "Đăng nhập thành công", token, userInfo);

        } catch (Exception e) {
            return new AuthResponse(false, "Lỗi hệ thống: " + e.getMessage());
        }
    }

    public AuthResponse register(RegisterRequest request) {
        try {
            // Kiểm tra email đã tồn tại
            if (userRepository.existsByEmail(request.getEmail())) {
                return new AuthResponse(false, "Email đã được sử dụng");
            }

            // Tạo user mới
            User user = new User();
            user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setPasswordHash(request.getPassword()); // Sử dụng passwordHash
            user.setPhone(request.getPhone());
            
            // Xử lý birthDate
            if (request.getBirthDate() != null && !request.getBirthDate().isEmpty()) {
                try {
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                    Date birthDate = sdf.parse(request.getBirthDate());
                    user.setBirthdate(birthDate);
                } catch (ParseException e) {
                    return new AuthResponse(false, "Định dạng ngày sinh không hợp lệ (yyyy-MM-dd)");
                }
            }

            // Tạo account tự động hoặc từ request
            if (request.getAccount() != null && !request.getAccount().isEmpty()) {
                // Kiểm tra account đã tồn tại
                if (userRepository.existsByAccount(request.getAccount())) {
                    return new AuthResponse(false, "Tài khoản đã được sử dụng");
                }
                user.setAccount(request.getAccount());
            } else {
                // Tạo account tự động từ email
                String autoAccount = request.getEmail().split("@")[0];
                user.setAccount(autoAccount);
            }

            // Set default values
            user.setBlocked(false);
            user.setDeleted(false);

            User savedUser = userRepository.save(user);

            // Chỉ trả về thông báo thành công, không tạo token và user info
            return new AuthResponse(true, "Đăng ký thành công. Vui lòng đăng nhập để tiếp tục.");

        } catch (Exception e) {
            return new AuthResponse(false, "Lỗi hệ thống: " + e.getMessage());
        }
    }

    // Method thêm để admin quản lý user
    public boolean blockUser(String userId) {
        try {
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                user.setBlocked(true);
                userRepository.save(user);
                return true;
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean unblockUser(String userId) {
        try {
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                user.setBlocked(false);
                userRepository.save(user);
                return true;
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean deleteUser(String userId) {
        try {
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                user.setDeleted(true);
                userRepository.save(user);
                return true;
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }

    // Method kiểm tra user có active không
    public boolean isUserActive(String userId) {
        User user = userRepository.findById(userId).orElse(null);
        return user != null && user.isActive();
    }
}