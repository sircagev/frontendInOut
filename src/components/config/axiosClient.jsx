import axios from "axios"

const axiosClient = axios.create({
    baseURL: "http://10.193.128.50:3003/",
    withCredentials: true
})

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")

    if (token) {
        config.headers.token = token;
    }
    return config;
});

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosClient;