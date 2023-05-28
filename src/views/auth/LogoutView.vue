<template>
    <div class="flex justify-center w-screen h-full mt-8">
        <p>Zaraz nastąpi wylogowanie</p>
    </div>
</template>
<script>
import axios from 'axios';
import '../../interceptors/axios';

export default{
    data(){
        return{
        };
    },
    mounted(){
        this.LogoutFunction()
    },
    methods:{
        async LogoutFunction() {
            await axios.get('/auth/logout', {
                headers: {
                    withCredentials: true,
                    Authorization: `Bearer ` + localStorage.getItem("token"),
                }
                });
                await localStorage.setItem("token",null);
                await localStorage.setItem("refresh",null);
                await localStorage.setItem("username",null);
                await localStorage.setItem("role",null);
                await localStorage.setItem("uid",null);
                this.$router.push('/');
            }
    }
}

</script>