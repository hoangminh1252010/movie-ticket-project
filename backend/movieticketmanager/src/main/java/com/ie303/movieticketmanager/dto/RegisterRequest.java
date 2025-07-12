package com.ie303.movieticketmanager.dto;

public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String phone;
    private String birthDate; // String format: "yyyy-MM-dd"
    private String account;   // Thêm field account

    // Constructors
    public RegisterRequest() {}

    public RegisterRequest(String name, String email, String password, String phone, String birthDate, String account) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.birthDate = birthDate;
        this.account = account;
    }

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getBirthDate() { return birthDate; }
    public void setBirthDate(String birthDate) { this.birthDate = birthDate; }

    public String getAccount() { return account; }
    public void setAccount(String account) { this.account = account; }
}