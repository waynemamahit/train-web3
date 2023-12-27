import { ethers } from "ethers";

export default class Candidate {
  constructor(
    name = "",
    description = "",
    count = ethers.utils.parseEther("0"),
    id = ""
  ) {
    this.name = name;
    this.description = description;
    this.count = count;
    this.id = id;
  }
}
