import axios from "./index";

class OrderApi {

    static async CreateOrder(data) {
        return await axios.post(`/order/create-order`, data)
    }

}

export default OrderApi