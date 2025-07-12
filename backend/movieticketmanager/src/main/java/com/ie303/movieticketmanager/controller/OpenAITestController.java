package com.ie303.movieticketmanager.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ie303.movieticketmanager.service.OpenAITestService;

import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/openai-test")
@CrossOrigin(origins = "*")
public class OpenAITestController {
    
    @Autowired
    private OpenAITestService openAITestService;
    
    /**
     * Test cơ bản - kiểm tra connection đến OpenAI API
     */
    @GetMapping("/connection")
    public Mono<Map<String, Object>> testConnection() {
        return openAITestService.testConnection();
    }
    
    /**
     * Test chat API - gửi một tin nhắn đơn giản
     */
    @GetMapping("/chat")
    public Mono<Map<String, Object>> testChat() {
        return openAITestService.testSimpleChat();
    }
    
    /**
     * Test với custom message - GỬI THẬT ĐẾN OPENAI
     */
    @PostMapping("/chat-custom")
    public Mono<Map<String, Object>> testCustomChat(@RequestBody Map<String, String> request) {
        String message = request.getOrDefault("message", "Hello, OpenAI!");
        return openAITestService.testCustomMessage(message);
    }
    
    /**
     * Debug chat với thông tin chi tiết
     */
    @GetMapping("/debug-chat")
    public Mono<Map<String, Object>> debugChat() {
        return openAITestService.debugChat();
    }
    
    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public Mono<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "OpenAI Test Controller is running");
        response.put("timestamp", System.currentTimeMillis());
        response.put("endpoints", new String[]{
            "GET /api/openai-test/connection - Test OpenAI connection",
            "GET /api/openai-test/chat - Test simple chat",
            "GET /api/openai-test/debug-chat - Debug chat with details",
            "POST /api/openai-test/chat-custom - Test custom message"
        });
        
        return Mono.just(response);
    }
} 