import axios from "axios"

const axiosClient = axios.create({
    baseURL: "http://localhost:3000/"
})

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    
    config.headers.token=token
    return config;
});

axiosClient.interceptors.response.use((response) => {
        return response

});

export default axiosClient;