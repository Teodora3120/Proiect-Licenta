import axios from "./index";

class CustomerApi {

    static async UpdateUserAccountDetails(userId, data) {
        return await axios.put(`/customer/update-account-details/${userId}`, data)
    }

    static async DeleteAccount(userId) {
        return await axios.delete(`/customer/delete-account/${userId}`)
    }

}

export default CustomerApi