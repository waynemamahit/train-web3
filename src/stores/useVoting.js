import { BigNumber } from "ethers";
import { defineStore } from "pinia";
import { showError, showMessage } from "src/helpers/notify";
import Candidate from "src/models/Candidate";
import * as VotingService from "src/services/VotingService";
import { ref } from "vue";

export default defineStore("voting", () => {
  const candidates = ref([]);
  const newCandidate = ref(new Candidate());
  const targetTime = ref(BigNumber.from(0));

  const getTargetTime = async () => {
    try {
      targetTime.value = await VotingService.getTargetTime();
    } catch (error) {
      showError(error, "Failed get target time!");
    }
  };

  return {
    candidates,
    newCandidate,
    targetTime,
    getTargetTime,
    async getCandidates() {
      try {
        candidates.value = await VotingService.getCandidates();
      } catch (error) {
        showError(error, "Failed get candidates!");
      }
    },
    async register() {
      const { name, description } = newCandidate.value;
      try {
        candidates.value = await VotingService.register(name, description);
        if (candidates.value.length > 0)
          return showMessage("Register as candidate has been success!");
        return showMessage("Winner has been found!");
      } catch (error) {
        showError(error, "Failed register!");
      } finally {
        await getTargetTime();
      }
    },
    async vote(id = "") {
      try {
        candidates.value = await VotingService.vote(id);
        if (candidates.value.length > 0)
          return showMessage("Vote up has been success!");
        return showMessage("Winner has been found!");
      } catch (error) {
        showError(error, "Failed vote up!");
      } finally {
        await getTargetTime();
      }
    },
  };
});
