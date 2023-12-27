import { defineStore } from "pinia";
import { showError, showMessage } from "src/helpers/notify";
import { get, set } from "src/services/GreeterService";
import { ref } from "vue";

export default defineStore("greeter", () => {
  const greet = ref("");
  const newGreet = ref("");

  return {
    greet,
    newGreet,
    async getGreet() {
      try {
        greet.value = await get();
      } catch (error) {
        showError(error, "Failed get data!");
      }
    },
    async setGreet() {
      try {
        greet.value = await set(newGreet.value);
        showMessage("Greeting has been updated!");
      } catch (error) {
        showError(error, "Failed transaction!");
      }
    },
  };
});
