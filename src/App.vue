<template>
  <div class="container">
    <header class="p-3">
      <div class="container">
        <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <router-link to="/" class="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
            <h1 class="fs-4">
              BlaBlaCar
            </h1>
          </router-link>

          <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0 mx-4">
            <li><router-link to="/" class="nav-link px-2 text-white">Головна</router-link></li>
            <li><router-link to="/rides" class="nav-link px-2 text-white">Поїздки</router-link></li>
            <li><router-link to="/create" class="nav-link px-2 text-white">Створити поїздку</router-link></li>
          </ul>


          <div class="text-end" v-if="account">
            <div class="dropdown">
              <a class="btn btn-secondary dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                {{ account.name }}
              </a>

              <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">

                <router-link class="dropdown-item" to="/profile">Профіль</router-link>
                <router-link class="dropdown-item" to="/reservations">Бронювання</router-link>
                <router-link class="dropdown-item" to="/admin" v-if="account.admin">Панель керування</router-link>
                <router-link class="dropdown-item" to="/" @click="logout()">Вийти</router-link>
              </div>
            </div>
          </div>

          <div class="text-end" v-if="!account">
            <router-link to="/login" class="text-decoration-none">
              <button type="button" class="btn btn-outline-light me-2">Вхід / Реєстрація</button>
            </router-link>
          </div>
        </div>
      </div>
    </header>
  </div>
  <main class="text-bg-dark">
    <div class="container py-4">
      <router-view></router-view>
    </div>
  </main>
  <footer class="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
    <div class="col-md-4 d-flex align-items-center">
      <a href="/" class="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1">
        <svg class="bi" width="30" height="24">
          <use xlink:href="#bootstrap"></use>
        </svg>
      </a>
      <span class="mb-3 mb-md-0 text-muted">© {{ new Date().getFullYear() }} BlaBlaCar</span>
    </div>
  </footer>
</template>

<script>
const blablacar = require('./blablacar.lib');

export default {
  name: 'App',
  data: () => ({
    account: null,
  }),
  created() {
    this.$watch(() => this.$route.params, () => {
      this.loadProfile();
    }, { immediate: true });
  },
  methods: {
    logout() {
      blablacar.logout();
      this.account = null;
    },
    loadProfile() {
      if (!this.account) {
        const account = localStorage.getItem('user');
        if (account) {
          this.account = JSON.parse(account);
          blablacar.checkPerms().then((res) => {
            this.account.admin = res;
          }).catch(() => {
            this.account.admin = false;
          });
        }
      }
    }
  }
}
</script>

<style>
body {
  background: #1e1e1e;
}
</style>
