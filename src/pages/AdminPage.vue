<template>
    <main>
        <div class="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style="width: 280px;">
            <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                <span class="fs-4">Адмін панель</span>
            </a>
            <hr>
            <ul class="nav nav-pills flex-column mb-auto">
                <li class="nav-item" v-for="p in pages" :key="p.page">
                    <a href="#" :class="'nav-link ' + (page == p.page ? 'active' : 'text-white')" aria-current="page"
                        @click="changePage(p.page)">
                        {{ p.name }}
                    </a>
                </li>
            </ul>
        </div>
        <div v-if="page == 'comments'">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Автор</th>
                        <th scope="col">Отримувач</th>
                        <th scope="col">Оцінка</th>
                        <th scope="col">Коментар</th>
                        <th scope="col">Управління</th>
                    </tr>
                </thead>
                <tbody>
                    <div v-if="!comments.length">
                        Порожньо
                    </div>
                    <tr v-else v-for="comment in comments" :key="comment.id">
                        <th scope="row">{{ comment.id }}</th>
                        <td><router-link :to="'/profile/' + comment.creator_id">{{ comment.creator_name }}</router-link>
                        </td>
                        <td><router-link :to="'/profile/' + comment.user_id">{{ comment.user_name }}</router-link></td>
                        <td>
                            <StarRating :rating="comment.rating" />
                        </td>
                        <td>{{ comment.comment }}</td>
                        <td><button class="btn btn-danger btn-sm" @click="deleteComment(comment.id)">Видалити</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else-if="page == 'trips'">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Автор</th>
                        <th scope="col">Звідки</th>
                        <th scope="col">Куди</th>
                        <th scope="col">Місць</th>
                        <th scope="col">Дата створення</th>
                        <th scope="col">Опис</th>
                        <th scope="col">Управління</th>
                    </tr>
                </thead>
                <tbody>
                    <div v-if="!trips.length">
                        Порожньо
                    </div>
                    <tr v-else v-for="trip in trips" :key="trip.id">
                        <th scope="row">{{ trip.id }}</th>
                        <td><router-link :to="'/profile/' + trip.driver_id">{{ trip.driver_name }}</router-link></td>
                        <td>{{ trip.start }}</td>
                        <td>{{ trip.end }}</td>
                        <td>{{ trip.passengers }}</td>
                        <td>{{ new Date(trip.time / 1000).toLocaleString('uk-UA', { timeZone: 'Europe/Kiev' }) }}</td>
                        <td>{{ trip.description }}</td>
                        <td><button class="btn btn-danger btn-sm" @click="deleteTrip(trip.id)">Видалити</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else-if="page == 'users'">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Ім'я</th>
                        <th scope="col">Логін</th>
                        <th scope="col">Дата створення</th>
                        <th scope="col">Роль</th>
                        <th scope="col">Управління</th>
                    </tr>
                </thead>
                <tbody>
                    <div v-if="!users.length">
                        Порожньо
                    </div>
                    <tr v-else v-for="user in users" :key="user.id">
                        <th scope="row">{{ user.id }}</th>
                        <td>{{ user.name }}</td>
                        <td>{{ user.login }}</td>
                        <td>{{ user.created_at }}</td>
                        <td>
                            <span v-if="user.is_admin" class="badge text-bg-success">Адмін</span>
                            <span v-else class="badge text-bg-secondary">Користувач</span>
                        </td>
                        <td>
                            <div v-if="user.id != ownId">
                                <button class="btn btn-danger btn-sm" @click="deleteUser(user.id)">Видалити</button>

                                <button v-if="!user.is_admin" class="btn btn-secondary btn-sm mx-2"
                                    @click="makeAdminUser(user.id, true)">Зробити адміном</button>
                                <button v-else class="btn btn-secondary btn-sm mx-2"
                                    @click="makeAdminUser(user.id, false)">Забрати роль</button>
                            </div>
                            <span v-else>-</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else-if="page == 'reservations'">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Водій</th>
                        <th scope="col">Пасажир</th>
                        <th scope="col">Дата створення</th>
                        <th scope="col">Коментар</th>
                        <th scope="col">Статус</th>
                        <th scope="col">Відповідь</th>
                        <th scope="col">Час відповіді</th>
                        <th scope="col">Управління</th>
                    </tr>
                </thead>
                <tbody>
                    <div v-if="!reservations.length">
                        Порожньо
                    </div>
                    <tr v-else v-for="reservation in reservations" :key="reservation.id">
                        <th scope="row">{{ reservation.id }}</th>
                        <td><router-link :to="'/profile/' + reservation.driver_id">{{ reservation.driver_name
                        }}</router-link></td>
                        <td><router-link :to="'/profile/' + reservation.user_id">{{ reservation.client_name }}</router-link>
                        </td>
                        <td>{{ reservation.time }}</td>
                        <td>{{ reservation.comment }}</td>
                        <td>
                            <span v-if="reservation.status == 0" class="badge text-bg-secondary">Очікує</span>
                            <span v-else-if="reservation.status == 1" class="badge text-bg-success">Погоджено</span>
                            <span v-else class="badge text-bg-danger">Відхилено</span>
                        </td>
                        <td>{{ reservation.response ?? "-" }}</td>
                        <td>{{ (reservation.response_time ? new Date(reservation.response_time)
                            .toLocaleString('uk-UA', {
                                timeZone: 'Europe/Kiev'
                            }) : '-') }}</td>
                        <td>
                            <button class="btn btn-danger btn-sm"
                                @click="deleteReservation(reservation.id)">Видалити</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </main>
</template>
  
<script>
import StarRating from '@/components/StarRating.vue';

const blablacar = require('../blablacar.lib')

export default {
    name: "AdminPage",
    data: () => ({
        pages: [
            {
                name: "Відгуки",
                page: "comments"
            },
            {
                name: "Поїздки",
                page: "trips"
            },
            {
                name: "Користувачі",
                page: "users"
            },
            {
                name: "Бронювання",
                page: "reservations"
            }
        ],
        page: "comments",
        comments: [],
        users: [],
        trips: [],
        reservations: [],
        ownId: blablacar.getCurrentUser().id
    }),
    created() {
        if (!blablacar.isLoggedIn()) {
            this.$router.push("/");
            return;
        }
        blablacar.checkPerms().then(perms => {
            if (!perms)
                this.$router.push("/");
        });
        this.changePage("comments");
    },
    methods: {
        changePage(page) {
            this.page = page;
            if (page == "comments") {
                blablacar.adminGetComments().then(comments => {
                    this.comments = comments;
                });
            }
            else if (page == "users") {
                blablacar.adminGetUsers().then(users => {
                    this.users = users;
                });
            }
            else if (page == "trips") {
                blablacar.adminGetTrips().then(trips => {
                    this.trips = trips;
                });
            }
            else if (page == "reservations") {
                blablacar.adminGetReservations().then(reservations => {
                    this.reservations = reservations;
                });
            }
        },
        deleteComment(id) {
            if (!confirm("Ви впевнені, що хочете видалити цей коментар?"))
                return;

            blablacar.adminDeleteComment(id).then(() => {
                this.comments = this.comments.filter(c => c.id != id);
            });
        },
        deleteUser(id) {
            if (!confirm("Ви впевнені, що хочете видалити цього користувача?"))
                return;

            blablacar.adminDeleteUser(id).then(() => {
                this.users = this.users.filter(u => u.id != id);
            });
        },
        makeAdminUser(id, perms) {
            let action = perms ? "дати права адміна?" : "забрати права адміна?";
            if (!confirm("Ви впевнені, що хочете " + action))
                return;

            blablacar.adminMakeAdminUser(id, perms).then(() => {
                this.users = this.users.map(u => {
                    if (u.id == id)
                        u.is_admin = perms;
                    return u;
                });
            });
        },
        deleteTrip(id) {
            if (!confirm("Ви впевнені, що хочете видалити цю поїздку?"))
                return;

            blablacar.adminDeleteTrip(id).then(() => {
                this.trips = this.trips.filter(t => t.id != id);
            });
        },
        deleteReservation(id) {
            if (!confirm("Ви впевнені, що хочете видалити це бронювання?"))
                return;

            blablacar.adminDeleteReservation(id).then(() => {
                this.reservations = this.reservations.filter(r => r.id != id);
            });
        }
    },
    components: { StarRating }
}
</script>

<style scoped>
body {
    min-height: 100vh;
    min-height: -webkit-fill-available;
}

html {
    height: -webkit-fill-available;
}

main {
    display: flex;
    flex-wrap: nowrap;
    height: 100vh;
    height: -webkit-fill-available;
    max-height: 100vh;
    overflow-x: auto;
    overflow-y: hidden;
}
</style>
  