package com.ie303.movieticketmanager.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Mono;

@Service
public class OpenAITestService {
    
    private final WebClient webClient;
    private final String openaiApiKey;
    
    public OpenAITestService(WebClient openaiWebClient, String openaiApiKey) {
        this.webClient = openaiWebClient;
        this.openaiApiKey = openaiApiKey;
    }
    
    public Mono<Map<String, Object>> testConnection() {
        if (openaiApiKey == null || openaiApiKey.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "OpenAI API key not configured");
            error.put("success", false);
            return Mono.just(error);
        }
        
        // Test với API đơn giản nhất - list models
        return webClient.get()
                .uri("/models")
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> {
                    Map<String, Object> result = new HashMap<>();
                    result.put("success", true);
                    result.put("message", "OpenAI API connection successful!");
                    result.put("models_count", ((List<?>) response.get("data")).size());
                    return result;
                })
                .onErrorReturn(createErrorResponse("Failed to connect to OpenAI API"));
    }
    
    public Mono<Map<String, Object>> testSimpleChat() {
        if (openaiApiKey == null || openaiApiKey.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "OpenAI API key not configured");
            error.put("success", false);
            return Mono.just(error);
        }
        
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-4o-mini");
        requestBody.put("messages", List.of(
            Map.of("role", "user", "content", "Hello! Please respond with exactly: 'OpenAI connection test successful!'")
        ));
        requestBody.put("max_tokens", 50);
        
        return webClient.post()
                .uri("/chat/completions")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> {
                    Map<String, Object> result = new HashMap<>();
                    result.put("success", true);
                    result.put("message", "OpenAI Chat API working!");
                    
                    // Extract response text
                    try {
                        List<?> choices = (List<?>) response.get("choices");
                        if (!choices.isEmpty()) {
                            Map<?, ?> firstChoice = (Map<?, ?>) choices.get(0);
                            Map<?, ?> message = (Map<?, ?>) firstChoice.get("message");
                            result.put("ai_response", message.get("content"));
                        }
                    } catch (Exception e) {
                        result.put("ai_response", "Could not parse response");
                    }
                    
                    return result;
                })
                .onErrorResume(error -> {
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("success", false);
                    errorResponse.put("error", "Failed to get response from OpenAI Chat API");
                    errorResponse.put("error_details", error.getMessage());
                    errorResponse.put("error_type", error.getClass().getSimpleName());
                    return Mono.just(errorResponse);
                });
    }
    
    public Mono<Map<String, Object>> debugChat() {
        if (openaiApiKey == null || openaiApiKey.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "OpenAI API key not configured");
            error.put("success", false);
            return Mono.just(error);
        }
        
        // Test với gpt-4o-mini model (rẻ hơn và stable hơn)
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-4o-mini");
        requestBody.put("messages", List.of(
            Map.of("role", "user", "content", "Say 'Hello from OpenAI!' and nothing else.")
        ));
        requestBody.put("max_tokens", 20);
        requestBody.put("temperature", 0);
        
        return webClient.post()
                .uri("/chat/completions")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> {
                    Map<String, Object> result = new HashMap<>();
                    result.put("success", true);
                    result.put("message", "Debug chat successful!");
                    result.put("model_used", "gpt-4o-mini");
                    result.put("full_response", response);
                    
                    // Extract response text
                    try {
                        List<?> choices = (List<?>) response.get("choices");
                        if (!choices.isEmpty()) {
                            Map<?, ?> firstChoice = (Map<?, ?>) choices.get(0);
                            Map<?, ?> message = (Map<?, ?>) firstChoice.get("message");
                            result.put("ai_response", message.get("content"));
                        }
                    } catch (Exception e) {
                        result.put("parsing_error", e.getMessage());
                    }
                    
                    return result;
                })
                .onErrorResume(error -> {
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("success", false);
                    errorResponse.put("error", "Debug chat failed");
                    errorResponse.put("error_details", error.getMessage());
                    errorResponse.put("error_type", error.getClass().getSimpleName());
                    
                    // Thêm thông tin HTTP status nếu có
                    if (error.getMessage().contains("401")) {
                        errorResponse.put("likely_cause", "Invalid API key or insufficient permissions");
                    } else if (error.getMessage().contains("429")) {
                        errorResponse.put("likely_cause", "Rate limit exceeded or insufficient credits");
                    } else if (error.getMessage().contains("400")) {
                        errorResponse.put("likely_cause", "Bad request - check model name or request format");
                    }
                    
                    return Mono.just(errorResponse);
                });
    }
    
    public Mono<Map<String, Object>> testCustomMessage(String userMessage) {
        if (openaiApiKey == null || openaiApiKey.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "OpenAI API key not configured");
            error.put("success", false);
            return Mono.just(error);
        }
        
        // Tạo system prompt cho Neko Cinema
        String systemPrompt = "Bạn là trợ lý AI của Neko Cinema, một rạp chiếu phim hiện đại. " +
                "Hãy trả lời các câu hỏi về phim, lịch chiếu, giá vé một cách thân thiện và hữu ích. " +
                "Nếu không biết thông tin cụ thể, hãy đưa ra gợi ý hữu ích.";
        
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-4o-mini");
        requestBody.put("messages", List.of(
            Map.of("role", "system", "content", systemPrompt),
            Map.of("role", "user", "content", userMessage)
        ));
        requestBody.put("max_tokens", 300);
        requestBody.put("temperature", 0.7);
        
        return webClient.post()
                .uri("/chat/completions")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> {
                    Map<String, Object> result = new HashMap<>();
                    result.put("success", true);
                    result.put("user_message", userMessage);
                    result.put("model_used", "gpt-4o-mini");
                    
                    // Extract AI response
                    try {
                        List<?> choices = (List<?>) response.get("choices");
                        if (!choices.isEmpty()) {
                            Map<?, ?> firstChoice = (Map<?, ?>) choices.get(0);
                            Map<?, ?> message = (Map<?, ?>) firstChoice.get("message");
                            result.put("ai_response", message.get("content"));
                        }
                        
                        // Thêm usage info nếu có
                        if (response.containsKey("usage")) {
                            result.put("usage", response.get("usage"));
                        }
                        
                    } catch (Exception e) {
                        result.put("parsing_error", e.getMessage());
                        result.put("ai_response", "Xin lỗi, tôi gặp sự cố khi xử lý phản hồi.");
                    }
                    
                    return result;
                })
                .onErrorResume(error -> {
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("success", false);
                    errorResponse.put("user_message", userMessage);
                    errorResponse.put("error", "Failed to get response from OpenAI");
                    errorResponse.put("error_details", error.getMessage());
                    errorResponse.put("error_type", error.getClass().getSimpleName());
                    
                    return Mono.just(errorResponse);
                });
    }
    
    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> error = new HashMap<>();
        error.put("success", false);
        error.put("error", message);
        return error;
    }
} 