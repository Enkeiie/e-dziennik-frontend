<template>
  <div class="tw-w-full tw-h-screen bg-my-background-image tw-md:flex tw-items-center tw-text-center">
      <div>
        <b-navbar toggleable="md" type="dark" variant="info">
          <b-navbar-brand @click="routeMe()">Bystrzak.pl</b-navbar-brand>
        </b-navbar>
        <router-view/>
    </div>
    <div class="tw-flex tw-h-1/2 tw-items-center tw-justify-center">
  <b-card>
    Ta strona jest widoczna tylko dla zalogowanych użytkowników. Aby kontynuować <router-link to="/auth/login">&nbsp;zaloguj się</router-link>
  </b-card>
  </div>
  </div>
</template>
<script>
export default {
    data() {
        return {}
    },
    methods: {
        routeMe(){
            let role = localStorage.getItem("role");
                if(role=="admin"){
                    this.$router.push('/admin/');
                }
                else if(role=="teacher"){
                    this.$router.push('/teacher/');
                }
                else if(role=="student"){
                    this.$router.push('/student/');
                }
                else if(role=="parent"){
                    this.$router.push('/parent/');
                }else
                    this.$router.push('/');
                }
        }
}
</script>
<style>
.bg-my-background-image {
  background-image: url('../assets/bg.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
</style>