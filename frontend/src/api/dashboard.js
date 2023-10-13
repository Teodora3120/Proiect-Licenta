import axios from "./index";

class DashboardApi {

    static async GetAllServices() {
        return await axios.get(`/dashboard/get-all-services`)
    }

    static async GetAllWorkers() {
        return await axios.get(`/dashboard/get-all-workers`)
    }

    static async GetScheduleForADay(data, userId) {
        return await axios.get(`/dashboard/get-schedule-for-a-day/${userId}`, { params: data })
    }
}

export default DashboardApi