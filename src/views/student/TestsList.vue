<template>
    <div class="m-2 text-center">
        <h1>Moje testy</h1>
        <div v-for="test in filteredTests" :key="test._id" class="border m-2 p-4 w-auto text-left">
            <div>
                <h1>Test: {{ test.testId.title }}</h1>
                <h4>Przedmiot: {{ test.subjectId.title }}</h4>
            </div>
            <div>
                Przypisany dnia: {{ ' '+formattedDate(test.dateAssigned) }}<br/>Wygasa dnia: {{ ' '+formattedDate(test.expirationDate) }}
            </div>
            <div>
                <b-btn variant="info" @click="getToTest(test.testId._id,test.subjectId._id,test._id)">Rozwiąż test</b-btn>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import '../../interceptors/axios';
export default {
    data() {
        return {
            tests: [],
        };
    },
    created() {
        this.fetchData()
    },
    computed: {
        filteredTests() {
            return (this.tests.filter(test => !test.solvedIds.includes(localStorage.getItem("uid"))))
        },
    },
        mounted() {
                  if (localStorage.getItem("role") != "student") {
            this.$router.push('/error/403');
        }  
    },
    methods:{
        formattedDate(dateStr) {
      const date = new Date(dateStr)
      const hours = date.getUTCHours().toString().padStart(2, '0')
      const minutes = date.getUTCMinutes().toString().padStart(2, '0')
      const day = date.getUTCDate().toString().padStart(2, '0')
      const month = (date.getUTCMonth() + 1).toString().padStart(2, '0')
      const year = date.getUTCFullYear().toString().substr(-2)
      return `${hours}:${minutes} ${day}.${month}.${year}`
    },
        async fetchData(){
            axios.get(`/assigned-tests/student/`+localStorage.getItem("class"),{
                    withCredentials: false,
                    headers: {
Authorization: `Bearer ` + localStorage.getItem("token"),
                    }
                }).then(data => this.tests=data.data);
        },
        async getToTest(id,id2,id3){
            localStorage.setItem("assignment",id3);
            localStorage.setItem("subject",id2);
            this.$router.push('/student/tests/'+id);
        }
    }
}
</script>