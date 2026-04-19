using System.Dynamic;
using HealthcareSystem.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
namespace HealthcareSystem.Infrastructure.Persistence;
public class AppDbContext:IdentityDbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options):base(options){}
    public DbSet<Patient> Patients=>Set<Patient>();
    public DbSet<Doctor> Doctors=>Set<Doctor>();
    public DbSet<Appointment> Appointments=>Set<Appointment>();
protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<Appointment>()
            .HasOne(a=>a.Patient).WithMany(p=>p.Appointments)
            .HasForeignKey(a=>a.PatientId).OnDelete(DeleteBehavior.Restrict);
        builder.Entity<Appointment>()
            .HasOne(a=>a.Doctor).WithMany(d=>d.Appointments)
            .HasForeignKey(a=>a.DoctorId).OnDelete(DeleteBehavior.Restrict);
    }

}