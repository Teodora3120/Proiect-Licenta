import axios from "./index";

class OrderApi {

    static async CreateOrder(data) {
        return await axios.post(`/order/create-order`, data)
    }

    static async GetOrders(userId) {
        return await axios.get(`/order/get-orders/${userId}`)
    }

    static async DeleteOrder(orderId, userId) {
        return await axios.delete(`/order/delete-order/${orderId}/${userId}`)
    }
}

export default OrderApi