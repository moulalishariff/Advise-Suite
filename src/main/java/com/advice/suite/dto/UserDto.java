package com.advice.suite.dto;

import com.advice.suite.enums.Role;

import jakarta.validation.constraints.Pattern;

public class UserDto {

    private String name;
    private String email;
    private String password;
    private Role role;

    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be exactly 10 digits")
    private String phone;

    private String token;
    private String betaId;

    public UserDto(String name, String email, String password, Role role, String phone, String betaId) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.phone = phone;
        this.betaId = betaId;
    }
    public UserDto(String token, String role, String email, String betaId) {
        this.token = token;
        this.role = Role.valueOf(role);
        this.email = email;
        this.betaId = betaId;
    }
//    public UserDto(String email, String password) {
//        this.email = email;
//        this.password = password;
//    }


    public UserDto(String betaId, String password) {
        this.betaId = betaId;
        this.password = password;
    }

    public UserDto(String token, String role, String email) {
        this.token = token;
        this.role = Role.valueOf(role);
        this.email = email;
    }

    public UserDto() {}

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public String getBetaId() {
		return betaId;
	}

	public void setBetaId(String betaId) {
		this.betaId = betaId;
	}
    
}
