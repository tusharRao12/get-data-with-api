import axios from "axios";

const API = axios.create({
    baseURL : 'https://rdxuat.com'
})

export default API;