<template>
    <input type="text" v-model="searchTerm" @input="search" :placeholder="placeholder" class="form-control"
        @focus="showResults">
    <div :class="'dropdown-menu mt-0' + (showDropdown && searchResults.length > 0 ? ' d-block' : ' d-none')">
        <li v-for="result in searchResults" class="dropdown-item" :key="result.id" @click="selectResult(result, $event)">
            {{ result.name }}
        </li>
    </div>
</template>

  
<script>
const blablacar = require('../blablacar.lib');

export default {
    name: 'AddressSearchBox',
    data() {
        return {
            searchTerm: '',
            searchResults: [],
            showDropdown: false,
            timeout: null
        }
    },
    props: {
        placeholder: {
            type: String,
            default: 'Search...'
        }
    },
    methods: {
        search() {
            if (this.searchTerm.length == 0) {
                this.searchResults = [];
                this.$emit('deleted', '');
                return;
            }

            // debounce the search for 500ms
            if (this.timeout) clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.searchResults = [];
                if (this.searchTerm.length > 0) {
                    this.getSearchResults();
                }
            }, 500);
        },
        getSearchResults() {
            // for demo purposes, we'll just hard-code some results
            blablacar.getHints(this.searchTerm).then((results) => {
                for (let i = 0; i < results.length; i++) {
                    this.searchResults.push({
                        id: i,
                        name: results[i]
                    });
                }
            });
        },
        selectResult(result, event) {
            event.stopPropagation();
            this.searchTerm = result.name;
            this.searchResults = [];
            // return the selected result as an event
            this.$emit('changed', result.name);
        },
        showResults() {
            this.showDropdown = true;
        },
        hideResults() {
            this.showDropdown = false;
        }
    }
}
</script>

<style scoped></style>
  