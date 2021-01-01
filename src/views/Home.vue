<template>
    <div id="home">
        <p class="app-title">Soldier Vacation Report System</p>
        <div class="head-bar">
            <div class="unit head-bar-item"><span>3BWPN</span></div>
            <div class="classes head-bar-item"><span>Class 4</span></div>
        </div>

        <p class="last-report">Last Report: 2020 / 12 / 27 14:26</p>

        <div class="report-btn" @click="showModal = true">
            <span>Report</span>
        </div>
        
        <!-- <Status :state="reportState" :info="info" /> -->

        <!-- Report Modal -->
        <vue-final-modal v-model="showModal" classes="modal-container" content-class="modal-content">
            Report form

            <input type="text" id="tagNum" class="user-input" placeholder="You're number" />
            <input type="text" id="doing" class="user-input" placeholder="What you are doing?" />

            <!-- Check Box -->
            <div class="check-box-wrapper">
                <input type="checkbox" name="fever" v-model="health.fever" />
                <label for="fever">發燒</label>

                <input type="checkbox" name="hospital" v-model="health.hospital" />
                <label for="hospital">看診</label>

                <input type="checkbox" name="getCool" v-model="health.getCool" />
                <label for="getCool">感冒</label>
            </div>

            <div class="modal__action">
                <button class="vfm-btn" @click="report">confirm</button>
            </div>
        </vue-final-modal>

        <splide :options="options" @splide:dragged="dragged">
            <splide-slide>
                <Status :state="reportState" :info="info" />
            </splide-slide>
            <splide-slide>
                <ReportTemplate :report="reportState" />
            </splide-slide>
        </splide>
    </div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref } from "vue";
import Status from "@/components/Status.vue";
import ReportTemplate from "@/components/ReportTemplate.vue";
import axios from "axios";
import { useToast, TYPE  } from "vue-toastification";
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import '@splidejs/splide/dist/css/themes/splide-default.min.css';

export default defineComponent({
    name: "Home",
    components: { 
        Status,
        Splide,
        SplideSlide,
        ReportTemplate
    },

    setup() {
        // Toast Notification init
        const toast = useToast();

        const health = reactive({
            fever: false,
            hospital: false,
            getCool: false
        })
        const today = ref(new Date())
        const showModal = ref(false);
        const reportState = ref(null);
        const info = reactive({
            total: 0,
            reported: 0,
            unreported: 0,
        });
        const options = {
            arrows: false,
            pagination: false
        }
        const tt = ()=>{
            setTimeout(() => {
                console.log(health.fever)
            });
        }

        const refreshAPI = () => {
            axios({
                method: "post",
                url: "https://cors-anywhere.herokuapp.com/http://140.116.183.176:1451/refreshJson",
                data: {
                    token: "3~%E6%B8%AC%E8%A9%A6~20~15~11~14~18~21",
                    when: "109/12/31 2130回報",
                },
            }).then((res) => {
                for (const i in res.data) {
                    info.total += 1;
                    if (res.data[i] !== "尚未回覆") {
                        info.reported += 1;
                    }
                    else{info.unreported += 1}
                }
                reportState.value = res.data;
            });
        };

        const report = () => {
            const tagNum = document.getElementById("tagNum").value;
            let doing = document.getElementById("doing").value;

            // Checking health
            if (health.fever){doing += ' 有發燒'}
            if (health.hospital){doing += ' 有住院'}
            if (health.getCool){doing += ' 有感冒'}

            // Posting API
            axios({
                method: "post",
                url: "https://cors-anywhere.herokuapp.com/http://140.116.183.176:1451/send",
                data: {
                    token: "3~%E6%B8%AC%E8%A9%A6~20~15~11~14~18~21",
                    when: "109/12/31 2130回報",
                    who: tagNum,
                    what: doing,
                },
            }).then((res) => {
                
                refreshAPI();
                toast("Report success!", {
                        type: TYPE.SUCCESS 
                    })
                showModal.value = false;
            });
        };

        const dragged = () => {
            refreshAPI();
        }

        onMounted(() => {
            refreshAPI();
        });

        return {
            tt,
            toast,
            info,
            health,
            showModal,
            reportState,
            refreshAPI,
            report,
            dragged,
            today,
            options,
        };
    },
});
</script>

<style lang="scss" scoped>
#home {
    width: 100%;
    height: 100%;
}

.app-title {
    margin-top: 30px;
    margin-bottom: 30px;
    color: var(--primary-gray);
}

.head-bar {
    display: flex;
    border: solid 1px var(--highlight-yellow);
    margin-top: 30px;
    margin-bottom: 30px;
    .head-bar-item {
        width: 100%;
    }

    .unit {
        color: var(--highlight-yellow);
    }
    .classes {
        color: var(--primary-dark);
        background-color: var(--highlight-yellow);
    }
}
.last-report {
    color: var(--secondary-gray);
}
.report-btn {
    width: 50%;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    background-color: var(--highlight-red);
}

::v-deep .modal-container {
    display: flex;
    justify-content: center;
    align-items: center;
}
::v-deep .modal-content {
    position: relative;
    display: flex;
    flex-direction: column;
    max-height: 90%;
    margin: 0 1rem;
    padding: 2rem;
    border-radius: 0.5rem;
    background: var(--secondary-gray);
    box-shadow: 5px 5px 10px 5px rgba(0, 0, 0, 0.364) ;
}
.modal__action {
    margin-top: 30px;

    .vfm-btn{
        padding-left: 15px;
        padding-right: 15px;
        height: 30px;
        border-radius: 5px;
        border: none;
        outline: none;
        background-color: var(--highlight-yellow);
    }
}

.check-box-wrapper{
    display: flex;
    justify-content: space-between;
}
.user-input {
    height: 1.5rem;
    margin-top: 10px;
    margin-bottom: 10px;
    text-align: center;
    border: solid 0.25px gray;
    border-radius: 0.5rem;
}
</style>
