<template>
    <div class="pt-5 px-1 w-100">
        <h1 class="text-center">Menu</h1>
        <b-list-group class="text-left tw-w-fit tw-mx-auto">
            <b-list-group-item><router-link to="/student/presenceandgrades/" class="tw-text-3xl"><gradeandpresence-icon/>Obecności i oceny</router-link></b-list-group-item>
                    <b-list-group-item><router-link to="/student/tests/" class="tw-text-3xl"><exams-icon/>Moje sprawdziany</router-link></b-list-group-item>
        </b-list-group>
    </div>
    
</template>
<script>
export default {
    mounted() {
                    if (localStorage.getItem("role") != "admin") {
            this.$router.push('/error/403');
        }
    }
}
</script>