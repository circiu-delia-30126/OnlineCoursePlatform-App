package com.onlinecourseplatform.online_course_platform.repository;

import com.onlinecourseplatform.online_course_platform.db.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Integer> {
}
