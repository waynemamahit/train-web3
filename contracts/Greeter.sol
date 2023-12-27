// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Greeter {
    mapping(address => string) greeting;
    event GreetLog(address owner, string greet, uint256 timestamp);

    constructor(string memory _greeting) isEmpty(_greeting) {
        greeting[msg.sender] = _greeting;
    }

    function getGreet() view external returns (string memory) {
        return greeting[msg.sender];
    }

    function setGreet(string memory _greeting) external isEmpty(_greeting) {
        greeting[msg.sender] = _greeting;
    }

    modifier isEmpty(string memory _greeting) {
        require(
            bytes(_greeting).length > 0,
            "Failed update greeting, couldn't set empty greet!"
        );
        emit GreetLog(msg.sender, _greeting, block.timestamp);
        _;
    }
}
