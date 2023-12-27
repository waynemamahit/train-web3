// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Todo {
    struct TodoItem {
        string title;
        string description;
        string deadline;
    }
    event TodoLog(
        address owner,
        string title,
        string description,
        string action,
        uint256 timestamp
    );

    mapping(address => TodoItem[]) todos;

    function getTodos() external view returns (TodoItem[] memory) {
        return todos[msg.sender];
    }

    function addTodo(TodoItem memory newTodo) external {
        require(
            bytes(newTodo.title).length > 0 &&
                bytes(newTodo.description).length > 0 &&
                bytes(newTodo.deadline).length > 0,
            "Failed add todo, required value!"
        );

        todos[msg.sender].push(newTodo);
        emit TodoLog(
            msg.sender,
            newTodo.title,
            newTodo.description,
            "add",
            block.timestamp
        );
    }

    function editTodo(
        uint256 index,
        TodoItem memory newTodo
    ) external isOutIndex(index, "edit") {
        todos[msg.sender][index] = newTodo;
    }

    function deleteTodo(uint256 index) external isOutIndex(index, "delete") {
        for (uint i = index; i < todos[msg.sender].length - 1; i++) {
            todos[msg.sender][i] = todos[msg.sender][i + 1];
        }
        todos[msg.sender].pop();
    }

    modifier isOutIndex(uint256 index, string memory action) {
        require(
            (index >= 0 && index < todos[msg.sender].length),
            string(abi.encodePacked("Failed ", action, " todo, invalid index!"))
        );
        TodoItem memory todo = todos[msg.sender][index];
        emit TodoLog(
            msg.sender,
            todo.title,
            todo.description,
            action,
            block.timestamp
        );
        _;
    }
}
