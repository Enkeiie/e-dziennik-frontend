<template>
    <div class="m-2">
        <!--Początek formularz dodania oceny-->
        <b-modal id="modal-add-grade" title="Dodaj ocenę" hide-footer size="sm">
            <b-form @submit.prevent="addGrade">
                <div class="d-flex flex-row mb-2">
                    <b-select v-model="studentNameSelect">
                        <option :value="null">---Wybierz---</option>
                        <option :value="student._id" v-for="student in students" :key="student._id">{{
                            student.first_name + ' ' + student.last_name + ' | ' + student.PESEL
                        }}</option>
                    </b-select>
                </div>
                <div class="d-flex flex-row mb-2">
                    <label for="number" class="w-50">Wartość</label>
                    <b-input type="number" id="number" class="ml-2" v-model="createGradeForm.value" />
                </div>
                <div class="d-flex flex-row mb-2">
                    <label for="letter" class="w-50">Rodzaj oceny</label>
                    <b-input type="text" id="letter" class="ml-2" v-model="createGradeForm.type" />
                </div>
                <div class="d-flex flex-row mb-2">
                    <label for="com" class="w-50">Komentarz</label>
                    <b-form-textarea type="text" id="com" class="ml-2" v-model="createGradeForm.comment" />
                </div>
                <b-btn type="submit" class="w-100" variant="success">Dodaj Ocenę</b-btn>
            </b-form>
        </b-modal>
        <!--Koniec formularza dodania oceny-->
        <!--Początek formularz edycji oceny-->
        <b-modal id="modal-edit-grade" title="Edytuj ocenę" hide-footer size="sm">
            <b-form @submit.prevent="editGrade(editGradeForm._id)">
                <b-btn type="submit" class="w-100" variant="danger" @click="deleteGrade(editGradeForm._id)">Usuń
                    Ocenę</b-btn>
                <p style="font-size: 12px">Dodano:</p>
                <p style="font-size: 12px">{{ editGradeForm.createdAt }}</p>
                <p style="font-size: 12px">Ostatnia zmiana:</p>
                <p style="font-size: 12px">{{ editGradeForm.updatedAt }}</p>
                <div class="d-flex flex-row mb-2">
                    <label for="number" class="w-50">Wartość</label>
                    <b-input type="number" id="number" class="ml-2" v-model="editGradeForm.value" />
                </div>
                <div class="d-flex flex-row mb-2">
                    <label for="letter" class="w-50">Rodzaj oceny</label>
                    <b-input type="text" id="letter" class="ml-2" v-model="editGradeForm.type" />
                </div>
                <div class="d-flex flex-row mb-2">
                    <label for="com" class="w-50">Komentarz</label>
                    <b-form-textarea type="text" id="com" class="ml-2" v-model="editGradeForm.comment" />
                </div>
                <b-btn type="submit" class="w-100" variant="success">Edytuj Ocenę</b-btn>
            </b-form>
        </b-modal>
        <!--Koniec formularza edycji oceny-->
        <center><h1>Oceny: {{name}}</h1></center>
        <b-btn v-b-modal.modal-add-grade scrollable variant="success">Dodaj ocene</b-btn>
        <p class="tw-float-right ">Legenda: Aktywność <span :style="{ 'background-color': gradeColor(`aktywność`) }"
                class="tw-py-1 tw-px-3 tw-rounded-full">&nbsp;</span>, Kartkówka <span
                :style="{ 'background-color': gradeColor(`kartkówka`) }"
                class="tw-py-1 tw-px-3 tw-rounded-full">&nbsp;</span>,
            Sprawdzian <span :style="{ 'background-color': gradeColor(`sprawdzian`) }"
                class="tw-py-1 tw-px-3 tw-rounded-full">&nbsp;</span>, Odpowiedź <span
                :style="{ 'background-color': gradeColor(`odpowiedź`) }"
                class="tw-py-1 tw-px-3 tw-rounded-full">&nbsp;</span>, Inne <span :style="{ 'background-color': 'gray' }"
                class="tw-py-1 tw-px-3 tw-rounded-full">&nbsp;</span></p>
        <table class="table table-responsive border border-collapse" hover stripped thead-class="bg-dark text-light">
            <tr>
                <th>#</th>
                <th>Uczeń</th>
                <th>Oceny</th>
            </tr>
            <tr class="border tw-w-fit" v-for='(studentGrades, index) in studentsGrades'
                :key="studentGrades[0].student">
                <td class="tw-w-4">{{ index + 1 }}</td>
                <td class="tw-w-48">{{ getStudent(studentGrades[0].student) }}</td>

                <span class="tw-mr-0.5" v-b-popover.hover="" v-for="grade in studentGrades" :key="grade._id"
                    v-b-modal.modal-edit-grade scrollable
                    @click="fillEditForm(grade._id, grade.value, grade.createdAt, grade.updatedAt, grade.type, grade.comment)"
                    :id="`popover-${index}-${grade._id}`">
                    <td :style="{ 'background-color': gradeColor(grade.type) }" class="w-24">{{ grade.value }} </td>
                </span>
                <b-popover v-for="grade in studentGrades" :key="grade._id" :target="`popover-${index}-${grade._id}`"
                    triggers="hover">
                    <div>
                        <p>Wartość oceny: {{ grade.value }}</p>
                        <p>Rodzaj oceny: {{ grade.type }}</p>
                        <p>Wystawiono: {{ formattedDate(grade.createdAt) }}</p>
                        <p>Ostatnia edycja: {{ formattedDate(grade.updatedAt) }}</p>
                        <p>Komentarz: {{ grade.comment }}</p>
                    </div>
                </b-popover>
            </tr>
        </table>
    </div>
</template>
<script>
import axios from 'axios';
import '../../interceptors/axios';
export default {
    data() {
        return {
            name: "",
            students: [],
            studentNameSelect: null,
            createGradeForm: {
                value: "",
                type: "",
                comment: "",
            },
            editGradeForm: {
                value: "",
                type: "",
                comment: "",
            },
            grades: [],
            formattedGrades: [],
            gradeColors: {
                'sprawdzian': 'red',
                'aktywność': 'green',
                'kartkówka': 'orange',
                'odpowiedź': 'blue',
            }
        }
    },
    mounted() {
        this.prepareData(),
            this.getStudentsList();
                        if (localStorage.getItem("role") != "teacher") {
            this.$router.push('/error/403');
        }
    },
    computed: {
        studentsGrades() {
            // Deklaracja mapy ocen
            const gradesMap = new Map();
            // Przejście przez tablice ocen
            for (const grade of this.grades) {
                // Pobierz obiekt studenta
                const student = grade.student;
                // Sprawdź czy student jest w mapie
                if (!gradesMap.has(student)) {
                    // Jeżeli nie ma to dodaj nowego do mapy
                    gradesMap.set(student, []);
                }
                // Pobierz ucznia z tablicy i dodaj oceny
                gradesMap.get(student).push(grade);
            }
            // Konwersja mapy do finalnej tablicy
            return Array.from(gradesMap.values());
        },
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
            this.name=localStorage.getItem("SubjectName")
            axios
                .get(`/grades/` + this.$route.params.class + '/' + this.$route.params.subject, {
                    withCredentials: false,
                    headers: {
Authorization: `Bearer ` + localStorage.getItem("token"),
                    }
                })
                .then(data => (this.grades = data.data));
            this.createGradeForm;
        },
        async getStudentsList() {
            axios
                .get(`/classes/` + this.$route.params.class + '/students', {
                    withCredentials: false,
                    headers: {
Authorization: `Bearer ` + localStorage.getItem("token"),
                    }
                })
                .then(data => (this.students = data.data[0].students, console.log(this.students)));
        },
        async addGrade() {
            axios
                .post(`/grades/`, {
                    student: this.studentNameSelect,
                    value: this.createGradeForm.value,
                    type: this.createGradeForm.type,
                    subject: this.$route.params.subject,
                    comment: this.createGradeForm.comment
                }, {
                    withCredentials: false,
                    headers: {
Authorization: `Bearer ` + localStorage.getItem("token"),
                    }
                });
            this.$router.go(0)
        },
        async editGrade(id) {
            axios
                .patch(`/grades/` + id, {
                    value: this.editGradeForm.value,
                    type: this.editGradeForm.type,
                    comment: this.editGradeForm.comment,
                }, {
                    withCredentials: false,
                    headers: {
Authorization: `Bearer ` + localStorage.getItem("token"),
                    }
                });
            this.$router.go(0)
        },
        async deleteGrade(id) {
            axios
                .delete(`/grades/` + id, {
                    withCredentials: false,
                    headers: {
Authorization: `Bearer ` + localStorage.getItem("token"),
                    }
                });
            this.$router.go(0)
        },
        getStudent(id) {
            const student = this.students.find(student => student._id === id);
            return student.first_name + " " + student.last_name;
        },
        fillEditForm(id, val, cre, upd, typ, com) {
            this.editGradeForm = {
                value: val,
                type: typ,
                comment: com,
                updatedAt: upd,
                createdAt: cre,
                _id: id,
            }
        },
        gradeColor(type) {
            type = type.toLowerCase();
            if (this.gradeColors[type]) {
                return this.gradeColors[type];
            } else {
                return 'gray';
            }
        }
    },
}
</script>