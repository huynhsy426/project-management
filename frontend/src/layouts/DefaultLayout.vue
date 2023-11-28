<script setup>
import router from "../routes";
import { onMounted, ref, watch } from "vue";
import FullLayout from "./full/FullLayout.vue";
import VerticalLayout from "./vertical/VerticalLayout.vue";
import VerticalLayoutAssignUp from "./vertical/VerticalLayoutAssignUp.vue";
import { useRouter } from "vue-router";

const _router = useRouter();

const layout = ref(FullLayout);

watch(router.currentRoute, (value) => {
  switch (value.meta.layout) {
    case "vertical":
      layout.value = VerticalLayout;
      break;
    case "vertical-Assign":
      layout.value = VerticalLayoutAssignUp;
      break;
    default:
      layout.value = FullLayout;
      break;
  }
});
</script>

<template>
  <component :is="layout" />
</template>