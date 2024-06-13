<template>
  <section>
    {{ message }}
  </section>
</template>

<script setup>
import { ref } from "vue";
const message = ref("模板");
</script>
