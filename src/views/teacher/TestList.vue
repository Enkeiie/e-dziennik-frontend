<template>
    <div class="pt-5 px-1 w-100">
        <!--Początek formularz dodania testu-->
        <b-modal id="modal-add-test" title="Dodaj przedmiot" hide-footer size="md">
            <b-form @submit.prevent="addTest">
                <div class="d-flex flex-row mb-2">
                    <label for="titlea" class="w-25">Tytuł</label>
                    <b-input type="text" id="titlea" class="ml-2" v-model="createTestForm.title" />
                </div>
                <div class="d-flex flex-row mb-2">
                    <label for="numbera" class="w-25">Próg zaliczenia</label>
                    <b-input type="number" id="numbera" class="ml-2" v-model="createTestForm.pass" />
                </div>
                <b-btn type="submit" class="w-100" variant="success" id="submitBtn">Dodaj Test</b-btn>
            </b-form>
        </b-modal>
        <!--Koniec formularza dodania testu-->
        <!--Początek formularz edycji testu-->
        <b-modal id="modal-edit-test" title="Edytuj przedmiot" hide-footer size="lg">
            <b-form @submit.prevent="editTest(editTestForm._id)">
                <div class="d-flex flex-row mb-2">
                    <label for="title" class="w-25">Tytuł</label>
                    <b-input type="text" id="title" class="ml-2" v-model="editTestForm.title" />
                </div>
                <div class="d-flex flex-row mb-2">
                    <label for="number" class="w-25">Próg zaliczenia</label>
                    <b-input type="number" id="number" class="ml-2" v-model="editTestForm.pass" />
                </div>
                <b-btn type="submit" class="w-100" variant="success">Edytuj test</b-btn>
            </b-form>
        </b-modal>
        <!--Koniec formularza edycji testu-->
        <!--Początek formularz dodania pytania-->
        <b-modal id="modal-add-question" title="Dodaj pytanie" hide-footer size="md">
            <b-form @submit.prevent="addTestQ(editTestForm._id)">
                <div class="d-flex flex-row mb-2">
                    <label for="title" class="w-25">Treść</label>
                    <b-input type="text" id="title" class="ml-2" v-model="createTestQForm.header" />
                </div>
                <b-btn type="submit" class="w-100" variant="success">Dodaj pytanie</b-btn>
            </b-form>
        </b-modal>
        <!--Koniec formularza dodania pytania-->
        <!--Początek formularz edycji pytania-->
        <b-modal id="modal-edit-question" title="Edytuj pytanie" hide-footer size="md">
            <b-form @submit.prevent="editTestQ(editTestQForm._id)">
                <div class="d-flex flex-row mb-2">
                    <label for="title" class="w-25">Treść</label>
                    <b-input type="text" id="title" class="ml-2" v-model="editTestQForm.header" />
                </div>
                <b-btn type="submit" class="w-100" variant="success">Edytuj Test</b-btn>
            </b-form>
        </b-modal>
        <!--Koniec formularza edycji pytania-->
        <!--Początek formularz dodania odpowiedzi-->
        <b-modal id="modal-add-answer" title="Dodaj odpowiedź" hide-footer size="md">
            <b-form @submit.prevent="addTestQA(editTestQForm._id)">
                <div class="d-flex flex-row mb-2">
                    <label for="title" class="w-25">Treść</label>
                    <b-input type="text" id="title" class="ml-2" v-model="createTestQAForm.content" />
                </div>
                <b-btn type="submit" class="w-100" variant="success">Dodaj Odpowiedź</b-btn>
            </b-form>
        </b-modal>
        <!--Koniec formularza dodania odpowiedzi-->
        <b-btn variant="success" class="mb-2" style="float:left" v-b-modal.modal-add-test scrollable id="showAddForm">Dodaj</b-btn>
        <b-table stripped hover :items="tests" :fields="fields" responsive="sm" class="text-center"
            thead-class="bg-dark text-light" id="dataTable" :per-page="perPage" :current-page="currentPage">
            <!--Dodanie numeracji-->
            <template #cell(index)="data">
                {{ data.index + 1 }}
            </template>
            <!--Dodanie guzików do każdego rzędu-->
            <template v-slot:cell(actions)="row">
                <div class="d-flex flex-row justify-content-center w-100">
                    <b-btn variant="info" class="ml-1 w-50"
                        @click="row.toggleDetails(), fillData(currentRow(row.index))">Lista pytań</b-btn>
                    <b-btn variant="warning" @click="fillData(currentRow(row.index))" class="ml-1 w-50"
                        v-b-modal.modal-edit-test scrollable>Edytuj</b-btn>
                    <b-btn variant="danger" @click="deleteTest(currentRow(row.index))" class="ml-1 w-50">Usuń</b-btn>
                </div>
            </template>
            <!--Początek karty pytań-->
            <template #row-details="row">
                <b-card class="border-primary tw-bg-gray-300">
                    <b-btn variant="success" class="mb-2" style="float:left" v-b-modal.modal-add-question
                        scrollable>Dodaj</b-btn>
                    <b-table stripped hover :items="row.item.questions" :fields="fields2" responsive="sm"
                        class="text-center" thead-class="bg-primary text-dark" id="detailTable">
                        <!--Dodanie numeracji-->
                        <template #cell(index)="data">
                            {{ data.index + 1 }}
                        </template>
                        <!--Dodanie guzików do każdego rzędu-->
                        <template v-slot:cell(actions)="row2">
                            <div class="d-flex flex-row justify-content-center w-100">
                                <b-btn variant="info" class="ml-1 w-50"
                                    @click="fillQData(row2.index), row2.toggleDetails()">Lista
                                    odpowiedzi</b-btn>
                                <b-btn variant="warning" @click="fillQData(row2.index)" class="ml-1 w-50"
                                    v-b-modal.modal-edit-question scrollable>Edytuj</b-btn>
                                <b-btn variant="danger" @click="deleteTestQ(row2.index)" class="ml-1 w-50">Usuń</b-btn>
                            </div>
                        </template>
                        <!--Początek karty odpowiedzi-->
                        <template #row-details="row2">
                            <b-card class="border-success tw-bg-gray-400">
                                <b-btn variant="success" class="mb-2" style="float:left" v-b-modal.modal-add-answer
                                    scrollable @click="fillQData(row2.index)">Dodaj</b-btn>
                                <b-table stripped hover :items="row2.item.answers" :fields="fields3" responsive="sm"
                                    class="text-center" thead-class="bg-primary text-dark" id="detailTable">
                                    <!--Dodanie numeracji-->
                                    <template #cell(index)="data">
                                        {{ data.index + 1 }}
                                    </template>
                                    <template v-slot:cell(actions)="row3">
                                        <div class="d-flex flex-row justify-content-center w-100">
                                            <b-btn variant="info" class="ml-1 w-50"
                                                @click="setCorrectQA(row2.index, row3.index)" scrollable>Ustaw jako
                                                odpowiedź</b-btn>
                                            <b-btn variant="danger" @click="deleteTestQA(row2.index, row3.index)"
                                                class="ml-1 w-50">Usuń</b-btn>
                                        </div>
                                    </template>
                                </b-table>
                            </b-card>
                        </template>
                    </b-table>
                </b-card>
            </template>
            <!--Koniec karty pytań-->
        </b-table>
        <!--Paginacja tabeli-->
        <div class="d-flex flex-row justify-content-center">
            <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage"
                aria-controls="dataTable"></b-pagination>
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
            fields: [{
                key: 'index', label: '#'
            },
            { key: 'title', label: 'Nazwa' },
            { key: 'pass', label: 'Próg zaliczenia' },
            { key: 'actions', label: 'Akcje' }],
            fields2: [{
                key: 'index', label: '#'
            },
            { key: 'header', label: 'Pytanie' },
            { key: 'correct', label: 'Poprawna odpowiedź' },
            { key: 'actions', label: 'Akcje' }],
            fields3: [{
                key: 'index', label: "#"
            },
            { key: 'content', label: 'Treść' },
            { key: 'actions', label: 'Akcje' }],
            createTestForm: {
                title: "",
                author: "",
                pass: null,
            },
            createTestQForm: {
                header: "",
            },
            editTestQForm: {

            },
            editTestForm: {
                _id: "",
                title: "",
                pass: "",
            },
            createTestQAForm: {
                content: "",
            },
            perPage: 7,
            currentPage: 1,
            currentQuestion: null,
        };
    },
    created() {
        this.fetchTests();
    },
    mounted() {
                if(localStorage.getItem("role")!="teacher"){
            this.$router.push('/error/403');
        }
        return;
    },
    computed: {
        rows() {
            return this.tests.length
        },
    },
    methods: {
        async fetchTests() {
            axios
                .get(`/tests/teacher/` + localStorage.getItem("uid"), {
                    withCredentials: false,
                    headers: {
Authorization: `Bearer ` + localStorage.getItem("token"),
                    }
                })
                .then(data => (this.tests = data.data, console.log(this.tests)));
        },
        async addTest() {
            if (!this.createTestForm.pass || !this.createTestForm.title || this.createTestForm.pass=="" || this.createTestForm.title == "") {
                alert("Wypełnij wszystkie kolumny")
                return
            }
            this.createTestForm.author = localStorage.getItem("uid");
            await axios.post('/tests', this.createTestForm, {
                withCredentials: false,
                headers: {
                                               Authorization: `Bearer ` + localStorage.getItem("token"),


                }
            });
            this.$router.go(0)
        },
        async addTestQ(id) {
            if (!this.createTestQForm.header) {
                alert("Wypełnij wszystkie kolumny")
                return
            }
            axios
                .post('/questions/' + id, this.createTestQForm, {
                    withCredentials: false,
                    headers: {
Authorization: `Bearer ` + localStorage.getItem("token"),
                    }
                });
                this.$router.go(0)
        },
        async addTestQA(id) {
            if (!this.createTestQAForm.content) {
                alert("Wypełnij wszystkie kolumny")
                return
            }
            axios
                .post('/answers/' + id, this.createTestQAForm, {
                    withCredentials: false,
                    headers: {
Authorization: `Bearer ` + localStorage.getItem("token"),
                    }
                });
                this.$router.go(0)
        },
        async deleteTest(id) {
            const removeID = this.tests[id]._id;
            await axios.delete('/tests/' + removeID, {
                withCredentials: false,
                headers: {
                                               Authorization: `Bearer ` + localStorage.getItem("token"),


                }
            });
            this.$router.go(0)
        },
        async deleteTestQ(id) {
            let testid = this.tests[this.currentQuestion]._id;
            await axios.delete('/questions/' + testid + '/' + id, {
                withCredentials: false,
                headers: {
                                               Authorization: `Bearer ` + localStorage.getItem("token"),


                }
            });
            this.$router.go(0)
        },
        async editTest(id) {
            if (!this.editTestForm.pass || !this.editTestForm.title) {
                alert("Wypełnij wszystkie kolumny")
                return
            }
            await axios.patch('/tests/' + id, this.editTestForm, {
                withCredentials: false,
                headers: {
                                               Authorization: `Bearer ` + localStorage.getItem("token"),


                }
            });
            this.$router.go(0)
        },
        async editTestQ(id) {
            if (!this.editTestQForm.header) {
                alert("Wypełnij wszystkie kolumny")
                return
            }
            await axios.patch('/questions/' + id, this.editTestQForm, {
                withCredentials: false,
                headers: {
                                               Authorization: `Bearer ` + localStorage.getItem("token"),


                }
            });
            this.$router.go(0)
        },
        fillData(id) {
            this.currentQuestion = id;
            this.editTestForm = this.tests[id];
        },
        fillQData(id2) {
            this.editTestQForm = this.tests[this.currentQuestion].questions[id2];
        },
        async setCorrectQA(id, id2) {
            let correctQA = this.tests[this.currentQuestion].questions[id].answers[id2].content;
            await axios.patch('/answers/' + this.tests[this.currentQuestion].questions[id]._id,
                {
                    content: correctQA,
                }, {
                withCredentials: false,
                headers: {
                                               Authorization: `Bearer ` + localStorage.getItem("token"),


                }
            });
            this.$router.go(0)
        },
        async deleteTestQA(id, id2) {
            await axios.delete('/answers/' + this.tests[this.currentQuestion].questions[id]._id + '/' + id2, {
                withCredentials: false,
                headers: {
                                               Authorization: `Bearer ` + localStorage.getItem("token"),


                }
            });
            this.$router.go(0)
        },
        /** Obecny faktyczny rząd tabeli
        * Oblicza faktyczny index tabeli z wiedzy o obecnej stronie i id wybranego rzedu na niej
        * @param {*} id 
        */
        currentRow(id) {
            return (this.currentPage - 1) * this.perPage + id
        },
    },
}  
</script>