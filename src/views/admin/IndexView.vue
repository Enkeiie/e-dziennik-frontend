<template>
    <div class="pt-5 px-1 w-100">
        <h1 class="text-center">Menu</h1>
        <b-list-group class="text-left tw-w-fit tw-mx-auto">
            <b-list-group-item class="tw-text-3xl"><router-link to="/admin/users/"><account-icon/>Użytkownicy </router-link></b-list-group-item>
                    <b-list-group-item class="tw-text-3xl"><router-link to="/admin/classes/"><class-icon/>Klasy </router-link></b-list-group-item>
                    <b-list-group-item class="tw-text-3xl"><router-link to="/admin/subjects/"><clipboard-icon/>Przedmioty</router-link></b-list-group-item>
                    <b-list-group-item class="tw-text-3xl"><router-link to="/admin/parents/"><family-icon/>Rodzice</router-link></b-list-group-item>
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