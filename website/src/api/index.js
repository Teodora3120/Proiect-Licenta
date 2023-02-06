import Axios from 'axios'

const version  = 1;
const axios = Axios.create({
  baseURL: `https://localhost:7244/api/v${version}`,
  headers: { 'Content-Type': 'application/json' },
})

axios.interceptors.request.use(
  (config) => {
    let user = localStorage.getItem('user')
    if (user) {
      user = JSON.parse(user)
      if (user.jwtToken) {
        config.headers.Authorization = user.jwtToken
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
