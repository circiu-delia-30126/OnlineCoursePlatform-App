using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace Desktop_client
{
    internal class CourseService  
    {
        private static readonly HttpClient client = new HttpClient();

        public CourseService()
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

        public async Task<List<Course>> GetCourseList()
        {
            List<Course> courseList = null;

            try
            {
                HttpResponseMessage response = await client.GetAsync("course");

                if (response.IsSuccessStatusCode)
                {
                    string resultString = await response.Content.ReadAsStringAsync();
                    Console.WriteLine("getCourses received: " + resultString);

                    var options = new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    };

                    courseList = JsonSerializer.Deserialize<List<Course>>(resultString, options);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception: {ex.Message}");
            }

            return courseList;
        }
    }
}