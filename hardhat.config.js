require("@nomicfoundation/hardhat-toolbox");
const { url, chainId } = require("./rpc.json");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    dev: {
      url,
      chainId,
    },
  },
  paths: {
    artifacts: "./contracts/artifacts",
    cache: "./contracts/cache",
  }
};
