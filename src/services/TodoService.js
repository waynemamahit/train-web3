import { getContract, getSigner } from "src/helpers/ethereum";
import Todo from "src/models/Todo";
import {
  abi,
  address,
} from "../../contracts/artifacts/contracts/Todo.sol/Todo.json";

const contract = getContract(address, abi, getSigner());

export const get = async () => {
  return await contract.getTodos();
};

export const add = async (newTodo = new Todo()) => {
  const tx = await contract.addTodo(newTodo);
  await tx.wait();
  return await get();
};

export const edit = async (index = 0, newTodo = new Todo()) => {
  const tx = await contract.editTodo(index, newTodo);
  await tx.wait();
  return await get();
};

export const del = async (index = 0) => {
  const tx = await contract.deleteTodo(index);
  await tx.wait();
  return await get();
};
