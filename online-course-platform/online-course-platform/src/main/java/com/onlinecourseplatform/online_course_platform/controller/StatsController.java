package com.onlinecourseplatform.online_course_platform.controller;

import com.onlinecourseplatform.online_course_platform.repository.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/stats")
public class StatsController {

    @Autowired
    private EnrollmentRepository repo;

    @GetMapping("/getStudentsPerTeacher")
    public List<Map<String,Object>> getStudentsPerTeacher() {
        List<Object[]> data = repo.getStudentsPerTeacher();
        List<Map<String,Object>> result = new ArrayList<>();

        for (Object[] row : data) {
            Map<String,Object> m = new HashMap<>();
            m.put("teacherName", row[0]);
            m.put("studentCount", row[1]);
            result.add(m);
        }

        return result;
    }

    @GetMapping("/getCoursesWithEnrollmentStats")
    public List<Map<String,Object>> getCoursesStats() {
        List<Object[]> data = repo.getCoursesWithEnrollmentStats();
        List<Map<String,Object>> result = new ArrayList<>();

        for (Object[] row : data) {
            Map<String,Object> m = new HashMap<>();
            m.put("courseTitle", row[0]);
            m.put("totalEnrollments", row[1]);
            result.add(m);
        }

        return result;
    }
}
