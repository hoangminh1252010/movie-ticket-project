package com.ie303.movieticketmanager.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class OpenAIConfig {
    
    @Value("${openrouter.api.key:}")
    private String openrouterApiKey;
    
    @Value("${openrouter.model:openai/gpt-4o-mini}")
    private String openrouterModel;
    
    @Bean
    public WebClient openaiWebClient() {
        return WebClient.builder()
                .baseUrl("https://openrouter.ai/api/v1")
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + openrouterApiKey)
                .defaultHeader("HTTP-Referer", "http://localhost:5173") // Vite default port
                .defaultHeader("X-Title", "Neko Cinema Chatbot") // Optional app name
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }
    
    @Bean
    public String openaiApiKey() {
        return openrouterApiKey; // Return OpenRouter key
    }
    
    @Bean
    public String openrouterModel() {
        return openrouterModel;
    }
} 