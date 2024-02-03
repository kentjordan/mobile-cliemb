import axios from "axios";

const custAxios = axios.create({
    baseURL: process.env.NODE_ENV === "production" ?
        `https://${process.env.EXPO_PUBLIC_PROD_REST_API_HOSTNAME}` : `http://${process.env.EXPO_PUBLIC_DEV_REST_API_HOSTNAME}`
});

export default custAxios;