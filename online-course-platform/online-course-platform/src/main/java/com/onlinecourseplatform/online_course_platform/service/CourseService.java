package com.onlinecourseplatform.online_course_platform.service;

import com.onlinecourseplatform.online_course_platform.db.Course;
import com.onlinecourseplatform.online_course_platform.repository.CourseRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CourseService {
    @Autowired
    private CourseRepository courseRepository;

    @Transactional
    public Course createCourse(Course c) {
        return courseRepository.saveAndFlush(c);//era doar save da nu merge??
    }

    public List<Course> findAllCourses(){
        return courseRepository.findAll();
    }
}
