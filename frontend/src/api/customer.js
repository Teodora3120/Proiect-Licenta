import axios from "./index";

class CustomerApi {

    static async UpdateUserAccountDetails(userId, data) {
        return await axios.put(`/customer/update-account-details/${userId}`, data)
    }

    static async DeleteAccount(userId) {
        return await axios.delete(`/customer/delete-account/${userId}`)
    }

    static async GetAllCustomers() {
        return await axios.get(`/customer/get-all-customers`)
    }

    static async GetUserById(userId) {
        return await axios.get(`/customer/get-customer-by-id/${userId}`)
    }
}

export default CustomerApi