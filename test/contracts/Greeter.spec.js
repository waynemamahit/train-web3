import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { ethers } from "hardhat";
import { describe, it, expect } from "vitest";

describe("Greeter Contract", async () => {
  const initGreet = "Hello World!";
  const instance = await ethers.getContractFactory("Greeter");
  const signers = await ethers.getSigners();
  const contract = await instance.deploy(initGreet);

  it("should have initial greeting!", async () => {
    expect(contract.deployTransaction)
      .to.emit(contract, "GreetLog")
      .withArgs(signers[0].address, initGreet, anyValue);
    expect(await contract.getGreet()).toBe(initGreet);
  });

  describe("Set Greet", () => {
    const newGreet = "Update Greet!";
    it("should set greeting!", async () => {
      await contract.setGreet(newGreet);
      expect(await contract.getGreet()).toBe(newGreet);
    });

    it("should emit an event on set greeting!", async () => {
      expect(contract.setGreet(newGreet))
        .to.emit(contract, "GreetLog")
        .withArgs(signers[0].address, newGreet, anyValue);
    });

    it("should not set empty greeting!", () => {
      expect(contract.setGreet("")).to.be.revertedWith(
        "Failed update greeting, couldn't set empty greet!"
      );
    });
  });
});
