<template>
    <div class="tw-flex tw-justify-center tw-w-screen tw-h-full tw-mt-8">
        <div class="tw-w-30 tw-lg:30">
            <form class="tw-border tw-border-gray-300  tw-bg-gray-100 tw-rounded-lg p-5" @submit.prevent="LoginFunction">
                <div class="mb-4 tw-bg-red-400 text-center border border-red-600 rounded full" v-if="error">
                    {{ message }}
                </div>
                <div class="mb-4">
                    <label>Nazwa użytkownika</label>
                    <b-input v-model="username" type="text" placeholder="Nazwa użytkownika" id="login"/>
                </div>
                <div class="mb-4">
                    <label>Hasło</label>
                    <b-input v-model="password" type="password" placeholder="************" id="password"/> 
                </div>
                <div class="mb-4">
                    <vue-recaptcha ref="recaptcha" @verify="onVerify" :sitekey="sitekey"></vue-recaptcha>
                </div>
                
                <div class="mb-4">
                    <b-btn type="submit" id="submitBtn">Zaloguj się</b-btn>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import '../../interceptors/axios';

export default{
    data(){
        return{
            username: "",
            password: "",
            recaptchaResponse: "",
            sitekey: "6Ld5sYwkAAAAAHdw8XcbRs2U21gVulMMCcUyZJiv",
            error: false,
            message: "",
        };
    },
    computed: {
    },
    methods:{
        onVerify(response) {
            this.recaptchaResponse = response;
        },
         async LoginFunction(){
            console.log(this.username);
                await axios.post('/auth/signin',{
                    username: this.username,
                    password: this.password,
                    captcha: this.recaptchaResponse,
                },{
                    headers:{
                        withCredentials: true,
                    }
                }).then(response =>{
                    this.error=false;
                    this.$store.commit('changeToken',response.data.accessToken);
                    this.$store.commit('changeRefresh',response.data.refreshToken);
                    let name = ''+response.data.userRole['first_name'] + ' ' + response.data.userRole['last_name'];
                    this.$store.commit('changeUsername',name);
                    this.$store.commit('changeRole',response.data.userRole['roles']);
                    this.$store.commit('changeUid',response.data.userRole['_id']);
                    localStorage.setItem("token",this.$store.getters.getToken);
                    localStorage.setItem("refresh",this.$store.getters.getRefresh);
                    localStorage.setItem("username",this.$store.getters.getUsername);
                    localStorage.setItem("role",this.$store.getters.getRole);
                    localStorage.setItem("uid",this.$store.getters.getUid);
                }).catch(error => {
                    if(error.response.status === 500){
                    this.$refs.recaptcha.reset();
                    this.error = true;
                    this.message = error.response.data.message
                    }
                })
                if(!this.error){
                    if(localStorage.getItem("role")=="student"){
                await axios.get(`/classes/student/`+localStorage.getItem("uid"),{
                    withCredentials: false,
                    headers: {
                        'Authorization': localStorage.getItem("token")
                    }
                }).then(response => localStorage.setItem("class",response.data._id))}
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
}

</script>