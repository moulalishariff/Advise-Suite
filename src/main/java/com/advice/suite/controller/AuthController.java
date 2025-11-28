package com.advice.suite.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.advice.suite.dto.ForgotPasswordRequest;
import com.advice.suite.dto.UserDto;
import com.advice.suite.entity.User;
import com.advice.suite.repository.UserRepository;
import com.advice.suite.service.AuthService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired 
    private AuthService authService;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserDto userDto) {
        authService.register(userDto);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<UserDto> login(@RequestBody UserDto userDto) {
        return ResponseEntity.ok(authService.login(userDto));
    }
    
//    @GetMapping("/{betaId}")
//    public ResponseEntity<?> getUserByBetaId(@PathVariable("betaId") String betaId) {
//        Optional<User> user = authService.getUserByBetaId(betaId);
//
//        if (user.isPresent()) {
//            Map<String, String> response = new HashMap<>();
//            response.put("role", user.get().getRole().name());
//            return ResponseEntity.ok(response);
//        } else {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                .body("Client BetaId not found.");
//        }
//    }
//    @GetMapping("/{betaId}")
//    public ResponseEntity<?> getUserByBetaId(@PathVariable("betaId") String betaId) {
//        Optional<User> user = authService.getUserByBetaId(betaId);
//
//        if (user.isPresent()) {
//            // Get user details, including email
//            User userDetails = user.get();
//            Map<String, String> response = new HashMap<>();
//            response.put("role", userDetails.getRole().name());
//            response.put("email", userDetails.getEmail());  // Add email to the response
//            return ResponseEntity.ok(response);
//        } else {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                .body("Client BetaId not found.");
//        }
//    }
    @GetMapping("/{betaId}")
    public ResponseEntity<?> getUserByBetaId(@PathVariable("betaId") String betaId) {
        if (betaId == null || betaId.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Invalid BetaId.");
        }

        Optional<User> user = authService.getUserByBetaId(betaId);

        if (user.isPresent()) {
            User userDetails = user.get();
            Map<String, String> response = new HashMap<>();
            response.put("role", userDetails.getRole().name());
            response.put("email", userDetails.getEmail());  // Add email to the response
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Client BetaId not found.");
        }
    }
    
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        Optional<User> optionalUser = userRepository.findByEmailAndBetaIdAndPhone(
                request.getEmail(), request.getBetaId(), request.getPhone());

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Invalid email, beta ID, or phone number");
        }

        User user = optionalUser.get();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return ResponseEntity.ok("Password updated successfully.");
    }
}

