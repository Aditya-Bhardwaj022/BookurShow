package com.aditya.bms.controller;

import com.aditya.bms.dto.LoginResponseDTO;
import com.aditya.bms.model.User;
import com.aditya.bms.repository.UserRepository;
import com.aditya.bms.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public String register(@RequestBody User user) {

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        userRepository.save(user);

        return "User registered successfully";
    }


    @PostMapping("/login")
    public LoginResponseDTO login(@RequestBody User request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new RuntimeException("Invalid credentials");
        }

        java.util.Map<String, Object> claims = new java.util.HashMap<>();
        claims.put("role", user.getRole().name());

        String token = jwtService.generateToken(claims, user.getEmail());
        LoginResponseDTO.DataResponse data = new LoginResponseDTO.DataResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                List.of(user.getRole().name()),
                "Bearer"
        );
        return new LoginResponseDTO(
                "Success","User authenticated successfully",
                data
        );
    }
}
