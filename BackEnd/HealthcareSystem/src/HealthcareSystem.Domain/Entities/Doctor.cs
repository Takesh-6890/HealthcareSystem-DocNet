namespace HealthcaerSystem.Domain.Entities;
public class Doctor
{
    public Guid Id{get;set;}=Guid.NewGuid();
    public string UserId{get;set;}=string.Empty;
    public string FirstName{get;set;}=string.Empty;
    public string LastName{get;set;}=string.Empty;
    public string Specialization{get;set;}=string.Empty;
    public ICollection<Appointment> Appointments{get;set;}=new List<Appointment>();
}