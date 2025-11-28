package com.advice.suite.dto;

public class ForgotPasswordRequest {
    private String email;
    private String betaId;
    private String phone;
    private String newPassword;
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getBetaId() {
		return betaId;
	}
	public void setBetaId(String betaId) {
		this.betaId = betaId;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getNewPassword() {
		return newPassword;
	}
	public void setNewPassword(String newPassword) {
		this.newPassword = newPassword;
	}
}
