<template>
  <div class="pt-5 px-1 w-100">
    <!--Początek formularz dodania przedmiotu-->
    <b-modal
      id="modal-add-subject"
      title="Dodaj przedmiot"
      hide-footer
      size="lg"
    >
      <b-form @submit.prevent="addSubject">
        <div class="d-flex flex-row mb-2">
          <label for="title" class="w-25">Tytuł</label>
          <b-input
            type="text"
            id="title"
            class="ml-2"
            v-model="createSubjectForm.title"
          />
        </div>
        <div class="d-flex flex-row mb-2">
          <label for="code" class="w-25">Kod</label>
          <b-input
            type="text"
            id="code"
            class="ml-2"
            v-model="createSubjectForm.code"
          />
        </div>
        <b-btn type="submit" class="w-100" variant="success"
          >Dodaj przedmiot</b-btn
        >
      </b-form>
    </b-modal>
    <!--Koniec formularza dodania przedmiotu-->
    <!--Początek formularz edycji przedmiotu-->
    <b-modal
      id="modal-edit-subject"
      title="Edytuj przedmiot"
      hide-footer
      size="lg"
    >
      <b-form @submit.prevent="editSubject(editSubjectForm._id)">
        <div class="d-flex flex-row mb-2">
          <label for="title" class="w-25">Tytuł</label>
          <b-input
            type="text"
            id="title"
            class="ml-2"
            v-model="editSubjectForm.title"
          />
        </div>
        <div class="d-flex flex-row mb-2">
          <label for="code" class="w-25">Kod</label>
          <b-input
            type="text"
            id="code"
            class="ml-2"
            v-model="editSubjectForm.code"
          />
        </div>
        <b-btn type="submit" class="w-100" variant="success"
          >Edytuj przedmiot</b-btn
        >
      </b-form>
    </b-modal>
    <!--Koniec formularza edycji przedmiotu-->
    <!--Początek formularza dodania nauczyciela-->
    <b-modal
      id="modal-add-teacher"
      title="Dodaj Nauczyciela"
      hide-footer
      size="sm"
    >
      <b-form @submit.prevent="addTeacher(editSubjectForm._id)">
        <b-form-select v-model="teacherNameselect">
          <b-form-select-option :value="null"
            >Wybierz Ucznia</b-form-select-option
          >
          <b-form-select-option
            :value="user._id"
            v-for="user in teacherNames"
            :key="user._id"
            >{{ user.first_name + "" + user.last_name }} |
            {{ user.PESEL }}</b-form-select-option
          > </b-form-select
        ><br />
        <b-btn type="submit" class="w-100" variant="success"
          >Dodaj Nauczyciela</b-btn
        >
      </b-form>
    </b-modal>
    <!--Koniec formularza dodania nauczyciela-->
    <b-btn
      variant="success"
      class="mb-2"
      style="float: left"
      v-b-modal.modal-add-subject
      scrollable
      >Dodaj</b-btn
    >
    <b-table
      stripped
      hover
      :items="subjects"
      :fields="fields"
      responsive="sm"
      class="text-center"
      thead-class="bg-dark text-light"
      id="dataTable"
      :per-page="perPage"
      :current-page="currentPage"
    >
      <!--Dodanie numeracji-->
      <template #cell(index)="data">
        {{ data.index + 1 }}
      </template>
      <!--Dodanie guzików do każdego rzędu-->
      <template v-slot:cell(actions)="row">
        <div class="d-flex flex-row justify-content-center w-100">
          <b-btn
            variant="info"
            class="ml-1 w-50"
            @click="row.toggleDetails(), fillData(currentRow(row.index))"
            >Szczegóły</b-btn
          >
          <b-btn
            variant="warning"
            @click="fillData(currentRow(row.index))"
            class="ml-1 w-50"
            v-b-modal.modal-edit-subject
            scrollable
            >Edytuj</b-btn
          >
          <b-btn
            variant="danger"
            @click="deleteSubject(currentRow(row.index))"
            class="ml-1 w-50"
            >Usuń</b-btn
          >
        </div>
      </template>
      <!--Początek karty detali-->
      <template #row-details="row">
        <b-card class="border-primary tw-bg-gray-300">
          <h1>Nauczyciele</h1>
          <b-btn
            variant="success"
            class="mb-2"
            style="float: left"
            v-b-modal.modal-add-teacher
            scrollable
            @click="fillData(currentRow(row.index))"
            >Dodaj</b-btn
          >
          <!--Tabela uczniów-->
          <b-table
            stripped
            hover
            :items="row.item.teachers"
            :fields="fields2"
            responsive="sm"
            class="text-center"
            thead-class="bg-primary text-dark"
            id="detailTable"
          >
            <!--Dodanie numeracji-->
            <template #cell(index)="data">
              {{ data.index + 1 }}
            </template>
            <!--Dodanie guzika do każdego rzędu-->
            <template v-slot:cell(action)="row">
              <div class="d-flex flex-row justify-content-center w-100">
                <b-btn
                  @click="deleteTeacher(row.index)"
                  variant="danger"
                  class="ml-1 w-50"
                  >Usuń</b-btn
                >
              </div>
            </template>
          </b-table>
        </b-card>
      </template>
      <!--Koniec karty detali-->
    </b-table>
    <!--Paginacja tabeli-->
    <div class="d-flex flex-row justify-content-center">
      <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="dataTable"
      ></b-pagination>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import "../../interceptors/axios";
export default {
  data() {
    return {
      subjects: [],
      teacherNames: [],
      teacherNameselect: null,
      fields: [
        {
          key: "index",
          label: "#",
        },
        { key: "title", label: "Nazwa" },
        { key: "code", label: "Kod" },
        { key: "actions", label: "akcje" },
      ],
      fields2: [
        {
          key: "index",
          label: "#",
        },
        { key: "first_name", label: "Imie" },
        { key: "last_name", label: "Nazwisko" },
        { key: "PESEL", label: "PESEL" },
        { key: "action", label: "akcje" },
      ],
      createSubjectForm: {
        title: null,
        code: null,
      },
      editSubjectForm: {
        _id: null,
        title: null,
        code: null,
      },
      perPage: 7,
      currentPage: 1,
    };
  },
  mounted() {
    this.fetchSubjects();
    this.fillNames();
            if (localStorage.getItem("role") != "admin") {
            this.$router.push('/error/403');
        }
  },
  computed: {
    rows() {
      return this.subjects.length;
    },
    csrf() {
      return localStorage.getItem("_csrf");
    },
  },
  methods: {
    async fetchSubjects() {
      axios
        .get(`/subjects`, {
          withCredentials: false,
          headers: {
                                       Authorization: `Bearer ` + localStorage.getItem("token"),

          },
        })
        .then((data) => (this.subjects = data.data));
    },
    async addSubject() {
      if (!this.createSubjectForm.title || !this.createSubjectForm.code) {
        alert("Wypełnij wszystkie kolumny");
        return;
      }
      await axios.post("/subjects", this.createSubjectForm, {
        withCredentials: false,
        headers: {
                                     Authorization: `Bearer ` + localStorage.getItem("token"),

        },
      });
      this.$router.go(0);
    },
    async deleteSubject(id) {
      const removeID = this.subjects[id]._id;
      await axios.delete("/subjects/" + removeID, {
        withCredentials: false,
        headers: {
                                     Authorization: `Bearer ` + localStorage.getItem("token"),

        },
      });
      this.$router.go(0);
    },
    async editSubject(id) {
      if (!this.editSubjectForm.title || !this.editSubjectForm.code) {
        alert("Wypełnij wszystkie kolumny");
        return;
      }
      await axios.patch("/subjects/" + id, this.editSubjectForm, {
        withCredentials: false,
        headers: {
                                     Authorization: `Bearer ` + localStorage.getItem("token"),

        },
      });
      this.$router.go(0);
    },
    async addTeacher(id) {
      await axios.post("/subjects/" + id + "/" + this.teacherNameselect, id, {
        withCredentials: false,
        headers: {
                                     Authorization: `Bearer ` + localStorage.getItem("token"),

        },
      });
      this.$router.go(0);
    },
    async deleteTeacher(id) {
      await axios.delete("/subjects/" + this.editSubjectForm._id + "/" + id, {
        withCredentials: false,
        headers: {
                                     Authorization: `Bearer ` + localStorage.getItem("token"),

        },
      });
      this.$router.go(0);
    },
    fillData(id) {
      this.editSubjectForm = this.subjects[id];
    },
    fillNames() {
      axios
        .get(`/users/getters/teachers`, {
          withCredentials: false,
          headers: {
                                       Authorization: `Bearer ` + localStorage.getItem("token"),


          },
        })
        .then((data) => (this.teacherNames = data.data));
    },
    /** Obecny faktyczny rząd tabeli
     * Oblicza faktyczny index tabeli z wiedzy o obecnej stronie i id wybranego rzedu na niej
     * @param {*} id
     */
    currentRow(id) {
      return (this.currentPage - 1) * this.perPage + id;
    },
  },
};
</script>
