<template>
<!-- Loading Modal -->
        <vue-final-modal v-model="loading" classes="modal-container" content-class="modal-content">
            Loading
        </vue-final-modal>
</template>

<script>
import { defineComponent} from "vue";
   export default defineComponent({
       name: 'Loading',
   })
</script>
