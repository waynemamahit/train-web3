import { ethers } from "ethers";
import { getContract, getSigner } from "src/helpers/ethereum";
import {
  abi,
  address,
} from "../../contracts/artifacts/contracts/Voting.sol/Voting.json";

const contract = getContract(address, abi);

export const getCandidates = async () => await contract.getCandidates();

export const getTargetTime = async () => await contract.getTargetTime();

export const register = async (name, description) => {
  const tx = await contract.register(name, description, {
    value: ethers.utils.parseUnits("5", "ether"),
  });
  await tx.wait();
  return await getCandidates();
};

export const vote = async (id) => {
  const tx = await contract.connect(getSigner(1)).vote(id, {
    value: ethers.utils.parseUnits("0.5", "ether"),
  });
  await tx.wait();
  return await getCandidates();
};
