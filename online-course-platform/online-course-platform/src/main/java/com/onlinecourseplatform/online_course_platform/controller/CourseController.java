package com.onlinecourseplatform.online_course_platform.controller;

import com.onlinecourseplatform.online_course_platform.db.*;
import com.onlinecourseplatform.online_course_platform.repository.CourseRepository;
import com.onlinecourseplatform.online_course_platform.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/course")
@CrossOrigin(origins = "*")
public class CourseController {

    @Autowired
    private CourseRepository courseRepo;

    @Autowired
    private TeacherRepository teacherRepo;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, Object> request) {
        try {
            Integer teacherId = (Integer) request.get("teacherId");
            String title = (String) request.get("title");
            Integer categoryId = (Integer) request.get("categoryId");

            if (teacherId == null || title == null || title.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("teacherId and title are required");
            }

            Teacher teacher = teacherRepo.findById(teacherId)
                    .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + teacherId));

            Course course = new Course();
            course.setTitle(title);
            course.setCategoryId(categoryId);
            course.setTeacher(teacher);

            Course saved = courseRepo.save(course);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping
    public List<Course> all() {
        return courseRepo.findAll();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody Map<String, Object> request) {
        try {
            Course course = courseRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));

            String title = (String) request.get("title");
            Integer categoryId = request.get("categoryId") != null ? 
                    (Integer) request.get("categoryId") : null;
            Integer teacherId = request.get("teacherId") != null ? 
                    (Integer) request.get("teacherId") : null;

            if (title != null && !title.trim().isEmpty()) {
                course.setTitle(title);
            }

            if (categoryId != null) {
                course.setCategoryId(categoryId);
            }

            if (teacherId != null) {
                Teacher teacher = teacherRepo.findById(teacherId)
                        .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + teacherId));
                course.setTeacher(teacher);
            }

            Course updated = courseRepo.save(course);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        try {
            if (!courseRepo.existsById(id)) {
                return ResponseEntity.badRequest().body("Course not found with id: " + id);
            }
            courseRepo.deleteById(id);
            return ResponseEntity.ok("Course deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}