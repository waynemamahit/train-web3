import { installQuasar } from "@quasar/quasar-app-extension-testing-unit-vitest";
import { config, mount, shallowMount } from "@vue/test-utils";
import { Dialog, Notify } from "quasar";
import Todo from "src/models/Todo";
import TodoPageVue from "src/pages/TodoPage.vue";
import stores from "src/stores";
import { beforeAll, describe, expect, it } from "vitest";

installQuasar({ plugins: [Notify, Dialog] });

describe("Todo Page Component", () => {
  const wrapperConfig = {
    global: {
      plugins: [stores()],
    },
  };
  let wrapper = mount(TodoPageVue, wrapperConfig);

  beforeAll(() => {
    wrapper = mount(TodoPageVue, wrapperConfig);
  });

  it("should have sub component", () => {
    expect(wrapper.find(".todos").exists()).toBe(true);
    expect(wrapper.find(".addTodo").exists()).toBe(true);
    expect(wrapper.find(".searchTodo").exists()).toBe(true);
    config.global.renderStubDefaultSlot = true;
    wrapper = shallowMount(TodoPageVue, wrapperConfig);
    expect(wrapper.find(".form-label").exists()).toBe(true);
    expect(wrapper.find(".form-title").exists()).toBe(true);
    expect(wrapper.find(".form-description").exists()).toBe(true);
    expect(wrapper.find(".form-deadline").exists()).toBe(true);
    expect(wrapper.find(".submitTodo").exists()).toBe(true);
  });

  describe("Add Todo", () => {
    it("should add new todo", async () => {
      const dataLength = wrapper.vm.todos.length;
      wrapper.vm.form = new Todo("New Title", "Lorem ipsum");
      await wrapper.vm.submitTodo();
      expect(wrapper.vm.todos.length).toBeGreaterThan(dataLength);
    });

    it("should not add new todo with empty value", async () => {
      const dataLength = wrapper.vm.todos.length;
      wrapper.vm.form = new Todo("", "", "");
      await wrapper.vm.submitTodo();
      expect(wrapper.vm.todos.length).toEqual(dataLength);
    });
  });

  describe("Edit Todo", () => {
    it("should edit todo", async () => {
      const newTodo = new Todo("Edited Title", "LALALALLA");
      await wrapper.vm.selectTodo(0);
      expect(wrapper.vm.formIndex).toBe(0);
      expect(wrapper.vm.form).toEqual(new Todo(...wrapper.vm.todos[0]));
      wrapper.vm.form = newTodo;
      await wrapper.vm.submitTodo();
      expect(new Todo(...wrapper.vm.todos[0])).toEqual(newTodo);
    });

    it("should not edit todo with invalid index", async () => {
      const dataLength = wrapper.vm.todos.length;
      const newTodo = new Todo("Edited Title2", "LALALALLA2");
      await wrapper.vm.selectTodo(dataLength);
      wrapper.vm.form = newTodo;
      expect(wrapper.vm.formIndex).toBe(dataLength);
      expect(wrapper.vm.form).toEqual(newTodo);
      await wrapper.vm.submitTodo();
      expect(new Todo(...wrapper.vm.todos[dataLength - 1]) != newTodo).toBe(
        true
      );
    });
  });

  describe("Delete Todo", () => {
    it("should delete todo with invalid index", async () => {
      const dataLength = wrapper.vm.todos.length;
      await wrapper.vm.deleteTodo(0);
      expect(wrapper.vm.todos.length).toBeLessThan(dataLength);
    });

    it("should not delete todo with invalid index", async () => {
      const dataLength = wrapper.vm.todos.length;
      await wrapper.vm.deleteTodo(dataLength);
      expect(wrapper.vm.todos.length).toBe(dataLength);
    });
  });
});
