// src/services/api.js
import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

export const getChats = () => API.get("/chats");
export const getMessagesByWaId = (wa_id) =>
  API.get(`/chats/${wa_id}/messages`);

export const sendMessage = (messageData) =>
  API.post("/chats/message", messageData);
