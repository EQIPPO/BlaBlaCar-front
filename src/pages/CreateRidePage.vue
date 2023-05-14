<template>
    <h1>Створити поїздку</h1>
    <form ref="createRideForm">
        <div class="mb-3 row">
            <label class="col-sm-2 col-form-label">Звідки</label>
            <div class="col-sm-10">
                <AddressSearchBox placeholder="Звідки" @changed="changeFrom" />
            </div>
        </div>
        <div class="mb-3 row">
            <label class="col-sm-2 col-form-label">Куди</label>
            <div class="col-sm-10">
                <AddressSearchBox placeholder="Куди" @changed="changeTo" />
            </div>
        </div>
        <div class="mb-3 row">
            <label class="col-sm-2 col-form-label">Кількість пасажирів</label>
            <div class="col-sm-10">
                <input type="number" class="form-control" placeholder="Кількість пасажирів" v-model="count" required
                    min="1" />
            </div>
        </div>
        <div class="mb-3 row">
            <label class="col-sm-2 col-form-label">Дата/час</label>
            <div class="col-sm-10">
                <input type="datetime-local" class="form-control" v-model="date" required />
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">Опис (авто, умови, місце зустрічі)</label>
            <textarea class="form-control" rows="3" v-model="description"></textarea>
        </div>
        <button class="btn btn-primary" :disabled="buttonDisabled"
            @click="submitRide($event, $refs.createRideForm)">Опублікувати</button>
    </form>
</template>
  
<script>
const blablacar = require('../blablacar.lib');
import AddressSearchBox from '@/components/AddressSearchBox.vue';

export default {
    name: "CreateRidePage",
    components: { AddressSearchBox },
    data: () => ({
        from: null,
        to: null,
        count: 1,
        date: new Date().toISOString().slice(0, 16),
        description: '',
        buttonDisabled: true
    }),
    created() {
        this.$watch(() => this.$route.params, () => {
            if (!blablacar.isLoggedIn()) {
                this.$router.push('/login');
            }
        }, { immediate: true });
    },
    methods: {
        changeFrom(address) {
            this.from = address;
            this.buttonDisabled = !this.from || !this.to;
        },
        changeTo(address) {
            this.to = address;
            this.buttonDisabled = !this.from || !this.to;
        },
        submitRide(event, form) {
            event.preventDefault();

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            var timestamp = new Date(this.date).getTime() / 1000;
            if (!this.from || !this.to) {
                return;
            }

            blablacar.createRide(this.from, this.to, this.count, timestamp, this.description).
                then(() => {
                    this.$router.push('/reservations');
                }).
                catch((e) => {
                    console.error(e);
                    alert(e);
                });
        }
    }
}
</script>

<style scoped></style>
  