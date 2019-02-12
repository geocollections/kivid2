<template>
  <div class="front-page">
    <div class="row">
      <div class="col-md-12" style="text-align: right; margin-top: -5rem !important;">
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
          <div class="row">
            <h4>{{$t('main.searchInstructions')}}</h4>
          </div>

          <div>
            <div class="row">
              <div class="input-group" role="group" aria-label="Basic example">
                <button type="button" class="btn form-control btn-secondary" @click="searchType = 1;clearSearch()" :class="searchType === 1 ? 'active': ''">Property</button>
                <button type="button" class="btn form-control btn-secondary" @click="searchType = 2;clearSearch()" :class="searchType === 2 ? 'active': ''">Chemical element</button>
                <button type="button" class="btn form-control btn-secondary" @click="searchType = 3;clearSearch()" :class="searchType === 3 ? 'active': ''">Mineral</button>
              </div>
            </div>
            <form v-on:submit.prevent="searchByAdditionalCriteria" class="col-lg-12 well"  style="text-align: right;">
              <div class="row"  v-for="property,idx in searchParameters.properties"   v-if="searchType === 1">
                <div class="col-lg-5">
                  <select class="searchCriterionType" v-model="property.propertyType" v-on:change="setDefaultOperand(property)">
                    <option :value="item.id" v-for="item in rockPropertyTypes" v-translate="{ et: item.property, en: item.property_en }"></option>
                  </select>
                </div>
                <div class="col-lg-2">
                  <select class="searchCriterionType"  v-model="property.propertyOperand">
                    <option v-bind:value="item.value" v-for="item in onlyAllowedOperands(property)">{{$t('search.operand.'+item.name)}}</option>
                  </select>
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
                <div class="col-md-3 pb-2 "  v-for="item in searchResults"><router-link :to="'/'+item.rock_id" v-translate="{ et: item.rock__name, en: item.rock__name_en }"></router-link></div>
              </div>
            </div>
          </div>
        </b-collapse>
        <div class="col-lg-12">
          <router-link :to="'/'+232">
            <img src="https://files.geocollections.info/medium/9d/b5/9db5b4d9-7e83-471f-a2dd-cf2f440064f1.jpg" alt="kaltsiit" style="max-width: 750px; width: 100%;"/>
          </router-link>
        </div>
        <div class="col-lg-12">
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
      title: 'Rock.info'
    },
    data() {
      return {
        searchParameters: this.setDefaultSearchParams(), mineralList:[], chemicalElList:[], loading:false, searchType: 1, showCollapse:false,
        searchResults:[], noSearchResults : false, lastChangedRocks: [],rockPropertyTypes: [],isAdvancedSearch:false,
        propertiesConf: [
          {'id':1, 'allowedOperands': [1,4,5]},
          {'id':2, 'allowedOperands': [1,4,5]},
          {'id':3, 'allowedOperands': [1,4]},
          {'id':4, 'allowedOperands': [1,4]},
          {'id':5, 'allowedOperands': [1,4]},
          {'id':6, 'allowedOperands': [1,4]},
          {'id':7, 'allowedOperands': [1,4,5]},
          {'id':8, 'allowedOperands': [1,4,5]},
          {'id':9, 'allowedOperands': [1,4,]},
          {'id':10, 'allowedOperands': [1,4]},
          {'id':11, 'allowedOperands': [1,4]},
          ],
        operands: [
          {'id':1, 'value':'text', 'name' : 'contains'},//icontains
          // {'id':2, 'value':'gte', 'name' : 'isGreaterThan'},
          // {'id':3, 'value':'lte', 'name' : 'isSmallerThan'},
          {'id':4, 'value':'iexact', 'name' : 'equals'},
          {'id':5, 'value':'number', 'name' : 'isBetween'}//range
          ]
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
    mounted() {
      //watch search parameters
      // for (let k in this.searchParameters) {this.$watch('searchParameters.' + k, function (val, oldVal) { console.log(k, val, oldVal) }) }
    },
    methods: {
      onlyAllowedOperands(property) {
        return [3,4,5,6,9,10,11].indexOf(property.propertyType) >=0 ?
          this.operands.filter(function (val, i) {return val.id !== 5;}, this) :
          this.operands.filter(function (val, i) {return val.id === 5;}, this);
      },
      setDefaultOperand(property) {
        let prop = this.rockPropertyTypes.filter(function (val, i) {
          return val.id === property.propertyType;
        }, this);
        //remove gte from the data ?range
        property.propertyOperand=prop[0].default_search === 'gte' ? 'number' : prop[0].default_search
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
        }

        return isValid ;
      },
      getSelectedMineralIds(){
        return Array.from(this.searchParameters.selectedMinerals.map(item => item.mineral__id))
      },
      isValueNotNullAndNotEmptyString(val) {
        return val !== null && val !== ''
      },
      getProperties() {
        let query = '', vm = this;
        this.searchParameters.properties.forEach(function(prop){
          console.log(prop)
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
        console.log(query)
        return query
      },
      getSelectedChemicalElementQuery() {
        let query = '';
        this.searchParameters.selectedChemicalElements.forEach(function(el){
          console.log(el)
          query += `mineral__formula__icontains=${el.element__element}&`
        });
        return query.substring(0,query.length-2)
      },
      searchByAdditionalCriteria() {
        if(!this.isValidForm()) {
          this.$emit('throw-error',`Search is not allowed. Please choose some search criteria`);
          return;
        }
        this.loading = true;
        let query, mineralsIds = this.getSelectedMineralIds(), mode = this.$localStorage.get('kivid_mode');
        if (this.searchType === 1) {
          query = fetchSearchByPropertyType(this.getProperties(),this.searchParameters.properties.length);
          // query = this.searchParameters.propertyOperand !== 'range'?
          //   fetchSearchByPropertyType(this.searchParameters.propertyType.id, this.searchParameters.propertyOperand,this.searchParameters.propertyValue,mode) :
          //   fetchSearchByPropertyType(this.searchParameters.propertyType.id, this.searchParameters.propertyOperand,this.searchParameters.propertyValueFrom+','+this.searchParameters.propertyValueTo, mode)
        } else if (this.searchType === 2) {
          query = fetchSearchByChemicalElement(this.getSelectedChemicalElementQuery(), mode);
        } else if (this.searchType === 3) {
          //hack >> minera l search accepts more than one value
          mineralsIds.push(0);
          query = fetchSearchByMineral(mineralsIds, mode);
        }
        this.noSearchResults = false;
        query.then((response) => {
          this.searchResults = response.results ? this.reorderResultsByRockName(response.results) : [];
          this.loading = false;
          this.noSearchResults = this.searchResults.length === 0 ? true : false;
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
      reorderResultsByRockName: function(searchResults){
        return this.lang === 'et' ?
            searchResults.filter(x => !!x.rock__name).sort((a,b) => (a.rock__name.toLowerCase() > b.rock__name.toLowerCase()) ? 1 : ((b.rock__name.toLowerCase() > a.rock__name.toLowerCase()) ? -1 : 0)) :
            searchResults.filter(x => !!x.rock__name_en).sort((a,b) => (a.rock__name_en.toLowerCase() > b.rock__name_en.toLowerCase()) ? 1 : ((b.rock__name_en.toLowerCase() > a.rock__name_en.toLowerCase()) ? -1 : 0))
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
          propertyOperand: this.rockPropertyTypes ? this.rockPropertyTypes[0].default_search : 'icontains',
          propertyValue: null, propertyValueFrom:null,propertyValueTo:null
        }
      }
    },
    watch: {
      'searchParameters.propertyOperand': {
        handler: function (oldVal,newVal) {
          if(oldVal === 'range') {
            this.searchResults.propertyValue = null
          }

          if(oldVal !== 'range') {
            this.searchResults.propertyValueFrom = null
            this.searchResults.propertyValueTo = null
          }
        },
        deep: true
      },
      'searchParameters.properties': {
        handler: function (after, before) {


        },
        deep: true
      },
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
  padding: 15px 10px;
  border: none;
  background-color: #f5f5f5;
  /*margin-bottom: 2px;*/
}
#collapseA {
  background-color: #F4FBFD;
}
.well {
  padding: 10px;
  vertical-align: middle;

  min-height: 20px;
  margin-bottom: 20px;
  background-color: #f5f5f5;
  border: 1px solid #e3e3e3;
  border-radius: 2px;
  -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.05);
  box-shadow: inset 0 1px 1px rgba(0,0,0,.05);
}
.btn-link {
  font-size: small !important; letter-spacing: 1.3px; color:#F05F40; font-weight: bolder; text-decoration: none
}
.btn-link:hover {
  color:#eb3812;
  font-weight: bold;
}

</style>
