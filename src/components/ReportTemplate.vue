<template>
  <!-- <div class="copy-btn" @click="copytext"><span>Copy template</span></div> -->
  <div id="report-template">
    <pre class="preview">{{template}}</pre>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
    name: "ReportTemplate",
    props: ['template'],
    
});
</script>

<style lang="scss" scoped>
#report-template {
  height: 100%;
  background-color: var(--secondary-gray);
}

.preview{
    padding: 15px;
    text-align: left;
    margin: 0;
}

</style>