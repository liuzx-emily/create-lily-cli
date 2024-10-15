<script lang="jsx" setup>
import CompCounter from "./CompCounter.vue";
import CompHello from "./CompHello";
</script>

<template>
  <section>
    <CompCounter :start="10" />
    <CompHello name="emily" />
  </section>
</template>

<style lang="scss" scoped></style>
