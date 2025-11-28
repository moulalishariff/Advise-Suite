package com.advice.suite.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.advice.suite.dto.UserDto;
import com.advice.suite.enums.Role;
import com.advice.suite.entity.User;
import com.advice.suite.repository.UserRepository;
import com.advice.suite.util.JwtUtil;

//@Service
//public class AuthService {
//
//    @Autowired private UserRepository userRepo;
//    @Autowired private PasswordEncoder passwordEncoder;
//    @Autowired private JwtUtil jwtUtil;
//
//    public void register(UserDto userDto) {
//        if (userRepo.existsByEmail(userDto.getEmail())) {
//            throw new RuntimeException("Email already exists");
//        }
//
//        String namePart = userDto.getName().replaceAll("\\s+", "").toUpperCase();
//        namePart = namePart.length() >= 4 ? namePart.substring(0, 4) : String.format("%-4s", namePart).replace(' ', 'X');
//        String phonePart = userDto.getPhone().substring(userDto.getPhone().length() - 4);
//        String betaId = namePart + phonePart;
//
//        User user = new User();
//        user.setName(userDto.getName());
//        user.setEmail(userDto.getEmail());
//        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
//        user.setRole(userDto.getRole() != null ? userDto.getRole() : Role.CLIENT);
////        user.setRole(userDto.getRole());
//        user.setPhone(userDto.getPhone());
//        user.setBetaId(betaId);
//
//        userRepo.save(user);
//    }
//    
//    public UserDto login(UserDto userDto) {
//        User user = userRepo.findByBetaId(userDto.getBetaId())
//                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
//
//        if (!passwordEncoder.matches(userDto.getPassword(), user.getPassword())) {
//            throw new BadCredentialsException("Invalid password");
//        }
//
//        String token = jwtUtil.generateToken(user);
//
//        UserDto responseDto = new UserDto();
//        responseDto.setToken(token);
//        responseDto.setBetaId(user.getBetaId());
//        responseDto.setEmail(user.getEmail());
//        responseDto.setRole(user.getRole());
//        responseDto.setName(user.getName());
//        responseDto.setPhone(user.getPhone());
//
//        return responseDto;
//    }
//    
//    public Optional<User> getUserByBetaId(String betaId) {
//        return userRepo.findByBetaId(betaId);
//    }
//    public void updatePassword(User user, String newPassword) {
//        String encodedPassword = passwordEncoder.encode(newPassword); // assuming you autowired PasswordEncoder
//        user.setPassword(encodedPassword);
//        userRepo.save(user);
//    }
//
//}

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public void register(UserDto userDto) {
        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        String namePart = userDto.getName().replaceAll("\\s+", "").toUpperCase();
        namePart = namePart.length() >= 4 ? namePart.substring(0, 4) : String.format("%-4s", namePart).replace(' ', 'X');
        String phonePart = userDto.getPhone().substring(userDto.getPhone().length() - 4);
        String betaId = namePart + phonePart;

        User user = new User();
        user.setName(userDto.getName());
        user.setEmail(userDto.getEmail());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setRole(userDto.getRole() != null ? userDto.getRole() : Role.CLIENT);
        user.setPhone(userDto.getPhone());
        user.setBetaId(betaId);

        userRepository.save(user);
    }

    public UserDto login(UserDto userDto) {
        User user = userRepository.findByBetaId(userDto.getBetaId())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!passwordEncoder.matches(userDto.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid password");
        }

        String token = jwtUtil.generateToken(user);

        UserDto responseDto = new UserDto();
        responseDto.setToken(token);
        responseDto.setBetaId(user.getBetaId());
        responseDto.setEmail(user.getEmail());
        responseDto.setRole(user.getRole());
        responseDto.setName(user.getName());
        responseDto.setPhone(user.getPhone());

        return responseDto;
    }

    public Optional<User> getUserByBetaId(String betaId) {
        return userRepository.findByBetaId(betaId);
    }

    public void updatePassword(User user, String newPassword) {
        String encodedPassword = passwordEncoder.encode(newPassword);
        user.setPassword(encodedPassword);
        userRepository.save(user);
    }
}
