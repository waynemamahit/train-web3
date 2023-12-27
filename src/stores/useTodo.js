import { defineStore } from "pinia";
import { showError } from "src/helpers/notify";
import Todo from "src/models/Todo";
import { get, add, edit, del } from "src/services/TodoService";
import { ref } from "vue";

export default defineStore("todo", () => {
  const todos = ref([]);
  const form = ref(new Todo());
  const formIndex = ref(null);
  const errMsg = "Failed transaction!";

  return {
    todos,
    form,
    formIndex,
    async getTodos() {
      try {
        todos.value = await get();
      } catch (error) {
        showError(error, "Failed get data!");
      }
    },
    async submitTodo() {
      try {
        todos.value =
          formIndex.value === null
            ? await add(form.value)
            : await edit(formIndex.value, form.value);
      } catch (error) {
        showError(error, errMsg);
      }
    },
    selectTodo(index = null) {
      formIndex.value = index;
      if (index >= 0 && index < todos.value.length) {
        form.value = new Todo(...todos.value[index]);
      }
    },
    async deleteTodo(index = 0) {
      try {
        todos.value = await del(index);
      } catch (error) {
        showError(error, errMsg);
      }
    },
  };
});
