<template>
    <div class="m-2 text-center">
        <div id="test">
            <h1>{{ test.title }}</h1>
            <form @submit.prevent="grade">
                <div v-for='(question, index) in test.questions' :key="question._id" class="m-2 p-4 border text-left">
                    <label>{{ question.header }}: </label>
                    <b-form-select v-model="selectedAnswers[index]">
                        <option v-for="answer in question.answers" :key="answer.content">
                            {{ answer.content }}
                        </option>
                    </b-form-select>
                </div>
                <b-btn type="success">Prześlij</b-btn>
            </form>
        </div>
        <div id="results" style="display:none">
            <h1>Uzyskałeś{{ ' '+points + ' ' }}punktów na{{ ' '+max + ' ' }}punktów</h1>
            <h2>Twoja ocena to {{ rs }}</h2>
            <b-btn>
                <RouterLink to="/student/tests">Wróć do testów</RouterLink>
            </b-btn>
        </div>

    </div>
</template>
<script>
import axios from 'axios';
import '../../interceptors/axios';
import { RouterLink } from 'vue-router';
export default {
    data() {
        return {
            test: [],
            answers: null,
            points: 0,
            max: 0,
            rs: 0,
            createGradeDto: {
                student: localStorage.getItem("uid"),
                type: "Sprawdzian",
                subject: localStorage.getItem("subject"),
                value: "",
                comment: "",
            }
        };
    },
    created() {
        this.fetchData();
    },
    computed: {
        selectedAnswers() {
            return Array(this.test.questions.length).fill({});
        },
    },
    methods: {
        async fetchData() {
            axios.get(`/tests/` + this.$route.params.id, {
                    withCredentials: false,
                    headers: {
Authorization: `Bearer ` + localStorage.getItem("token"),
                    }
                }).then(data => this.test = data.data);
        },
        async grade() {
            let points = 0;
            let max = this.selectedAnswers.length;
            let pass = 0.5;
            let treshold = (1 - pass) / 4;
            this.selectedAnswers.forEach((answer, index) => {
                if (answer == this.test.questions[index].correct) {
                    points++;
                }
            });
            let res = points / max;
            this.max = max;
            this.points = points;
            if (res < pass) {
                this.rs = 1;
            }
            else {
                if (res >= pass && res < (pass + treshold)) {
                    this.rs = 2
                }
                if (res >= pass && res <= (pass + (treshold * 2))) {
                    this.rs = 3
                }
                else if (res >= (pass + treshold) && res <= (pass + (treshold * 3))) {
                    this.rs = 4
                }
                else if (res >= (pass + (treshold * 2)) && res <= (pass + (treshold * 4))) {
                    this.rs = 5;
                }
            }
            document.getElementById("results").style.display = "block";
            document.getElementById("test").style.display = "none";
            this.createGradeDto.value = this.rs;
            this.createGradeDto.comment = this.test.title;
            axios.post('grades/test/grade',this.createGradeDto,{
                    withCredentials: false,
                    headers: {
Authorization: `Bearer ` + localStorage.getItem("token"),
                    }
                })
            axios.get('assigned-tests/grade/'+localStorage.getItem("assignment")+'/'+localStorage.getItem("uid"),{
                    withCredentials: false,
                    headers: {
Authorization: `Bearer ` + localStorage.getItem("token"),
                    }
                })
        }
    },
    components: { RouterLink }
}
</script>