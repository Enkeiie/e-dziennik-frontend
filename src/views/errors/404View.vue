<template>
    <div class="pt-5 px-1 w-100 text-center">
       Wybrany zasób nie istnieje. Aby powrócić naciśnij <a class="text-blue" @click="routeMe">tutaj</a>
    </div>
</template>
<script>
export default {
    data() {
        return {
        }
    },
    created() {
    },
    computed: {
    },
    methods: {
        routeMe(){
            let role = localStorage.getItem("role");
            if(role=="admin"){
                this.$router.push('/admin/');
            }
            if(role=="teacher"){
                this.$router.push('/teacher/');
            }
            if(role=="student"){
                this.$router.push('/student/');
            }
            if(role=="parent"){
                this.$router.push('/parent/');
            }
        }
    }
}
</script>