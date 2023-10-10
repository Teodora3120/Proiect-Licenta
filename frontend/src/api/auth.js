import axios from "./index";

class AuthApi {
    static async Register(data) {
        return await axios.post('/auth/register', data)
    }

    static async Login(data) {
        return await axios.post('/auth/login', data)
    }

    static async GetUserById(userId) {
        return await axios.get(`/auth/get-user-by-id/${userId}`)
    }
}

export default AuthApi