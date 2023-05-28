<template>
    <div class="pt-5 px-1 w-100">
        <h1 class="text-center">Menu</h1>
        <b-list-group class="text-left tw-w-fit tw-mx-auto">
            <b-list-group-item><router-link to="/teacher/grades/" class="tw-text-3xl"><grades-icon/>Oceny</router-link></b-list-group-item>
                <b-list-group-item><router-link to="/teacher/presences/" class="tw-text-3xl"><presences-icon/>Obecności</router-link></b-list-group-item>
                    <b-list-group-item><router-link to="/teacher/tests/assignments" class="tw-text-3xl"><tests-icon/>Przypisz testy</router-link></b-list-group-item>
                        <b-list-group-item><router-link to="/teacher/tests/" class="tw-text-3xl"><assignments-icon/>Zarządzaj testami</router-link></b-list-group-item>
                        <b-list-group-item><router-link to="/teacher/homeroom" class="tw-text-3xl"><class-icon/>Moje klasy</router-link></b-list-group-item>
        </b-list-group>
    </div>
    
</template>
<script>
export default {
    mounted() {
                if(localStorage.getItem("role")!="teacher"){
            this.$router.push('/error/403');
        }
    }
}
</script>