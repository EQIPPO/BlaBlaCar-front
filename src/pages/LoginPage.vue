<template>
    <form class="login-form" id="login-form" v-if="mode == 'login'">
        <h2>Вхід</h2>

        <div class='alert alert-dark' role='alert' v-if="error">{{ error }}</div>

        <div class="form-floating">
            <input type="text" class="form-control" id="floatingInput" placeholder="Login" name="login" required
                minlength="3" v-model="login">
            <label for="floatingInput">Логін</label>
        </div>
        <div class="form-floating">
            <input type="password" class="form-control" id="floatingPassword" placeholder="Password" name="password"
                required minlength="8" v-model="password">
            <label for="floatingPassword">Пароль</label>
        </div>

        <button class="w-100 btn btn-lg btn-primary my-4" type="submit" @click="tryLogin($event)">Увійти</button>
        <p class="mb-2"><a href="#" @click="mode = 'register'">Зареєструватися</a></p>
    </form>

    <form class="login-form" id="register-form" v-if="mode == 'register'">
        <h2>Реєстрація</h2>

        <div class='alert alert-dark' role='alert' v-if="error">{{ error }}</div>

        <div class="form-floating">
            <input type="text" class="form-control" id="floatingInput" placeholder="Ім'я" name="name" required minlength="3"
                v-model="name">
            <label for="floatingInput">Ім'я</label>
        </div>
        <div class="form-floating">
            <input type="text" class="form-control" id="floatingLogin" placeholder="Логін" name="login" required
                minlength="3" v-model="login">
            <label for="floatingLogin">Логін</label>
        </div>
        <div class="form-floating">
            <input type="password" class="form-control" id="floatingPassword" placeholder="Пароль" name="password"
                minlength="8" required v-model="password">
            <label for="floatingPassword">Пароль</label>
        </div>

        <button class="w-100 btn btn-lg btn-primary my-4" type="submit"
            @click="tryRegister($event)">Зареєструватись</button>
        <p class="mb-2"><a href="#" @click="mode = 'login'">Увійти</a></p>
    </form>
</template>
  
<script>
const blablacar = require('../blablacar.lib')

export default {
    name: 'LoginPage',
    data: () => ({
        mode: 'login',
        name: '',
        login: '',
        password: '',
        error: null
    }),
    created() {
        this.$watch(() => this.$route.params, () => {
            if (blablacar.isLoggedIn()) {
                this.$router.push('/');
            }
        }, { immediate: true });
    },
    methods: {
        tryLogin: async function (event) {
            event.preventDefault();
            try {
                await blablacar.login(this.login, this.password);
                this.$router.push('/');
            }
            catch (e) {
                this.error = e;
            }
        },
        tryRegister: async function (event) {
            event.preventDefault();
            try {
                await blablacar.register(this.name, this.login, this.password);
                this.$router.push('/');
            }
            catch (e) {
                this.error = e;
            }
        }
    }
}
</script>

<style scoped>
.login-form {
    width: 90%;
    max-width: 400px;
    background-color: #1e1e1eaa;
    padding: 40px;
    border-radius: 5px;
    margin: 0 auto;
    color: white;
}

.login-form>h2 {
    text-align: center;
    margin-bottom: 40px;
}

.login-form input {
    background: none;
    border: none;
    border-bottom: 1px solid white;
    border-radius: 0;
    box-shadow: none;
    outline: none;
    color: white;
}

.login-form input:focus {
    border-bottom: 1px solid #ffcc00;
    background: none;
    color: white;
}

.login-form a {
    color: #adbef0;
    text-decoration: none;
}

.alert-dark {
    background-color: #1e1e1eaa;
    color: white;
    border: 1px solid #aaaaaa;
}
</style>
  