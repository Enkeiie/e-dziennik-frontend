<template>
  <div class="pt-5 px-1 w-100">
    <!--Początek okienka dodania użytkownika-->
    <b-modal id="modal-create" title="Dodaj użytkownika" hide-footer size="lg">
      <form @submit.prevent="createUser" class="w-75" style="margin: 0 auto">
        <label for="username" class="control-label">Nazwa użytkownika</label>
        <b-input
          type="text"
          name="username"
          v-model="createDataForm.username"
          class="form-control"
        />

        <label for="email" class="control-label">Email</label>
        <b-input
          type="text"
          name="email"
          v-model="createDataForm.email"
          class="form-control"
        />

        <label for="first_name" class="control-label">Imię</label>
        <b-input
          type="text"
          name="first_name"
          v-model="createDataForm.first_name"
          class="form-control"
        />

        <label for="last_name" class="control-label">Nazwisko</label>
        <b-input
          type="text"
          name="last_name"
          v-model="createDataForm.last_name"
          class="form-control"
        />

        <label for="PESEL" class="control-label">PESEL</label>
        <b-input
          type="text"
          name="PESEL"
          v-model="createDataForm.PESEL"
          class="form-control"
        />

        <label for="password" class="control-label">Hasło</label>
        <b-input
          type="password"
          name="password"
          v-model="createDataForm.password"
          class="form-control"
        />

        <label for="roles" class="control-label">Role</label>
        <b-form-select
          v-model="createDataForm.roles"
          :options="[
            { value: 'admin', text: 'Administrator' },
            { value: 'teacher', text: 'Nauczyciel' },
            { value: 'student', text: 'Uczeń' },
            { value: 'parent', text: 'Rodzic' },
          ]"
          :select-size="4"
          selected="null"
          multiple
        ></b-form-select>

        <b-btn type="submit" variant="success">Utwórz użytkownika</b-btn>
      </form>
    </b-modal>
    <!--Koniec okienka dodania użytkownika-->
    <!--Początek okienka edycji podstawowej użytkownika-->
    <b-modal
      id="modal-edit-base"
      title="Edytuj użytkownika"
      hide-footer
      size="lg"
    >
      <form
        @submit.prevent="editUser(baseData._id)"
        class="w-75"
        style="margin: 0 auto"
      >
        <label for="username" class="control-label">Nazwa użytkownika</label>
        <b-input
          type="text"
          name="username"
          v-model="baseData.username"
          class="form-control"
        />

        <label for="first_name" class="control-label">Imię</label>
        <b-input
          type="text"
          name="first_name"
          v-model="baseData.first_name"
          class="form-control"
        />

        <label for="last_name" class="control-label">Nazwisko</label>
        <b-input
          type="text"
          name="last_name"
          v-model="baseData.last_name"
          class="form-control"
        />

        <label for="roles" class="control-label">Role</label>
        <b-form-select v-model="baseData.roles" multiple :select-size="3">
          <b-form-select-option
            v-if="Array.from(baseData.roles).includes('student')"
            value="student"
            selected
            >Student</b-form-select-option
          >
          <b-form-select-option v-else value="student"
            >Student</b-form-select-option
          >
          <b-form-select-option
            v-if="Array.from(baseData.roles).includes('teacher')"
            value="teacher"
            selected
            >Nauczyciel</b-form-select-option
          >
          <b-form-select-option v-else value="teacher"
            >Nauczyciel</b-form-select-option
          >
          <b-form-select-option
            v-if="Array.from(baseData.roles).includes('parent')"
            value="parent"
            selected
            >Rodzic</b-form-select-option
          >
          <b-form-select-option v-else value="parent"
            >Rodzic</b-form-select-option
          >
          <b-form-select-option
            v-if="Array.from(baseData.roles).includes('admin')"
            value="admin"
            selected
            >Administrator</b-form-select-option
          >
          <b-form-select-option v-else value="admin"
            >Administrator</b-form-select-option
          >
        </b-form-select>
        <b-btn type="submit" variant="success">Zatwierdź dane</b-btn>
      </form>
    </b-modal>
    <!--Koniec okienka edycji podstawowej użytkownika-->
    <!--Początek okienka edycji detali użytkownika-->
    <b-modal
      id="modal-edit-extend"
      title="Edytuj użytkownika"
      hide-footer
      size="lg"
    >
      <form
        @submit.prevent="editExtend(baseData._id)"
        class="w-75"
        style="margin: 0 auto"
      >
        <label for="password" class="control-label">Hasło</label>
        <b-form-input
          type="password"
          name="password"
          v-model="extendedData.password"
          class="form-control"
        />

        <label for="email" class="control-label">Email</label>
        <b-form-input
          type="email"
          name="email"
          v-model="baseData.email"
          class="form-control"
        />

        <label for="PESEL" class="control-label">Pesel</label>
        <b-form-input
          type="text"
          name="PESEL"
          v-model="baseData.PESEL"
          class="form-control"
        />

        <b-btn type="submit" variant="success">Zatwierdź dane</b-btn>
      </form>
    </b-modal>
    <!--Koniec okienka edycji detali użytkownika-->
    <!--Początek okienka dodania adresu-->
    <b-modal id="modal-add-address" title="Dodaj adres" hide-footer size="lg">
      <form
        @submit.prevent="addAddress(baseData._id)"
        class="w-75"
        style="margin: 0 auto"
      >
        <label for="city" class="control-label">Miasto</label>
        <b-input
          type="text"
          name="city"
          v-model="createAddressForm.city"
          class="form-control"
        />

        <label for="street" class="control-label">Ulica</label>
        <b-input
          type="text"
          name="street"
          v-model="createAddressForm.street"
          class="form-control"
        />

        <label for="house_number" class="control-label">Numer domu</label>
        <b-input
          type="number"
          name="house_number"
          v-model="createAddressForm.house_number"
          class="form-control"
        />

        <label for="flat_number" class="control-label">Mieszkanie</label>
        <b-input
          type="number"
          name="flat_number"
          v-model="createAddressForm.flat_number"
          class="form-control"
        />

        <label for="postal" class="control-label">Kod pocztowy</label>
        <b-input
          type="text"
          name="postal"
          v-model="createAddressForm.postal"
          class="form-control"
        />

        <b-btn type="submit" variant="success">Zatwierdź dane</b-btn>
      </form>
    </b-modal>
    <!--Koniec okienka dodania adresu-->
    <!--Początek okienka edycji adresu-->
    <b-modal id="modal-edit-address" title="Edytuj adres" hide-footer size="lg">
      <form
        @submit.prevent="editAddress(baseData._id, tmpVariable)"
        class="w-75"
        style="margin: 0 auto"
      >
        <label for="city" class="control-label">Miasto</label>
        <b-input
          type="text"
          name="city"
          v-model="editAddressForm.city"
          class="form-control"
        />

        <label for="street" class="control-label">Ulica</label>
        <b-input
          type="text"
          name="street"
          v-model="editAddressForm.street"
          class="form-control"
        />

        <label for="house_number" class="control-label">Numer domu</label>
        <b-input
          type="number"
          name="house_number"
          v-model="editAddressForm.house_number"
          class="form-control"
        />

        <label for="flat_number" class="control-label">Mieszkanie</label>
        <b-input
          type="number"
          name="flat_number"
          v-model="editAddressForm.flat_number"
          class="form-control"
        />

        <label for="postal" class="control-label">Kod pocztowy</label>
        <b-input
          type="text"
          name="postal"
          v-model="editAddressForm.postal"
          class="form-control"
        />

        <b-btn type="submit" variant="success">Zatwierdź dane</b-btn>
      </form>
    </b-modal>
    <!--Koniec okienka edycji adresu-->
    <b-btn variant="success" class="mb-2" v-b-modal.modal-create scrollable
      >Dodaj</b-btn
    >
    <b-table
      hover
      :items="users"
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
          <b-btn variant="info" class="ml-1 w-50" @click="row.toggleDetails"
            >Szczegóły</b-btn
          >
          <b-btn
            @click="fillData(currentRow(row.index))"
            variant="warning"
            class="ml-1 w-50"
            v-b-modal.modal-edit-base
            scrollable
            >Edytuj</b-btn
          >
          <b-btn
            @click="deleteData(currentRow(row.index))"
            variant="danger"
            class="ml-1 w-50"
            >Usuń</b-btn
          >
        </div>
      </template>
      <!--Początek karty szczegółów-->
      <template #row-details="row">
        <b-card class="text-left tw-bg-gray-300">
          <div class="d-flex flex-column">
            <ul class="list-group">
              <li class="list-group-item">Email : {{ row.item.email }}</li>
              <li class="list-group-item">PESEL : {{ row.item.PESEL }}</li>
              <b-btn
                @click="fillData(currentRow(row.index))"
                variant="warning"
                class="align-self-center w-50 m-2"
                v-b-modal.modal-edit-extend
                scrollable
                >Edytuj</b-btn
              >
            </ul>
            <h1 class="m-2 text-center">Adresy:</h1>
            <b-btn
              @click="fillData(currentRow(row.index))"
              variant="success"
              v-b-modal.modal-add-address
              class="w-25"
              >Dodaj adres</b-btn
            >
            <div
              v-for="(address, index) in row.item.address"
              :key="index"
              class="mt-3"
            >
              <ul class="list-group border border-primary">
                <li class="list-group-item">Miasto : {{ address.city }}</li>
                <li class="list-group-item">
                  Miasto : {{ address.street + " " + address.house_number }} /
                  {{ address.flat_number }}
                </li>
                <li class="list-group-item">
                  Kod pocztowy : {{ address.postal }}
                </li>
                <li class="list-group-item">
                  <div class="d-flex flex-row justify-content-center">
                    <b-btn
                      variant="warning"
                      @click="
                        fillData(currentRow(row.index)),
                          fillAddressData(currentRow(row.index), index)
                      "
                      v-b-modal.modal-edit-address
                      class="ml-1 w-50"
                      >Edytuj adres</b-btn
                    >
                    <b-btn
                      variant="danger"
                      @click="deleteAddress(currentRow(row.index), index)"
                      class="ml-1 w-50"
                      >Usuń adres</b-btn
                    >
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </b-card>
      </template>
      <!--Koniec karty szczegółów-->
    </b-table>
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
import "../../interceptors/axios";
import axios from "axios";
export default {
  data() {
    return {
      /** Lista użytkowników
       * trzyma obiekty użytkowników
       */
      users: [],
      /** Podstawowe dane użytkownika
       * model podstawowych informacji o użytkowniku
       */
      baseData: {
        _id: "",
        username: "",
        first_name: "",
        last_name: "",
        roles: [],
      },
      /** Rozszerzone dane użytkownika
       * model pozostałych informacji o użytkowniku
       */
      extendedData: {
        password: "",
        PESEL: "",
        email: "",
      },
      /** Pola tabeli głownej
       * Zawiera klucze i napisy na headerach tabeli
       */
      fields: [
        { key: "index", label: "#" },
        { key: "first_name", label: "Imię" },
        { key: "last_name", label: "Nazwisko" },
        { key: "username", label: "Nazwa użytkownika" },
        { key: "roles", label: "Rola", formatter: "convertRoles" },
        { key: "actions", label: "Akcje" },
      ],
      /** Formularz utworzenia nowego użytkownika
       * Zawiera pełen model użytkownika
       */
      createDataForm: {
        username: "",
        first_name: "",
        last_name: "",
        password: "",
        PESEL: "",
        email: "",
        roles: [],
      },
      /** Lista adresów
       * Zawiera liste adresów
       */
      addresses: [],
      /** Formularz utworzenia adresu
       * zawiera model adresu
       */
      createAddressForm: {
        city: "",
        postal: "",
        street: "",
        house_number: 0,
        flat_number: 0,
      },
      /** Formularz edycji adresu
       * zawiera model adresu
       */
      editAddressForm: {
        city: "",
        postal: "",
        street: "",
        house_number: 0,
        flat_number: 0,
      },
      tmpVariable: 0,
      perPage: 7,
      currentPage: 1,
    };
  },
  mounted() {
    this.fetchPosts();
                if (localStorage.getItem("role") != "admin") {
            this.$router.push('/error/403');
        }
  },
  computed: {
    rows() {
      return this.users.length;
    },
    csrf() {
      return localStorage.getItem("_csrf");
    },
  },
  methods: {
    /** Obecny faktyczny rząd tabeli
     * Oblicza faktyczny index tabeli z wiedzy o obecnej stronie i id wybranego rzedu na niej
     * @param {*} id
     */
    currentRow(id) {
      return (this.currentPage - 1) * this.perPage + id;
    },
    /** Konwerter tablic ról
     * Zamienia tablicę z rolami na tekst
     * @param {*} item tablica przedmiotów
     */
    convertRoles(item) {
      let m = Array.from(item);
      let z = "";
      console.log(m);
      m.forEach((role, index) => {
        if (role == "teacher") {
          z += "NAUCZYCIEL";
        }
        if (role == "student") {
          z += "UCZEŃ";
        }
        if (role == "admin") {
          z += "ADMINISTRATOR";
        }
        if (role == "parent") {
          z += "RODZIC";
        }
        if (index >= 0 && m.length > 1 && index < m.length - 1) {
          z += ",";
        }
      });
      return z;
    },
    /** Pobieranie postów
     * Pobiera posty i umieszcza je w obiekcie users
     */
    fetchPosts() {
      axios
        .get(`/users/`, {
          withCredentials: false,
          headers: {
                                       Authorization: `Bearer ` + localStorage.getItem("token"),

          },
        })
        .then((data) => (this.users = data.data));
    },
    /** Zapełnienie formularzów edycji
     * wypełnia formularze edycji
     * @param {*} index numer rzędu komórki
     */
    fillData(index) {
      this.baseData = Array.from(this.users)[index];
      this.extendedData = Array.from(this.users)[index];
    },
    fillAddressData(id, id2) {
      this.editAddressForm = Array.from(this.users)[id].address[id2];
      this.tmpVariable = id2;
    },
    async createUser() {
      if (
        !/^[0-9]+$/.test(this.createDataForm.PESEL) ||
        this.createDataForm.PESEL.length < 11 ||
        this.createDataForm.PESEL.length > 11 ||
        !this.createDataForm.email ||
        !this.createDataForm.first_name ||
        !this.createDataForm.last_name ||
        !this.createDataForm.password ||
        !this.createDataForm.roles ||
        !this.createDataForm.username
      ) {
        alert("Wprowadź poprawne dane");
        return;
      }
      await axios.post("/auth/signup", this.createDataForm, {
        withCredentials: false,
        headers: {
                                     Authorization: `Bearer ` + localStorage.getItem("token"),

        },
      });
      this.$router.go(0);
    },
    async editUser(id) {
      if (
        !this.baseData.first_name ||
        !this.baseData.last_name ||
        !this.baseData.roles ||
        !this.baseData.username
      ) {
        alert("Wprowadź poprawne dane");
        return;
      }
      await axios.patch("/users/" + id, this.baseData, {
        withCredentials: false,
        headers: {
                                     Authorization: `Bearer ` + localStorage.getItem("token"),

        },
      });
      this.$router.go(0);
    },
    async editExtend(id) {
      let form = {
        username: this.baseData.username,
        first_name: this.baseData.first_name,
        last_name: this.baseData.last_name,
        roles: this.baseData.roles,
        password: this.extendedData.email,
        PESEL: this.extendedData.PESEL,
        email: this.extendedData.email,
      };
      if (
        !this.extendedData.email ||
        !this.extendedData.password ||
        !this.extendedData.PESEL ||
        !/^[0-9]+$/.test(this.extendedData.PESEL) ||
        this.extendedData.PESEL.length < 11 ||
        this.extendedData.PESEL.length > 11
      ) {
        alert("Wprowadź poprawne dane");
        return;
      }
      await axios.patch("/users/" + id, form, {
        withCredentials: false,
        headers: {
                                     Authorization: `Bearer ` + localStorage.getItem("token"),

        },
      });
      this.$router.go(0);
    },
    async deleteData(id) {
      this.fillData(id);
      const deleteID = this.baseData._id;
      await axios.delete("/users/" + deleteID, {
        withCredentials: false,
        headers: {
                                     Authorization: `Bearer ` + localStorage.getItem("token"),

        },
      });
      this.$router.go(0);
    },
    async addAddress(id) {
      console.log(this.createAddressForm);
      console.log(id);
      await axios.post("/users/" + id + "/addAddress", this.createAddressForm, {
        withCredentials: false,
        headers: {
                                     Authorization: `Bearer ` + localStorage.getItem("token"),

        },
      });
      this.$router.go(0);
    },
    async editAddress(id, id2) {
      await axios.patch("/users/" + id + "/" + id2, this.editAddressForm, {
        withCredentials: false,
        headers: {
                                     Authorization: `Bearer ` + localStorage.getItem("token"),

        },
      });
      this.$router.go(0);
    },
    async deleteAddress(id, id2) {
      this.fillData(id);
      const deleteID = this.baseData._id;
      await axios.delete("/users/" + deleteID + "/" + id2, {
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
