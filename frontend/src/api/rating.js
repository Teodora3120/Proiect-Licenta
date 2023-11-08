import axios from "./index";

class RatingApi {
    static async CreateRating(data) {
        return await axios.post('/rating/rate', data)
    }

    static async GetWorkerRating(workerId) {
        return await axios.get(`/rating/worker-rating/${workerId}`)
    }

    static async GetCustomerNumberOfRatings(customerId) {
        return await axios.get(`/rating/customer-ratings/${customerId}`)
    }

    static async GetWorkersRatings() {
        return await axios.get(`/rating/workers-ratings`)
    }
}

export default RatingApi