package com.onlinecourseplatform.online_course_platform.controller;

import com.onlinecourseplatform.online_course_platform.db.Teacher;
import com.onlinecourseplatform.online_course_platform.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/teacher")
@CrossOrigin(origins = "*")
public class TeacherController {

    @Autowired
    private TeacherRepository repo;

    @PostMapping
    public ResponseEntity<?> createTeacher(@RequestBody Teacher t) {
        try {
            Teacher saved = repo.save(t);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping
    public List<Teacher> getAll() {
        return repo.findAll();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTeacher(@PathVariable Integer id, @RequestBody Teacher t) {
        try {
            Teacher existing = repo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + id));
            
            if (t.getName() != null && !t.getName().trim().isEmpty()) {
                existing.setName(t.getName());
            }
            if (t.getEmail() != null && !t.getEmail().trim().isEmpty()) {
                existing.setEmail(t.getEmail());
            }
            
            Teacher updated = repo.save(existing);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTeacher(@PathVariable Integer id) {
        try {
            if (!repo.existsById(id)) {
                return ResponseEntity.badRequest().body("Teacher not found with id: " + id);
            }
            repo.deleteById(id);
            return ResponseEntity.ok("Teacher deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}