import axios from './index'

class SpecialitiesApi {
  static async GetSpecialities() {
    return await axios.get('/Specialities')
  }
}

export default SpecialitiesApi