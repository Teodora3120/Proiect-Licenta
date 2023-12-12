import axios from "./index";

class OrderApi {

    static async CreateOrder(data) {
        return await axios.post(`/order/create-order`, data)
    }

    static async GetOrders(userId) {
        return await axios.get(`/order/get-orders/${userId}`)
    }

    static async UpdateOrder(data) {
        return await axios.patch(`/order/update-order`, data)
    }
}

export default OrderApi