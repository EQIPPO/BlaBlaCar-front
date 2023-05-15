import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'

import HomePage from './pages/HomePage.vue'
import LoginPage from './pages/LoginPage.vue'
import ProfilePage from './pages/ProfilePage.vue'
import CreateRidePage from './pages/CreateRidePage.vue'
import SearchRidePage from './pages/SearchRidePage.vue'
import RidePage from './pages/RidePage.vue'
import ReservationsPage from './pages/ReservationsPage.vue'
import AdminPage from './pages/AdminPage.vue'

import NotFoundPage from './pages/NotFoundPage.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: HomePage },
        { path: '/login', component: LoginPage },
        { path: '/profile/:id', component: ProfilePage },
        { path: '/profile', component: ProfilePage },
        { path: '/create', component: CreateRidePage },
        { path: '/rides', component: SearchRidePage },
        { path: '/rides/:id', component: RidePage },
        { path: '/reservations', component: ReservationsPage },
        { path: '/admin', component: AdminPage },

        { path: '/:pathMatch(.*)*', component: NotFoundPage },
    ]
})

const app = createApp(App)
app.use(router)

app.mount('#app')
