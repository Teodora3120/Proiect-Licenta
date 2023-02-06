import axios from './index'

class AuthApi {
  static async RegisterPatient(data) {
    return await axios.post('/Patients', data)
  }

  static async RegisterDoctor(data) {
    return await axios.post('/Doctors/speciality', data)
  }

  static async Login(data) {
    return await axios.post('/Logins', data)
  }
}

export default AuthApi
