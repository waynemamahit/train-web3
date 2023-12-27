import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import Candidate from "src/models/Candidate";
import { describe, expect, it } from "vitest";

describe("Voting Contract", async () => {
  const durationTime = BigNumber.from(60 * 60 * 2);
  const instance = await ethers.getContractFactory("Voting");
  const signers = await ethers.getSigners();
  let contract = await instance.deploy(durationTime);

  const getCandidates = async () => await contract.getCandidates();

  describe("Deployment", () => {
    it("should have target time more than current time", async () => {
      expect(
        BigNumber.from(Math.floor(Date.now() / 1000)).lt(
          await contract.getTargetTime()
        )
      ).toBe(true);
    });
  });

  const candidate = new Candidate("New Cand", "LALALALALLA");
  const registerTx = {
    value: ethers.utils.parseUnits("5", "ether"),
  };

  describe("Register Candidate", () => {
    it("should register candidate", async () => {
      await contract.register(
        candidate.name,
        candidate.description,
        registerTx
      );

      const result = (await getCandidates())[0];
      expect(result.name).toBe(candidate.name);
      expect(result.description).toBe(candidate.description);
    });

    it("should emit an event register candidate", () => {
      const newName = candidate.name + " 1";

      expect(
        contract
          .connect(signers[1])
          .register(newName, candidate.description, registerTx)
      )
        .to.emit(contract, "CandidateLog")
        .withArgs(newName, candidate.description, signers[1].address, anyValue);
    });

    describe("Validations", () => {
      const baseErr = "Failed register, ";

      it("should not register candidate without pay", () => {
        expect(
          contract.connect(signers[2]).register("New Cand 2", "Lalallalala", {
            value: BigNumber.from(0),
          })
        ).to.be.revertedWith(baseErr + "must pay with 5 coin for register!");
      });

      it("should not register candidate with empty name and description", () => {
        expect(
          contract.connect(signers[2]).register("", "", registerTx)
        ).to.be.revertedWith(baseErr + "must have name and description!");
      });

      it("should not register candidate with same address", () => {
        expect(
          contract
            .connect(signers[0])
            .register(
              candidate.name + " 000",
              candidate.description,
              registerTx
            )
        ).to.be.revertedWith(baseErr + "candidate has been exist!");
      });

      it("should not register candidate with same name", () => {
        expect(
          contract
            .connect(signers[2])
            .register(candidate.name, "Lorem", registerTx)
        ).to.be.revertedWith(
          baseErr + "must have different name with other candidate!"
        );
      });
    });
  });

  const voteTx = {
    value: ethers.utils.parseUnits("0.5", "ether"),
  };

  describe("Vote Up Candidate", () => {
    const candidateId = signers[0].address;

    it("should vote up candidate", async () => {
      const count = (await getCandidates())[0].count;
      await contract.connect(signers[1]).vote(candidateId, voteTx);
      expect((await getCandidates())[0].count.gt(count)).toBe(true);
    });

    it("should emit an event vote up candidate", async () => {
      expect(contract.connect(signers[2]).vote(candidateId, voteTx))
        .to.emit(contract, "VoteLog")
        .withArgs(signers[2].address, candidateId, anyValue);
    });

    describe("Validations", () => {
      const baseErr = "Failed vote up, couldn't vote up ";

      it("should not vote up without pay", async () => {
        expect(
          contract.connect(signers[3]).vote(candidateId, {
            value: BigNumber.from(0),
          })
        ).to.be.revertedWith(baseErr + "must pay with 0.5 coin for vote up!");
      });

      it("should not vote up candidate 2 times", async () => {
        expect(
          contract.connect(signers[1]).vote(candidateId, voteTx)
        ).to.be.revertedWith(baseErr + "candidate 2 times!");
      });

      it("should not vote up candidate not exist", async () => {
        expect(
          contract.connect(signers[3]).vote(signers[5].address, voteTx)
        ).to.be.revertedWith(baseErr + "candidate not exist!");
      });

      it("should not vote up candidate as same address voter", async () => {
        expect(
          contract.connect(signers[0]).vote(candidateId, voteTx)
        ).to.be.revertedWith(baseErr + "with same address voter!");
      });
    });
  });

  it("should not vote up or register until winner has been found", async () => {
    const newContract = await instance.deploy(durationTime);

    await newContract
      .connect(signers[0])
      .register(candidate.name, candidate.description, registerTx);

    await newContract
      .connect(signers[1])
      .register(candidate.name + " 1", candidate.description, registerTx);

    let i = 1;
    while (i <= 3) {
      await newContract.connect(signers[i]).vote(signers[0].address, voteTx);
      i++;
    }
    await newContract.connect(signers[i]).vote(signers[1].address, voteTx);

    await ethers.provider.send("evm_setNextBlockTimestamp", [
      Math.floor(Date.now() / 1000) + durationTime.toNumber() + 12,
    ]);
    await ethers.provider.send("evm_mine");

    const result = (await newContract.getCandidates())[0];
    const winnerBalance = await signers[0].getBalance();
    const voterBalance = await signers[1].getBalance();

    expect(
      await newContract.connect(signers[i + 1]).vote(signers[1].address, voteTx)
    )
      .to.emit(newContract, "WinnerLog")
      .withArgs(
        result.name,
        result.description,
        result.count,
        result.id,
        anyValue
      );

    expect((await signers[0].getBalance()).gt(winnerBalance)).toBe(true);
    expect((await signers[1].getBalance()).gt(voterBalance)).toBe(true);
  });
});
