import axios from "./index";

class ServiceApi {

    static async GetAllServices() {
        return await axios.get(`/service/get-all-services`)
    }

    static async CreateService(data) {
        return await axios.post('/service/create-service', data)
    }

    static async EditService(data) {
        return await axios.put('/service/edit-service', data)
    }

    static async DeleteService(serviceId) {
        return await axios.delete(`/service/delete-service/${serviceId}`)
    }

    static async GetServices(userId) {
        return await axios.get(`/service/get-services/${userId}`)
    }

    static async DeleteAllServices(userId) {
        return await axios.delete(`/service/delete-all-services/${userId}`)
    }

}

export default ServiceApi