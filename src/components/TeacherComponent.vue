<template>
    <div>
        <b-navbar toggleable="md" type="dark" variant="info">
  <router-link to="/teacher/"><b-navbar-brand>Bystrzak.pl</b-navbar-brand></router-link>

  <!-- Put the toggle here after the brand -->
  <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

  <b-collapse is-nav id="nav_collapse">

    <b-navbar-nav>
      <b-nav-item href="#"><router-link to="/teacher/grades/" class="text-white">Oceny</router-link></b-nav-item>
      <b-nav-item href="#"><router-link to="/teacher/presences/" class="text-white">Obecności</router-link></b-nav-item>
      <b-nav-item-dropdown>
        <template slot="button-content">
          <em>Testy</em>
        </template>
        <b-dropdown-item @click="routeTests">Lista testów</b-dropdown-item>
        <b-dropdown-item @click="routeAssignments">Przypisz test</b-dropdown-item>
      </b-nav-item-dropdown>
      <b-nav-item><router-link to="/teacher/homeroom" class="text-white">Moje klasy</router-link></b-nav-item>
    </b-navbar-nav>

    <!-- Right aligned nav items -->
    <b-navbar-nav class="ml-auto">
      <b-nav-item href="#" right v-if="!isLoaded">Zaloguj się</b-nav-item>
      <b-nav-item-dropdown right v-if="isLoaded">
        <!-- Using button-content slot -->
        <template slot="button-content">
          <em>{{this.username}}</em>
        </template>
        <b-dropdown-item> <router-link to="/auth/profile">Profil</router-link></b-dropdown-item>
        <b-dropdown-item> <router-link to="/auth/logout">Wyloguj się</router-link></b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>

  </b-collapse>


</b-navbar>
        <router-view/>
    </div>
</template>
<script>

export default{
    data(){
      return {
        roles: null,
        username: null,
      }
    },
    mounted(){
      this.roles = localStorage.getItem('role');
      this.username = localStorage.getItem('username');
      console.log(this.roles)
    },
    computed:{
      isLoaded(){
        return this.roles != null
      }
    },
    methods: {
      routeTests(){
        this.$router.push("/teacher/tests")
      },
      routeAssignments(){
        this.$router.push("/teacher/tests/assignments")
      }
    }
}
</script>