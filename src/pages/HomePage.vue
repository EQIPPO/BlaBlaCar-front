<template>
    <div class="hello">
        <h1>Шукаєте як зекономити на таксі?</h1>
        <p>
            Знайдіть собі попутника або водія, щоб подорожувати разом та економити.
        </p>
        <p>
            <router-link to="/rides">Перейти до пошуку</router-link>
        </p>
    </div>
</template>
  
<script>
export default {
    name: 'HomePage'
}
</script>

<style scoped>
h3 {
    margin: 40px 0 0;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: inline-block;
    margin: 0 10px;
}

a {
    color: #42b983;
}
</style>
  