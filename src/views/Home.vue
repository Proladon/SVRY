<template>
    <div id="home">
        <p class="app-title">Soldier Vacation Report System</p>
        <span style="font-size: 12px">Developers: leon123858、Proladon</span>
        <div class="head-bar">
            <div class="unit head-bar-item"><span>3BWPN</span></div>
            <div class="classes head-bar-item" @click="openClassModal"><span>Class {{classNum}}</span></div>
        </div>

        <p class="now-time-period" @click="openTimePeriodModal">{{ timePeriod }}</p>

        <!-- Operate Button -->
        <div class="operate-btn report-btn" v-show="slide === 0" @click="showModal = true">
            <span>Report</span>
        </div>
        <br>
        <div class="quick-report-btn" v-show="slide === 0" >
            <div class="quick-report" @click="selectQuickSet = true">Quick Report</div>
            <div class="quick-report-setting" @click="quickReport = true">⚙</div>
        </div>
        

        <div class="operate-btn refresh-btn" v-show="slide === 1" @click="refreshTemplate"><span>Refresh</span></div>
        <div class="operate-btn copy-btn" v-show="slide === 1" @click="copytext"><span>Copy template</span></div>

        <p class="last-report" v-show="slide === 0">
                reported: {{ info.reported }} / un-reported: {{ info.unreported }}
        </p>

        <!-- Splide -->
        <splide :options="options" @splide:pagination:updated="changeView">
            <splide-slide>
                <Status :state="reportState" :info="info" />
            </splide-slide>
            <splide-slide>
                <ReportTemplate :template="template" />
            </splide-slide>
        </splide>
        
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

            <p style="font-size: 14px;">Default: 無感冒無發燒</p>

            <div class="modal__action">
                <button class="vfm-btn" @click="report">confirm</button>
            </div>
        </vue-final-modal>

        <!-- Time Period Modal -->
        <vue-final-modal v-model="timePeriodModal" classes="modal-container" content-class="modal-content">
            <p @click="chooseTimePeriod('1130')">1130</p>
            <p @click="chooseTimePeriod('1430')">1430</p>
            <p @click="chooseTimePeriod('1830')">1830</p>
            <p @click="chooseTimePeriod('2130')">2130</p>
        </vue-final-modal>

        <!-- Base&Class Modal -->
        <vue-final-modal v-model="classModal" classes="modal-container" content-class="modal-content">
            <p>Setting Class</p>
            
            <!-- <div class="class-num">
                <p  v-for="num in 10" :key="num" @click="chooseClass(num)">{{num}}</p>
            </div> -->

            <label for="people">班級</label>
            <input type="text"  id="classNum" class="user-input" placeholder="ex. 4 (range 1 ~ 10)">
            
            <label for="people">班級人數</label>
            <input type="text"  id="people" class="user-input" placeholder="ex. 15">

            <div class="modal__action">
                <button class="vfm-btn" @click="chooseClass">confirm</button>
            </div>
        </vue-final-modal>

        <!-- Loading Modal -->
        <vue-final-modal v-model="loading" classes="modal-container" content-class="modal-content">
            Loading
        </vue-final-modal>


        <!-- Quick Report Setting Modal -->
        <vue-final-modal v-model="quickReport" @before-open="initQuickSet" classes="modal-container" content-class="modal-content">
            <input type="text" v-for=" index in 5" :key="index" :id="`set_${index-1}`" >
            
            <div class="modal__action">
                <button class="vfm-btn" @click="setQuickReport">confirm</button>
            </div>
        </vue-final-modal>

        <!-- Select Quick Set Modal -->
        <vue-final-modal v-model="selectQuickSet" classes="modal-container" content-class="modal-content">
            <div class="quick-set">
                <p v-for=" index in 5" :key="index">{{quickSet.set[index-1]}}</p>
            </div>
        </vue-final-modal>
        
        
        <br>
        <span style="color:gray;">Made with ❤</span>
        <br>
        
    </div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref } from "vue";
import Status from "@/components/Status.vue";
import ReportTemplate from "@/components/ReportTemplate.vue";

import axios from "axios";
import date from "date-and-time";
import { useToast, TYPE } from "vue-toastification";
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import copy from 'copy-to-clipboard';

import "@splidejs/splide/dist/css/themes/splide-default.min.css";

export default defineComponent({
    name: "Home",
    components: {
        Status,
        Splide,
        SplideSlide,
        ReportTemplate,
    },

    setup() {
        // const apiUrl = ref("http://140.116.183.176:1451/") //成大server
        const apiUrl = ref("http://140.116.183.54:1341/")
        // const apiUrl = ref("https://cors-anywhere.herokuapp.com/http://140.116.183.176:1451/refreshJson")
        const classNum = ref('')
        const totalPeople = ref('')
        // Toast Notification init
        const toast = useToast();

        const quickSet = reactive({
            set:[]
        })

        // Time
        const timePeriod = ref("");
        const when = ref("");
        const template = ref("");

        // Modal
        const showModal = ref(false);
        const timePeriodModal = ref(false);
        const classModal = ref(false);
        const loading = ref(false)
        const quickReport = ref(false);
        const selectQuickSet = ref(false);

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
            getCool: false,
        });

        // Splide
        const options = {
            arrows: false,
            pagination: true,
            padding: 0,
            gap: 50,
        };

        const slide = ref(0);
        
        const checkTime = (auto=true) => {
            const now = new Date();
            const hours = now.getHours();
            const year = date.format(now, "YYYY") - 1911;

            if (auto){
                if (hours >=0 && hours < 12) {
                    timePeriod.value = 1130;
                } else if (hours >= 12 && hours < 15) {
                    timePeriod.value = 1430;
                } else if (hours >= 15 && hours < 19) {
                    timePeriod.value = 1830;
                } else if (hours >= 19) {
                    timePeriod.value = 2130;
                }
            }

            when.value = `${year}/${date.format(now, "M/D")} ${timePeriod.value}回報`
        };
      

        // API Operate
        const refreshJsonAPI = () => {
            loading.value = true
            axios({
                method: "post",
                url: apiUrl.value + "refreshJson",
                data: {
                    token: `3~%E5%85%B5%E5%99%A8~${classNum.value}~${totalPeople.value}~11~14~18~21`,
                    when: when.value,
                },
            }).then((res) => {
                // reset info
                info.total = 0;
                info.reported = 0;
                info.unreported = 0;

                // re-count info
                for (const i in res.data) {
                    info.total += 1;
                    if (res.data[i] !== "尚未回覆") {
                        info.reported += 1;
                    } else {
                        info.unreported += 1;
                    }
                }

                reportState.value = res.data;
                loading.value = false
            }).catch(()=>{
                toast("伺服器錯誤，請稍後再試，或連繫開發人員", {
                    type: TYPE.ERROR,
                });
            })
        };

        const getReportString = () => {
            loading.value = true
            axios({
                method: "post",
                url: apiUrl.value + "refresh",
                data: {
                    token: `3~%E5%85%B5%E5%99%A8~${classNum.value}~${totalPeople.value}~11~14~18~21`,
                    when: when.value,
                },
            }).then((res) => {
                template.value = res.data
                    .replaceAll('<strong style="background-color: gray;">', "")
                    .replaceAll("</strong>", "");
                    loading.value = false
            }).catch(()=>{
                toast("伺服器錯誤，請稍後再試，或連繫開發人員", {
                    type: TYPE.ERROR,
                });
            })
        };


        const sendAPI = (tagNum, doing) => {
            loading.value = true
            axios({
                method: "post",
                url: apiUrl.value + "send",
                data: {
                    token: `3~%E5%85%B5%E5%99%A8~${classNum.value}~${totalPeople.value}~11~14~18~21`,
                    when: when.value,
                    who: tagNum,
                    what: doing,
                },
            }).then(() => {
                refreshJsonAPI();

                showModal.value = false;
                loading.value = false
            }).then(()=>{
                getReportString();
                toast(tagNum + " Report success!", {
                    type: TYPE.SUCCESS,
                });
            }).catch(()=>{
                toast("伺服器錯誤，請稍後再試，或連繫開發人員", {
                    type: TYPE.ERROR,
                });
            })
        };


        const report = () => {
            // get user input
            let tagNum = document.getElementById("tagNum").value;
            let doing = document.getElementById("doing").value;
            
            // Checking Number Tag
            tagNum = String(Number(tagNum.trim()))

            if(tagNum === ''){
                toast("請輸入你的學號",{
                    type: TYPE.ERROR
                });
                return
            }else{
                window.localStorage.setItem('userNum', tagNum)
            }

            // Checking user input
            doing.trim();
            if(doing === ''){
                toast("請輸入你正在做什麼",{
                     type: TYPE.ERROR
                });
                return
            }

            let pass = true
            if (doing !== "尚未回覆") {
                // Checking health
                if (health.fever) {
                    pass = false
                    doing += " 有發燒";
                }
                if (health.hospital) {
                    pass = false
                    doing += " 有住院";
                }
                if (health.getCool) {
                    pass = false
                    doing += " 有感冒";
                } 
                if (pass) {
                    doing += " 無發燒無感冒";
                }
            }

            // Posting API
            sendAPI(tagNum, doing);
            
        };
        
        const refreshTemplate = ()=>{
            getReportString();
        }

        const openTimePeriodModal = ()=>{
            timePeriodModal.value = true
        };

        const chooseTimePeriod = (period)=>{
            timePeriod.value = Number(period)
            checkTime(false)
            timePeriodModal.value = false
            refreshJsonAPI()
            refreshTemplate()
        };

        const openClassModal = ()=>{
            classModal.value = true
        }

        const chooseClass = ()=>{
            const num = document.getElementById('classNum').value
            const people = document.getElementById('people').value
            let pass = true
            num.trim()
            people.trim()

            if(num !== ''){
                classNum.value = num
                window.localStorage.setItem('classNum', num)
            }else{
                pass = false
                toast("請輸入班級(數字)!", {
                    type: TYPE.ERROR
                })
            }

            if(people !== ''){
                totalPeople.value = people
                window.localStorage.setItem('totalPeople', people)
            }else{
                pass = false
                toast("請輸入班級人數(數字)!", {
                    type: TYPE.ERROR
                })
            }
            
            
            if (pass){
                refreshJsonAPI()
                getReportString()
                classModal.value = false
            }
            
        }

        const changeView = (data) => {
            slide.value = data._i;
        };

        const copytext = ()=>{
            copy(template.value)
            toast("Copy Done", {
                type: TYPE.INFO
            })
        }

        const initQuickSet = ()=>{
            const quickSetStorge = JSON.parse(localStorage.getItem('quickReportSet'))
            if(!quickSetStorge){
                localStorage.setItem('quickReportSet', JSON.stringify({}))
            }else{
                for(let index=0; index<5; index++){
                    document.getElementById(`set_${index}`).value = quickSetStorge[index]
                    quickSet.set = quickSetStorge
                }
            }

        }

        const setQuickReport = ()=>{
            
            const setData = {}
            for(let index=0; index<5; index++){
                const data = document.getElementById(`set_${index}`).value
                if(data !== ''){
                    setData[index]=data
                }
                
            }
            localStorage.setItem('quickReportSet', JSON.stringify(setData))
            quickSet.set = setData

            quickReport.value = false
        }

     



        onMounted(() => {
            
            const userNumStroge = localStorage.getItem('userNum')
            const classNumStorge = localStorage.getItem('classNum')
            const totalPeopleStorge = localStorage.getItem('totalPeople')
            
            

            if(classNumStorge === null || totalPeopleStorge === null){
                classModal.value = true
            }else{
                document.getElementById("tagNum").value = userNumStroge
                classNum.value = classNumStorge
                totalPeople.value = totalPeopleStorge
            }

            
            
            checkTime();
    
            refreshJsonAPI();
            getReportString();


        });

        return {
            toast,
            classNum,
            totalPeople,
            loading,
            setQuickReport,
            quickSet,
            initQuickSet,
            
            
            // Modal
            showModal,
            timePeriodModal,
            classModal,
            openClassModal,
            openTimePeriodModal,
            chooseTimePeriod,
            chooseClass,
            quickReport,
            selectQuickSet,
            
            // Report Info
            info,
            health,
            report,
            reportState,
            template,

            // API
            apiUrl,
            sendAPI,
            refreshJsonAPI,
            refreshTemplate,
            getReportString,

            checkTime,
            timePeriod,
            options,
            changeView,
            slide,
            copytext,
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
    margin-top: 10px;
    margin-bottom: 10px;
    color: var(--primary-gray);
}

.head-bar {
    display: flex;
    border: solid 1px var(--highlight-yellow);
    margin-top: 30px;
    margin-bottom: 30px;

    .head-bar-item {
        width: 100%;
        cursor: pointer;
    }

    .unit {
        color: var(--highlight-yellow);
    }
    .classes {
        color: var(--primary-dark);
        background-color: var(--highlight-yellow);
    }
}

.now-time-period {
    color: var(--highlight-yellow);
    font-size: 2.5rem;
    cursor: pointer;
}

.last-report {
    color: var(--secondary-gray);
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
    box-shadow: 5px 5px 10px 5px rgba(0, 0, 0, 0.364);
}
.modal__action {
    margin-top: 30px;

    .vfm-btn {
        font-family: 'Share Tech Mono', monospace;
        padding-left: 15px;
        padding-right: 15px;
        height: 30px;
        border-radius: 5px;
        border: none;
        outline: none;
        background-color: var(--highlight-yellow);
    }
}

.class-num{
    width: 200px;
    height: 150px;
    overflow: scroll;
}

.check-box-wrapper {
    display: flex;
    justify-content: space-between;
}

.operate-btn{
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.report-btn {
    width: 50%;
    margin: 0 auto;
    background-color: var(--highlight-red);
}

.quick-report-btn{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 50%;
    height: 30px;
    margin: 0 auto;
    background-color: skyblue;
    
    .quick-report{
        width: 100%;
    }

    .quick-report-setting{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 20%;
        height: 100%;
        background-color: grey;
    }
}

.refresh-btn{
  width: 50%;
  margin: 0 auto;
  margin-bottom: 20px;
  background-color: cadetblue;
}

.copy-btn{
  width: 50%;
  margin: 0 auto;
  margin-bottom: 20px;
  background-color: cadetblue;
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


