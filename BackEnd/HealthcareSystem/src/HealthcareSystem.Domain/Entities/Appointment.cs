namespace HealthcareSystem.Domain.Entities
{
    public class Appointment
    {
        public Guid Id{get;set;}=Guid.NewGuid();
        public Guid PatientId{get;set;}
        public Guid DoctorId{get;set;}
        public DateTime SlotStart{get;set;}
        public DateTime SlotEnd{get;set;}
        public string Reason{get;set;}=string.Empty;
        public AppointmentStatus Status{get;set;}=AppointmentStatus.Scheduled;
        public string? VideoRoomUrl{get;set;}
        public DateTime CreatedAt{get;set;}=DateTime.UtcNow;
        public Patient Patient{get;set;}=null!;
        public Doctor Doctor{get;set;}=null!;
    }
}