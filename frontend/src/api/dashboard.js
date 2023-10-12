import axios from "./index";

class DashboardApi {

    static async GetAllServices() {
        return await axios.get(`/dashboard/get-all-services`)
    }

}

export default DashboardApi