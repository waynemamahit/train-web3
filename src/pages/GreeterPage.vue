<script setup>
import { storeToRefs } from "pinia";
import { isProvide } from 'src/helpers/ethereum';
import useGreeter from "src/stores/useGreeter";
import { onMounted } from "vue";

const store = useGreeter();
const { greet, newGreet } = storeToRefs(store);
const { getGreet, setGreet } = store;

onMounted(async () => {
  await getGreet();
  if (isProvide) {
    window.ethereum.on("chainChanged", getGreet)
    window.ethereum.on("accountsChanged", getGreet)
  }
});
</script>

<template>
  <q-page class="flex flex-center">
    <q-card flat bordered>
      <q-card-section class="custom-bg" v-if="greet.length > 0">
        <div class="text-h3 text-center text-white greet">{{ greet }}</div>
      </q-card-section>

      <q-card-section>
        <q-input
          outlined
          v-model="newGreet"
          label="New Greeting"
          class="newGreet"
        />
        <q-btn
          size="lg"
          class="q-my-sm text-center full-width setGreet"
          color="secondary"
          label="Set Greeting"
          @click="setGreet"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>
