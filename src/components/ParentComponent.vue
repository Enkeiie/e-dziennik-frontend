<template>
    <div>
        <b-navbar toggleable="md" type="dark" variant="info">
          <router-link to="/parent/"><b-navbar-brand>Bystrzak.pl</b-navbar-brand></router-link>

  <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

  <b-collapse is-nav id="nav_collapse">

    <b-navbar-nav>
      <b-nav-item href="#"><router-link to="/parent/presenceandgrades" class="text-white">Oceny i obecność</router-link></b-nav-item>
      <b-nav-item href="#"><router-link to="/parent/excuses" class="text-white">Usprawiedliwienia</router-link></b-nav-item>
    </b-navbar-nav>

    <b-navbar-nav class="ml-auto">
      <b-nav-item href="#" right v-if="!isLoaded">Zaloguj się</b-nav-item>
      <b-nav-item-dropdown right v-if="isLoaded">
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
      console.log(this.roles);
      this.username = localStorage.getItem('username');
      console.log(this.roles)
    },
    computed:{
      isLoaded(){
        return this.roles != null
      }
    }
}
</script>