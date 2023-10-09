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
                config.headers.Authorization = user.token
            }
        }
        return Promise.resolve(config)
    },
    (error) => Promise.reject(error),
)

axios.interceptors.response.use(
    (response) => Promise.resolve(response),
    (error) => Promise.reject(error),
)


export default axios