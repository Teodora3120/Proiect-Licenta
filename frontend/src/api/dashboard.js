import axios from "./index";

class DashboardApi {

    static async GetAllServices() {
        return await axios.get(`/dashboard/get-all-services`)
    }

    static async GetAllWorkers() {
        return await axios.get(`/dashboard/get-all-workers`)
    }
}

export default DashboardApi