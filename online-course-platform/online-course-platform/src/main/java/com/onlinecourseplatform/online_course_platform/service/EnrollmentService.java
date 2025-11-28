package com.onlinecourseplatform.online_course_platform.service;

import com.onlinecourseplatform.online_course_platform.db.Enrollment;
import com.onlinecourseplatform.online_course_platform.repository.EnrollmentRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class EnrollmentService {
    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Transactional
    public Enrollment createEnrollment(Enrollment e) {
        return enrollmentRepository.saveAndFlush(e);
    }

    public List<Enrollment> findAllEnrollments() {
        return enrollmentRepository.findAll();
    }
}
