import { computed, ref } from "vue";

export default function (fields) {
  const columns = computed(() => {
    const result = [];
    for (const key in fields) {
      result.push({
        ...{
          name: key,
          field: key,
          align: "center",
          sortable: true,
        },
        ...fields[key],
      });
    }
    return result;
  });

  const formDialog = ref(false);

  return {
    columns,
    filter: ref(""),
    formDialog,
    openForm(process = () => {}, index = null) {
      formDialog.value = true;
      process(index);
    },
  };
}
