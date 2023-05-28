<template>
    <div class="m-2">
        <!--Początek formularz dodania obecności-->
        <b-modal id="modal-add-grade" title="Dodaj obecność" hide-footer size="sm">
            <b-form @submit.prevent="addPresence">
                <div class="d-flex flex-wrap">
                    <div class="mb-2" v-for="student in students" :key="student.name">
                        <label>
                            <input type="checkbox" v-model="student.present"> {{
                                student.first_name + ' ' +
                                student.last_name + ' | ' + student.PESEL
                            }}
                        </label>
                    </div>
                </div>
                <b-btn type="submit" class="w-100" variant="success">Sprawdź obecność</b-btn>
            </b-form>
        </b-modal>
        <!--Koniec formularza dodania obecności-->
        <!--Początek formularz edycji obecności-->
        <b-modal id="modal-edit-presence" title="Edytuj obecność" hide-footer size="sm">
            <b-form @submit.prevent="editPresence(editPresenceForm._id)">
                <b-btn variant="danger" @click="deletePresenses(editPresenceForm._id)">Usuń</b-btn>
                <p style="font-size: 12px">Wystawiono: {{ editPresenceForm.createdAt }}</p>
                <p style="font-size: 12px">Ostatnia zmiana: {{ editPresenceForm.updatedAt }}</p>
                <div class="d-flex flex-row mb-2">
                    <b-select v-model="selectedPresenceValue">
                        <option :value="null">---Wybierz---</option>
                        <option :value="presence.name" v-for="presence in presencesList" :key="presence.name">{{
                            presence.value
                        }}</option>
                    </b-select>
                </div>
                <p>Komentarz: {{ editPresenceForm.comment }}</p>
                <b-btn type="submit" class="w-100" variant="success">Edytuj Obecność</b-btn>
            </b-form>
        </b-modal>
        <center>
            <h1>Obecności: {{ name }}</h1>
        </center>
        <!--Koniec formularza edycji obecności-->
        <b-btn v-b-modal.modal-add-grade scrollable variant="success">Dodaj Obecność</b-btn>
        <table class="table table-responsive border border-collapse" hover stripped thead-class="bg-dark text-light"
            v-if="studentsPresences.length > 0">
            <thead>
                <tr class="tw-w-fit">
                    <th class="border">Uczeń</th>
                    <th class="border" v-for="(date) in uniqueDates" :key="date">{{ date }}</th>
                </tr>
            </thead>
            <tbody>
                <tr class="border" v-for="studentPresences in studentsPresences" :key="studentPresences[0].student">
                    <td class="border">{{ getStudent(studentPresences[0].student) }}</td>
                    <td class="border" :style="{ 'background-color': presenceColor(presence.present) }"
                        v-for="(presence) in studentPresences" :key="presence._id" v-b-modal.modal-edit-presence scrollable
                        @click="$event.stopPropagation(), fillEditForm(presence._id, presence.present, presence.createdAt, presence.updatedAt, presence.comment)">
                        {{ returnLetter(presence.present) }}
                    </td>
                </tr>
            </tbody>
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
            previousDate: null,
            colspan: 1,
            students: [],
            studentNameSelect: null,
            createPresenceForm: {
                value: "",
                type: "",
                comment: "",
            },
            editPresenceForm: {
                value: "",
                type: "",
                comment: "",
            },
            presences: [],
            presencesColor: {
                "absent": 'red',
                "present": 'green',
                "excused": 'orange',
            },
            formattedPresences: [],
            selectedPresenceValue: null,
            presencesList: [
                {
                    name: 'present',
                    value: 'OBECNY',
                },
                {
                    name: 'absent',
                    value: 'NIEOBECNY',
                },
                {
                    name: 'excused',
                    value: 'USPRAWIEDLIWONY',
                },
            ]
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
        studentsPresences() {
            // Deklaracja mapy ocen
            const presencesMap = new Map();
            // Przejście przez tablice ocen
            for (const presence of this.presences) {
                // Pobierz obiekt studenta
                const student = presence.student;
                // Sprawdź czy student jest w mapie
                if (!presencesMap.has(student)) {
                    // Jeżeli nie ma to dodaj nowego do mapy
                    presencesMap.set(student, []);
                }
                // Pobierz ucznia z tablicy i dodaj oceny
                presencesMap.get(student).push(presence);
            }
            // Konwersja mapy do finalnej tablicy
            for (const studentPresences of presencesMap.values()) {
                studentPresences.sort((a, b) => {
                    const dateA = new Date(a.createdAt);
                    const dateB = new Date(b.createdAt);
                    if (dateA < dateB) {
                        return -1;
                    } else if (dateA > dateB) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
            }
            return Array.from(presencesMap.values());
        },
        uniqueDates() {
            const uniqueDatesSet = new Set();
            for (const presence of this.studentsPresences[0]) {
                const date = new Date(presence.createdAt);
                const roundedMinutes = Math.round(date.getMinutes() / 1.5) * 1.5;
                date.setMinutes(roundedMinutes);
                const dateString = `${date.toLocaleDateString('en-GB')}, ${date.toLocaleTimeString('en-GB', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: false
                })}`;
                uniqueDatesSet.add(dateString);
            }
            const uniqueDatesArray = Array.from(uniqueDatesSet);
            uniqueDatesArray.sort((a, b) => new Date(a) - new Date(b));
            return uniqueDatesArray;
        }
    },
    methods: {
        async prepareData() {
            this.name = localStorage.getItem("SubjectName")
            axios
                .get(`/presences/` + this.$route.params.class + '/' + this.$route.params.subject, {
                    withCredentials: false,
                    headers: {
                        Authorization: `Bearer ` + localStorage.getItem("token"),
                    }
                })
                .then(data => (this.presences = data.data));
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
        async addPresence() {
            const presentStudents = this.students.filter(s => s.present).map(s => s)
            axios
                .post(`/presences/` + this.$route.params.class + '/' + this.$route.params.subject, {
                    presentStudentsArray: presentStudents,
                }, {
                    withCredentials: false,
                    headers: {
                        Authorization: `Bearer ` + localStorage.getItem("token"),
                    }
                });
            this.$router.go(0)
        },
        async editPresence(id) {
            axios
                .patch(`/presences/` + id, {
                    present: this.selectedPresenceValue,
                    comment: this.editPresenceForm.comment,
                }, {
                    withCredentials: false,
                    headers: {
                        Authorization: `Bearer ` + localStorage.getItem("token"),
                    }
                });
            this.$router.go(0)
        },
        async deletePresences(id) {
            let dates = {
                createdAt: this.editPresenceForm.createdAt,
                updatedAt: this.editPresenceForm.updatedAt,
            }
            axios
                .delete(`/presences/` + id,dates, {
                    withCredentials: false,
                    headers: {
                        Authorization: `Bearer ` + localStorage.getItem("token"),
                    }
                });
            this.$router.go(0)
        },
        getStudent(id) {
            const student = this.students.find(student => student._id == id);
            return student.first_name + " " + student.last_name;
        },
        fillEditForm(id, val, cre, upd) {
            this.selectedPresenceValue = val;
            this.editPresenceForm = {
                updatedAt: upd,
                createdAt: cre,
                _id: id,
            }
        },
        presenceColor(type) {
            type = type.toLowerCase();
            return this.presencesColor[type];
        },
        returnLetter(str) {
            if (str == 'excused') return 'Usprawiedliwone'
            if (str == 'present') return 'Obecny'
            if (str == 'absent') return 'Nieobecny'
        }
    },
}
</script>