package com.onlinecourseplatform.online_course_platform.controller;

import com.onlinecourseplatform.online_course_platform.db.User;
import com.onlinecourseplatform.online_course_platform.db.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepo;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            String email = credentials.get("email");
            String password = credentials.get("password");

            if (email == null || password == null) {
                return ResponseEntity.badRequest().body("Email și parola sunt obligatorii!");
            }

            Optional<User> userOpt = userRepo.findByEmail(email);

            if (userOpt.isEmpty()) {
                return ResponseEntity.status(401).body("Email sau parolă incorectă!");
            }

            User user = userOpt.get();

            if (!user.getPassword().equals(password)) {
                return ResponseEntity.status(401).body("Email sau parolă incorectă!");
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("user", Map.of(
                    "id", user.getId(),
                    "username", user.getUsername(),
                    "email", user.getEmail(),
                    "role", user.getRole()
            ));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Eroare server: " + e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User newUser) {
        try {

            if (userRepo.findByEmail(newUser.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("Email-ul este deja folosit!");
            }

            if (userRepo.findByUsername(newUser.getUsername()).isPresent()) {
                return ResponseEntity.badRequest().body("Username-ul este deja folosit!");
            }

            // Setează role default
            if (newUser.getRole() == null || newUser.getRole().isEmpty()) {
                newUser.setRole("USER");
            }

            User savedUser = userRepo.save(newUser);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Cont creat cu succes!");
            response.put("user", Map.of(
                    "id", savedUser.getId(),
                    "username", savedUser.getUsername(),
                    "email", savedUser.getEmail(),
                    "role", savedUser.getRole()
            ));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Eroare: " + e.getMessage());
        }
    }
}