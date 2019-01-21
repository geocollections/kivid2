<template>
  <div class="front-page">
    <div class="row">
      <div class="col-md-12">
        <h1>{{$t('main.greeting')}}</h1>
      </div>
    </div>
    <div class="row m-2">
      <div class="col-md-4"></div>
      <div class="col-md-4">
        <rock-search></rock-search>
      </div>
      <div class="col-md-4"></div>
    </div>
    <div class="row m-2">
      <div class="col-md-4"></div>
      <div class="col-md-4">
        <div class="btn-group btn-group-toggle" data-toggle="buttons">
          <label class="btn  btn-xs btn-secondary active">
            <input type="radio" name="options" id="option1" autocomplete="off" checked> {{$t('search.worldwide')}}
          </label>
          <label class="btn  btn-xs btn-secondary">
            <input type="radio" name="options" id="option3" autocomplete="off"> {{$t('search.only_estonia')}}
          </label>
        </div>
      </div>
      <div class="col-md-4"></div>
    </div>
    <div class="row m-2">
      <div class="col-md-12">
      <router-link :to="'/'+232">
      <img src="https://files.geocollections.info/medium/9d/b5/9db5b4d9-7e83-471f-a2dd-cf2f440064f1.jpg" alt="kaltsiit" style="max-width: 750px; width: 100%;"/>
      </router-link>
      </div>
    </div>
    <div class="row m-2">
      <div class="col-md-12">
          |
          <router-link :to="'/'+3">mineraalid</router-link> |
          <router-link :to="'/'+799">vääriskivid</router-link> |
          <br>
          |
          <router-link :to="'/'+113">tardkivimid</router-link> |
          <router-link :to="'/'+21">setted</router-link> |
          <router-link :to="'/'+6">settekivimid</router-link> |
          <router-link :to="'/'+114">moondekivimid</router-link> |

          <br>
          |
          <router-link :to="'/'+793">maagid</router-link> |
          <router-link :to="'/'+796">põlevmaavarad</router-link> |
          <router-link :to="'/'">tööstustoormed</router-link> |
          <router-link :to="'/'">ehitusmaavarad</router-link> |

          <br>
          <div style="padding: 5px 0; font-size: 0.8em;" v-if="lastChangedRocks && lastChangedRocks.length > 0">{{$t('main.lastChanged')}}:
            <span v-for="item in lastChangedRocks">
              <router-link :to="'/'+item.id" v-translate="{ et: item.name, en: item.name_en }"></router-link>  |
            </span></div>
      </div>
    </div>


  </div>
</template>

<script>
  import {
    fetchLastChangedRocks
  } from '../api'
  import VueMultiselect from 'vue-multiselect'
  import RockSearch from "../components/main/RockSearch";
  export default {
    name: "front-page",
    components: {RockSearch, VueMultiselect},
    metaInfo: {
      title: 'EUROCORE Data Portal'
    },
    data() {
      return { lastChangedRocks: []}
    },
    created() {
      this.$emit('page-loaded',false);
      fetchLastChangedRocks()
      fetchLastChangedRocks(this.mode).then((response) => {
        this.lastChangedRocks = response.results ? response.results : [];
      });

    }
  }
</script>

<style scoped>
.front-page {
  max-width: 1280px !important;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}
.btn-secondary:not(:disabled):not(.disabled).active {
    background-color: #F05F40 !important;
    border-color:#eb3812 !important;
    z-index: 1 !important;
  }
</style>
