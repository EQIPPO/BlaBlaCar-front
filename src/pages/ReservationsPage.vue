<template>
    <button type="button" class="btn btn-primary" @click="switchPage(false)">Мої резервування</button>
    <button type="button" class="btn btn-secondary mx-2" @click="switchPage(true)">Мої поїздки</button>

    <hr />

    <div v-if="error">
        <p>{{ error }}</p>
    </div>
    <div v-else-if="loading">
        <p>Завантаження...</p>
    </div>
    <div v-else-if="showOwnTrips">
        <ul class="list-group list-group-flush">
            <li class="list-group-item" v-if="trips.length == 0">Порожньо</li>
            <li class="list-group-item" v-else v-for="trip in trips" :key="trip.id">
                <div class="mb-2">
                    <span><b>Звідки:</b> {{ trip.start }}</span><br />
                    <span><b>Куди:</b> {{ trip.end }}</span><br />
                    <span><b>Коли:</b> {{ new Date(trip.time * 1000).toLocaleString('uk-UA', { timeZone: 'Europe/Kiev' })
                    }}</span>
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
    <div v-else>
        <ul class="list-group list-group-flush">
            <li class="list-group-item" v-if="trips.length == 0">Порожньо</li>
            <li class="list-group-item" v-else v-for="trip in trips" :key="trip.id">
                <div class="mb-2">
                    <span><b>Звідки:</b> {{ trip.start }}</span><br />
                    <span><b>Куди:</b> {{ trip.end }}</span><br />
                    <span><b>Коли:</b> {{ new Date(trip.trip_time * 1000).toLocaleString('uk-UA', {
                        timeZone: 'Europe/Kiev'
                    })
                    }}</span>
                </div>
                <div class="mb-2">
                    <span><b>Час бронювання:</b> {{ trip.time }}</span><br />
                    <span><b>Ваш коментар:</b> {{ trip.comment }}</span><br />
                </div>
                <div class="mb-2" v-if="trip.response_time">
                    <span><b>Відповідь:</b> {{ trip.response }}</span><br />
                    <span><b>Час відповіді:</b> {{ new Date(trip.response_time).toLocaleString('uk-UA', {
                        timeZone:
                            'Europe/Kiev'
                    }) }}</span><br />
                    <span><b>Статус відповіді:</b> {{ trip.status == 1 ? 'Погоджено' : 'Відхилено' }}</span>
                </div>
                <div class="mb-2" v-else>
                    <b>Очікуйте на відповідь</b>
                </div>
                <span>
                    <router-link :to="'/rides/' + trip.trip_id">
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

export default {
    name: 'ReservationsPage',
    data: () => ({
        trips: [],
        error: null,
        loading: false,
        showOwnTrips: false
    }),
    created() {
        this.loadTrips();
    },
    methods: {
        loadTrips() {
            this.error = null;
            this.loading = true;
            if (this.showOwnTrips) {
                blablacar.getOwnTrips().then((trips) => {
                    this.trips = trips;
                    this.loading = false;
                }).catch((err) => {
                    this.error = err;
                    this.loading = false;
                });
            } else {
                blablacar.getPassengerTrips().then((trips) => {
                    this.trips = trips;
                    this.loading = false;
                }).catch((err) => {
                    this.error = err;
                    this.loading = false;
                });
            }
        },
        switchPage(page) {
            if (this.showOwnTrips !== page) {
                this.showOwnTrips = page;
                this.loadTrips();
            }
        }
    }
}
</script>

<style scoped></style>