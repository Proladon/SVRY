<template>
    <div id="home">
        <p class="app-title">Soldier Vacation Report System</p>
        <div class="head-bar">
            <div class="unit head-bar-item"><span>3BWPN</span></div>
            <div class="classes head-bar-item"><span>Class 4</span></div>
        </div>

        <p class="now-time-period">{{timePeriod}}</p>
        
        <!-- Report Button -->
        <div class="report-btn" @click="showModal = true">
            <span>Report</span>
        </div>

        <p class="last-report">reported: {{info.reported}} / un-reported: {{info.unreported}}</p>

        
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

        <splide :options="options" @splide:dragged="dragged" @splide:pagination:updated="changeView">
            <splide-slide>
                
                <Status :state="reportState" :info="info" />
            </splide-slide>
            <splide-slide>
                <ReportTemplate :template="template" />
            </splide-slide>
        </splide>
    </div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref } from "vue";
import Status from "@/components/Status.vue";
import ReportTemplate from "@/components/ReportTemplate.vue";
import axios from "axios";
import date from 'date-and-time';
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

        // Time
        const timePeriod = ref('')
        const today = ref(date.format(new Date(), 'YYYY/MM/DD'))
        const when = ref('')
        const template = ref('')

        // Modal
        const showModal = ref(false);

        // Report
        const reportState = ref(null);
        const info = reactive({
            total: 0,
            reported: 0,
            unreported: 0,
        });
        const health = reactive({
            fever: false,
            hospital: false,
            getCool: false
        })

        // Splide
        const options = {
            arrows: false,
            pagination: true,
            padding: 0,
            gap: 50,
        }

        const slide = ref(0)
        

        const refreshAPI = () => {
            
            axios({
                method: "post",
                url: "://140.116.183.176:1451/refreshJson", 
                // url: "http://140.116.183.176:1451/refreshJson",
                // url: "https://cors-anywhere.herokuapp.com/http://140.116.183.176:1451/refreshJson",
                data: {
                    // token: "3~%E6%B8%AC%E8%A9%A6~20~15~11~14~18~21", test
                    token: "3~%E5%85%B5%E5%99%A8~4~15~11~14~18~21",
                    when: when.value,
                },
            }).then((res) => {
                info.total = 0
                info.reported = 0
                info.unreported = 0
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
            doing.trim()
            
            if(doing !== '尚未回覆'){
                // Checking health
                if (health.fever){doing += ' 有發燒'}
                if (health.hospital){doing += ' 有住院'}
                if (health.getCool){doing += ' 有感冒'}
                else{doing += ' 無發燒無感冒'}
            }


            // Posting API
            axios({
                method: "post",
                url: "://140.116.183.176:1451/send",
                // url: "http://140.116.183.176:1451/send",
                // url: "https://cors-anywhere.herokuapp.com/http://140.116.183.176:1451/send",
                data: {
                    // token: "3~%E6%B8%AC%E8%A9%A6~20~15~11~14~18~21",
                    token: "3~%E5%85%B5%E5%99%A8~4~15~11~14~18~21",
                    when: when.value,
                    who: tagNum,
                    what: doing,
                },
            }).then((res) => {
                
                refreshAPI();
                toast(tagNum + " Report success!", {
                        type: TYPE.SUCCESS 
                    })
                showModal.value = false;
            });
        };

        const dragged = () => {
            refreshAPI();

            axios({
                method: "post",
                url: "://140.116.183.176:1451/refresh",
                // url: "http://140.116.183.176:1451/refresh",
                // url: "https://cors-anywhere.herokuapp.com/http://140.116.183.176:1451/refresh",
                data: {
                    // token: "3~%E6%B8%AC%E8%A9%A6~20~15~11~14~18~21",
                    token: "3~%E5%85%B5%E5%99%A8~4~15~11~14~18~21",
                    when: when.value,
                },
            }).then(res=>{
                template.value = res.data
                    .replaceAll('<strong style="background-color: gray;">', '')
                    .replaceAll('</strong>', '')
            })
        }

        const changeView = (data)=>{
            slide.value = data._i
        }

        onMounted(() => {
            
            // '109/12/31 2130回報'
            const now = new Date()
            const hours = now.getHours()
            const year = date.format(now, 'YYYY') - 1911


            const checkTime = ()=>{
                if (hours > 9 && hours < 12){
                    timePeriod.value = 1130
                }
                else if (hours > 12 && hours < 15){
                    timePeriod.value = 1430
                }
                else if (hours > 15 && hours < 19){
                    timePeriod.value = 1830
                }
                else if (hours > 19){
                    timePeriod.value = 2130
                }
            }
            checkTime()
            
            when.value = (String(year + '/' + date.format(now, 'MM/DD') + ' '+ timePeriod.value + '回報') )
            
            setInterval(()=>{
                checkTime()
            }, 30000)
            
            refreshAPI();
                
        });

        return {
            toast,
            info,
            health,
            showModal,
            reportState,
            refreshAPI,
            report,
            template,
            dragged,
            timePeriod,
            options,
            changeView,
            slide
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

.now-time-period{
    color: var(--highlight-yellow);
    font-size: 2.5rem;
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
