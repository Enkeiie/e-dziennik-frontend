<template>
    <div class="pt-5 px-1 w-100">
        <!--Formularz przypisania testu-->
        <b-modal id="modal-add-test" title="Dodaj test" hide-footer size="md">
            <b-form @submit.prevent="addAssignment">
                <label>Klasa</label>
                <b-select v-model="classSelectValue">
                    <option value="null">--Wybierz klasę--</option>
                    <option v-for="grade in classes" :key="grade._id" :value="grade._id">{{
                        grade.number + grade.code + " " + grade.year
                    }}</option>
                </b-select>
                <label>Test</label>
                <b-select v-model="testSelectValue">
                    <option value="null">--Wybierz test--</option>
                    <option v-for="test in tests" :key="test._id" :value="test._id">{{ test.title }}</option>
                </b-select>
                <label>Przedmiot</label>
                <b-select v-model="subjectSelectValue">
                    <option value="null">--Wybierz przedmiot--</option>
                    <option v-for="subject in subjects" :key="subject._id" :value="subject._id">{{ subject.title }}
                    </option>
                </b-select>
                <label>Data rozpoczęcia testu</label>
                <b-input v-model="createAssignment.dateAssigned" type="datetime-local"></b-input>
                <label>Data zakończenia testu</label>
                <b-input v-model="createAssignment.expirationDate" type="datetime-local"></b-input>
                <b-btn type="submit" variant="success">Przypisz test</b-btn>
            </b-form>
        </b-modal>
        <!--Koniec przypisania testu-->
        <div>
            <b-btn variant="success" class="mb-2" style="float:left" v-b-modal.modal-add-test scrollable>Przypisz
                test</b-btn>
        </div><br /><br />
        <div class="text-center m-2" style="overflow-x: auto">
            <h1>Aktywne</h1>
            <table class="table border border-collapse" hover stripped thead-class="bg-dark text-light" responsive="sm">
                <tr v-for="assignment in cassignments" :key="assignment._id">
                    <td>{{ assignment.classId.number + assignment.classId.code + " " + assignment.classId.year }}</td>
                    <td>{{ assignment.testId.title }}</td>
                    <td>{{ assignment.testId.title }}</td>
                    <td>{{ assignment.subjectId.title }}</td>
                    <td>{{ formattedDate(assignment.dateAssigned) }}</td>
                    <td>{{ formattedDate(assignment.expirationDate) }}</td>
                    <td><b-btn variant="danger" @click="deleteAssignment(assignment._id)">Usuń</b-btn></td>
                </tr>
            </table>
            <h1>Wygasłe (archiwum)</h1>
            <table class="table border border-collapse" stripped hover responsive="sm">
                <tr v-for="assignment in eassignments" :key="assignment._id">
                    <td>{{ assignment.classId.number + assignment.classId.code + " " + assignment.classId.year }}</td>
                    <td>{{ assignment.testId.title }}</td>
                    <td>{{ assignment.subjectId.title }}</td>
                    <td>{{ formattedDate(assignment.dateAssigned) }}</td>
                    <td>{{ formattedDate(assignment.expirationDate) }}</td>
                </tr>
            </table>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import '../../interceptors/axios';

export default {
    data() {
        return {
            cassignments: [],
            eassignments: [],
            subjectSelectValue: null,
            subjects: [],
            tests: [],
            classes: [],
            createAssignment: {
                testId: "",
                classId: "",
                teacherId: localStorage.getItem("uid"),
                dateAssigned: "",
                expirationDate: "",
            },
            classSelectValue: null,
            testSelectValue: null,
            fields1: [{
                key: 'index', label: '#'
            },
            { key: 'classId.number', label: 'Number' },
            { key: 'classId.code', label: 'Code' },
            { key: 'classId.year', label: 'Year' },
            { key: 'testId.title', label: 'Title' },
            { key: 'testId.pass', label: 'Pass' },
            { key: 'teacherId', label: 'Teacher' },
            { key: 'dateAssigned', label: 'Date Assigned' },
            { key: 'expirationDate', label: 'Expiration Date' }],
        }
    },
    created() {
        this.prepareData();
        if(localStorage.getItem("role")!="teacher"){
            this.$router.push('/error/403');
        }
    },
    computed: {
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
            this.roles = localStorage.getItem('role');
            axios
                .get(`/classes/getters/names/` + localStorage.getItem('uid'),{
                    withCredentials: false,
                    headers: {
Authorization: `Bearer ` + localStorage.getItem("token"),
                    }
                })
                .then(data => (this.classes = data.data));
            axios
                .get(`/tests/teacher/` + localStorage.getItem('uid'),{
                    withCredentials: false,
                    headers: {
Authorization: `Bearer ` + localStorage.getItem("token"),
                    }
                })
                .then(data => (this.tests = data.data));
            axios
                .get(`/assigned-tests/teacher/` + localStorage.getItem('uid') + '/active', {
                    headers: {
                        'Authorization': `Bearer ` + localStorage.getItem('token')
                    }
                })
                .then(data => (this.cassignments = data.data, console.log(this.cassignments)));
            axios
                .get(`/assigned-tests/teacher/` + localStorage.getItem('uid') + '/expired', {
                    withCredentials: false,
                    headers: {
Authorization: `Bearer ` + localStorage.getItem("token"),
                    }
                })
                .then(data => (this.eassignments = data.data, console.log(this.eassignments)));
            axios
                .get(`/subjects/getters/names/` + localStorage.getItem('uid'), {
                    withCredentials: false,
                    headers: {
Authorization: `Bearer ` + localStorage.getItem("token"),
                    }
                })
                .then(data => this.subjects = data.data)
        },
        async addAssignment() {
            this.createAssignment.subjectId = this.subjectSelectValue;
            this.createAssignment.classId = this.classSelectValue;
            this.createAssignment.testId = this.testSelectValue;
            if (!this.createAssignment.classId || !this.createAssignment.dateAssigned || !this.createAssignment.expirationDate || !this.createAssignment.teacherId || !this.createAssignment.testId){
                alert("Wypełnij poprawnie pola")
                return
            }
                axios
                    .post(`/assigned-tests/`, this.createAssignment, {
                        withCredentials: false,
                        headers: {
                                                       Authorization: `Bearer ` + localStorage.getItem("token"),


                        }
                    });
            this.$router.go(0)
        },
        async deleteAssignment(id) {
            axios
                .delete(`/assigned-tests/` + id, {
                    withCredentials: false,
                    headers: {
                                               Authorization: `Bearer ` + localStorage.getItem("token"),

                    }
                });
            this.$router.go(0)
        }
    },
}  
</script>