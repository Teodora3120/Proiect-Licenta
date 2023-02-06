import axios from './index'

class SurveyApi {
  static async GetQuestions(patientId) {
    return await axios.get(`/SurveyQuestions/${patientId}`)
  }
  static async SendSurvey(data) {
    return await axios.put(`/SurveyQuestions`, data)
  }
}

export default SurveyApi