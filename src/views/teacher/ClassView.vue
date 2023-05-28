<template>
    <div class="pt-5 px-1 w-100">
        <label>Klasa</label>
        <b-form-select v-model="selectedClass" @change="reset" class="mb-2" id="class">
            <option :value="null">--Wybierz--</option>
            <option v-for='(classa,index) in mclass' :key="index" :value="index">{{
                classa.number+""+classa.code+" | "+classa.year
            }}</option>
        </b-form-select>
        <div v-if="selectedClass!=null">
        <label>Uczeń</label>
        <b-form-select v-model="selectedStudent" @change="grades" class="mb2" id="student">
            <option :value="null">--Wybierz--</option>
            <option v-for='student in mclass[selectedClass].students' :key="student._id" :value="student._id">{{
                student.first_name
            }}
                {{ student.last_name }}</option>
        </b-form-select>
        <label>Przedmiot</label>
        <b-form-select v-model="selectedSubject"  @change="grades" class="mb2" id="subject">
            <option :value="null">--Wybierz--</option>
            <option v-for='subject in mclass[selectedClass].subjects' :key="subject._id" :value="subject._id">{{ subject.title }}
            </option>
        </b-form-select>
        </div>
        <div class="tw-m-2">
        <h1>Oceny</h1>
        <b-table hover stripped :items="marks" :responsive="true" :fields="fields1" thead-class="bg-dark text-light">
        <template v-slot:cell(index)="data">
            {{ data.index + 1 }}
        </template>
        <template v-slot:cell(createdAt)="data3">
            {{ formattedDate(data3.item.createdAt) }}
        </template>
        <template v-slot:cell(updatedAt)="data4">
            {{ formattedDate(data4.item.updatedAt) }}
        </template>
        </b-table>
        <h2>Obecności</h2>
        <b-table :items="presences" :responsive="true"  :fields="fields2"  hover stripped thead-class="bg-dark text-light">
            <template v-slot:cell(index)="data">
            {{ data.index + 1 }}
        </template>
        <template v-slot:cell(present)="data2">
            {{ returnLetter(data2.item.present) }}
        </template>
        <template v-slot:cell(createdAt)="data3">
            {{ formattedDate(data3.item.createdAt) }}
        </template>
        <template v-slot:cell(updatedAt)="data4">
            {{ formattedDate(data4.item.updatedAt) }}
        </template>
        </b-table>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import '../../interceptors/axios';
export default {
    data() {
        return {
            mclass: null,
            selectedSubject: null,
            selectedStudent: null,
            selectedClass: null,
            marks: [],
            presences: [],
            fields1: [
                { key:'index', label: "#"},
                { key: 'value', label: "Wartość"},
                { key: 'type', label: "Rodzaj oceny"},
                { key: 'comment', label: "Komentarz"},
                { key: 'createdAt', label: "Wystawiona"},
                { key: 'updatedAt', label: "Ostatnia modyfikacja"},
            ],
            fields2: [
                { key:'index', label: "#"},
                { key: 'present', label: "Wartość"},
                { key: 'comment', label: "Komentarz"},
                { key: 'createdAt', label: "Wystawiona"},
                { key: 'updatedAt', label: "Ostatnia modyfikacja"},
            ],
        }
    },
    created() {
        this.prepareData();
    },
    computed: {
        students(arr) {
            return arr;
        },
    },
        mounted() {
                    if (localStorage.getItem("role") != "teacher") {
            this.$router.push('/error/403');
            }
    },
    methods: {
        formattedDate(dateStr) {
      const date = new Date(dateStr)
      const hours = date.getUTCHours().toString().padStart(2, '0')
      const minutes = date.getUTCMinutes().toString().padStart(2, '0')
      const day = date.getUTCDate().toString().padStart(2, '0')
      const month = (date.getUTCMonth() + 1).toString().padStart(2, '0')
      const year = date.getUTCFullYear().toString().substr(-2)
      return `${hours}:${minutes} ${day}.${month}.${year}`
    },
        async prepareData() {
           await  axios
                .get(`/classes/teacher/` + localStorage.getItem('uid'),{
                    withCredentials: false,
                    headers: {
Authorization: `Bearer ` + localStorage.getItem("token"),
                    }
                })
                .then(data => (this.mclass = data.data, console.log(this.mclass)));
        },
        async getGrades() {
            let data = this.selectedStudent;
            if (!data) {
                return new Array();
            }
            let res2 = await axios.get("presences/"+ this.selectedStudent,{
                    withCredentials: false,
                    headers: {
Authorization: `Bearer ` + localStorage.getItem("token"),
                    }
                });
            let res = await axios.get("grades/student/" + this.selectedStudent,{
                    withCredentials: false,
                    headers: {
Authorization: `Bearer ` + localStorage.getItem("token"),
                    }
                });
            data = res.data;
            let data2 = res2.data;
            let data3 = data.filter(grade => grade.subject._id == this.selectedSubject);
            let data4 = data2.filter(presence => presence.subject._id == this.selectedSubject);
            this.marks = data3;
            this.presences = data4;
        },
        async grades() {
            return this.selectedStudent && this.selectedSubject ? await this.getGrades(this.selectedStudent) : []
        },
        reset(){
            this.marks=null;
        },
        returnLetter(str){
            if(str == 'excused') return 'Usprawiedliwiony'
            if(str == 'present') return 'Obecny'
            if(str == 'absent') return 'Nieobecny'
        }
    }
}
</script>