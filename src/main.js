import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './interceptors/axios'
import './assets/css/main.css'
import { VueRecaptcha } from 'vue-recaptcha';
import HumanMaleFemaleChild from 'vue-material-design-icons/HumanMaleFemaleChild.vue';
import AccountGroup from 'vue-material-design-icons/AccountGroup.vue';
import ClipboardList from 'vue-material-design-icons/ClipboardList.vue';
import HomeGroup from 'vue-material-design-icons/HomeGroup.vue';
import ListStatus from 'vue-material-design-icons/ListStatus.vue';
import NotebookEdit from 'vue-material-design-icons/NotebookEdit.vue';
import NoteEdit from 'vue-material-design-icons/NoteEdit.vue';
import NotePlus from 'vue-material-design-icons/NotePlus.vue';
import CalendarText from 'vue-material-design-icons/CalendarText.vue';
import BookOpenPageVariant from 'vue-material-design-icons/BookOpenPageVariant.vue';
import CalendarRemove from 'vue-material-design-icons/CalendarRemove.vue';
import VueCookies from 'vue-cookies'

Vue.component('excuse-icon', CalendarRemove);
Vue.component('gradeandpresence-icon', BookOpenPageVariant);
Vue.component('exams-icon', CalendarText);
Vue.component('presences-icon', ListStatus);
Vue.component('grades-icon', NotebookEdit);
Vue.component('assignments-icon', NoteEdit);
Vue.component('tests-icon', NotePlus);
Vue.component('class-icon', HomeGroup);
Vue.component('clipboard-icon', ClipboardList);
Vue.component('account-icon', AccountGroup);
Vue.component('family-icon', HumanMaleFemaleChild);
Vue.component('vue-recaptcha', VueRecaptcha);
Vue.config.productionTip = false

new Vue({
  router,
  store,
  VueCookies,
  render: h => h(App)
}).$mount('#app')
