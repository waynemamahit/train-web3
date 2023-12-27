import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { ethers } from "hardhat";
import { getDate } from "src/helpers/date";
import Todo from "src/models/Todo";
import { describe, it, expect } from "vitest";

describe("Todo Contract", async () => {
  const instance = await ethers.getContractFactory("Todo");
  const signers = await ethers.getSigners();
  const contract = await instance.deploy();
  const revertInvalidIndex = "invalid index!";

  const getTodos = async () => await contract.getTodos();

  describe("Add Todo", () => {
    const newTodo = new Todo("New Title", "Lorem ipsum");
    it("should add new todo and emit an event", async () => {
      expect(await contract.addTodo(newTodo))
        .to.emit(contract, "TodoLog")
        .withArgs(
          signers[0].address,
          newTodo.title,
          newTodo.description,
          "add",
          anyValue
        );
      expect(new Todo(...(await getTodos())[0])).toEqual(newTodo);
    });

    it("should not add new todo with all empty", async () => {
      expect(contract.addTodo(new Todo("", "", ""))).to.be.revertedWith(
        "Failed add todo, required value!"
      );
    });
  });

  describe("Edit Todo", () => {
    const newTodo = new Todo(
      "Edited Title",
      "LALALALALLALAA",
      getDate(Date.now() + 1000 * 60 * 60)
    );

    it("should edit todo and emit an event", async () => {
      await contract.editTodo(0, newTodo);
      expect(contract.editTodo(0, newTodo))
        .to.emit(contract, "TodoLog")
        .withArgs(
          signers[0].address,
          newTodo.title,
          newTodo.description,
          "edit",
          anyValue
        );
      expect(new Todo(...(await getTodos())[0])).toEqual(newTodo);
    });

    it("should not edit todo with invalid index", () => {
      expect(contract.editTodo(2, newTodo)).to.be.revertedWith(
        "Failed edit todo, " + revertInvalidIndex
      );
    });
  });

  describe("Delete Todo", () => {
    it("should delete todo and emit an event", async () => {
      const todo = (await getTodos())[0];
      const currentLength = (await getTodos()).length;
      expect(await contract.deleteTodo(0))
        .to.emit(contract, "TodoLog")
        .withArgs(
          signers[0].address,
          todo.title,
          todo.description,
          "delete",
          anyValue
        );
      expect((await getTodos()).length).toBeLessThan(currentLength);
    });

    it("should not delete todo with invalid index", () => {
      expect(contract.deleteTodo(0)).to.be.revertedWith(
        "Failed delete todo, " + revertInvalidIndex
      );
    });
  });
});
