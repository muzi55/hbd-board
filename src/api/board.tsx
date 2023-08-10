import axios from "axios";
import { Data } from "../types/types";

const getBoardData = async () => {
  const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/boards`);
  return response.data;
};
const addBoardData = async (data: any) => {
  await axios.post(`${process.env.REACT_APP_SERVER_URL}/boards`, data);
};
const delBoardData = async (id: number) => {
  const response = await axios.delete(`${process.env.REACT_APP_SERVER_URL}/boards/${id}`);
};
const updateBoardData = async (id: number) => {
  await axios.patch(`${process.env.REACT_APP_SERVER_URL}/boards/${id}`, { isDeleted: true });
};
export { getBoardData, addBoardData, delBoardData, updateBoardData };
