<template>
    <div class="pt-5 px-1 w-100">
        <label>Uczeń</label>
        <b-form-select v-model="selectedStudent" @change="subjects(), reset()">
            <option :value="null">--Wybierz--</option>
            <option v-for='student in children' :key="student.studentId._id" :value="student.studentId._id">{{
                student.studentId.first_name
            }}
                {{ student.studentId.last_name }}</option>
        </b-form-select>
        <label>Przedmiot</label>
        <b-form-select v-model="selectedSubject" @change="grades">
                <option value="null">--Wybierz przedmiot--</option>
                <option v-for="subject in studentSubjects" :key="subject._id" :value="subject._id">
                    {{ subject.title }}
                </option>
            </b-form-select>
        <div class="tw-m-2">
        <h1>Oceny</h1>
        <b-table hover stripped thead-class="bg-dark text-light" :items="marks" :responsive="true" :fields="fields1">
        <template v-slot:cell(index)="data">
            {{ data.index + 1 }}
        </template>
        <template v-slot:cell(createdAt)="data2">
            {{ formattedDate(data2.item.createdAt) }}
        </template>
        <template v-slot:cell(updatedAt)="data3">
            {{ formattedDate(data3.item.updatedAt) }}
        </template>
        </b-table>
        <h2>Obecności</h2>
        <b-table hover stripped thead-class="bg-dark text-light" :items="presences" :responsive="true"  :fields="fields2">
            <template v-slot:cell(index)="data">
            {{ data.index + 1 }}
        </template>
            <template v-slot:cell(present)="data">
                {{ returnLetter(data.item.present) }}
            </template>
            <template v-slot:cell(createdAt)="data2">
            {{ formattedDate(data2.item.createdAt) }}
        </template>
        <template v-slot:cell(updatedAt)="data3">
            {{ formattedDate(data3.item.updatedAt) }}
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
            children: null,
            studentSubjects: [],
            selectedSubject: null,
            selectedStudent: null,
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
                    if (localStorage.getItem("role") != "parent") {
                        this.$router.push('/error/403');
                        return;
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
            axios
                .get(`/parents-children/parent/` + localStorage.getItem('uid'),{
                    withCredentials: false,
                    headers: {
Authorization: `Bearer ` + localStorage.getItem("token"),
                    }
                })
                .then(data => (this.children = data.data));
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
        async subjects() {
            let tmp = this.selectedStudent;
            console.log(tmp)
            let res = await axios.get(`classes/student/`+tmp,{
                    withCredentials: false,
                    headers: {
Authorization: `Bearer ` + localStorage.getItem("token"),
                    }
                });
            let data = res.data.subjects;
            console.log(data);
            this.studentSubjects = data;
        },
        reset(){
            this.selectedSubject=null;
            this.marks=null;
            this.presences=null;
        },
        returnLetter(str){
            if(str == 'excused') return 'Usprawiedliwony'
            if(str == 'present') return 'Obecny'
            if(str == 'absent') return 'Nieobecny'
        }
    }
}
</script>