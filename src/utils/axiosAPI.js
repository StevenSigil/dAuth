import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://127.0.0.1:8000/api/",
  baseURL: "https://d-auth.herokuapp.com/api/",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});
export default axiosInstance;

export function getAndSetToken() {
  var authToken = sessionStorage.getItem("Token");
  if (authToken) {
    axiosInstance.defaults.headers.common["Authorization"] =
      "Token " + authToken;
  } else {
    console.log("Auth-token not found.");
  }
}

export function checkForToken() {
  const token = sessionStorage.getItem("Token");

  if (token) return true;
  else return false;
}

// "proxy": "http://127.0.0.1:8000",
