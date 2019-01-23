<template>
    <button class="btn btn-link" @click="order($props.value)">
        <span>{{ $t($props.name) }}</span>
    <span v-show="searchParameters.specimens.sortBy === localizePredicate($props.value) && searchParameters.specimens.sortByAsc">&darr;</span>
    <span v-show="searchParameters.specimens.sortBy === localizePredicate($props.value) && !searchParameters.specimens.sortByAsc">&uarr;</span>
    </button>
</template>

<script>
    export default {
        name: "SortField",
        data() {
            return {
                predicate: null
            }
        },
        props: ['value', 'name', 'searchParameters'],
        methods: {
            order: function (predicate) {
                predicate = this.localizePredicate(predicate);
                let searchParameters = {
                    page : 1,
                    paginateBy : this.searchParameters.specimens.paginateBy,
                    sortByAsc : (this.searchParameters.specimens.sortBy === predicate ? !this.searchParameters.specimens.sortByAsc : true),
                    sortBy : predicate,
                    order : !this.searchParameters.specimens.sortByAsc ? "ASCENDING" :  "DESCENDING",
                    onlyImgs: this.searchParameters.specimens.onlyImgs,git: this.searchParameters.specimens.git,tug: this.searchParameters.specimens.tug,elm: this.searchParameters.specimens.elm
                }
                //DO not have any effect ???
                // this.$store.commit('SET_SPECIMEN_SEARCH_PARAMS', {searchParameters})
                this.searchParameters.specimens = searchParameters;
                // this.$emit('search-parameters-changed', searchParameters);
            },
            localizePredicate(predicate) {
                let tokens = predicate.split(",");
                if(tokens.length === 1) return predicate;
                let value_et = tokens[0], value_en = tokens[1];
                return this.$localStorage.get('kivid_lang') === 'et' ? value_et : value_en;
            }
        }

    }
</script>

<style scoped>

</style>
