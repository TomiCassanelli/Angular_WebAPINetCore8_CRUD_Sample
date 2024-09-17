using EmployeeCrudApi.Data;
using EmployeeCrudApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.RegularExpressions;

namespace EmployeeCrudApi.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private ApplicationDbContext _context;

        public EmployeeController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<List<Employee>> GetAll()
        {
            return await _context.Employees.ToListAsync();
        }

        [HttpGet]
        public async Task<Employee> GetById(int id)
        {
            return await _context.Employees.FindAsync(id);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Employee employee)
        {
            // Verifica la longitud Maxima del nombre
            if (employee.Name.Length > 100)
            {
                return BadRequest(new { status = 400, error = "Bad Request", message = "El nombre no puede tener más de 100 caracteres." });
            }

            // Verifica la longitud Minima del nombre
            if (employee.Name.Length < 2)
            {
                return BadRequest(new { status = 400, error = "Bad Request", message = "El nombre no puede tener menos de 2 caracteres." });
            }

            // Verifica que el nombre esté repetido
            if (_context.Employees.Any(e => e.Name == employee.Name))
            {
                return BadRequest(new { status = 400, error = "Bad Request", message = "El nombre  ya existe." });
            }

            // Verifica que el nombre no tenga numeros
            if (Regex.IsMatch(employee.Name, @"\d"))
            {
                return BadRequest(new { status = 400, error = "Bad Request", message = "El nombre contiene caracteres no permitidos." });
            }

            // Verifica si se ingresen mas de 3 letras repetidas seguidas
            if (Regex.IsMatch(employee.Name, @"(\w)\1{2,}"))
            {
                return BadRequest(new { status = 400, error = "Bad Request", message = "El nombre contiene caracteres repetidos de forma excesiva." });
            }

            employee.CreatedDate = DateTime.Now;
            await _context.Employees.AddAsync(employee);
            await _context.SaveChangesAsync();
    
        return Ok(employee);

        }

        [HttpPut]
        public async Task Update([FromBody] Employee employee)
        {
            Employee employeeToUpdate = await _context.Employees.FindAsync(employee.Id);
            employeeToUpdate.Name = employee.Name;
            await _context.SaveChangesAsync();
        }

        [HttpDelete]
        public async Task Delete(int id)
        {
            var employeeToDelete = await _context.Employees.FindAsync(id);
            _context.Remove(employeeToDelete);
            await _context.SaveChangesAsync();
        }
    }
}
