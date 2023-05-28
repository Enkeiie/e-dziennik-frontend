<template>
    <div class="pt-5 px-1 w-100">
        <b-card class="w-fit" style="margin: 0 auto">
            <b-form @submit.prevent="wait">
                <h2>Wybierz Klasę</h2>
                <b-select name="select1" v-model="classNameSelect">
                    <option :value="null">---Wybierz---</option>
                    <option :value="classa._id" v-for="classa in classes" :key="classa._id">{{ classa.number + ' ' + classa.code }}</option>
                </b-select>
                <div class="d-flex justify-content-center m-2">
                    <b-btn type="submit" variant="success" @click="changeState1()" class="w-25">Dalej</b-btn>
                </div>
            </b-form>
            <b-form @submit.prevent="wait">
                <div class="d-flex justify-content-center m-2">
                    <b-btn variant="danger" id="BackBtn" style="display:none" @click="changeState2()" class="w-25">Wstecz</b-btn>
                </div>
                <h2>Wybierz Przedmiot</h2>
                <b-select name="select2" :disabled="disabled" v-model="subjectNameSelect" id="getName">
                    <option :value="null">---Wybierz---</option>
                    <option :value="subject._id" v-for="subject in subjects" :key="subject._id">{{ subject.title + ' | ' + subject.code }}</option>
                </b-select>
                <div class="d-flex justify-content-center m-2">
                    <b-btn type="submit" class="w-25" variant="success" :disabled="disabled" @click="go">Wyszukaj</b-btn>
                </div>
            </b-form>
        </b-card>
    </div>
</template>
<script>
import axios from 'axios';
import '../../interceptors/axios';
export default {
    data() {
        return{
            disabled: true,
            subjectNameSelect: null,
            classNameSelect: null,
            classes: [],
            subjects: [],
            roles: null,
        }
    },
    mounted() {
        this.prepareData();
                    if (localStorage.getItem("role") != "teacher") {
            this.$router.push('/error/403');
        }
    },
    methods: {
        async prepareData(){
            this.roles=localStorage.getItem('role');
            axios
                .get(`/classes/getters/names/`+localStorage.getItem('uid'),{
                    withCredentials: false,
                    headers: {
Authorization: `Bearer ` + localStorage.getItem("token"),
                    }
                })
                .then(data => (this.classes = data.data));
                axios
                .get(`/subjects/getters/names/`+localStorage.getItem('uid'),{
                    withCredentials: false,
                    headers: {
Authorization: `Bearer ` + localStorage.getItem("token"),
                    }
                })
                .then(data => (this.subjects = data.data));  
        },
        changeState1(){
            if(!this.classNameSelect){
                alert("Wybierz poprawną wartość")
                return
            }
            document.getElementById("BackBtn").style.display="block";
            this.disabled=false;
        },
        changeState2(){
            document.getElementById("BackBtn").style.display="none";
            this.disabled=true;
            this.subjectNameSelect=null;
        },
        go(){
            if(!this.subjectNameSelect){
                alert("Wybierz poprawną wartość")
                return
            }
            const selectElement = document.getElementById('getName')
            localStorage.setItem("SubjectName",selectElement.options[selectElement.selectedIndex].text);
            this.$router.push("/teacher/grades/"+this.classNameSelect+'/'+this.subjectNameSelect)
        },
        wait(){

        }
    },
}
</script>