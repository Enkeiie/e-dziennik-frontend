<template>
  <div class="pt-5 px-2 w-100">
    <!--Początek okienka dodania adresu-->
    <b-modal id="newAddress" title="Dodaj adres" hide-footer size="lg">
      <form @submit.prevent="addAddress()" class="w-75" style="margin: 0 auto">
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
    <!--Okienko edycji danych-->
      <b-modal id="editData" title="EdytujInformacje" hide-footer size="lg">
      <form @submit.prevent="editUser()" class="w-75" style="margin: 0 auto">
        <label for="username" class="control-label">Nazwa użytkownika</label>
        <b-input
          type="text"
          name="username"
          v-model="editDataForm.username"
          class="form-control"
        />
        <label for="first_name" class="control-label">Imię</label>
        <b-input
          type="text"
          name="first_name"
          v-model="editDataForm.first_name"
          class="form-control"
        />
        <label for="last_name" class="control-label">Nazwisko</label>
        <b-input
          type="text"
          name="last_name"
          v-model="editDataForm.last_name"
          class="form-control"
        />

        <label for="PESEL" class="control-label">PESEL</label>
        <b-input
          type="text"
          name="PESEL"
          v-model="editDataForm.PESEL"
          class="form-control"
        />

        <label for="password" class="control-label">Hasło</label>
        <b-input
          type="password"
          name="password"
          v-model="editDataForm.password"
          class="form-control"
        />
        <b-btn type="submit" variant="success">Zatwierdź dane</b-btn>
      </form>
    </b-modal>
    <!--Koniec okienka edycji danych-->
    <h1 class="text-center">Moje dane:</h1>
    <div class="md:tw-flex md:tw-flex-row flex-none">
      <div class="md:tw-basis-1/4">
        <b-card>
          <center>
            <img
              class="tw-object-contain tw-w-36 tw-aspect-square tw-rounded-full"
              src="../../assets/avatar.jpg"
            />
          </center>
          <h2>
            {{ this.profileData.first_name }} {{ this.profileData.last_name }}
          </h2>
        </b-card>
      </div>
      <div class="text-center md:tw-mt-0 tw-mt-2 md:tw-px-2 md:tw-basis-4/5">
        <b-list-group class="text-left">
          <b-list-group-item>
            Nazwa użytkownika: {{ this.profileData.username }}
          </b-list-group-item>
          <b-list-group-item>
            Email: {{ this.profileData.email }}
          </b-list-group-item>
          <b-list-group-item>
            PESEL: {{ this.profileData.PESEL }}
          </b-list-group-item>
          <b-btn class="tw-w-full" variant="warning" v-b-modal.editData
            >Edytuj moje dane</b-btn
          >
        </b-list-group>
      </div>
    </div>
    <h1>Moje adresy</h1>
    <b-btn variant="success" v-b-modal.newAddress>Dodaj adres</b-btn>
    <div class="md:tw-flex md:tw-flex-row">
      <b-list-group
        class="text-center tw-md:w-96 tw-w-full tw-px-5 tw-mt-2 md:tw-w-1/3"
        v-for="(address, index) in this.profileData.address"
        :key="index"
        small
      >
        <b-list-group-item class="tw-bg-red-300" small>
          Miasto
        </b-list-group-item>
        <b-list-group-item>
          {{ address.city }}
        </b-list-group-item>
        <b-list-group-item class="tw-bg-red-300"> Ulica </b-list-group-item>
        <b-list-group-item>
          {{
            address.street +
            " " +
            address.house_number +
            " / " +
            address.flat_number
          }}
        </b-list-group-item>
        <b-list-group-item class="tw-bg-red-300">
          Kod pocztowy
        </b-list-group-item>
        <b-list-group-item>
          {{ address.postal }}
        </b-list-group-item>
        <b-list-group-item>
          <b-btn variant="warning" class="md:tw-w-1/2 tw-w-full tw-m-1">Edytuj</b-btn>
          <b-btn
            variant="danger"
            @click="deleteAddress(index)"
            class="md:tw-w-1/2 tw-w-full tw-m-1"
            >Usuń</b-btn
          >
        </b-list-group-item>
      </b-list-group>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import "../../interceptors/axios";

export default {
  data() {
    return {
      profileData: {
        id: "",
        first_name: "",
        last_name: "",
        PESEL: "",
        address: [
          {
            city: "",
            postal: "",
            street: "",
            house_number: "",
            flat_number: "",
          },
        ],
        username: "",
        email: "",
        password: "",
      },
      editDataForm: {
        first_name: "",
        last_name: "",
        PESEL: "",
        username: "",
        email: "",
        password: "",
      },
      createAddressForm: {
        city: "",
        postal: "",
        street: "",
        house_number: 0,
        flat_number: 0,
      },
    };
  },
  computed: {
    getToken() {
      return `Bearer ${localStorage.getItem("token")}`;
    },
    getRefresh() {
      return `Bearer ${localStorage.getItem("refresh")}`;
    },
    csrf() {
      return localStorage.getItem('_csrf');
    }    
  },
  created() {
    this.fetchUser();
  },
  methods: {
    async fetchUser() {
      await axios
        .get("/auth/profile", {
          withCredentials: true,
          headers: {
            Authorization: this.getToken,
          },
        })
        .then((response) => (this.profileData = response.data));
      this.editDataForm.first_name = this.profileData.first_name;
      this.editDataForm.last_name = this.profileData.last_name;
      this.editDataForm.email = this.profileData.email;
      this.editDataForm.PESEL = this.profileData.PESEL;
      this.editDataForm.password = this.profileData.password;
      this.editDataForm.username = this.profileData.username;
      console.log(this.editDataForm);
      this.profileData.password =
        this.profileData.password.substring(0, 12) + "...";
    },
    async editUser() {
      await axios.post(
        "/auth/profile",
        {
          username: this.editDataForm.username,
          first_name: this.editDataForm.first_name,
          last_name: this.editDataForm.last_name,
          email: this.editDataForm.email,
          PESEL: this.editDataForm.PESEL,
          password: this.editDataForm.password,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: this.getToken,
          },
        }
      );
      this.$router.go(0);
    },
    async deleteAddress(id) {
      await axios.delete("/users/" + localStorage.getItem("uid") + "/" + id, {
        withCredentials: true,
        headers: {
          Authorization: this.getToken,
        },
      });
      this.$router.go(0);
    },
    async addAddress() {
      await axios.post(
        "/users/" + localStorage.getItem("uid") + "/addAddress",
        this.createAddressForm,
        {
          withCredentials: true,
          headers: {
            Authorization: this.getToken,
          },
        }
      );
      this.$router.go(0);
    },
  },
};
</script>
