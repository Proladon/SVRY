<template>
    <div id="report-template">
        <p>{{report}}</p>
    </div>
</template>

<script>
import { defineComponent } from "vue";
import axios from "axios";
export default defineComponent({
  name: "ReportTemplate",
    props: ['report']
    
});
</script>

<style lang="scss" scoped>
#report-template{
    height: 100%;
    background-color: var(--secondary-gray);
}
</style>