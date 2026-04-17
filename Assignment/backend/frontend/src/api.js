import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/items",
});

export const getItems = () => API.get("/");
export const addItem = (data) => API.post("/", data);