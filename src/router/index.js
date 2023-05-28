import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeComponent from '../components/HomeComponent.vue'
import AdminComponent from '../components/AdminComponent.vue'
import TeacherComponent from '../components/TeacherComponent.vue'
import AuthComponent from '../components/AuthComponent.vue'
import StudentComponent from '../components/StudentComponent.vue'
import ParentComponent from '../components/ParentComponent.vue'
Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeComponent,
    meta: {},
    children: [
      {
        path: '',
        name: 'landing page',
        component: () => import('../views/HomeView.vue')
      },
      {
        path: 'error/404',
        name: 'error 404',
        component: () => import('../views/errors/404View.vue')
      },
      {
        path: 'error/403',
        name: 'error 403',
        component: () => import('../views/errors/403View.vue')
      },
      {
        path: 'admin',
        name: 'admin panel',
        component: AdminComponent,
        meta: {
          group: 'admin',
          requiredVarValue: 'admin',
        },
        children: [
          {
            path: '',
            name: 'index panel',
            component: () => import('../views/admin/IndexView.vue'),
          },
          {
            path: 'users',
            name: 'user list',
            component: () => import('../views/admin/UserListView.vue')
          },
          {
            path: 'classes',
            name: 'class list',
            component: () => import('../views/admin/ClassListView.vue')
          },
          {
            path: 'subjects',
            name: 'subject list',
            component: () => import('../views/admin/SubjectListView.vue')
          },
          {
            path: 'parents',
            name: 'parents panel',
            component: () => import('../views/admin/ParentsListView.vue')
          }
        ]
      },
      {
        path: 'teacher',
        name: 'teacher panel',
        component: TeacherComponent,
        meta: {
          group: 'teacher',
          requiredVarValue: 'teacher',
        },
        children: [
          {
            path: '',
            name: 'index panel',
            component: () => import('../views/teacher/IndexView.vue'),
          },
          {
            path: 'grades',
            name: 'grade panel',
            component: () => import('../views/teacher/GradePickerView.vue'),
          },
          {
            path: 'grades/:class/:subject',
            name: 'grade list',
            component: () => import('../views/teacher/GradesList.vue'),
          },
          {
            path: 'presences',
            name: 'presence panel',
            component: () => import('../views/teacher/PresencePickerView.vue'),
          },
          {
            path: 'presences/:class/:subject',
            name: 'presences list',
            component: () => import('../views/teacher/PresenceList.vue'),
          },
          {
            path: 'tests',
            name: 'test panel',
            component: () => import('../views/teacher/TestList.vue'),
          },
          {
            path: 'tests/assignments',
            name: 'assignments panel',
            component: () => import('../views/teacher/AssignedTestList.vue'),
          },
          {
            path: 'homeroom',
            name: 'teacher class panel',
            component: () => import('../views/teacher/ClassView.vue')
          }
        ]
      },
      {
        path: 'student',
        name: 'student panel',
        component: StudentComponent,
        meta: {
          group: 'student',
          requiredVarValue: 'student',
        },
        children: [
          {
            path: '',
            name: 'index view',
            component: () => import('../views/student/IndexView.vue')
          },
          {
            path: 'presenceandgrades',
            name: 'presence and grades panel',
            component: () => import('../views/student/GradeAndPresenceView.vue'),
          },
          {
            path: 'tests',
            name: 'test panel',
            component: () => import(`../views/student/TestsList.vue`),
          },
          {
            path: 'tests/:id',
            name: 'solve test panel',
            component: () => import(`../views/student/TestView.vue`)
          }
        ]
      },
      {
        path: 'parent',
        name: 'parent panel',
        component: ParentComponent,
        meta: {
          group: 'parent',
          requiredVarValue: 'parent',
        },
        children: [
          {
            path: '',
            name: 'index panel',
            component: () => import('../views/parent/IndexView.vue'),
          },
          {
            path: 'presenceandgrades',
            name: 'presence and grades panel',
            component: () => import('../views/parent/GradeAndPresenceView.vue')
          },
          {
            path: 'excuses',
            name: 'excuses panel',
            component: () => import('../views/parent/ExcusesView.vue')
          }
        ]
      },
      {
        path: 'auth',
        name: 'auth panel',
        component: AuthComponent,
        children: [
          {
            path: 'login',
            name: 'login panel',
            component: () => import('../views/auth/LoginView.vue'),
          },
          {
            path: 'logout',
            name: 'logout panel',
            component: () => import('../views/auth/LogoutView.vue')
          },
          {
            path: 'profile',
            name: "profile panel",
            component: () => import('../views/auth/ProfileView.vue')
          }
        ]
      },
    ]
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const role = localStorage.getItem('role');
  const { meta } = to;
  console.log(to.meta.group)
  console.log(role)
  if (meta.group == 'teacher' && role != 'teacher') {
    this.$router.push('/error/403');
  } else if (meta.group == 'admin' && role != 'admin') {
    this.$router.push('/error/403');
  } else if (meta.group == 'parent' && role != 'parent') {
    this.$router.push('/error/403');
  } else if (meta.group == 'student' && role != 'student') {
    this.$router.push('/error/403');
  } else {
    next();
  }
});
export default router
