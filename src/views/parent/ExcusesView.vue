<template>
  <div class="pt-5 px-1 w-100">
    <!--Formularz Usprawiedliwienia-->
    <b-modal id="modal-add-excuse" title="Usprawiedliw" hide-footer size="md">
      <b-form @submit.prevent="addExcuse(id)">
        <label>Powód</label>
        <b-form-textarea v-model="excuse"></b-form-textarea>
        <b-btn type="submit" variant="success">Prześlij</b-btn>
      </b-form>
    </b-modal>
    <!--Koniec przypisania testu-->
    <label>Uczeń</label>
    <b-form-select v-model="selectedStudent" @change="reset(), grades()">
      <option :value="null">--Wybierz--</option>
      <option
        v-for="student in children"
        :key="student.studentId._id"
        :value="student.studentId._id"
      >
        {{ student.studentId.first_name }} {{ student.studentId.last_name }}
      </option>
    </b-form-select>
    <div
      v-for="presence in presences"
      :key="presence._id"
      class="border m-2 p-4 w-auto text-left"
    >
      <div>
        <h1>Przedmiot: {{ presence.subject.title }}</h1>
        <h4>Dnia: {{ formattedDate(presence.createdAt) }}</h4>
      </div>
      <div>
        <b-btn
          variant="info"
          v-b-modal.modal-add-excuse
          scrollable
          @click="fill(presence._id)"
          >Usprawiedliw</b-btn
        >
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import "../../interceptors/axios";
export default {
  data() {
    return {
      children: null,
      selectedStudent: null,
      presences: [],
      id: null,
      excuse: null,
    };
  },
  created() {
    this.prepareData();
  },
  computed: {
    students(arr) {
      return arr;
    },
  },
    mounted() {
                if (localStorage.getItem("role") != "parent") {
            this.$router.push('/error/403');
      }
        return;
  },
  methods: {
    formattedDate(dateStr) {
      const date = new Date(dateStr);
      const hours = date.getUTCHours().toString().padStart(2, "0");
      const minutes = date.getUTCMinutes().toString().padStart(2, "0");
      const day = date.getUTCDate().toString().padStart(2, "0");
      const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
      const year = date.getUTCFullYear().toString().substr(-2);
      return `${hours}:${minutes} ${day}.${month}.${year}`;
    },
    async prepareData() {
      axios
        .get(`/parents-children/parent/` + localStorage.getItem("uid"), {
          withCredentials: false,
          headers: {
            Authorization: `Bearer ` + localStorage.getItem("token"),
          },
        })
        .then((data) => (this.children = data.data));
    },
    async getGrades() {
      let data = this.selectedStudent;
      if (!data) {
        return new Array();
      }
      let res = await axios.get("presences/" + this.selectedStudent, {
        withCredentials: false,
        headers: {
          Authorization: `Bearer ` + localStorage.getItem("token"),
          "X-CSRF-Token": localStorage.getItem("_csrf"),
        },
      });
      let fData = res.data.filter((presence) => presence.present == "absent");
      this.presences = fData;
    },
    async grades() {
      return this.selectedStudent
        ? await this.getGrades(this.selectedStudent)
        : [];
    },
    reset() {
      if (this.selectedStudent == null) {
        this.presences = null;
      }
    },
    async fill(id) {
      this.id = id;
    },
    async addExcuse(id) {
      if (!this.excuse) {
        alert("Podaj przyczynę");
        return;
      }
      let dto = {
        present: "excused",
        comment: this.excuse,
      };
      await axios.patch(`presences/` + id, dto, {
        withCredentials: false,
        headers: {
          Authorization: `Bearer ` + localStorage.getItem("token"),
        },
      });
      this.$router.go(0);
    },
  },
};
</script>
