import axios from "./index";

class WorkerApi {

    static async UpdateUserAccountDetails(userId, data) {
        return await axios.put(`/worker/update-account-details/${userId}`, data)
    }

    static async SaveDomain(userId, data) {
        return await axios.put(`/worker/save-domain/${userId}`, data)
    }

    static async DeleteAccount(userId) {
        return await axios.delete(`/worker/delete-account/${userId}`)
    }

    static async SendSchedule(userId, data) {
        return await axios.put(`/worker/send-schedule/${userId}`, data)
    }

    static async GetScheduleForADay(data, userId) {
        return await axios.get(`/worker/get-schedule-for-a-day/${userId}`, { params: data })
    }

    static async GetAllWorkers() {
        return await axios.get(`/worker/get-all-workers`)
    }
}

export default WorkerApi