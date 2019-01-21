<template>
  <div class="front-page">
    <div class="row">
      <div class="col-md-12" style="text-align: right; margin-top: -5rem !important;">
        <lang-buttons></lang-buttons>
      </div>
    </div>
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
        <div class="btn-group btn-group-toggle">
          <label class="btn  btn-xs btn-secondary" :class="selectedMode === 'in_global' ? 'active': ''">
            <input type="radio" name="options" id="one" value="in_global" v-model="selectedMode">{{$t('search.worldwide')}}
          </label>
          <label class="btn  btn-xs btn-secondary"  :class="selectedMode === 'in_estonia' ? 'active': ''">
            <input type="radio" name="options" id="two" value="in_estonia" v-model="selectedMode">{{$t('search.only_estonia')}}
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
          <router-link :to="'/'+3">{{$t('main.minerals')}}</router-link> |
          <router-link :to="'/'+799">{{$t('main.gemstones')}}</router-link> |
          <br>
          |
          <router-link :to="'/'+113">{{$t('main.igneousRocks')}}</router-link> |
          <router-link :to="'/'+21">{{$t('main.sediments')}}</router-link> |
          <router-link :to="'/'+6">{{$t('main.sedimentaryRocks')}}</router-link> |
          <router-link :to="'/'+114">{{$t('main.metamorphicRocks')}}</router-link> |

          <br>
          |
          <router-link :to="'/'+793">{{$t('main.ores')}}</router-link> |
          <router-link :to="'/'+796">{{$t('main.combustibleRocks')}}</router-link> |
          <router-link :to="'/'">{{$t('main.industrialRawMaterials')}}</router-link> |
          <router-link :to="'/'">{{$t('main.buildingSupplies')}}</router-link> |

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
  import LangButtons from "../components/main/LangButtons";
  export default {
    name: "front-page",
    components: {LangButtons, RockSearch, VueMultiselect},
    metaInfo: {
      title: 'EUROCORE Data Portal'
    },
    data() {
      return { lastChangedRocks: [],selectedMode:this.$localStorage.get('kivid_mode')}
    },
    created() {
      this.$emit('page-loaded',false);
      fetchLastChangedRocks()
      fetchLastChangedRocks(this.mode).then((response) => {
        this.lastChangedRocks = response.results ? response.results : [];
      });
    },
    watch: {
      selectedMode: function(mode){
        this.$localStorage.set('kivid_mode', mode);
      }
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
