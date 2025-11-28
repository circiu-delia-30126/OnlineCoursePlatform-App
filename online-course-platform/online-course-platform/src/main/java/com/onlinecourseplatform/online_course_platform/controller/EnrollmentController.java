package com.onlinecourseplatform.online_course_platform.controller;

import com.onlinecourseplatform.online_course_platform.db.*;
import com.onlinecourseplatform.online_course_platform.repository.CourseRepository;
import com.onlinecourseplatform.online_course_platform.repository.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/enrollment")
@CrossOrigin(origins = "*")
public class EnrollmentController {

    @Autowired
    private EnrollmentRepository enrollmentRepo;

    @Autowired
    private CourseRepository courseRepo;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, Object> request) {
        try {
            Integer courseId = (Integer) request.get("courseId");
            String studentName = (String) request.get("studentName");
            String email = (String) request.get("email");

            if (courseId == null || studentName == null || email == null) {
                return ResponseEntity.badRequest().body("courseId, studentName and email are required");
            }

            Course course = courseRepo.findById(courseId)
                    .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));

            Enrollment enrollment = new Enrollment();
            enrollment.setCourse(course);
            enrollment.setStudentName(studentName);
            enrollment.setEmail(email);

            Enrollment saved = enrollmentRepo.save(enrollment);
            return ResponseEntity.ok(saved);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error: " + ex.getMessage());
        }
    }

    @GetMapping
    public List<Enrollment> all() {
        return enrollmentRepo.findAll();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody Map<String, Object> request) {
        try {
            Enrollment enrollment = enrollmentRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Enrollment not found with id: " + id));

            Integer courseId = request.get("courseId") != null ? (Integer) request.get("courseId") : null;
            String studentName = (String) request.get("studentName");
            String email = (String) request.get("email");

            if (courseId != null) {
                Course course = courseRepo.findById(courseId)
                        .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
                enrollment.setCourse(course);
            }
            if (studentName != null && !studentName.trim().isEmpty()) {
                enrollment.setStudentName(studentName);
            }
            if (email != null && !email.trim().isEmpty()) {
                enrollment.setEmail(email);
            }

            Enrollment updated = enrollmentRepo.save(enrollment);
            return ResponseEntity.ok(updated);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error: " + ex.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        try {
            if (!enrollmentRepo.existsById(id)) {
                return ResponseEntity.badRequest().body("Enrollment not found with id: " + id);
            }
            enrollmentRepo.deleteById(id);
            return ResponseEntity.ok("Enrollment deleted successfully");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error: " + ex.getMessage());
        }
    }
}
