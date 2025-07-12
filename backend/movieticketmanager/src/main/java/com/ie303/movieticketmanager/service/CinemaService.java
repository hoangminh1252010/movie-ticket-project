package com.ie303.movieticketmanager.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ie303.movieticketmanager.model.Cinema;
import com.ie303.movieticketmanager.repository.CinemaRepository;

@Service
public class CinemaService {

    @Autowired
    private CinemaRepository cinemaRepository;

    // Lấy tất cả cinema đang hoạt động
    public List<Cinema> getAllActiveCinemas() {
        return cinemaRepository.findByIsActiveTrue();
    }

    // Lấy cinema theo ID
    public Optional<Cinema> getCinemaById(String id) {
        return cinemaRepository.findById(id);
    }

    // Tìm cinema theo tên
    public List<Cinema> searchCinemasByName(String name) {
        return cinemaRepository.findByNameContainingIgnoreCase(name);
    }

    // Lấy cinema theo thành phố
    public List<Cinema> getCinemasByCity(String city) {
        return cinemaRepository.findByCityAndIsActiveTrue(city);
    }

    // Lấy danh sách thành phố có cinema
    public List<String> getAvailableCities() {
        return cinemaRepository.findDistinctCities()
                .stream()
                .map(Cinema::getCity)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    // Tạo cinema mới
    public Cinema createCinema(Cinema cinema) {
        cinema.setActive(true);
        return cinemaRepository.save(cinema);
    }

    // Cập nhật cinema
    public Cinema updateCinema(String id, Cinema cinema) {
        Optional<Cinema> existingCinema = cinemaRepository.findById(id);
        if (existingCinema.isPresent()) {
            Cinema updated = existingCinema.get();
            updated.setName(cinema.getName());
            updated.setAddress(cinema.getAddress());
            updated.setCity(cinema.getCity());
            updated.setPhone(cinema.getPhone());
            updated.setActive(cinema.isActive());
            return cinemaRepository.save(updated);
        }
        return null;
    }

    // Xóa cinema (soft delete)
    public boolean deactivateCinema(String id) {
        Optional<Cinema> cinema = cinemaRepository.findById(id);
        if (cinema.isPresent()) {
            Cinema c = cinema.get();
            c.setActive(false);
            cinemaRepository.save(c);
            return true;
        }
        return false;
    }

    // Xóa cinema vĩnh viễn
    public boolean deleteCinema(String id) {
        try {
            cinemaRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // Tạo dữ liệu mẫu (để test)
    public void createSampleCinemas() {
        if (cinemaRepository.count() == 0) {
            List<Cinema> sampleCinemas = List.of(
                new Cinema("Neko Cinema Hồ Chí Minh", "123 Nguyễn Huệ, Quận 1", "Hồ Chí Minh", "028-1234-5678"),
                new Cinema("Neko Cinema Hà Nội", "456 Hoàn Kiếm, Quận Hoàn Kiếm", "Hà Nội", "024-1234-5678"),
                new Cinema("Neko Cinema Đà Nẵng", "789 Trần Phú, Quận Hải Châu", "Đà Nẵng", "0236-1234-567"),
                new Cinema("Neko Cinema Cần Thơ", "321 Ninh Kiều, Quận Ninh Kiều", "Cần Thơ", "0292-1234-567"),
                new Cinema("Neko Cinema Nha Trang", "654 Trần Quang Khải, TP Nha Trang", "Nha Trang", "0258-1234-567")
            );
            
            // Set specific IDs to match existing showtimes
            sampleCinemas.get(0).setId("6846e48955d71b6ed386bc27");
            sampleCinemas.get(1).setId("6846e48955d71b6ed386bc28");
            sampleCinemas.get(2).setId("6846e48955d71b6ed386bc29");
            sampleCinemas.get(3).setId("6846e48955d71b6ed386bc2a");
            sampleCinemas.get(4).setId("6846e48955d71b6ed386bc2b");
            
            cinemaRepository.saveAll(sampleCinemas);
        }
    }

    // Lấy tất cả cinema (không kiểm tra isActive)
    public List<Cinema> getAllCinemas() {
        return cinemaRepository.findAll();
    }
} 