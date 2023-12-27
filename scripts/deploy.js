// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const fs = require("fs");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

async function main() {
  // const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  // const unlockTime = currentTimestampInSeconds + 60;

  // const lockedAmount = hre.ethers.utils.parseEther("0.001");

  // const Lock = await hre.ethers.getContractFactory("Lock");
  // const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

  // await lock.deployed();

  // console.log(
  //   `Lock with ${ethers.utils.formatEther(
  //     lockedAmount
  //   )}ETH and unlock timestamp ${unlockTime} deployed to ${lock.address}`
  // );

  const contracts = {
    Greeter: ["Hello World!"],
    Todo: [],
    Voting: [BigNumber.from(45)],
  };

  for (const key in contracts) {
    const factory = await ethers.getContractFactory(key);
    const contract = await factory.deploy(...contracts[key]);
    const filePath = `contracts/artifacts/contracts/${key}.sol/${key}.json`;
    let data = JSON.parse(fs.readFileSync(filePath));
    data.address = contract.address;
    data = JSON.stringify(data);
    fs.writeFileSync(filePath, data);
    console.log(`${key} contract has been deployed: ${contract.address}`);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
