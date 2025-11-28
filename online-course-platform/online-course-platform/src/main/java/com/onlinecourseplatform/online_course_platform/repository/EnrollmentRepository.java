package com.onlinecourseplatform.online_course_platform.repository;

import com.onlinecourseplatform.online_course_platform.db.Enrollment;
import org.springframework.data.jpa.repository.*;
import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Integer> {

    @Query("SELECT t.name AS teacherName, COUNT(e.id) AS studentCount " +
            "FROM Teacher t " +
            "JOIN Course c ON c.teacher.id = t.id " +
            "LEFT JOIN Enrollment e ON e.course.id = c.id " +
            "GROUP BY t.id, t.name")
    List<Object[]> getStudentsPerTeacher();

    @Query("SELECT c.title AS courseTitle, COUNT(e.id) AS totalEnrollments " +
            "FROM Course c " +
            "LEFT JOIN Enrollment e ON e.course.id = c.id " +
            "GROUP BY c.id, c.title")
    List<Object[]> getCoursesWithEnrollmentStats();
}