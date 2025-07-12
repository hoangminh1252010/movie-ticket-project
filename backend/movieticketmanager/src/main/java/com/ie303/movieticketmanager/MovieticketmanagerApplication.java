package com.ie303.movieticketmanager;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.ie303.movieticketmanager.service.CinemaService;

@SpringBootApplication
public class MovieticketmanagerApplication implements CommandLineRunner {

	@Autowired
	private CinemaService cinemaService;

	public static void main(String[] args) {
		SpringApplication.run(MovieticketmanagerApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		// Tạo dữ liệu mẫu cho cinema khi khởi động
		cinemaService.createSampleCinemas();
		System.out.println("✅ Cinema sample data initialized");
	}
}
