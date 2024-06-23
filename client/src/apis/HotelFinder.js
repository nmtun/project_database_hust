import axios from "axios";

export default axios.create({
    baseURL: "http://localhost:3010/api/v1/hotels",
})