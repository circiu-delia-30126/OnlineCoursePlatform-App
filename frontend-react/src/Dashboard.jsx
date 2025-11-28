import { useState, useEffect } from 'react';
import { teacherService, courseService, enrollmentService } from './services/api';
import Chatbot from './Chatbot';
import './Dashboard.css';

function Dashboard({ user, onLogout }) {
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [activeTab, setActiveTab] = useState('teachers');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [newTeacher, setNewTeacher] = useState({ name: '', email: '' });
  const [newCourse, setNewCourse] = useState({ title: '', categoryId: '', teacherId: '' });
  const [editingCourse, setEditingCourse] = useState(null);
  const [newEnrollment, setNewEnrollment] = useState({ studentName: '', email: '', courseId: '' });
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [teachersRes, coursesRes, enrollmentsRes] = await Promise.all([
        teacherService.getAll(),
        courseService.getAll(),
        enrollmentService.getAll()
      ]);

      setTeachers(teachersRes.data);
      setCourses(coursesRes.data);
      setEnrollments(enrollmentsRes.data);
    } catch (err) {
      setStatus({ type: 'error', message: extractError(err) });
    }
  };

  const extractError = (err) => {
    if (err?.response?.data) {
      return typeof err.response.data === 'string'
        ? err.response.data
        : err.response.data.message || 'Eroare necunoscută';
    }
    return err?.message || 'Ceva nu a mers bine';
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    if (!newTeacher.name || !newTeacher.email) {
      setStatus({ type: 'error', message: 'Completează nume și email pentru profesor.' });
      return;
    }
    try {
      await teacherService.create(newTeacher);
      setNewTeacher({ name: '', email: '' });
      setStatus({ type: 'success', message: 'Profesor adăugat cu succes.' });
      fetchAllData();
    } catch (err) {
      setStatus({ type: 'error', message: extractError(err) });
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!newCourse.title || !newCourse.teacherId) {
      setStatus({ type: 'error', message: 'Titlul și profesorul sunt obligatorii.' });
      return;
    }
    try {
      await courseService.create({
        title: newCourse.title,
        categoryId: newCourse.categoryId ? Number(newCourse.categoryId) : null,
        teacherId: Number(newCourse.teacherId)
      });
      setNewCourse({ title: '', categoryId: '', teacherId: '' });
      setStatus({ type: 'success', message: 'Curs adăugat cu succes.' });
      fetchAllData();
    } catch (err) {
      setStatus({ type: 'error', message: extractError(err) });
    }
  };

  const handleStartEditCourse = (course) => {
    setEditingCourse({
      id: course.id,
      title: course.title || '',
      categoryId: course.categoryId || '',
      teacherId: course.teacher?.id || ''
    });
    setActiveTab('courses');
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    if (!editingCourse?.id) {
      return;
    }
    try {
      await courseService.update(editingCourse.id, {
        title: editingCourse.title,
        categoryId: editingCourse.categoryId !== '' ? Number(editingCourse.categoryId) : null,
        teacherId: editingCourse.teacherId ? Number(editingCourse.teacherId) : null
      });
      setEditingCourse(null);
      setStatus({ type: 'success', message: 'Curs actualizat cu succes.' });
      fetchAllData();
    } catch (err) {
      setStatus({ type: 'error', message: extractError(err) });
    }
  };

  const handleAddEnrollment = async (e) => {
    e.preventDefault();
    if (!newEnrollment.studentName || !newEnrollment.email || !newEnrollment.courseId) {
      setStatus({ type: 'error', message: 'Completează numele, emailul și cursul.' });
      return;
    }
    try {
      await enrollmentService.create({
        studentName: newEnrollment.studentName,
        email: newEnrollment.email,
        courseId: Number(newEnrollment.courseId)
      });
      setNewEnrollment({ studentName: '', email: '', courseId: '' });
      setStatus({ type: 'success', message: 'Înscriere adăugată.' });
      fetchAllData();
    } catch (err) {
      setStatus({ type: 'error', message: extractError(err) });
    }
  };

  const handleLogoutClick = () => {
    setShowProfile(false);
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <h1>🎓 Online Course Platform</h1>
        <div className="nav-right">
          <div className="profile-wrapper">
            <button
              className="profile-btn"
              onClick={() => setShowProfile((prev) => !prev)}
            >
              👤 Profilul meu
            </button>
            {showProfile && (
              <div className="profile-card">
                <p><strong>Utilizator:</strong> {user?.username}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Rol:</strong> {user?.role}</p>
              </div>
            )}
          </div>
          <button onClick={handleLogoutClick} className="logout-btn">🚪 Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        {status.message && (
          <div className={`status-banner ${status.type}`}>
            {status.message}
          </div>
        )}

        <div className="tabs">
          <button
            className={activeTab === 'teachers' ? 'active' : ''}
            onClick={() => setActiveTab('teachers')}
          >
            👨‍🏫 Profesori ({teachers.length})
          </button>
          <button
            className={activeTab === 'courses' ? 'active' : ''}
            onClick={() => setActiveTab('courses')}
          >
            📚 Cursuri ({courses.length})
          </button>
          <button
            className={activeTab === 'enrollments' ? 'active' : ''}
            onClick={() => setActiveTab('enrollments')}
          >
            ✍️ Înscrieri ({enrollments.length})
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'teachers' && (
            <div className="management-section">
              <div className="form-card">
                <h3>Adaugă profesor</h3>
                <form onSubmit={handleAddTeacher}>
                  <div className="form-row">
                    <input
                      type="text"
                      placeholder="Nume"
                      value={newTeacher.name}
                      onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={newTeacher.email}
                      onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="primary-btn">➕ Adaugă profesor</button>
                </form>
              </div>

              <h2>Lista Profesori</h2>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nume</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map(teacher => (
                    <tr key={teacher.id}>
                      <td>{teacher.id}</td>
                      <td>{teacher.name}</td>
                      <td>{teacher.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="management-section">
              <div className="form-grid">
                <div className="form-card">
                  <h3>Adaugă curs</h3>
                  <form onSubmit={handleAddCourse}>
                    <input
                      type="text"
                      placeholder="Titlu curs"
                      value={newCourse.title}
                      onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                    />
                    <input
                      type="number"
                      placeholder="Categorie (ID opțional)"
                      value={newCourse.categoryId}
                      onChange={(e) => setNewCourse({ ...newCourse, categoryId: e.target.value })}
                    />
                    <select
                      value={newCourse.teacherId}
                      onChange={(e) => setNewCourse({ ...newCourse, teacherId: e.target.value })}
                    >
                      <option value="">Selectează profesor</option>
                      {teachers.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.name}
                        </option>
                      ))}
                    </select>
                    <button type="submit" className="primary-btn">➕ Adaugă curs</button>
                  </form>
                </div>

                {editingCourse && (
                  <div className="form-card accent">
                    <div className="form-card-header">
                      <h3>Actualizează curs #{editingCourse.id}</h3>
                      <button
                        type="button"
                        className="text-link"
                        onClick={() => setEditingCourse(null)}
                      >
                        Anulează
                      </button>
                    </div>
                    <form onSubmit={handleUpdateCourse}>
                      <input
                        type="text"
                        placeholder="Titlu curs"
                        value={editingCourse.title}
                        onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                      />
                      <input
                        type="number"
                        placeholder="Categorie (ID)"
                        value={editingCourse.categoryId}
                        onChange={(e) => setEditingCourse({ ...editingCourse, categoryId: e.target.value })}
                      />
                      <select
                        value={editingCourse.teacherId}
                        onChange={(e) => setEditingCourse({ ...editingCourse, teacherId: e.target.value })}
                      >
                        <option value="">Selectează profesor</option>
                        {teachers.map((teacher) => (
                          <option key={teacher.id} value={teacher.id}>
                            {teacher.name}
                          </option>
                        ))}
                      </select>
                      <button type="submit" className="secondary-btn">💾 Salvează cursul</button>
                    </form>
                  </div>
                )}
              </div>

              <h2>Lista Cursuri</h2>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Titlu</th>
                    <th>Categorie</th>
                    <th>Profesor</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map(course => (
                    <tr key={course.id}>
                      <td>{course.id}</td>
                      <td>{course.title}</td>
                      <td>{course.categoryId || 'N/A'}</td>
                      <td>{course.teacher?.name || 'N/A'}</td>
                      <td>
                        <button
                          className="text-link"
                          onClick={() => handleStartEditCourse(course)}
                        >
                          ✏️ Editează
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'enrollments' && (
            <div className="management-section">
              <div className="form-card">
                <h3>Adaugă înscriere</h3>
                <form onSubmit={handleAddEnrollment}>
                  <input
                    type="text"
                    placeholder="Nume student"
                    value={newEnrollment.studentName}
                    onChange={(e) => setNewEnrollment({ ...newEnrollment, studentName: e.target.value })}
                  />
                  <input
                    type="email"
                    placeholder="Email student"
                    value={newEnrollment.email}
                    onChange={(e) => setNewEnrollment({ ...newEnrollment, email: e.target.value })}
                  />
                  <select
                    value={newEnrollment.courseId}
                    onChange={(e) => setNewEnrollment({ ...newEnrollment, courseId: e.target.value })}
                  >
                    <option value="">Selectează curs</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                  <button type="submit" className="primary-btn">➕ Adaugă înscriere</button>
                </form>
              </div>

              <h2>Lista Înscrieri</h2>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Student</th>
                    <th>Email</th>
                    <th>Curs</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map(enrollment => (
                    <tr key={enrollment.id}>
                      <td>{enrollment.id}</td>
                      <td>{enrollment.studentName}</td>
                      <td>{enrollment.email}</td>
                      <td>{enrollment.course?.title || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Chatbot
        teachers={teachers}
        courses={courses}
        enrollments={enrollments}
      />
    </div>
  );
}

export default Dashboard;