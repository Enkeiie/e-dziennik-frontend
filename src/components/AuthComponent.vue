<template>
    <div>
        <b-navbar toggleable="md" type="dark" variant="info">
          <b-navbar-brand @click="routeMe()">Bystrzak.pl</b-navbar-brand>
        </b-navbar>
        <router-view/>
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