<template>
    <div v-if="trip">
        <h1>Деталі про поїздку</h1>
        <p>
            <b>Відправлення:</b> {{ trip.start }}<br />
            <b>Прибуття:</b> {{ trip.end }}<br />
            <b>Кількість пасажирів:</b> {{ trip.passengers }}<br />
            <b>Дата відправлення:</b> {{ new Date(trip.time * 1000).toLocaleString('uk-UA', { timeZone: 'Europe/Kiev' })
            }}<br />
            <b>Водій:</b> <router-link :to="'/profile/' + trip.driver_id">{{ trip.driver_name }}</router-link><br />
        </p>
        <div v-if="canReserve">
            <hr />
            <h3>Забронювати?</h3>
            <div class="mb-3">
                <label class="form-label">Повідомлення водію (контакти, які речі, наявність дітей)</label>
                <textarea class="form-control" rows="3" v-model="description"></textarea>
            </div>
            <button class="btn btn-primary" @click="reserve">Забронювати</button>
        </div>
        <div v-if="alreadyReserved">
            <hr />
            <h4>Ви вже забронювали цю поїздку</h4>
        </div>
    </div>
    <div v-else-if="error">
        <p>{{ error }}</p>
    </div>
    <div v-else>
        <p>Завантаження...</p>
    </div>
</template>
  
<script>
const blablacar = require('../blablacar.lib')

export default {
    name: "RidePage",
    data: () => ({
        trip: null,
        error: null,
        canReserve: false,
        description: '',
        alreadyReserved: false
    }),
    created() {
        this.$watch(() => this.$route.params, () => {
            this.loadTrip();
        }, { immediate: true });
    },
    methods: {
        loadTrip() {
            this.error = null;
            this.canReserve = false;
            blablacar.getTrip(this.$route.params.id).then((trip) => {
                this.trip = trip;
                if (blablacar.isLoggedIn() && trip.driver_id !== blablacar.getCurrentUser().id) {
                    this.alreadyReserved = blablacar.isTripReserved(trip.id);
                    this.canReserve = !this.alreadyReserved;
                }
            }).catch((err) => {
                this.error = err;
            });
        },
        reserve() {
            blablacar.reserveTrip(this.$route.params.id, this.description).then(() => {
                location.reload();
            }).catch((err) => {
                this.error = err;
                alert(err);
            });
        },
    }
}
</script>

<style scoped></style>