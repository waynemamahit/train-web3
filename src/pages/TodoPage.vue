<script setup>
import { storeToRefs } from "pinia";
import useTable from "src/composeables/useTable";
import { isProvide } from "src/helpers/ethereum";
import useTodo from "src/stores/useTodo";
import { onMounted } from "vue";

const store = useTodo();
const { todos, form, formIndex } = storeToRefs(store);
const { getTodos, submitTodo, selectTodo, deleteTodo } = store;

const { columns, filter, formDialog, openForm } = useTable({
  title: {
    label: "Title",
  },
  description: {
    label: "Description",
  },
  deadline: {
    label: "deadline",
  },
});

onMounted(async () => {
  await getTodos();

  if (isProvide) {
    window.ethereum.on("chainChanged", getTodos);
    window.ethereum.on("accountsChanged", getTodos);
  }
});
</script>

<template>
  <q-page class="flex flex-center">
    <q-card flat bordered style="max-width: 75vw">
      <q-card-section>
        <q-table
          title="List of Todo"
          title-class="text-h4"
          class="todos"
          grid
          hide-header
          :filter="filter"
          :rows="todos"
          :columns="columns"
        >
          <template v-slot:top-right>
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
              class="q-ma-md addTodo"
              round
              icon="add"
              color="primary"
              @click="openForm(selectTodo)"
            />
          </template>

          <template v-slot:item="props">
            <q-card
              class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
            >
              <q-card-section>
                <div class="text-h6 text-center">{{ props.row.title }}</div>
              </q-card-section>
              <q-separator />
              <q-card-section>
                <div class="text-paragraph text-justify">
                  {{ props.row.description }}
                </div>
              </q-card-section>
              <q-card-section>
                <div class="text-subtitle2 text-center text-grey">
                  Due: {{ props.row.deadline }}
                </div>
              </q-card-section>
              <q-card-section class="text-center">
                <q-btn
                  icon="edit"
                  color="secondary"
                  class="q-mx-sm"
                  @click="openForm(selectTodo, props.rowIndex)"
                />
                <q-btn
                  icon="delete"
                  class="q-mx-sm"
                  color="negative"
                  @click="deleteTodo(props.rowIndex)"
                />
              </q-card-section>
            </q-card>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-dialog v-model="formDialog">
      <q-card>
        <q-card-section class="custom-bg">
          <div class="text-h4 text-center text-white form-label">
            {{ formIndex === null ? "Add" : "Edit" }} Todo
          </div>
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="submitTodo" class="text-center">
            <br />
            <q-input
              outlined
              autofocus
              v-model="form.title"
              label="Title"
              class="q-mb-md form-title"
            />
            <q-input
              outlined
              autogrow
              v-model="form.description"
              label="Description"
              class="q-mb-md form-description"
            />
            <q-input
              class="q-mb-md form-deadline"
              outlined
              v-model="form.deadline"
            >
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="form.deadline" mask="YYYY-MM-DD">
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
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
