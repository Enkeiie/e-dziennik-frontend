<template>
    <div class="pt-5 px-1 w-100">
        <!--Początek formularz dodania klasy-->
        <b-modal id="modal-add-class" title="Dodaj klasę" hide-footer size="md">
            <b-form @submit.prevent="addClass">
                <div class="d-flex flex-row mb-2">
                    <label for="number" class="w-50">Numer</label>
                    <b-input type="number" id="number" class="ml-2" v-model="createClassForm.number" />
                </div>
                <div class="d-flex flex-row mb-2">
                    <label for="letter" class="w-50">Literał</label>
                    <b-input type="text" id="letter" class="ml-2" v-model="createClassForm.code" />
                </div>
                <div class="d-flex flex-row mb-2">
                    <label for="year" class="w-50">Rocznik</label>
                    <b-input type="text" id="year" class="ml-2" v-model="createClassForm.year" />
                </div>
                <div class="d-flex flex-row mb-2">
                    <label for="teacher" class="w-50">Wychowawca</label>
                    <b-form-select v-model="teacherNameselect">
                        <option :value="null">--Wybierz--</option>
                        <option v-for="teacher in teachers" :key="teacher._id" :value="teacher._id">{{
                            teacher.first_name + ' ' + teacher.last_name
                        }}</option>
                    </b-form-select>
                </div>
                <b-btn type="submit" class="w-100" variant="success">Dodaj klasę</b-btn>
            </b-form>
        </b-modal>
        <!--Koniec formularza dodania klasy-->
        <!--Początek formularz dodania przedmiotu-->
        <b-modal id="modal-add-subject" title="Dodaj Przedmiot" hide-footer size="sm">
            <b-form @submit.prevent="addSubject(baseData._id)">
                <b-form-select v-model="subjectNameselect">
                    <b-form-select-option :value="null">Wybierz Przedmiot</b-form-select-option>
                    <b-form-select-option :value="subjectName._id" v-for="subjectName in subjectNames"
                        :key="subjectName._id">{{ subjectName.title }} | {{ subjectName.code }}</b-form-select-option>
                </b-form-select><br />
                <b-btn type="submit" class="w-100" variant="success">Dodaj Przedmiot</b-btn>
            </b-form>
        </b-modal>
        <!--Koniec formularza dodania przedmiotu-->
        <!--Początek formularz dodania ucznia-->
        <b-modal id="modal-add-student" title="Dodaj Ucznia" hide-footer size="sm">
            <b-form @submit.prevent="addStudent(baseData._id)">
                <b-form-select v-model="studentNameselect">
                    <b-form-select-option :value="null">Wybierz Ucznia</b-form-select-option>
                    <b-form-select-option :value="user._id" v-for="user in userNames" :key="user._id">{{
                        user.first_name + '' + user.last_name
                    }} | {{ user.PESEL }}</b-form-select-option>
                </b-form-select><br />
                <b-btn type="submit" class="w-100" variant="success">Dodaj Ucznia</b-btn>
            </b-form>
        </b-modal>
        <!--Koniec formularza dodania ucznia-->
        <!--Początek formularz edycji klasy-->
        <b-modal id="modal-edit-class" title="Edytuj Klasę" hide-footer size="sm">
            <b-form @submit.prevent="editClass(editClassForm._id)">
                <div class="d-flex flex-row mb-2">
                    <label for="number" class="w-50">Numer</label>
                    <b-input type="number" id="number" class="ml-2" v-model="editClassForm.number" />
                </div>
                <div class="d-flex flex-row mb-2">
                    <label for="letter" class="w-50">Literał</label>
                    <b-input type="string" id="letter" class="ml-2" v-model="editClassForm.code" />
                </div>
                <div class="d-flex flex-row mb-2">
                    <label for="year" class="w-50">Rocznik</label>
                    <b-input type="string" id="year" class="ml-2" v-model="editClassForm.year" />
                </div>
                <label for="teacher" class="w-50">Wychowawca</label>
                <b-form-select v-model="teacherNameselect">
                    <option :value="null">--Wybierz--</option>
                    <option v-for="teacher in teachers" :key="teacher._id" :value="teacher._id">{{
                        teacher.first_name + ' ' + teacher.last_name
                    }}</option>
                </b-form-select>
                <b-btn type="submit" class="w-100" variant="success">Edytuj klasę</b-btn>
            </b-form>
        </b-modal>
        <!--Koniec formularza edycji klasy-->
        <b-btn variant="success" class="mb-2" v-b-modal.modal-add-class scrollable>Dodaj</b-btn>
        <b-table stripped hover :items="classes" :fields="fields" responsive="sm" class="text-center"
            thead-class="bg-dark text-light" id="dataTable" :per-page="perPage" :current-page="currentPage">
            <!--Dodanie numeracji-->
            <template #cell(index)="data">
                {{ data.index + 1 }}
            </template>
            <!--Wyświetlenie wychowawcy-->
            <template v-slot:cell(teacher)="data">
                {{ data.item.homeroomteacher.first_name }} {{ data.item.homeroomteacher.last_name }}
            </template>
            <!--Dodanie guzików do każdego rzędu-->
            <template v-slot:cell(actions)="row">
                <div class="d-flex flex-row justify-content-center w-100">
                    <b-btn variant="info" class="ml-1 w-50"
                        @click="fillData(currentRow(row.index)), row.toggleDetails()">Szczegóły</b-btn>
                    <b-btn @click="fillEditData(currentRow(row.index))" variant="warning" class="ml-1 w-50"
                        v-b-modal.modal-edit-class scrollable>Edytuj</b-btn>
                    <b-btn @click="deleteData(currentRow(row.index))" variant="danger" class="ml-1 w-50">Usuń</b-btn>
                </div>
            </template>
            <!--Początek detali klasy-->
            <template #row-details="row">
                <b-card class="border-primary tw-bg-gray-300">
                    <h1>Uczniowie</h1>
                    <b-btn variant="success" class="mb-2" style="float:left" v-b-modal.modal-add-student scrollable
                        @click="fillData(currentRow(row.index))">Dodaj</b-btn>
                    <!--Tabela uczniów-->
                    <b-table stripped hover :items="row.item.students" :fields="fields2" responsive="sm" class="text-center"
                        thead-class="bg-primary text-dark" id="detailTable">
                        <!--Dodanie numeracji-->
                        <template #cell(index)="data">
                            {{ data.index + 1 }}
                        </template>
                        <!--Dodanie guzika do każdego rzędu-->
                        <template v-slot:cell(action)="row2">
                            <div class="d-flex flex-row justify-content-center w-100">
                                <b-btn @click="deleteStudent(row2.index)" variant="danger" class="ml-1 w-50">Usuń</b-btn>
                            </div>
                        </template>
                    </b-table>
                    <h1>Przedmioty</h1>
                    <b-btn variant="success" class="mb-2" style="float:left" v-b-modal.modal-add-subject scrollable
                        @click="fillData(currentRow(row.index))">Dodaj</b-btn>
                    <!--Tabela przedmiotów-->
                    <b-table stripped hover :items="row.item.subjects" :fields="fields3" responsive="sm" class="text-center"
                        thead-class="bg-primary text-dark" id="detailTable">
                        <!--Dodanie numeracji-->
                        <template #cell(index)="data">
                            {{ data.index + 1 }}
                        </template>
                        <!--Dodanie guzika do każdego rzędu-->
                        <template v-slot:cell(action)="row">
                            <div class="d-flex flex-row justify-content-center w-100">
                                <b-btn @click="deleteSubject(row.index)" variant="danger" class="ml-1 w-50">Usuń</b-btn>
                            </div>
                        </template>
                    </b-table>
                </b-card>
            </template>
            <!--Koniec detali klasy-->
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
            classes: [],
            subjects: [],
            userNames: [],
            teachers: [],
            subjectNames: [],
            baseData: [],
            teacherNameselect: null,
            subjectNameselect: null,
            studentNameselect: null,
            fields: [{
                key: 'index', label: '#',
            },
            { key: 'number', label: 'Numer', },
            { key: 'code', label: 'literał', },
            { key: 'year', label: 'rocznik' },
            { key: 'teacher', label: 'Wychowawca' },
            { key: 'actions', label: 'akcje' }],
            fields2: [{
                key: 'index', label: '#',
            },
            { key: 'first_name', label: 'Imię' },
            { key: 'last_name', label: 'Nazwisko' },
            { key: 'PESEL', label: 'Pesel' },
            { key: 'action', label: 'Akcja' }
            ],
            fields3: [{
                key: 'index', label: '#',
            },
            { key: 'title', label: 'Tytuł' },
            { key: 'code', label: 'Kod' },
            { key: 'action', label: 'Akcja' }
            ],
            createClassForm: {
                number: 0,
                code: "",
                year: "",
                homeroomteacher: "",
            },
            editClassForm: {
                number: 0,
                code: "",
                year: "",
                homeroomteacher: "",
            },
            perPage: 7,
            currentPage: 1,
        };
    },
    computed: {
        rows() {
            return this.classes.length
        },
    },
    async mounted() {
        this.fetchClasses();
        this.fetchUserNames();
        this.fetchSubjectNames();
        if (localStorage.getItem("role") != "admin") {
            this.$router.push('/error/403');
        }
    },
    methods: {
        //Pobierz dane do tabel
        fetchClasses() {
            axios
                .get(`/classes`, {
                    withCredentials: false,
                    headers: {
                                                       Authorization: `Bearer ` + localStorage.getItem("token"),


                    }
                })
                .then(data => (this.classes = data.data));
            axios
                .get(`users/getters/teachers`, {
                    withCredentials: false,
                    headers: {
                                                       Authorization: `Bearer ` + localStorage.getItem("token"),

    
                    }
                })
                .then(data => this.teachers = data.data)
        },
        //Pobierz listę przedmiotów
        fetchSubjects() {
            axios
                .get(`/subjects`, {
                    withCredentials: false,
                    headers: {
                                                       Authorization: `Bearer ` + localStorage.getItem("token"),


                    }
                })
                .then(data => (this.subjects = data.data));
        },
        //Pobierz nazwy przedmiotów
        fetchSubjectNames() {
            axios
                .get(`/subjects/getters/names`, {
                    withCredentials: false,
                    headers: {
                                                       Authorization: `Bearer ` + localStorage.getItem("token"),


                    }
                })
                .then(data => (this.subjectNames = data.data));
        },
        //Pobierz nazwy użytkowników
        fetchUserNames() {
            axios
                .get(`/users/getters/students`, {
                    withCredentials: false,
                    headers: {
                                                       Authorization: `Bearer ` + localStorage.getItem("token"),



                    }
                })
                .then(data => (this.userNames = data.data));
        },
        //Wypełń dane w rzędzie
        fillData(index) {
            this.baseData = Array.from(this.classes)[index];
        },
        //Wypełń formularz edycji
        fillEditData(index) {
            this.editClassForm = this.classes[index];
            this.teacherNameselect = this.classes[index].homeroomteacher;
        },
        //Usuwanie Klasy
        async deleteData(id) {
            const removeID = this.classes[id]._id;
            await axios.delete('/classes/' + removeID, {
                withCredentials: false,
                headers: {
                                            Authorization: `Bearer ` + localStorage.getItem("token"),

                }
            });
            this.$router.go(0)
        },
        //Edycja Klasy
        async editClass(id) {
            this.editClassForm.homeroomteacher = this.teacherNameselect;
            if (!this.editClassForm.number ||
                !this.editClassForm.code ||
                !this.editClassForm.year ||
                !this.editClassForm.homeroomteacher) {
                alert("Wypełni wszystkie pola");
                return;
            }

            if (!/^\d{4}\/\d{4}$/.test(this.editClassForm.year)) {
                alert("Format rocznika to XXXX/XXXX gdize X jest liczbą.");
                return;
            }
            await axios.patch('/classes/' + id, this.editClassForm, {
                withCredentials: false,
                headers: {
                                            Authorization: `Bearer ` + localStorage.getItem("token"),

                }
            });
            this.$router.go(0)
        },
        //Dodanie Klasy
        async addClass() {
            this.createClassForm.homeroomteacher = this.teacherNameselect
            if (!this.createClassForm.number ||
                !this.createClassForm.code ||
                !this.createClassForm.year ||
                !this.createClassForm.homeroomteacher) {
                alert("Wypełni wszystkie pola");
                return;
            }

            if (!/^\d{4}\/\d{4}$/.test(this.createClassForm.year)) {
                alert("Format rocznika to XXXX/XXXX gdize X jest liczbą.");
                return;
            }
            console.log(this.createClassForm)
            await axios.post('/classes', this.createClassForm, {
                withCredentials: false,
                headers: {
                                            Authorization: `Bearer ` + localStorage.getItem("token"),

                }
            });
            this.$router.go(0)
        },
        //Dodanie Przedmiotu
        async addSubject(id) {
            if (!this.subjectNameselect) {
                alert("Wypełni wszystkie pola");
                return;
            }
            await axios.post('/classes/' + id + '/subjects/' + this.subjectNameselect, id, {
                withCredentials: false,
                headers: {
                                            Authorization: `Bearer ` + localStorage.getItem("token"),

                }
            });
            this.$router.go(0)
        },
        //Dodanie ucznia
        async addStudent(id) {
            if (!this.studentNameselect) {
                alert("Wypełni wszystkie pola");
                return;
            }
            await axios.post('/classes/' + id + '/students/' + this.studentNameselect, id, {
                withCredentials: false,
                headers: {
                                            Authorization: `Bearer ` + localStorage.getItem("token"),

                }
            });
            this.$router.go(0)
        },
        //Wsuwanie przedmiotu
        async deleteSubject(id2) {
            await axios.delete('/classes/' + this.baseData._id + '/subjects/' + id2, {
                withCredentials: false,
                headers: {
                                            Authorization: `Bearer ` + localStorage.getItem("token"),

                }
            });
            this.$router.go(0)
        },
        //Usuwanie ucznia
        async deleteStudent(id2) {
            await axios.delete('/classes/' + this.baseData._id + '/students/' + id2, {
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
    }
}
</script>