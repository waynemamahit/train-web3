import { installQuasar } from "@quasar/quasar-app-extension-testing-unit-vitest";
import { mount } from "@vue/test-utils";
import { Notify } from "quasar";
import stores from "src/stores";
import { beforeAll, describe, expect, it } from "vitest";
import GreeterPage from "../../src/pages/GreeterPage.vue";

installQuasar({ plugins: { Notify } });

describe("Greeter Page Component", () => {
  let wrapper;

  beforeAll(() => {
    wrapper = mount(GreeterPage, {
      global: {
        plugins: [stores()],
      },
    });
  });

  it("should have sub component", () => {
    expect(wrapper.find(".greet").exists()).to.be.false;
    expect(wrapper.find(".newGreet").exists()).to.be.true;
    expect(wrapper.find(".setGreet").exists()).to.be.true;
  });

  it("should have initial greeting", async () => {
    await wrapper.vm.getGreet();
    expect(wrapper.vm.greet.length).toBeGreaterThan(0);
    expect(wrapper.find(".greet").exists()).to.be.true;
  });

  describe("Set Greet", () => {
    it("should set new greeting", async () => {
      wrapper.vm.newGreet = "Hello Update!";
      await wrapper.vm.setGreet();
      expect(wrapper.vm.greet).toBe(wrapper.vm.newGreet);
      expect(wrapper.find(".greet").text()).toContain(wrapper.vm.newGreet);
    });

    it("should not set empty greeting", async () => {
      const currentGreet = wrapper.vm.greet;
      wrapper.vm.newGreet = "";
      await wrapper.vm.setGreet();
      expect(wrapper.vm.greet).toBe(currentGreet);
      expect(wrapper.find(".greet").text()).toContain(currentGreet);
    });
  });
});
