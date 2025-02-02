import Axios from 'axios'

const axios = Axios.create({
    baseURL: `http://localhost:5000`,
    headers: { 'Content-Type': 'application/json' },
})

axios.interceptors.request.use(
    (config) => {
        let userString = localStorage.getItem('user')
        if (userString) {
            const user = JSON.parse(userString)
            if (user && user.token) {
                config.headers.Authorization = `Bearer ${user.token}`;
            }
        }
        return Promise.resolve(config)
    },
    (error) => Promise.reject(error),
)
let isAlertShown = false;
axios.interceptors.response.use(
    (response) => Promise.resolve(response),
    (error) => {
        if (error.response && error.response.status === 403 && !isAlertShown) {
            isAlertShown = true;

            localStorage.removeItem("user")

            const confirmResponse = window.confirm("Your session has expired. You will be redirected to the login page.")
            if (confirmResponse) {
                return window.location.href = `${window.location.origin}/auth/login`;
            }
        }
        return Promise.reject(error)
    },
)


export default axios