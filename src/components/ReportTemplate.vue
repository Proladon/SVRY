<template>
  <div class="copy-btn" @click="copytext">Copy template</div>
  <div id="report-template">
    <pre class="preview">{{template}}</pre>
  </div>
</template>

<script>
import { defineComponent, props } from "vue";
import copy from 'copy-to-clipboard';
import { useToast, TYPE  } from "vue-toastification";

export default defineComponent({
    name: "ReportTemplate",
    props: ['template'],

    setup(props){
      const toast = useToast();
      const copytext = ()=>{
        copy(props.template)
        toast("Copy Done", {
            type: TYPE.INFO
        })
      }

      return{
        copytext
      }
    }
    
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

.copy-btn{
  width: 50%;
  margin: 0 auto;
  margin-bottom: 20px;
  background-color: cadetblue;
}
</style>