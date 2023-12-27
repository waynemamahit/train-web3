// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        string name;
        string description;
        uint256 count;
        address id;
    }
    Candidate[] candidates;

    event CandidateLog(
        string name,
        string description,
        address id,
        uint256 timestamp
    );

    event WinnerLog(
        string name,
        string description,
        uint256 count,
        address id,
        uint256 timestamp
    );

    struct Vote {
        address voter;
        address candidate;
    }
    Vote[] votes;

    event VoteLog(address voter, address candidate, uint256 timestamp);

    uint256 targetTime;
    uint256 duration;

    constructor(uint256 _duration) {
        targetTime = block.timestamp + _duration;
        duration = _duration;
    }

    function getCandidates() external view returns (Candidate[] memory) {
        return candidates;
    }

    function getTargetTime() external view returns (uint256) {
        return targetTime;
    }

    function register(
        string memory name,
        string memory description
    ) external payable getWinner {
        string memory baseErr = "Failed register, ";
        require(
            msg.value == 5 ether,
            string(
                abi.encodePacked(baseErr, "must pay with 5 coin for register!")
            )
        );
        require(
            bytes(name).length > 0 && bytes(description).length > 0,
            string(abi.encodePacked(baseErr, "must have name and description!"))
        );

        bool isValid = true;
        string memory errMsg = "";

        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i].id == msg.sender) {
                isValid = false;
                errMsg = "candidate has been exist!";
                break;
            }

            if (
                keccak256(abi.encodePacked(candidates[i].name)) ==
                keccak256(abi.encodePacked(name))
            ) {
                isValid = false;
                errMsg = "must have different name with other candidate!";
                break;
            }
        }

        require(isValid, string(abi.encodePacked(baseErr, errMsg)));

        candidates.push(Candidate(name, description, 0, msg.sender));

        emit CandidateLog(name, description, msg.sender, block.timestamp);
    }

    function vote(address id) external payable getWinner {
        string memory baseErr = "Failed vote up, couldn't vote up ";

        require(
            msg.value == 0.5 ether,
            string(
                abi.encodePacked(baseErr, "must pay with 0.5 coin for vote up!")
            )
        );

        bool isValid = true;
        string memory errMsg = "candidate not exist!";
        for (uint256 i = 0; i < votes.length; i++) {
            if (votes[i].voter == msg.sender && votes[i].candidate == id) {
                isValid = false;
                errMsg = "candidate 2 times!";
            }
        }

        bool isExist = false;
        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i].id == msg.sender) {
                isValid = false;
                errMsg = "with same address voter!";
                break;
            }

            if (candidates[i].id == id) {
                votes.push(Vote(msg.sender, id));
                candidates[i].count++;
                emit VoteLog(msg.sender, id, block.timestamp);
                isExist = true;
                break;
            }
        }

        require(isValid && isExist, string(abi.encodePacked(baseErr, errMsg)));
    }

    modifier getWinner() {
        if (block.timestamp >= targetTime) {
            address payable sender = payable(msg.sender);
            sender.transfer(msg.value);

            Candidate memory candidate;
            uint256 maxCount = 0;
            for (uint i = 0; i < candidates.length; i++) {
                if (candidates[i].count > maxCount) {
                    maxCount = candidates[i].count;
                    candidate = candidates[i];
                }
            }

            uint256 voterCount = 0;
            for (uint256 i = 0; i < votes.length; i++) {
                if (votes[i].candidate == candidate.id) voterCount++;
            }

            address payable winner = payable(candidate.id);
            if (voterCount > 0) {
                winner.transfer((15 * address(this).balance) / 100);

                uint256 currentBalance = address(this).balance;
                for (uint256 i = 0; i < votes.length; i++) {
                    if (votes[i].candidate == candidate.id) {
                        address payable voter = payable(votes[i].voter);
                        voter.transfer(currentBalance / voterCount);
                    }
                }

                emit WinnerLog(
                    candidate.name,
                    candidate.description,
                    candidate.count,
                    candidate.id,
                    block.timestamp
                );
            }

            while (candidates.length > 0) candidates.pop();
            while (votes.length > 0) votes.pop();
            targetTime = block.timestamp + duration;
        }
        _;
    }
}
