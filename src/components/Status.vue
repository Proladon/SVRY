<template>
    
    <div id="Status">
        <div class="status-tag" v-for="(p, index) in state" :key="p.tag">
            <div class="tag-content">
                <div class="color-tag" :class="{'reported' : !p.includes('尚未回覆'), 'unreported' : p.includes('尚未回覆')}"></div>
                <div class="name-tag">#{{index.slice(2, index.length)}}</div>
            </div>
        </div>

    </div>
</template>

<script>
import { defineComponent, props } from 'vue';
   export default defineComponent({
       name: 'Status',

       props: ['state', 'info']
   })
</script>

<style scoped lang="scss">
    #Status {
        margin-top: 30px;
        width: 100%;
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-content: flex-start;
    }

    .status-tag {
        width: 40%;
        height: 30px;
        margin-top: 5px;
        border: solid 1px gray;

        .tag-content {
            display: flex;
            width: 100%;
            height: 100%;

            .color-tag {
                width: 10%;
                height: 100%;
            }

            .name-tag {
                text-align: left;
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: var(--secondary-gray);
            }
        }

    }

    .reported {
        color: violet;
        background-color: #9BF570 !important;
    }

    .unreported {
        background-color: var(--primary-gray);
    }
</style>