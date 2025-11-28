using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;  // ← IMPORTANT!
using System.Threading.Tasks;

namespace Desktop_client
{
    public class StatsService
    {
        private static readonly HttpClient client = new HttpClient();

        public StatsService()
        {
            CreateConnection();
        }

        private void CreateConnection()
        {
            client.BaseAddress = new Uri("http://localhost:8083/");
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(
                new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
        }

        public async Task<List<StudentPerTeacherDto>> GetStudentsPerTeacher()
        {
            List<StudentPerTeacherDto> stats = null;

            try
            {
                HttpResponseMessage response = await client.GetAsync("stats/getStudentsPerTeacher");

                if (response.IsSuccessStatusCode)
                {
                    string resultString = await response.Content.ReadAsStringAsync();
                    Console.WriteLine("GetStudentsPerTeacher received: " + resultString);

                    var options = new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    };

                    stats = JsonSerializer.Deserialize<List<StudentPerTeacherDto>>(resultString, options);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception: {ex.Message}");
            }

            return stats;
        }

        public async Task<List<CourseEnrollmentStatsDto>> GetCoursesWithEnrollmentStats()
        {
            List<CourseEnrollmentStatsDto> stats = null;

            try
            {
                HttpResponseMessage response = await client.GetAsync("stats/getCoursesWithEnrollmentStats");

                if (response.IsSuccessStatusCode)
                {
                    string resultString = await response.Content.ReadAsStringAsync();
                    Console.WriteLine("GetCoursesWithEnrollmentStats received: " + resultString);

                    var options = new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    };

                    stats = JsonSerializer.Deserialize<List<CourseEnrollmentStatsDto>>(resultString, options);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception: {ex.Message}");
            }

            return stats;
        }
    }
}