<template>
  <div id="report-template">
    <pre class="preview">{{template}}</pre>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";

export default defineComponent({
    name: "ReportTemplate",
    props: ['state', 'classNum', 'when'],
    
    setup(props){
      const template = computed({
          get: ()=>{
            const state = props.state
            let content = ""
            const title = `${props.when}\n應到: 14員\n實到: 14員\n`
            for(const key in state){
              content += `3${String(props.classNum)}${key} ${state[key]}\n`
            }
            return title + content
          }
      })
      
      return{ template }
    }
})
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