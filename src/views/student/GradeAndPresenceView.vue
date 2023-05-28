<template>
    <div class="pt-5 px-1 w-100">
        <div class="text-center">
            <h1>Przedmiot</h1>
            <b-form-select v-model="selectedSubject" @change="filterData">
                <option value="null">--Wybierz przedmiot--</option>
                <option v-for="subject in uniqueSubjects" :key="subject._id" :value="subject._id">
                    {{ subject.title }}
                </option>
            </b-form-select>
        </div>
        <div v-if="selectedSubject != 'null'" class="m-4 text-center">
            <h1>Oceny</h1>
            <b-table hover stripped thead-class="bg-dark text-light" :items="filteredGrades" :fields="fields1">
                <template v-slot:cell(createdAt)="data3">
            {{ formattedDate(data3.item.createdAt) }}
        </template>
        <template v-slot:cell(updatedAt)="data4">
            {{ formattedDate(data4.item.updatedAt) }}
        </template>
            </b-table>
            <h1>Obecność</h1>
            <b-table hover stripped thead-class="bg-dark text-light" :items="filteredPresence" :fields="fields2">
                <template v-slot:cell(present)="data">
                {{ returnLetter(data.item.present) }}
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
            selectedSubject: "null",
            grades: [
            ],
            fields1: [{ key: "subject.title", label: "Przedmiot" },
            { key: "value", label: "Wartość" },
            { key: "createdAt", label: "Wystawiona dnia" },
            { key: "updatedAt", label: "Ostatnia edycja" },
            { key: "type", label: "Rodzaj" },
            { key: "comment", label: "Komentarz" }
            ],
            fields2: [{ key: "present", label: "Wartość" },
            { key: "createdAt", label: "Wystawiona dnia" },
            { key: "updatedAt", label: "Ostatnia edycja" },
            { key: "comment", label: "Komentarz" },
            ],
            presences: [],
        }
    },
    created() {
    },
    computed: {
        uniqueSubjects() {
            return this.grades
                .map(grade => grade.subject)
                .filter((subject, index, subjects) => subjects.findIndex(s => s._id == subject._id) == index)
                .map(subject => subject)
                .concat(this.presences
                    .map(presence => presence.subject)
                    .filter((subject, index, subjects) => subjects.findIndex(s => s._id == subject) == index)
                    .map(subject => subject)
                )
        },
        filteredGrades() {
            return (this.grades.filter(grade => grade.subject._id == this.selectedSubject))
        },
        filteredPresence() {
            return (this.presences.filter(presence => presence.subject._id == this.selectedSubject))
        }
    },
    mounted() {
        this.prepareData();
                    if (localStorage.getItem("role") != "student") {
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
            axios
                .get(`grades/student/` + localStorage.getItem("uid"), {
                    withCredentials: false,
                    headers: {
                                                       Authorization: `Bearer ` + localStorage.getItem("token"),

                    }
                }).then(data => (this.grades = data.data, console.log(data.data)));
            axios
                .get(`presences/` + localStorage.getItem("uid"), {
                    withCredentials: false,
                    headers: {
                                                       Authorization: `Bearer ` + localStorage.getItem("token"),

                    }
                }).then(data => this.presences = data.data);
        },
        changeState1() {
            document.getElementById("selector").style.display = "block";
            this.disabled = false;
        },
        changeState2() {
            document.getElementById("display").style.display = "none";
            this.disabled = true;
            this.subjectNameSelect = null;
        },
        filterData() {

        },
        returnLetter(str){
            if(str == 'excused') return 'Usprawiedliwone'
            if(str == 'present') return 'Obecny'
            if(str == 'absent') return 'Nieobecny'
        }
    },
}
</script>