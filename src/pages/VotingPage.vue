<script setup>
import { storeToRefs } from "pinia";
import useTable from "src/composeables/useTable";
import { isProvide } from "src/helpers/ethereum";
import useVoting from "src/stores/useVoting";
import { onMounted } from "vue";

const store = useVoting();
const { candidates, newCandidate, targetTime } = storeToRefs(store);
const { getTargetTime, getCandidates, register, vote } = store;

const { columns, filter, formDialog, openForm } = useTable({
  name: {
    label: "Name",
  },
  description: {
    label: "Description",
  },
});

onMounted(async () => {
  const getData = async () => {
    await getTargetTime();
    await getCandidates();
  };
  getData();
  if (isProvide) {
    window.ethereum.on("chainChanged", getData);
    window.ethereum.on("accountsChanged", getData);
  }
});
</script>

<template>
  <q-page class="flex flex-center">
    <q-card flat bordered style="max-width: 75vw">
      <q-card-section>
        <q-table
          title="List of Candidates"
          title-class="text-h4"
          class="candidates"
          grid
          hide-header
          :filter="filter"
          :rows="candidates"
          :columns="columns"
        >
          <template v-slot:top-right>
            <div class="text-subtitle1 q-mx-sm targetTime">
              Target Time:
              <strong
                >{{
                  new Date(targetTime.toNumber() * 1000).toJSON().split("T")[0]
                }},
                {{
                  new Date(targetTime.toNumber() * 1000).toLocaleTimeString()
                }}</strong
              >
            </div>
            <q-input
              dense
              debounce="300"
              class="searchTodo"
              v-model="filter"
              placeholder="Search"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
            <q-btn
              fab
              class="q-ma-md openForm"
              round
              icon="how_to_reg"
              color="primary"
              @click="openForm()"
            />
          </template>

          <template v-slot:item="props">
            <q-card
              class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
            >
              <q-card-section>
                <div class="text-h6 text-center">{{ props.row.name }}</div>
              </q-card-section>
              <q-separator />
              <q-card-section>
                <div class="text-paragraph text-justify">
                  {{ props.row.description }}
                </div>
              </q-card-section>
              <q-card-section class="text-center">
                <q-btn
                  icon="where_to_vote"
                  color="secondary"
                  class="q-mx-sm"
                  @click="vote(props.row.id)"
                />
              </q-card-section>
            </q-card>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-dialog v-model="formDialog" class="registerCandidate">
      <q-card>
        <q-card-section class="custom-bg">
          <div class="text-h4 text-center text-white">Register Candidate</div>
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="register" class="text-center">
            <br />
            <q-input
              outlined
              autofocus
              v-model="newCandidate.name"
              label="Name"
              class="q-mb-md form-name"
            />
            <q-input
              outlined
              autogrow
              v-model="newCandidate.description"
              label="Description"
              class="q-mb-md form-description"
            />
            <q-btn
              icon="send"
              label="Submit"
              color="secondary"
              type="submit"
              class="full-width submitTodo"
            />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>
