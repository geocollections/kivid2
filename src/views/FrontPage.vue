<template>
  <div class="front-page">
    <div class="row">
      <div class="col-md-12" style="text-align: right; margin-top: -4rem !important;">
        <lang-buttons/>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <h1>{{$t('main.greeting')}}</h1>
      </div>
    </div>
    <div class="row m-2">
      <div class="col-md-1"></div>
      <div class="col-md-10"  style="text-align: center">
        <div class="col-lg-12 ml-auto mr-auto" style="max-width: 30rem">
          <rock-search/>
          <!--<button class="btn btn-xs btn-link pt-0" v-b-toggle.collapseA><font-awesome-icon :icon="searchIcon"/>{{$t('main.advanceSearch')}}</button>-->
          <button class="btn btn-xs btn-link pt-0" @click="showCollapse = !showCollapse"
                  :class="showCollapse ? 'collapsed' : null"
                  aria-controls="collapseA"
                  :aria-expanded="showCollapse"><font-awesome-icon :icon="searchIcon" v-if="!showCollapse"/>&ensp;{{showCollapse ? $t('main.advanceSearchHide') : $t('main.advanceSearch')}}</button>
        </div>
        <b-collapse v-model="showCollapse" id="collapseA"  class="col-lg-12 border border-light medium p-4"  v-if="rockPropertyTypes.length > 0">
          <div class="col-lg-12 pb-3"><mode-buttons/></div>
          
          <!--
          <div class="row">
            <h4>{{$t('main.searchInstructions')}}</h4>
          </div>
			-->
          <div>
            <div class="row">
              <div class="input-group" role="group" aria-label="Basic example">
                <button type="button" class="btn form-control btn-secondary" @click="searchType = 1;clearSearch()" :class="searchType === 1 ? 'active': ''">{{$t('search.property')}}</button>
                <button type="button" class="btn form-control btn-secondary" @click="searchType = 2;clearSearch()" :class="searchType === 2 ? 'active': ''">{{$t('search.element')}}</button>
                <button type="button" class="btn form-control btn-secondary" @click="searchType = 3;clearSearch()" :class="searchType === 3 ? 'active': ''">{{$t('search.mineral')}}</button>
              </div>
            </div>
            <form v-on:submit.prevent="searchByAdditionalCriteria" class="col-lg-12 well"  style="text-align: right;">
              <div class="row"  v-for="property,idx in searchParameters.properties"   v-if="searchType === 1">
                <div class="col-lg-5">
                  <select class="searchCriterionType" v-model="property.propertyType" v-on:change="setDefaultOperand(property)">
                    <option :value="item.id" v-for="item in rockPropertyTypes" v-translate="{ et: item.property, en: item.property_en }"></option>
                  </select>
                </div>
                <div class="col-lg-2 searchCriterionType label-check">
                  <div v-if="property.propertyOperand !== 'number'">
                    <input type="checkbox" class="form-control"  :id="idx+'_checkbox'" v-model="property.checked"
                           v-on:change="property.propertyOperand = property.checked ? 'iexact' : 'text' ">
                    <label class="label" :for="idx+'_checkbox'">{{$t('search.exact')}}</label>
                  </div>

                  <!--<select class="searchCriterionType"  v-model="property.propertyOperand">-->
                    <!--<option v-bind:value="item.value" v-for="item in onlyAllowedOperands(property)">{{$t('search.operand.'+item.name)}}</option>-->
                  <!--</select>-->
                </div>
                <div class="col-lg-4" v-if="property.propertyOperand !== 'number'">
                  <input type="text" class="form-control" v-model="property.propertyValue"/>
                </div>

                <div class="col-lg-2" v-if="property.propertyOperand === 'number'">
                  <input type="number" class="form-control" v-model="property.propertyValueFrom"/>
                </div>
                <div class="col-lg-2" v-if="property.propertyOperand === 'number'">
                  <input type="number" class="form-control" v-model="property.propertyValueTo"/>
                </div>
                <div class="col-lg-1" style="text-align: right">
                  <button v-if="searchParameters.properties.length > 1" type="button" class="btn btn-xs btn-link" aria-pressed="true" @click="removeProperty(idx)" title="Remove property">
                    <font-awesome-icon class="mr-1" :icon="removeRow"/></button>
                </div>
              </div>
              <div class="row" v-if="searchType === 2">
                <div class="col-lg-2 label" ><label style="padding: 10px 5px;" v-if="false">{{$t('main.search.chemicalEl')}}:</label></div>
                <div class="col-lg-8">
                  <vue-multiselect :open-direction="'bottom'" label="element__element"
                                    v-model="searchParameters.selectedChemicalElements" placeholder="Search chemical element" track-by="element" :options="chemicalElList" :multiple="true" :taggable="true">
                  </vue-multiselect>
                  <!--<input type="text" class="form-control" v-model="searchParameters.chemicalElement"/>-->
                </div>
                <div class="col-lg-1">
                  <button type="button" class="btn btn-xs btn-search" aria-pressed="true" @click="searchByAdditionalCriteria" title="Sends request with inserted data">
                    <font-awesome-icon class="mr-1" :icon="searchIcon"/>{{$t('main.search.search')}}</button>
                </div>
              </div>
              <div class="row" v-if="searchType === 3">
                <div class="col-lg-2 label">
                  <label class="typo__label" style="padding: 10px 5px;" v-if="false">{{$t('main.search.mineral')}}:</label>
                </div>
                <div class="col-lg-8">
                  <vue-multiselect  :custom-label="displayMineralResults" :open-direction="'bottom'"
                                    v-model="searchParameters.selectedMinerals" placeholder="Search mineral" track-by="mineral__id" :options="mineralList" :multiple="true" :taggable="true"></vue-multiselect>
                  <span  v-translate="{ et: searchParameters.selectedMinerals.mineral__name , en: searchParameters.selectedMinerals.mineral__name_en }"></span>
                </div>
                <div class="col-lg-1">
                  <button type="button" class="btn btn-xs btn-search" aria-pressed="true" @click="searchByAdditionalCriteria" title="Sends request with inserted data">
                    <font-awesome-icon class="mr-1" :icon="searchIcon"/>{{$t('main.search.search')}}</button>
                </div>
              </div>
              <div class="row" v-if="searchType === 1">
                <div class="col-lg-6" style="text-align: left;">
                  <button type="button" class="btn btn-xs btn-link" aria-pressed="true" @click="addProperty" title="Add new property">
                    <font-awesome-icon :icon="addRow"/>&ensp;{{$t('main.search.addRow')}}</button>
                </div>
                <div class="col-lg-6">
                  <button type="button" class="btn btn-xs btn-search" aria-pressed="true" @click="searchByAdditionalCriteria" title="Sends request with inserted data">
                    <font-awesome-icon :icon="searchIcon"/>{{$t('main.search.search')}}</button>
                </div>
              </div>
            </form>
            <div class="col-lg-12" style="text-align: left;">
              <spinner v-show="loading" class="loading-overlay" size="massive" :message="$t('main.overlay')"></spinner>
              <h3 v-if="searchResults.length > 0">{{$t('main.searchResults')}}</h3>
              <h3 v-if="noSearchResults">{{$t('main.noSearchResults')}}</h3>
              <div class="row" v-if="searchResults.length > 0">
                <div class="col-md-3 pb-2 "  v-for="item in searchResults">
                  <router-link v-if="item.rock_id" :to="'/'+item.rock_id" v-translate="{ et: item.rock__name, en: item.rock__name_en }"></router-link>
                  <router-link v-if="!item.rock_id" :to="'/'+item.id" v-translate="{ et: item.name, en: item.name_en }"></router-link>
                </div>
              </div>
            </div>
          </div>
        </b-collapse>
        <div class="col-lg-12">
          <router-link :to="'/'+232">
            <img src="https://files.geocollections.info/img/kivid/kivid2.jpg" alt="kaltsiit" title="Kaltsiit | Calcite" style="max-width: 600px; width: 100%;"/>
          </router-link>
        </div>
        <div class="col-lg-12">
          <router-link :to="'/'+3">{{$t('main.minerals')}}</router-link> |
          <router-link :to="'/'+113">{{$t('main.igneousRocks')}}</router-link> |
          <router-link :to="'/'+21">{{$t('main.sediments')}}</router-link> |
          <router-link :to="'/'+6">{{$t('main.sedimentaryRocks')}}</router-link> |
          <router-link :to="'/'+114">{{$t('main.metamorphicRocks')}}</router-link> 
<!-- omit this before we get the classifications updated
          <br>
          <router-link :to="'/'+799">{{$t('main.gemstones')}}</router-link> |
          <router-link :to="'/'+793">{{$t('main.ores')}}</router-link> |
          <router-link :to="'/'+796">{{$t('main.combustibleRocks')}}</router-link> |
          <router-link :to="'/'">{{$t('main.industrialRawMaterials')}}</router-link> |
          <router-link :to="'/'">{{$t('main.buildingSupplies')}}</router-link> 
-->
          <br>
          <div style="padding: 5px 0; font-size: 0.8em;" v-if="lastChangedRocks && lastChangedRocks.length > 0">{{$t('main.lastChanged')}}:
            <span v-for="item in lastChangedRocks">
              <router-link :to="'/'+item.id" v-translate="{ et: item.name, en: item.name_en }"></router-link>  |
            </span></div>
        </div>
      </div>
      <div class="col-md-1"></div>
    </div>



  </div>
</template>

<script>
  import {
    fetchLastChangedRocks,
    fetchRockPropertyType,
    fetchSearchByPropertyType,
    fetchMineralList,
    fetchSearchByMineral,
    fetchSearchByChemicalElement,
    fetchChemicalElementList
  } from '../api'
  import Vue from 'vue'
  import Spinner from 'vue-simple-spinner'
  import VueMultiselect from 'vue-multiselect'
  import RockSearch from "../components/main/RockSearch";
  import LangButtons from "../components/main/LangButtons";
  import ModeButtons from "../components/main/ModeButtons";
  import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
  import faSearchPlus from '@fortawesome/fontawesome-free-solid/faSearchPlus';
  import faPlus from '@fortawesome/fontawesome-free-solid/faPlus';
  import faTrash from '@fortawesome/fontawesome-free-solid/faTrash';

  export default {
    name: "front-page",
    components: {ModeButtons, LangButtons, RockSearch, VueMultiselect,FontAwesomeIcon,Spinner},
    metaInfo: {
      title: 'Mineraalid, kivimid, maavarad'
    },
    data() {
      return {
        searchParameters: this.setDefaultSearchParams(), mineralList:[], chemicalElList:[], loading:false, searchType: 1, showCollapse:false,
        searchResults:[], noSearchResults : false, lastChangedRocks: [],rockPropertyTypes: [],isAdvancedSearch:false,
      }
    },
    computed: {
      lang() {return this.$i18n.locale},
      searchIcon() { return faSearchPlus },
      addRow() { return faPlus},
      removeRow() { return faTrash}
    },
    created() {
      this.$emit('page-loaded',false);
      fetchRockPropertyType().then((response) => {
        this.rockPropertyTypes = response.results ? response.results : [];
        // Object.assign(this.searchParameters, this.setDefaultSearchParams())
        this.searchParameters.properties[0].propertyType = this.rockPropertyTypes[0].id;
        this.searchParameters.properties[0].propertyOperand = this.rockPropertyTypes[0].default_search;
      });
      fetchLastChangedRocks(this.mode).then((response) => {
        this.lastChangedRocks = response.results ? response.results : [];
      });
      fetchMineralList().then((response) => {
        this.mineralList = response.results ? response.results : [];
      });
      fetchChemicalElementList().then((response) => {
        this.chemicalElList = response.results ? response.results : [];
      });

    },
    methods: {
      setDefaultOperand(property) {
        let prop = this.rockPropertyTypes.filter(function (val, i) {
          return val.id === property.propertyType;
        }, this);
        property.propertyOperand = prop[0].default_search
      },
      isValidForm() {
        // return !((this.searchParameters.propertyOperand !== 'range' && (this.searchParameters.propertyValue === null || this.searchParameters.propertyValue.length === 0))
        // && (this.searchParameters.propertyOperand === 'range' && (this.searchParameters.propertyValueFrom === null || this.searchParameters.propertyValueTo === null))
        // && (this.searchParameters.selectedMinerals.length === 0) && this.searchParameters.chemicalElement === null)
        let isValid = true;
        if(this.searchType === 1) {
          this.searchParameters.properties.forEach(function (prop) {
            prop.isValid =
              !(prop.propertyValue === null || prop.propertyValue === '') ||
              !(prop.propertyValueFrom === null || prop.propertyValueFrom === '') ||
              !(prop.propertyValueTo === null || prop.propertyValueTo === '');
            isValid &= prop.isValid;
          });
        } else if(this.searchType === 2) {
          isValid &= !(this.searchParameters.selectedChemicalElements.length === 0)
        } else if(this.searchType === 3) {
          isValid &= !(this.searchParameters.selectedMinerals.length === 0)
        }

        return isValid ;
      },
      isValueNotNullAndNotEmptyString(val) { return val !== null && val !== ''},
      getProperties() {
        let query = '', vm = this;
        this.searchParameters.properties.forEach(function(prop){
          if(prop.propertyOperand === 'text') query += ` (rp.property_type_id=${prop.propertyType} AND rp.value_txt like '%${prop.propertyValue}%') OR`;
          else if(prop.propertyOperand === 'iexact') query += ` (rp.property_type_id=${prop.propertyType} AND rp.value_txt like '${prop.propertyValue}') OR`;
          else if(prop.propertyOperand === 'number') {
            let val = '';
            if (vm.isValueNotNullAndNotEmptyString(prop.propertyValueFrom)) val = `rp.value_min >= ${prop.propertyValueFrom}`;
            if (vm.isValueNotNullAndNotEmptyString(prop.propertyValueFrom) && vm.isValueNotNullAndNotEmptyString(prop.propertyValueTo)) val += ` AND `;
            if (vm.isValueNotNullAndNotEmptyString(prop.propertyValueTo)) val = `rp.value_max <= ${prop.propertyValueTo}`;
            query += `( rp.property_type_id=${prop.propertyType} AND ${val}) OR`
          }

        });
        query = query.substring(0,query.length-3);
        return query
      },
      getSelectedChemicalElementQuery() {
        let query = '';
        this.searchParameters.selectedChemicalElements.forEach(function(el){
          console.log(el)
          query += `rockelement__element__element=${el.element__element}&`
        });
        return query.substring(0,query.length-1)
      },
      getSelectedMineralsQuery() {
        let query = '';
        this.searchParameters.selectedMinerals.forEach(function(el){
          query += ` rm.mineral_id=${el.mineral__id} OR`
        });
        return query.substring(0,query.length-3)
      },
      searchByAdditionalCriteria() {
        if(!this.isValidForm()) {
          this.$emit('throw-error',`Search is not allowed. Please choose some search criteria`);
          return;
        }
        this.loading = true;
        let query, mode = this.$localStorage.get('kivid_mode');
        if (this.searchType === 1) {
          query = fetchSearchByPropertyType(this.getProperties(),this.searchParameters.properties.length);
        } else if (this.searchType === 2) {
          query = fetchSearchByChemicalElement(this.getSelectedChemicalElementQuery(), mode);
        } else if (this.searchType === 3) {
          query = fetchSearchByMineral(this.getSelectedMineralsQuery(),this.searchParameters.selectedMinerals.length, mode);
        }
        this.noSearchResults = false;
        query.then((response) => {
          this.searchResults = response.results ?
            this.searchType === 2 ? this.reorderResultsByRockName(response.results,'name','name_en') : this.reorderResultsByRockName(response.results,'rock__name','rock__name_en') : [];
          this.loading = false;
          this.noSearchResults = this.searchResults.length === 0;
        });
      },
      clearSearch() {
        this.searchParameters = this.setDefaultSearchParams();
        this.searchResults = []
      },
      setDefaultSearchParams() {
        return {
          selectedChemicalElements: [],
          selectedMinerals: [],
          properties: [this.addNewProperty()]

        }
      },
      reorderResultsByRockName: function(searchResults,rock__name,rock__name_en){
        return this.lang === 'et' ?
            searchResults.filter(x => !!x[rock__name]).sort((a,b) => (a[rock__name].toLowerCase() > b[rock__name].toLowerCase()) ? 1 : ((b[rock__name].toLowerCase() > a[rock__name].toLowerCase()) ? -1 : 0)) :
            searchResults.filter(x => !!x[rock__name_en]).sort((a,b) => (a[rock__name_en].toLowerCase() > b[rock__name_en].toLowerCase()) ? 1 : ((b[rock__name_en].toLowerCase() > a[rock__name_en].toLowerCase()) ? -1 : 0))
      },
      displayChemicalElResults: function (item) {
        return this.lang === 'et' ? `${item.element__element} (${item.element__name})` : `${item.element__element} (${item.element__name_en})`
      },
      displayMineralResults: function (item) {
        return this.lang === 'et' ? `${item.mineral__name}` : `${item.mineral__name_en}`
      },
      removeProperty: function(idx) {
        this.searchParameters.properties.splice(idx, 1);
      },
      addProperty : function() {
        this.searchParameters.properties.push(this.addNewProperty());
      },
      addNewProperty: function() {
        return {
          propertyType: this.rockPropertyTypes ? this.rockPropertyTypes[0].id : '1',
          propertyOperand: this.rockPropertyTypes ? this.rockPropertyTypes[0].default_search : 'text',
          propertyValue: null, propertyValueFrom:null,propertyValueTo:null
        }
      }
    },
    metaInfo() {
      return {
        title : 'Mineraalide, kivimite ja maavarade portaal',
        meta: [
          {'property': 'og:title', 'content': 'Mineraalide, kivimite ja maavarade portaal', 'template': chunk => `${chunk}`, 'vmid': 'og:title'},
          {'property': 'og:url', 'content': 'https://dev.kivid.info/', 'vmid': 'og:url'},
          {'property': 'og:description', 'content': 'Mineraalide, kivimite ja maavarade portaal', 'vmid': 'og:description'},
          {'property': 'og:image', 'content': 'https://files.geocollections.info/medium/9d/b5/9db5b4d9-7e83-471f-a2dd-cf2f440064f1.jpg', 'vmid': 'og:image'},
          {'property': 'og:type', 'content': 'website','vmid': 'og:type'},

        ]
      }
    },
  }
</script>

<style scoped>
.front-page {
  max-width: 1280px !important;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}
  .front-page h1 {
  	font-weight: bold;
  	color: #2A68A5;
  	opacity: 0.9;
  }
.btn-search {
  color:#ffffff  !important;
  border-color:#eb3812  !important;
  background-color:#f05f40  !important;
}
.btn-search:hover {
  background-color:#eb3812  !important;
  color:#ffffff  !important;
}

.searchCriterionType {
  padding: 5px 10px;
  border: none;
  background-color: #f5f5f5;
  /*margin-bottom: 2px;*/
}
#collapseA {
  background-color: #f5f5f5;
  border-radius: 6px;
  border: solid 2px #ccc !important; 
  
}
.well {
  padding: 10px;
  vertical-align: middle;

  min-height: 20px;
  margin-bottom: 20px;
  background-color: #f5f5f5;
  /*border: 1px solid #e3e3e3;
  border-radius: 2px;
  -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.05);
  box-shadow: inset 0 1px 1px rgba(0,0,0,.05);*/
}
.btn-link {
  font-size: small !important; letter-spacing: 1.3px; color:#F05F40; font-weight: bolder; text-decoration: none
}
.btn-link:hover {
  color:#eb3812;
  font-weight: bold;
}
.label-check input {  display:none; }

.label-check label::before {
  width: 1.4em;
  text-align: center;
  display: inline-block;
  cursor: pointer;
  color: black;
  transition: color .3s ease;
  text-shadow: 0px 0px 1px #cccccc;
}
.label-check label:hover::before {
  text-shadow: 0px 0px 1px #6286d0;
}
.label-check [type='checkbox']:checked + label::before{
  color: #056dce;
}

.label-check [type='checkbox']         + label::before {  content: "\2610";}
.label-check [type='checkbox']:checked + label::before {  content: "\2611";}
</style>
