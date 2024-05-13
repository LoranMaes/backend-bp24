using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using VoorbeeldBachelorproef.Models;

namespace VoorbeeldBachelorproef.Data
{
    public class VoorbeeldBachelorproefContext : DbContext
    {
        public VoorbeeldBachelorproefContext (DbContextOptions<VoorbeeldBachelorproefContext> options)
            : base(options)
        {
        }

        public DbSet<VoorbeeldBachelorproef.Models.TodoItem> TodoItem { get; set; } = default!;
    }
}
