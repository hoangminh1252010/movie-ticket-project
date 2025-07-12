# OpenAI API Connection Test

## Cách test OpenAI API connection

### 1. Chuẩn bị API Key

1. Đi tới https://platform.openai.com/api-keys
2. Tạo API key mới
3. Copy API key
4. Mở file `application.properties`
5. Thay `YOUR_OPENAI_API_KEY_HERE` bằng API key thật của bạn

### 2. Chạy backend server

```bash
cd backend/movieticketmanager
./mvnw spring-boot:run
```

### 3. Test các endpoint

#### A. Health Check (không cần API key)

```bash
curl http://localhost:8080/api/openai-test/health
```

#### B. Test Connection (cần API key)

```bash
curl http://localhost:8080/api/openai-test/connection
```

**Kết quả mong đợi nếu thành công:**

```json
{
  "success": true,
  "message": "OpenAI API connection successful!",
  "models_count": 50
}
```

#### C. Test Simple Chat (cần API key)

```bash
curl http://localhost:8080/api/openai-test/chat
```

**Kết quả mong đợi nếu thành công:**

```json
{
  "success": true,
  "message": "OpenAI Chat API working!",
  "ai_response": "OpenAI connection test successful!"
}
```

#### D. Test Custom Message

```bash
curl -X POST http://localhost:8080/api/openai-test/chat-custom \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello from Vietnam!"}'
```

### 4. Troubleshooting

#### Nếu gặp lỗi "API key not configured":

- Kiểm tra file `application.properties`
- Đảm bảo API key đã được thay thế đúng
- Restart server sau khi thay đổi config

#### Nếu gặp lỗi 401 Unauthorized:

- API key không hợp lệ hoặc đã hết hạn
- Kiểm tra API key trên OpenAI dashboard

#### Nếu gặp lỗi 429 Rate Limited:

- Bạn đã vượt quá giới hạn API calls
- Đợi một chút hoặc upgrade plan

### 5. Frontend Integration

Sau khi backend hoạt động, bạn có thể gọi từ frontend:

```javascript
// Test connection
fetch("http://localhost:8080/api/openai-test/connection")
  .then((response) => response.json())
  .then((data) => console.log(data));

// Test chat
fetch("http://localhost:8080/api/openai-test/chat")
  .then((response) => response.json())
  .then((data) => console.log(data));
```
