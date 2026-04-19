namespace HealthcareSystem.Domain.Entities;
public class Patient
{
    public Guid Id{get;set;}=Guid.NewGuid();
    public string UserId{get;set;}=string.Empty;
    public string FirstName{get;set;}=string.Empty;
    public string LastName{get;set;}=string.Empty;
    public DateTime DateOfBirth{get;set;}
    public string Phone{get;set;}=string.Empty;
    public string? FhirPatientId{get;set;}
    public ICollection<Appointment> Appointments{get;set;}=new List<Appointment>();
}