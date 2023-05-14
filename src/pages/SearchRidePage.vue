<template>
    <h1>Пошук поїздки</h1>
    <form ref="createRideForm">
        <div class="mb-3 row">
            <label class="col-sm-2 col-form-label">Звідки</label>
            <div class="col-sm-10">
                <AddressSearchBox placeholder="Звідки" @changed="changeFrom" @deleted="removeFrom" />
            </div>
        </div>
        <div class="mb-3 row">
            <label class="col-sm-2 col-form-label">Куди</label>
            <div class="col-sm-10">
                <AddressSearchBox placeholder="Куди" @changed="changeTo" @deleted="removeTo" />
            </div>
        </div>
        <div class="mb-3 row">
            <label class="col-sm-2 col-form-label">Кількість пасажирів</label>
            <div class="col-sm-10">
                <input type="number" class="form-control" placeholder="Кількість пасажирів" v-model="count" min="1" />
            </div>
        </div>
        <div class="mb-3 row">
            <label class="col-sm-2 col-form-label">Виїзд до</label>
            <div class="col-sm-10">
                <input type="datetime-local" class="form-control" v-model="date" />
            </div>
        </div>
        <button class="btn btn-primary" @click="searchRide($event, $refs.createRideForm)">Пошук</button>
    </form>
    <hr />
    <div v-if="loading">
        <p>Завантаження...</p>
    </div>
    <div v-else-if="error">
        <p>Помилка: {{ error }}</p>
    </div>
    <div v-else-if="trips.length === 0">
        <p>Нічого не знайдено</p>
    </div>
    <div v-else>
        <ul class="list-group list-group-flush">
            <li class="list-group-item" v-for="trip in trips" :key="trip.id">
                <span class="h5">
                    <router-link :to="'/profile/' + trip.driver_id">{{ trip.driver_name }}</router-link> -
                    {{ new Date(trip.time * 1000).toLocaleString('uk-UA', { timeZone: 'Europe/Kiev' }) }}
                </span>
                <div class="mb-2">
                    <b>{{ trip.passengers }} {{ countParse(trip.passengers) }}</b><br />
                    <span><b>Звідки:</b> {{ trip.start }}</span><br />
                    <span><b>Куди:</b> {{ trip.end }}</span>
                </div>
                <span>
                    <router-link :to="'/rides/' + trip.id">
                        <button type="button" class="btn btn-success">
                            Детальніше »
                        </button>
                    </router-link>
                </span>
            </li>
        </ul>
    </div>
</template>
  
<script>
const blablacar = require('../blablacar.lib');
import AddressSearchBox from '@/components/AddressSearchBox.vue';

export default {
    name: "SearchRidePage",
    components: { AddressSearchBox },
    data: () => ({
        from: null,
        to: null,
        count: 1,
        date: new Date().toISOString().slice(0, 16),
        trips: [],
        error: null,
        loading: false,
    }),
    created() {
        this.$watch(() => this.$route.params, () => {
            this.loadTrips();
        }, { immediate: true });
    },
    methods: {
        changeFrom(address) {
            this.from = address;
        },
        changeTo(address) {
            this.to = address;
        },
        removeFrom() {
            this.from = null;
        },
        removeTo() {
            this.to = null;
        },
        loadTrips() {
            if (this.trips.length) {
                return;
            }
            this.loading = true;
            this.error = null;
            var timestamp = new Date(this.date).getTime() / 1000;
            blablacar.getRides(this.from, this.to, this.count, timestamp)
                .then(trips => {
                    this.trips = trips;
                    this.loading = false;
                })
                .catch(e => {
                    this.error = e;
                    this.loading = false;
                })
        },
        searchRide(event, form) {
            event.preventDefault();
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            this.trips = [];
            this.loadTrips();
        },
        countParse(amount) {
            if (amount % 10 === 1 && amount % 100 !== 11)
                return 'місце';
            else if (amount % 10 >= 2 && amount % 10 <= 4 && (amount % 100 < 10 || amount % 100 >= 20))
                return 'місця';
            else
                return 'місць';
        }
    }
}
</script>

<style scoped></style>
  