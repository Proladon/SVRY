<template>
    <p>{{report}}</p>
</template>

<script>
import { defineComponent } from "vue";
import axios from "axios";
export default defineComponent({
  name: "ReportTemplate",
    props: ['report']
});
</script>

<style>
</style>