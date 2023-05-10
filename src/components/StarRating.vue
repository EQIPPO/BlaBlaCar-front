<template>
    <span v-for="(star, index) in 5" :key="index" :class="'fa fa-star' + (rating >= (index + 1) ? ' checked' : '')"
        @click="!readonly && updateRating(index + 1)">
    </span>
</template>
  
<script>
export default {
    name: 'StarRating',
    props: {
        rating: {
            type: Number,
            required: true
        },
        readonly: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        updateRating(rating) {
            this.$emit('update:rating', rating);
        }
    }
}
</script>

<style scoped>
.checked {
    color: orange !important;
}

.fa-star {
    color: #adb5bd;
}
</style>
  