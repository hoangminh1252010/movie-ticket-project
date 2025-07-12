package com.ie303.movieticketmanager.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ie303.movieticketmanager.service.ChatBotService;

import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = "*")
public class ChatBotController {
    
    @Autowired
    private ChatBotService chatBotService;
    
    /**
     * Main chatbot endpoint for frontend
     */
    @PostMapping("/chat")
    public Mono<Map<String, Object>> chat(@RequestBody Map<String, Object> request) {
        String message = (String) request.get("message");
        @SuppressWarnings("unchecked")
        List<Map<String, String>> conversationHistory = (List<Map<String, String>>) request.get("conversationHistory");
        
        if (message == null || message.trim().isEmpty()) {
            return Mono.just(Map.of(
                "success", false,
                "message", "Vui lòng nhập tin nhắn!",
                "timestamp", System.currentTimeMillis()
            ));
        }
        
        // Use conversation history if provided, otherwise use empty list
        if (conversationHistory == null) {
            return chatBotService.processMessage(message.trim());
        } else {
            return chatBotService.processMessage(message.trim(), conversationHistory);
        }
    }
    
    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public Mono<Map<String, Object>> health() {
        return Mono.just(Map.of(
            "status", "Neko Chatbot is online! 🤖",
            "timestamp", System.currentTimeMillis(),
            "version", "1.0.0"
        ));
    }
    
    /**
     * Create booking from chatbot conversation
     */
    @PostMapping("/create-booking")
    public Mono<Map<String, Object>> createBooking(@RequestBody Map<String, Object> request) {
        String message = (String) request.get("message");
        @SuppressWarnings("unchecked")
        List<Map<String, String>> conversationHistory = (List<Map<String, String>>) request.get("conversationHistory");
        
        if (message == null || message.trim().isEmpty()) {
            return Mono.just(Map.of(
                "success", false,
                "message", "Vui lòng nhập tin nhắn!",
                "timestamp", System.currentTimeMillis()
            ));
        }
        
        if (conversationHistory == null) {
            conversationHistory = new ArrayList<>();
        }
        
        return chatBotService.createBookingFromChat(message.trim(), conversationHistory);
    }
} 