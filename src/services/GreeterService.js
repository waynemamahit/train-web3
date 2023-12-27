import { getContract, getSigner } from "src/helpers/ethereum";
import {
  abi,
  address,
} from "../../contracts/artifacts/contracts/Greeter.sol/Greeter.json";

const contract = getContract(address, abi, getSigner());

export const get = async () => {
  return await contract.getGreet();
};

export const set = async (newGreet = "") => {
  const tx = await contract.setGreet(newGreet);
  await tx.wait();
  return await get();
};
