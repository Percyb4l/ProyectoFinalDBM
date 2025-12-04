import api from "./api";

export const getReports = () => api.get("/reports");

export const generateReport = (data) =>
  api.post("/reports", data);

export const downloadReport = (path) =>
  api.get(`/reports/download?file=${path}`, { responseType: "blob" });
