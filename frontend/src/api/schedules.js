import axios from './index'

class ScheduleApi {
  static async SendSchedule(data) {
    return await axios.put(`/ScheduleIntervals`, data)
  }
  static async GetSchedule(userId) {
    return await axios.get(`/ScheduleIntervals/${userId}`)
  }
}

export default ScheduleApi