import axios from './index'

class AppointmentApi {
  static async CreateAppointment(patientId, doctorId,data) {
    console.log(patientId,doctorId, data)
    return await axios.post(
      `/Appointments/${patientId}_${doctorId}/create_appointment`,
      data,
    )
  }
  static async GetDoctorAppointments(doctorId) {
    return await axios.get(`/Appointments/doctors/${doctorId}`)
  }
  static async GetPatientAppointments(patientId) {
    return await axios.get(`/Appointments/patients/${patientId}`)
  }
}

export default AppointmentApi
