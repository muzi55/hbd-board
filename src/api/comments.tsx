import axios from "axios";
import { addCommentData } from "../types/types";

const getCommentsData = async () => {
  const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/Comments`);
  return response.data;
};
const addCommentsData = async (data: addCommentData) => {
  await axios.post(`${process.env.REACT_APP_SERVER_URL}/Comments`, data);
};
const delCommentsData = async (id: number) => {
  await axios.delete(`${process.env.REACT_APP_SERVER_URL}/Comments/${id}`);
};
const updateCommentsData = async (id: number) => {
  await axios.post(`${process.env.REACT_APP_SERVER_URL}/Comments`);
};
export { getCommentsData, addCommentsData, delCommentsData, updateCommentsData };
