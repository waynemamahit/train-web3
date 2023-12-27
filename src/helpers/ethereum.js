import { ethers } from "ethers";
import { keys, url } from "../../rpc.json";

export const isProvide = typeof window.ethereum !== "undefined";

export const getProvider = () =>
  isProvide
    ? new ethers.providers.Web3Provider(window.ethereum)
    : new ethers.providers.JsonRpcProvider(url);

export const requestAccounts = async () =>
  isProvide
    ? await window.ethereum.request({ method: "eth_requestAccounts" })
    : await getProvider().listAccounts();

export const getSigner = (index = 0) => {
  const provider = getProvider();
  return isProvide
    ? provider.getSigner()
    : new ethers.Wallet(keys[index], provider);
};

export const getContract = (address, abi, provider = getSigner()) =>
  new ethers.Contract(address, abi, provider);
