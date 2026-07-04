import axios from "axios";

export const api = axios.create({
    baseURL:  "http://192.168.29.161:3000/api/auth",
      withCredentials: true,
});
