import axios from './index'

class PrescriptionApi {
  static async CreatePrescription(appointmentId, data) {
    return await axios.post(`/Prescriptions/${appointmentId}`, data)
  }
  static async getPrescriptionByAppointmentId(appointmentId) {
    return await axios.get(`/Prescriptions/${appointmentId}`)
  }
}

export default PrescriptionApi