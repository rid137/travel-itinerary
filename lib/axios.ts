import axios from "axios"

const axiosClient = axios.create({
  baseURL: "https://booking-com15.p.rapidapi.com/api/v1",
  headers: {
    "x-rapidapi-host": "booking-com15.p.rapidapi.com",
    "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY || ""
  },
})

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.log("API error:", error.response || error.message)
    return Promise.reject(error)
  },
)

export default axiosClient
