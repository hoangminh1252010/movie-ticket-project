// package com.ie303.movieticketmanager.controller;

// import com.ie303.movieticketmanager.model.Order;
// import com.ie303.movieticketmanager.service.OrderService;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;
// import java.util.ArrayList;
// @RestController
// @RequestMapping("/api/orders")
// public class OrderController {
//     @Autowired
//     private OrderService orderService;
//     @Autowired
//     private OrderRepository orderRepository;

//     @GetMapping("/user/{userId}")
//     public List<Order> getOrdersByUserId(@PathVariable String userId) {
//         return orderService.getOrdersByUserId(userId);
//     }
//     @GetMapping("/showtime/{showtimeId}/seats")
//     public List<String> getBookedSeatsByShowtime(@PathVariable String showtimeId) {
//         List<Order> orders = orderRepository.findByShowtimeId(showtimeId);
//         List<String> bookedSeats = new ArrayList<>();
//         for (Order order : orders) {
//             if (order.getSeatNames() != null) {
//                 bookedSeats.addAll(order.getSeatNames());
//             }
//         }
//         return bookedSeats;
//     }
// }

// package com.ie303.movieticketmanager.controller;

// import com.ie303.movieticketmanager.model.Order;
// import com.ie303.movieticketmanager.repository.OrderRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.web.bind.annotation.*;
// import java.util.List;
// import java.util.ArrayList;

// @RestController
// @RequestMapping("/api/orders")
// public class OrderController {
//     @Autowired
//     private OrderRepository orderRepository;

//     // ... các endpoint khác ...

//     @GetMapping("/showtime/{showtimeId}/seats")
//     public List<String> getBookedSeatsByShowtime(@PathVariable String showtimeId) {
//         List<Order> orders = orderRepository.findByShowtimeId(showtimeId);
//         List<String> bookedSeats = new ArrayList<>();
//         for (Order order : orders) {
//             if (order.getSeatNames() != null) {
//                 bookedSeats.addAll(order.getSeatNames());
//             }
//         }
//         return bookedSeats;
//     }
// }

package com.ie303.movieticketmanager.controller;

import com.ie303.movieticketmanager.model.Order;
import com.ie303.movieticketmanager.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private OrderRepository orderRepository;

    // Thêm endpoint này:
    @GetMapping("/user/{userId}")
    public List<Order> getOrdersByUserId(@PathVariable String userId) {
        return orderRepository.findByUserId(userId);
    }

    @GetMapping("/showtime/{showtimeId}/seats")
    public List<String> getBookedSeatsByShowtime(@PathVariable String showtimeId) {
        List<Order> orders = orderRepository.findByShowtimeId(showtimeId);
        List<String> bookedSeats = new ArrayList<>();
        for (Order order : orders) {
            if (order.getSeatNames() != null) {
                bookedSeats.addAll(order.getSeatNames());
            }
        }
        return bookedSeats;
    }
}