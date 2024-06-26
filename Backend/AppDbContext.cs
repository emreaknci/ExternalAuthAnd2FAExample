using ExternalAuthAnd2FAExample.Models;
using Microsoft.EntityFrameworkCore;

namespace ExternalAuthAnd2FAExample;

public class AppDBContext : DbContext
{
    public AppDBContext(DbContextOptions<AppDBContext> options) : base(options)
    {
    }

    public virtual DbSet<AppUser> Users { get; set; }
}


