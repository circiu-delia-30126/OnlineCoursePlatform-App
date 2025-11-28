using System;
using System.Collections.Generic;
using System.Windows.Forms;

namespace Desktop_client
{
    public partial class Form1 : Form
    {
        private StatsService statsService;

        public Form1()
        {
            InitializeComponent();
            statsService = new StatsService();
        }

        // Button 1: Afișează studenți per profesor
        private async void button1_Click(object sender, EventArgs e)
        {
            try
            {
                // Afișează indicator de loading
                button1.Enabled = false;
                button1.Text = "Se încarcă...";

                // Obține datele
                List<StudentPerTeacherDto> stats = await statsService.GetStudentsPerTeacher();

                if (stats != null && stats.Count > 0)
                {
                    // Construiește mesajul
                    string message = "STUDENȚI PER PROFESOR\n\n";
                    message += new string('-', 40) + "\n\n";

                    foreach (var stat in stats)
                    {
                        message += $"Profesor: {stat.TeacherName}\n";
                        message += $"    Studenți: {stat.StudentCount}\n\n";
                    }

                    // Afișează într-un MessageBox
                    MessageBox.Show(message, "Statistici Studenți per Profesor",
                        MessageBoxButtons.OK, MessageBoxIcon.Information);
                }
                else
                {
                    MessageBox.Show("Nu s-au găsit date!", "Informație",
                        MessageBoxButtons.OK, MessageBoxIcon.Warning);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Eroare: {ex.Message}", "Eroare",
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            finally
            {
                // Resetează butonul
                button1.Enabled = true;
                button1.Text = "Afișează Studenți per Profesor";
            }
        }

        // Button 2: Afișează statistici înscrieri per curs
        private async void button2_Click(object sender, EventArgs e)
        {
            try
            {
                // Afișează indicator de loading
                button2.Enabled = false;
                button2.Text = "Se încarcă...";

                // Obține datele
                List<CourseEnrollmentStatsDto> stats = await statsService.GetCoursesWithEnrollmentStats();

                if (stats != null && stats.Count > 0)
                {
                    // Construiește mesajul
                    string message = "STATISTICI ÎNSCRIERI PER CURS\n\n";
                    message += new string('-', 40) + "\n\n";

                    foreach (var stat in stats)
                    {
                        message += $"Curs: {stat.CourseTitle}\n";
                        message += $"    Înscrieri: {stat.TotalEnrollments}\n\n";
                    }

                    // Afișează într-un MessageBox
                    MessageBox.Show(message, "Statistici Înscrieri",
                        MessageBoxButtons.OK, MessageBoxIcon.Information);
                }
                else
                {
                    MessageBox.Show("Nu s-au găsit date!", "Informație",
                        MessageBoxButtons.OK, MessageBoxIcon.Warning);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Eroare: {ex.Message}", "Eroare",
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            finally
            {
                // Resetează butonul
                button2.Enabled = true;
                button2.Text = "Afișează Statistici Înscrieri";
            }
        }
    }
}