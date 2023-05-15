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
            <b>Опис:</b> {{ trip.description }}
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
        <div v-if="myReservation && alreadyReserved">
            <hr />
            <h4>Ви вже забронювали цю поїздку</h4>
            <div v-if="myReservation.status">
                <span v-if="myReservation.status == 1" class="text-success">Прийнято</span>
                <span v-if="myReservation.status == 2" class="text-danger">Відхилено</span>
                -
                <span>
                    {{ new Date(myReservation.response_time).toLocaleString('uk-UA', { timeZone: 'Europe/Kiev' })
                    }}
                </span>
                <br />
                <span>{{ myReservation.response }}</span>
            </div>
            <div v-else>
                <span class="text-warning">Очікується відповідь</span>
            </div>
        </div>
        <div v-if="showReservations">
            <hr />
            <h4>Резервування на вашу поїздку:</h4>
            <div v-if="reservations.length">
                <ul class="list-group list-group-flush">
                    <li class="list-group-item" v-for="reservation in reservations" :key="reservation.id">
                        <span class="h6">
                            <router-link :to="'/profile/' + reservation.user_id">{{ reservation.user_name }}</router-link> -
                            {{ reservation.time }}
                        </span>
                        <p>{{ reservation.comment }}</p>
                        <div v-if="!alreadyReserved && !reservation.status">
                            <label class="form-label">Відповідь:</label>
                            <textarea class="form-control mb-3" rows="3" v-model="reservation.response"></textarea>
                            <button class="btn btn-success" @click="acceptReservation(reservation)">Прийняти</button>
                            <button class="btn btn-danger mx-2" @click="rejectReservation(reservation)">Відхилити</button>
                        </div>
                        <div v-else-if="reservation.status">
                            <span v-if="reservation.status == 1" class="text-success">Прийнято</span>
                            <span v-if="reservation.status == 2" class="text-danger">Відхилено</span>
                            -
                            <span>
                                {{ new Date(reservation.response_time).toLocaleString('uk-UA', { timeZone: 'Europe/Kiev' })
                                }}
                            </span>
                            <br />
                            <span>{{ reservation.response }}</span>
                        </div>
                    </li>
                </ul>
            </div>
            <div v-else>
                <p>Немає резервувань</p>
            </div>
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
        alreadyReserved: false,
        showReservations: false,
        reservations: [],
        myReservation: null
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
                if (!blablacar.isLoggedIn())
                    return;


                if (trip.driver_id !== blablacar.getCurrentUser().id) {
                    blablacar.getPassengerTrips().then(reservations => {
                        this.myReservation = reservations.find(r => r.trip_id == trip.id);
                        this.alreadyReserved = this.myReservation;
                        this.canReserve = !this.alreadyReserved;
                    }).catch((err) => {
                        this.error = err;
                    });
                }
                else {
                    this.showReservations = true;
                    blablacar.getDriverTrips(trip.id).then(reservations => {
                        this.reservations = [];
                        for (var r of reservations) {
                            if (r.trip_id == trip.id) {
                                this.reservations.push(r);
                                if (r.status == 1)
                                    this.alreadyReserved = true;
                            }
                        }
                        console.log(this.reservations, this.alreadyReserved);
                    }).catch((err) => {
                        this.error = err;
                    });
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
        acceptReservation(reservation) {
            blablacar.respondToReservation(reservation.id, 1, reservation.response)
                .then(() => {
                    location.reload();
                }).catch((err) => {
                    this.error = err;
                    alert(err);
                });
        },
        rejectReservation(reservation) {
            blablacar.respondToReservation(reservation.id, 2, reservation.response)
                .then(() => {
                    location.reload();
                }).catch((err) => {
                    this.error = err;
                    alert(err);
                });
        }
    }
}
</script>

<style scoped></style>