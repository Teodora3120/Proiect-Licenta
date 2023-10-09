import axios from "./index";

class AuthApi {
    static async Register(data) {
        return await axios.post('/auth/register', data)
    }

    static async Login(data) {
        return await axios.post('/auth/login', data)
    }
}

export default AuthApi