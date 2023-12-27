<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="custom-bg">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Train Web3 </q-toolbar-title>

        <q-btn
          class="q-pa-sm"
          color="secondary"
          label="Connect Wallet"
          icon="wallet"
          @click="connectWallet"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Features </q-item-label>

        <FeatureMenu
          v-for="link in featureList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import FeatureMenu from "src/components/FeatureMenu.vue";
import { requestAccounts } from "src/helpers/ethereum";
import { showError } from "src/helpers/notify";
import { defineComponent, onMounted, ref } from "vue";

const featureList = [
  {
    title: "Greeter",
    caption: "a first feature for greeting",
    icon: "waving_hand",
    link: "/greeter",
  },
  {
    title: "Todo",
    caption: "a first basic crud feature",
    icon: "task",
    link: "/todo",
  },
  {
    title: "Vote Up",
    caption: "a vote up and register candidate feature",
    icon: "how_to_vote",
    link: "/voting",
  },
];

export default defineComponent({
  name: "MainLayout",

  components: {
    FeatureMenu,
  },

  setup() {
    const leftDrawerOpen = ref(false);

    onMounted(async () => {
      await requestAccounts();
    });

    return {
      featureList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      async connectWallet() {
        try {
          await requestAccounts();
        } catch (error) {
          showError(error, "Failed to connect wallet!")
        }
      },
    };
  },
});
</script>
