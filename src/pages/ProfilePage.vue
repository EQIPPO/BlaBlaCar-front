<template>
    <div v-if="account">
        <h2 v-if="!editingName">
            {{ account.name }}
            <a href="#" style="font-size: small" v-if="ownAccount"
                @click="$event.preventDefault(); editingName = true">Змінити</a>
        </h2>
        <form class="row g-3" ref="nameEditForm" v-else>
            <div class="col-auto">
                <label for="editedName" class="visually-hidden">Ім'я</label>
                <input type="text" class="form-control" id="editedName" placeholder="Ім'я" v-model="editedName" required
                    minlength="3">
            </div>
            <div class="col-auto">
                <button type="submit" class="btn btn-primary mb-3"
                    @click="editName($event, this.$refs.nameEditForm)">Зберегти</button>
            </div>
            <div class="col-auto">
                <button type="submit" class="btn btn-secondary mb-3"
                    @click="$event.preventDefault(); editingName = false">Скасувати</button>
            </div>
        </form>
        <p>Дата реєстрації: {{ account.created_at }}</p>
        <p>
            Оцінка:
            <StarRating :rating="account.average" /> ({{ Math.round(account.average * 100) / 100 }})
        </p>

        <div v-if="showPrompt">
            <h4>Залишити відгук:</h4>
            <div class="mb-1">
                <span>Оцінка: </span>
                <StarRating :readonly="false" :rating="editedComment.rating" @update:rating="updateRating" />
            </div>
            <div class="mb-3">
                <label for="editedComment" class="form-label">Коментар:</label>
                <textarea class="form-control" id="editedComment" rows="3" v-model="editedComment.comment"></textarea>
            </div>
            <div>
                <button class="btn btn-sm btn-primary" @click="sendRating()">Залишити</button>
            </div>
        </div>

        <h3>Відгуки:</h3>
        <ul class="list-group list-group-flush">
            <li class="list-group-item" v-if="account.comments.length == 0">Порожньо</li>
            <li class="list-group-item" v-else v-for="comment in account.comments" :key="comment.id">
                <span>
                    <router-link :to="'/profile/' + comment.creator_id">{{ comment.creator_name }}</router-link> -
                    {{ comment.time }}
                </span>
                <p>
                    <StarRating :rating="comment.rating" />
                    {{ comment.comment }}
                </p>
            </li>
        </ul>
    </div>
    <div v-else-if="error">
        <p>{{ error }}</p>
    </div>
    <div v-else>
        <p>Завантаження...</p>
    </div>
</template>
  
<script>
import StarRating from '@/components/StarRating.vue';

const blablacar = require('../blablacar.lib')

export default {
    name: "ProfilePage",
    data: () => ({
        account: null,
        error: null,
        showPrompt: false,
        ownAccount: false,
        editedComment: {
            rating: 0,
            comment: ''
        },
        editingName: false,
        editedName: ''
    }),
    created() {
        this.$watch(() => this.$route.params, () => {
            this.loadProfile();
        }, { immediate: true });
    },
    methods: {
        loadProfile() {
            const currentUserId = blablacar.isLoggedIn() ? blablacar.getCurrentUser().id : null;
            this.showPrompt = false;
            this.editingName = false;
            this.ownAccount = false;

            if (currentUserId && (!this.$route.params.id || this.$route.params.id == currentUserId)) {
                this.ownAccount = true;
                this.editedName = blablacar.getCurrentUser().name;
            }

            if (!this.$route.params.id) {
                blablacar.getProfile().then((account) => {
                    this.account = account;
                    this.account.id = currentUserId;
                    this.ownAccount = true;
                    this.editedName = this.account.name;
                }).catch((err) => {
                    this.error = err;
                });
            }
            else {
                blablacar.getProfile(this.$route.params.id).then((account) => {
                    this.account = account;
                    this.account.id = this.$route.params.id;
                    if (blablacar.isLoggedIn() && this.account.id != currentUserId) {
                        console.log(this.account.id, currentUserId)
                        this.showPrompt = true;
                    }
                }).catch((err) => {
                    this.error = err;
                });
            }
        },
        updateRating(rating) {
            this.editedComment.rating = rating;
        },
        sendRating() {
            if (this.editedComment.rating == 0) {
                return
            }
            blablacar.postComment(this.account.id, this.editedComment).then(() => {
                this.editedComment = { rating: 0, comment: '' };
                this.showPrompt = false;
                this.error = null;
                this.account = null;
                this.loadProfile();
            }).catch((err) => {
                console.log(err);
                this.error = err.message;
            });
        },
        editName(event, form) {
            event.preventDefault();

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            blablacar.editName(this.editedName).then(() => {
                this.account.name = this.editedName;
                this.editingName = false;
                location.reload();
            }).catch((err) => {
                console.log(err);
                this.error = err.message;
            });
        }
    },
    components: { StarRating }
}
</script>

<style scoped></style>
  