import axios from "./index";

class WorkerApi {
    static async CreateService(data) {
        return await axios.post('/worker/create-service', data)
    }

    static async EditService(data) {
        return await axios.put('/worker/edit-service', data)
    }

    static async GetServices(userId) {
        return await axios.get(`/worker/get-services/${userId}`,)
    }
}

export default WorkerApi