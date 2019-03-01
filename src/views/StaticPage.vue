<template>
  <div class="page-container item-page">
    <div class="col  pt-3">
      <div class="card-body" v-if="content && content.content_et !== null" v-html="currentContent"></div>
      <div class="card-body" v-else>
          <h5>Oops! Page does not exist.</h5>
      </div>
    </div>
	</div>
</template>

<script>
  import {
    fetchPage
  } from '../api'
export default {
  name: 'static-page',
  data() {
    return{
      content: null, allowedPages: []
    }
  },
  created() {
    //check whether selected page is allowed
    fetchPage(this.$router.currentRoute.params.id).then((response) => {
      this.$emit('page-loaded',false);
      if(response.results && response.results.length > 0) {
        this.content = response.results[0];
      }
    });
  },
  computed: {
       currentContent () {
           return this.$localStorage.get('kivid_lang') === 'et'
               ? this.content.content_et
               : this.content.content_en
       }
  },

}


</script>
<style scope>
.item-page {
  max-width: 1280px !important;
  margin-left: auto;
  margin-right: auto;
}
.item-page h1 {
	font-weight: bold;
	color: #2A68A5;
	opacity: 0.9;
}
</style>
