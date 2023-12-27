import { installQuasar } from "@quasar/quasar-app-extension-testing-unit-vitest";
import { config, mount, shallowMount } from "@vue/test-utils";
import { Dialog, Notify } from "quasar";
import Candidate from "src/models/Candidate";
import VotingPageVue from "src/pages/VotingPage.vue";
import stores from "src/stores";
import { beforeAll, describe, expect, it } from "vitest";

installQuasar({ plugins: [Notify, Dialog] });

describe("VotingPage Component", () => {
  let wrapper;
  const wrapperConfig = {
    global: {
      plugins: [stores()],
    },
  };

  beforeAll(() => {
    wrapper = mount(VotingPageVue, wrapperConfig);
  });

  it("should have sub component", () => {
    expect(wrapper.find(".candidates").exists()).toBe(true);
    expect(wrapper.find(".openForm").exists()).toBe(true);
    expect(wrapper.find(".targetTime").exists()).toBe(true);
    expect(wrapper.find(".searchTodo").exists()).toBe(true);
    config.global.renderStubDefaultSlot = true;
    wrapper = shallowMount(VotingPageVue, wrapperConfig);
    expect(wrapper.find(".registerCandidate").exists()).toBe(true);
    expect(wrapper.find(".form-name").exists()).toBe(true);
    expect(wrapper.find(".form-description").exists()).toBe(true);
    expect(wrapper.find(".submitTodo").exists()).toBe(true);
  });

  const newCandidate = new Candidate("New Cand", "Lorem ipsum dolor sit amet!");
  describe("Register Candidate", () => {
    it("should register as candidate", async () => {
      await wrapper.vm.openForm();
      const dataLength = wrapper.vm.candidates.length;
      wrapper.vm.newCandidate = newCandidate;
      await wrapper.vm.register();
      expect(wrapper.vm.candidates.length).toBeGreaterThan(dataLength);
      expect(new Candidate(...wrapper.vm.candidates[0]).name).toBe(
        newCandidate.name
      );
      expect(new Candidate(...wrapper.vm.candidates[0]).description).toBe(
        newCandidate.description
      );
    });

    it("should not register as candidate", async () => {
      await wrapper.vm.openForm();
      const dataLength = wrapper.vm.candidates.length;
      wrapper.vm.newCandidate = newCandidate;
      await wrapper.vm.register();
      expect(wrapper.vm.candidates.length).toEqual(dataLength);
    });
  });

  describe("Vote Up Candidate", () => {
    it("should vote up candidate", async () => {
      const candidate = new Candidate(...wrapper.vm.candidates[0]);
      await wrapper.vm.vote(candidate.id);
      expect(
        new Candidate(...wrapper.vm.candidates[0]).count.toNumber() >
          candidate.count.toNumber()
      ).toBe(true);
    });

    it("should not vote up candidate", async () => {
      const candidate = new Candidate(...wrapper.vm.candidates[0]);
      await wrapper.vm.vote(candidate.id);
      expect(
        wrapper.vm.candidates[0].count.toNumber() === candidate.count.toNumber()
      ).toBe(true);
    });
  });
});
