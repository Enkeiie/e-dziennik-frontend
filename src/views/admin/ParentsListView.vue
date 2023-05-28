<template>
    <div class="pt-5 px-1 w-100">
        <!--Formularz dodania dziecka-->
        <b-modal id="modal-create" title="Dodaj dziecko" hide-footer size="sm">
            <b-form @submit.prevent="createBond">
                <label>Rodzic</label>
                <b-form-select v-model="parentSelect">
                    <option :value="null">--Wybierz--</option>
                    <option v-for="parent in parents" :key="parent._id" :value="parent._id">{{ parent.first_name }} {{
                        parent.last_name
                    }} | {{ parent.PESEL }}</option>
                </b-form-select>
                <label>Dziecko</label>
                <b-form-select v-model="studentSelect">
                    <option :value="null">--Wybierz--</option>
                    <option v-for="student in students" :key="student._id" :value="student._id">{{ student.first_name }}
                        {{ student.last_name }} | {{ student.PESEL }}</option>
                </b-form-select>
                <b-btn type="submit" variant="success" class="mt-2 tw-w-full">Dodaj</b-btn>
            </b-form>
        </b-modal>
        <!--Koniec formularza dodania dziecka-->
        <b-btn variant="success" class="mb-2" style="float:left" v-b-modal.modal-create scrollable>Dodaj</b-btn>
        <b-table hover :items="bonds" :fields="fields2" thead-class="bg-primary text-dark">
            <!--Dodanie numeracji-->
            <template #cell(index)="data">
                {{ data.index + 1 }}
            </template>
            <!--Dodanie guzika do każdego rzędu-->
            <template v-slot:cell(action)="row">
                <div class="d-flex flex-row justify-content-center">
                    <b-btn @click="removeBond(row.item._id)" variant="danger" class="ml-1 tw-w-48">Usuń</b-btn>
                </div>
            </template>
            <!--Dodanie rodzica i dziecka-->
            <template v-slot:cell(parent)="row">
                {{ row.item.parentId.first_name }} {{ row.item.parentId.last_name }}
            </template>
            <template v-slot:cell(student)="row">
                {{ row.item.studentId.first_name }} {{ row.item.studentId.last_name }}
            </template>
        </b-table>
    </div>
</template>
<script>
import axios from 'axios';
import '../../interceptors/axios';

export default {
    data() {
        return {
            bonds: [],
            parents: [],
            students: [],
            parentSelect: null,
            studentSelect: null,
            createForm: {
                studentId: "",
                parentId: "",
            },
            fields2: [
                { key: "index", label: "#" },
                { key: "parent", label: "Rodzic" },
                { key: "student", label: "Dziecko" },
                { key: "action", label: "Akcja" }
            ],
        }
    },
    computed: {
        csrf(){
            return localStorage.getItem('_csrf');
        }
    },
    async mounted() {
        this.fillData();
                if (localStorage.getItem("role") != "admin") {
            this.$router.push('/error/403');
        }
    },
    methods: {
        fillData() {
            axios
                .get(`users/getters/parents`, {
                    withCredentials: false,
                    headers: {
Authorization: `Bearer ` + localStorage.getItem("token"),                    }
                })
                .then(data => this.parents = data.data)
            axios
                .get(`users/getters/students`, {
                    withCredentials: false,
                    headers: {
Authorization: `Bearer ` + localStorage.getItem("token"),
                    }
                })
                .then(data => this.students = data.data)
            axios
                .get(`parents-children`, {
                    withCredentials: false,
                    headers: {
                                                          Authorization: `Bearer ` + localStorage.getItem("token"),

    

                    }
                })
                .then(data => { this.bonds = data.data, console.log(data.data) })
        },
        async createBond() {
            this.createForm.studentId = this.studentSelect;
            this.createForm.parentId = this.parentSelect;
            if (!this.createForm.studentId || !this.createForm.parentId) {
                alert("Wybierz obu użytkowników")
                return
            }
            await axios.post(`parents-children/`, this.createForm, {
                withCredentials: false,
                headers: {
                                               Authorization: `Bearer ` + localStorage.getItem("token"),


                }
            });
            this.$router.go(0)
        },
        async removeBond(id) {
            await axios.delete(`parents-children/` + id, {
                withCredentials: false,
                headers: {
                                               Authorization: `Bearer ` + localStorage.getItem("token"),


                }
            });
            this.$router.go(0)
        }
    }
}
</script>