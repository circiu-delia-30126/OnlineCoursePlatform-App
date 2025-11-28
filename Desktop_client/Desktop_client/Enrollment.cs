using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Desktop_client
{
    internal class Enrollment
    {
        public int Id { get; set; }
        public Course Course { get; set; }
        public string StudentName { get; set; }
        public string Email { get; set; }
    }
}
