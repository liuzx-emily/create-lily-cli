<script setup>
import { ref } from "vue";
const message = ref("模板");
</script>

<template>
  <section>
    {{ message }}
  </section>
</template>

<style lang="scss" scoped></style>
