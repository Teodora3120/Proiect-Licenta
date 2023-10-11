import axios from "./index";

class WorkerApi {
    static async CreateService(data) {
        return await axios.post('/worker/create-service', data)
    }

    static async EditService(data) {
        return await axios.put('/worker/edit-service', data)
    }

    static async DeleteService(serviceId) {
        return await axios.delete(`/worker/delete-service/${serviceId}`)
    }

    static async GetServices(userId) {
        return await axios.get(`/worker/get-services/${userId}`)
    }

    static async UpdateUserAccountDetails(userId, data) {
        return await axios.put(`/worker/update-account-details/${userId}`, data)
    }

    static async SaveDomain(userId, data) {
        return await axios.put(`/worker/save-domain/${userId}`, data)
    }

    static async DeleteAccount(userId) {
        return await axios.delete(`/worker/delete-account/${userId}`)
    }
}

export default WorkerApi