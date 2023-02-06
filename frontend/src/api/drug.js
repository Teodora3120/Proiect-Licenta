import axios from './index'

class DrugApi {
  static async GetDrugs() {
    return await axios.get('/Drugs')
  }
  static async GetDrugsByDoctorId(doctorId) {
    return await axios.get(`/Drugs/${doctorId}`)
  }
  static async DeleteDrug(drugId){
    return await axios.delete(`/Drugs/${drugId}`)
  }
  static async AddDrug(doctorId, data){
    return await axios.post(`/Drugs/${doctorId}`, data)
  }
}

export default DrugApi