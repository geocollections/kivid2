<template>
  <div class="page-container item-page" >
    <div v-if="!error">
      <div class="row">
        <div class="col-md-12">
          <h1>{{capitalizeFirstLetter(rock.name)}}</h1>
          <h6><i>{{rock.name_en}}</i></h6>
        </div>
      </div>
      <div class="col-md-12">  
        <div class="row" v-if="isDefinedAndNotEmpty(rock.images)" >
          <lingallery ref="lingallery" :items="rock.images"/>
        </div>
      </div>
      <tabs v-on:tab-changed="setActiveTab"></tabs>
      <tab-specimens v-if="activeTab === 'specimens'"></tab-specimens>
        <div class="row" v-if="activeTab  === 'overview'">
          <div class="col-md-8">
            <div class="row m-1">
              <div class="card rounded-0">
                <div class="card-body">
                  <table class='table basicInfoTable' v-if="basicInfoLoaded">
                    <tbody>
                    <tr v-if="isDefinedAndNotNull(rock.rocktype) || isDefinedAndNotNull(rock.rockrank)">
                      <th>{{$t('item.type')}}</th><td>{{rock.rocktype}} | {{rock.rockrank}}</td>
                    </tr>
                    <tr v-if="isDefinedAndNotNull(rock.formula_html)">
                      <th>{{$t('item.composition')}}</th><td v-html="rock.formula_html"></td>
                    </tr>
                    <tr v-if="isDefinedAndNotNull(rock.description) || isDefinedAndNotNull(rock.description_en)">
                      <th>{{$t('item.description')}}</th><td v-translate="{ et: rock.description, en: rock.description_en }"></td>
                    </tr>
                    <tr v-if="isDefinedAndNotNull(rock.description_in_estonia) | isDefinedAndNotNull(rock.description_in_estonia_en)">
                      <th>{{$t('item.in_estonia')}}</th><td v-translate="{ et: rock.description_in_estonia, en: rock.description_in_estonia_en }"></td>
                    </tr>
                    <tr v-if="isDefinedAndNotNull(rock.description_usage) | isDefinedAndNotNull(rock.description_usage_en)">
                      <th>{{$t('item.usage')}}</th><td v-translate="{ et: rock.description_usage, en: rock.description_usage_en }"></td>
                    </tr>
                    <tr v-if="isDefinedAndNotNull(rock.remarks)">
                      <th>{{$t('item.additionalInfo')}}</th><td>{{rock.remarks}}</td>
                    </tr>
                    <tr v-if="isDefinedAndNotNull(rock.name)">
                      <th>SARV</th><td>
                      <a :href="'http://geocollections.info/specimen?name_geology_1=1&name_geology='+rock.name+'&currentTable=specimen&paginateBy=25&sort=id&sortdir=DESC'" target='_blank'>{{$t('item.sarv')}}</a> | <a :href="'http://geocollections.info/specimen?name_geology_1=1&name_geology='+rock.name+'&search_images=1&currentTable=specimen&paginateBy=25&sort=id&sortdir=DESC'" target='_blank'>{{$t('item.sarvPics')}}</a>
                    </td>
                    </tr>
                    <tr v-if="isDefinedAndNotNull(rock.mindat_id)">
                      <th>Mindat ID</th><td><a :href="'http://mindat.org/min-'+rock.mindat_id+'.html'">{{rock.mindat_id}}</a></td>
                    </tr>
                    <tr v-if="isDefinedAndNotNull(rock.link_wikipedia) || isDefinedAndNotNull(rock.link_wikipedia_en)">
                      <th>Wikipedia</th><td><a target='_blank' :href="'http://et.wikipedia.org/wiki/'+rock.link_wikipedia">{{rock.link_wikipedia}}</a> | <a target='_blank' :href="'http://en.wikipedia.org/wiki/'+rock.link_wikipedia_en">{{rock.link_wikipedia_en}}</a></td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div class="row m-1" v-if="isDefinedAndNotEmpty(rock.classifications) && isClassificationTreeLoaded">
              <div class="card rounded-0">
                <div class="card-header">{{$t('item.classification')}}</div>
                <div class="card-body">
                  <div class="m-1 mt-3">
                    <ul class="nav nav-tabs tab-links" style="flex-wrap: nowrap !important;font-size: small">
                      <li class="nav-item" v-for="cls in rock.classifications">
                        <a href="#" v-on:click.prevent="setActiveClfTab(cls.rock_classification_id)" class="nav-link"
                           :class="{ active: activeClfTab === cls.rock_classification_id }" v-translate="{ et: cls.rock_classification__name, en: cls.rock_classification__name_en }"></a>
                      </li>
                    </ul>
                    <taxonomical-tree></taxonomical-tree>
                  </div>
                </div>
              </div>
            </div>
            <div class="row m-1" v-if="isDefinedAndNotEmpty(rock.minerals)">
              <div class="card rounded-0">
                <div class="card-header">{{$t('item.minerals')}}</div>
                <div class="card-body">
                    <table class='table basicInfoTable' >
                      <tbody>
                        <tr v-for="item in rock.minerals">
                          <td>
                            <a v-on:click.prevent="navigate(item.mineral__id)" href="#" v-translate="{ et: item.mineral__name, en: item.mineral__name_en }"></a>
                          </td>
                          <td v-html="item.mineral__formula_html"></td>
                          <td v-translate="{ et: item.description, en: item.description_en }"></td>
                          <td v-translate="{ et: item.mineral_type__name, en: item.mineral_type__name_en }"></td>
                        </tr>
                      </tbody>
                    </table>
                </div>
              </div>
            </div>
            <div class="row m-1" v-if="isDefinedAndNotEmpty(rock.references)">
              <div class="card rounded-0">
                <div class="card-header">{{$t('item.references')}}</div>
                <div class="card-body">
                  <div :class="idx === rock.references.length -1 ? '' : 'my-3'" v-for=" reference,idx in rock.references" style="padding-left: 3em; text-indent: -3em;">
                    <a href="#" @click="openUrl({parent_url:'http://geocollections.info/reference',object:reference.reference_id, width:500,height:500})">
                      {{reference.reference__author}} {{reference.reference__year}}.
                    </a>
                    <!--$author, $year. $title. $journal_name: $number or $book, $pages. DOI:$doi.-->
                    <span>{{reference.reference__title}}.</span>

                    <span v-if="reference.reference__journal__journal_name != null"><!-- if journal article -->
                                           <em>{{reference.reference__journal__journal_name}}</em> <strong>{{reference.reference__volume}}</strong>,
                                           <span v-if="reference.reference__number != null">{{reference.reference__number}},</span>
                                           <span v-if="isDefinedAndNotNull(reference.reference__pages)">{{reference.reference__pages}}. </span>
                                       </span>
                    <span v-if="isDefinedAndNotNull(reference.reference__book)"><!-- if book article -->
                                       <em>{{reference.reference__book}}</em>, pp. {{reference.reference__pages}}.
                                       </span>

                    <span v-if="reference.reference__doi !== null" ><a :href="'https://doi.org/'+reference.reference__doi" rel="noopener" target="_blank">DOI:{{reference.reference__doi}}</a></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="row m-1" v-if="isDefinedAndNotEmpty(rock.localities)">
              <div class="card rounded-0">
                <div class="card-header">{{$t('item.localities')}}</div>
                <div class="card-body no-padding">
                  <map-component></map-component>
                </div>
              </div>
            </div>
            <div class="row m-1" v-if="isDefinedAndNotEmpty(rock.properties)">
              <div class="card rounded-0">
                <div class="card-header">{{$t('item.features')}}</div>
                <div class="card-body">
                  <div v-for="item in rock.properties">
                    <span style="font-weight: bolder" v-translate="{ et: item.property, en: item.property_en }"></span>:
                    <span v-if="isDefinedAndNotNull(item.value_min) || isDefinedAndNotNull(item.value_max)">
                    {{item.value_min}} - {{item.value_max}}</span>
                    <span v-if="isDefinedAndNotNull(item.value_txt)">{{item.value_txt}}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="row m-1"  v-if="isDefinedAndNotEmpty(rock.synonyms)">
              <div class="card rounded-0">
                <div class="card-header">{{$t('item.synonyms')}}</div>
                <div class="card-body">
                  <div v-for="item in rock.synonyms">
                    <b>{{item.language__iso1}}</b>: {{item.name}}
                  </div>
                </div>
              </div>
            </div>
            <div class="row m-1" v-if="isDefinedAndNotEmpty(rock.mineralsByRock)">
              <div class="card rounded-0">
                <div class="card-header">{{$t('item.mineralsByRock')}}</div>
                <div class="card-body">
                  <ul  class="ast-content-ul-list">
                    <li class="mb-1" v-for="item in rock.mineralsByRock">
                      <button type="button" class="btn btn-outline-primary btn-circle" style="font-size: xx-small;" v-on:click.prevent="navigate(item.rock__id)"><font-awesome-icon :icon="icon" /></button>
                      <span class="ml-2" v-translate="{ et: capitalizeFirstLetter(item.rock__name), en: capitalizeFirstLetter(item.rock__name_en) }"></span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

    </div>
    <div class="row" v-else>
      <div class="col-md-12  m-1">
        <h3>ID {{$route.currentRoute.params.id}}: kirje ei ole kättesaadav</h3>
      </div>
    </div>
    <!--{{rock}}-->
  </div>
</template>

<script>
  import {
    fetchRock,
    fetchRockImages,
    fetchRockProperties,
    fetchRockSynonyms,
    fetchRockReferences,
    fetchRockTreeByRockId,
    fetchRockTree,
    fetchHierarchy,
    fetchRockLocalities,
    cntSpecimenCollection,
    fetchPhotoGallery,
    fetchMinerals,
    fetchMineralsByRock,
    fetchRockSiblings
  } from '../api'
  import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
  import faExternalLink from '@fortawesome/fontawesome-free-solid/faExternalLinkAlt'
  import Lingallery from "../components/main/Lingallery";
  import TaxonomicalTree from "../components/main/TaxonomicalTree";
  import MapComponent from "../components/main/MapComponent";
  import Tabs from "../components/main/Tabs";
  import TabSpecimens from "../components/main/TabSpecimens";
  export default {
    name: "item-page",
    components: {TabSpecimens, Tabs, MapComponent, TaxonomicalTree, Lingallery,FontAwesomeIcon},
    data() {
      return {
        kividUrl: 'https://dev.kivid.info',
        fileUrl:'https://files.geocollections.info',
        geocollectionUrl: "http://geocollections.info",
        error : false,
        mode: this.$localStorage.get('kivid_mode'),
        rock : {
          id: this.$router.currentRoute.params.id,
          images: [],
          properties: [],
          references: [],
          minerals: [],
          synonyms: [],
          classifications: [],
          tree: {nodes: []},
          specimenCollectionCnt: 1
        },
        basicInfoLoaded: false,
        activeTab: 'overview',
        activeClfTab: '',
        currentClf: {},
        isCurrentClfSistersLoaded: false,
        isCurrenClfHierarchyLoaded: false,
        isCurrentClfSiblingsLoaded: false
      }
    },
    computed: {
      isClassificationTreeLoaded() {
        return this.isCurrentClfSistersLoaded && this.isCurrenClfHierarchyLoaded && this.isCurrentClfSiblingsLoaded},
      icon() { return faExternalLink }
    },

    created() {
      this.$emit('page-loaded',true);
      this.loadFullRockInfo()
    },
    methods: {
      load() {console.log('TEST')},
      isDefinedAndNotNull(value) { return !!value && value !== null },
      isDefinedAndNotEmpty(value) { return !!value && value.length > 0 },
      capitalizeFirstLetter(string) {
        return string ? string.charAt(0).toUpperCase() + string.slice(1):'';
      },
      navigate: function(id) {
        this.$router.push({ path: `/${id}`});
        // reload
        this.$router.go(this.$router.currentRoute)
      },
      openUrl: function (params) {
        window.open(params.parent_url + '/' + params.object, '', 'width=' + params.width +
          ',height=' + params.height, scrollbars)
      },
      setFancyBoxCaption: function(el) {
        let text = "",
          autor = this.isDefinedAndNotNull(el.attachment__author__agent) ?
            this.$t('fancybox.author')+": <strong>"+el.attachment__author__agent +"</strong>":"" ,
          agent = this.isDefinedAndNotNull(el.attachment__copyright_agent__agent) ?
            " / <strong>"+el.attachment__copyright_agent__agent +"</strong>":"" ,
          date = this.isDefinedAndNotNull(el.attachment__date_created) ?
            "<div>" + this.$t('fancybox.date')+": <strong>"+el.attachment__date_created +"</strong></div>":
            this.isDefinedAndNotNull(el.attachment__date_created_free) ?
            "<div>" + this.$t('fancybox.date')+": <strong>"+el.attachment__date_created_free +"</strong></div>": "" ,
          licence = this.isDefinedAndNotNull(el.attachment__licence__licence) ?
            "<div>" + this.$t('fancybox.licence')+": <strong>"+el.attachment__licence__licence +"</strong></div>":"" ,
          detailView = this.isDefinedAndNotNull(el.attachment__specimen_id) ?
            "<div><button type=\"button\" class=\"btn btn-sm btn-danger\" onclick=\"window.open('"+this.geocollectionUrl+"/specimen/"+el.attachment__specimen_id+"')\">"+this.$t('fancybox.detailView')+"</button></div>":"" ;
        text += "<div>"+autor+agent+"</div>"+date+licence+detailView;
        return text;
      },
      composeImageUrls(images){
        if(images === undefined || images === {} || images.length === 0) return ;
        if (images.length > 0) {
          let this_ = this;
          images.forEach(function(el) {
            el.thumbnail = el.preview ? el.preview : this_.fileUrl + '/small/' + el.attachment__filename.substring(0, 2) + '/' + el.attachment__filename.substring(2, 4) + '/' + el.attachment__filename;
            el.src = el.large ? el.large : this_.fileUrl + '/large/' + el.attachment__filename.substring(0, 2) + '/' + el.attachment__filename.substring(2, 4) + '/' + el.attachment__filename;
            el.caption = this_.setFancyBoxCaption(el);
          });
          return images
        }
      },
      loadFullRockInfo() {
        fetchRock(this.rock.id, this.mode).then((response) => {
          this.$emit('page-loaded',false);
          if(this.isDefinedAndNotEmpty(response.results)) {
            this.rock = Object.assign(this.rock,response.results[0])
            this.basicInfoLoaded = true;
          } else this.error = true;
        });
        fetchRockImages(this.rock.id, this.mode).then((response) => {
          this.rock.images = this.isDefinedAndNotEmpty(response.results) ?
           this.composeImageUrls(response.results) : [];
        });
        fetchRockProperties(this.rock.id, this.mode).then((response) => {
          this.rock.properties = this.handleResponse(response);
        });
        fetchMinerals(this.rock.id, this.mode).then((response) => {
          this.rock.minerals = this.handleResponse(response);
        });
        fetchMineralsByRock(this.rock.id, this.mode).then((response) => {
          this.rock.mineralsByRock = this.handleResponse(response);
        });
        fetchRockSynonyms(this.rock.id, this.mode).then((response) => {
          this.rock.synonyms = this.handleResponse(response);
        });
        fetchRockReferences(this.rock.id, this.mode).then((response) => {
          this.rock.references = this.handleResponse(response);
        });
        console.log(this.rock)
        fetchRockTreeByRockId(this.rock.id, this.mode).then((response) => {
          if(this.isDefinedAndNotNull(response.results)) {
            this.rock.classifications = this.handleResponse(response);
            if(this.rock.images.length === 0) {
              fetchPhotoGallery(this.rock.classifications[0].parent_string, this.mode).then((response) => {
                this.rock.images = this.isDefinedAndNotEmpty(response.results) ?
                  this.composeImageUrls(response.results) : [];
              });
            }
            if(!this.isDefinedAndNotNull(response.results[0].parent__name)) return;
            this.setActiveClfTab(this.rock.classifications[0].rock_classification_id);
            this.composeTree()
          }
        });
        fetchRockLocalities(this.rock.id, this.mode).then((response) => {
          this.rock.localities = this.handleResponse(response);
        });
        cntSpecimenCollection(this.rock.id).then((response) => {
          this.rock.specimenCollectionCnt = response.count;
        });
      },
      handleResponse: function(response) {
        return this.isDefinedAndNotEmpty(response.results) ? response.results : [];
      },
      getCurrentClassification: function (list, itemID) {
        return list.filter(function (val, i) {
          return val.rock_classification_id === itemID;
        }, this);
      },
      setActiveTab: function(tab) {
        this.activeTab = tab
      },
      setActiveClfTab: function(tab) {
        this.activeClfTab = tab
        this.currentClf = this.getCurrentClassification(this.rock.classifications,tab)[0]
      },
      formatHierarchyString: function(value) { return value ? value.replace(/-/g, ',') : value;},
      composeTree: function () {
        this.isCurrenClfHierarchyLoaded = false;
        fetchHierarchy(this.rock.id,this.formatHierarchyString(this.currentClf.parent_string),this.activeClfTab).then((response) => {
          this.currenClfHierarchy = response.results;
          this.isCurrenClfHierarchyLoaded = true;
        });
        //sisters
        this.isCurrentClfSistersLoaded = false;
        fetchRockTree(this.activeClfTab, this.currentClf.parent_id, this.mode).then((response) => {
          this.currentClfSisters = response.results;
          this.isCurrentClfSistersLoaded = true;
        });
        //siblings
        this.isCurrentClfSiblingsLoaded = true;
        fetchRockSiblings(this.activeClfTab, this.currentClf.rock_id, this.mode).then((response) => {
          this.currentClfSiblings = response.results;
          this.isCurrentClfSiblingsLoaded = true;
        });
      }

    },
    watch: {
      'activeClfTab': {
        handler: function () {
          this.composeTree()
        },
        deep: true
      },
      '$route.params.id': {
        handler: function (id) {
          this.$router.push({ path: `/${id}`});
          // reload
          this.$router.go(this.$router.currentRoute)
        },
        deep: true
      }

    },

    metaInfo: {
      title: ''
    },
  }
</script>
<style scope>
  .item-page {
    max-width: 1280px !important;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
  }
  .basicInfoTable {
    width: 100%;
    max-width: 1024px;
    text-align: left;
  }
  .col-md-8 {
    padding-right:0.1rem !important;
  }
  .col-md-4 {
    padding-left:0.1rem !important;
  }
  .row {
    margin-top:20px;
  }
  .no-padding {
    padding: 0;
  }
  .card-header {
    color: #999;
    font-size: smaller;
    font-weight: bold;
  }
  .card-footer {
    background-color: transparent;
  }
  .card {
    margin-bottom: 4px;
  }

  div.card.rounded-0 {
    width: 100%
  }
  div.card-body {
    text-align: left
  }
  /* Unordered list style */
  ul.ast-content-ul-list {
    margin-left:-3rem;
  }
  ul.ast-content-ul-list li {
    position: relative;
    padding-left: 10px;
    list-style: none;
  }
  .btn-circle {
    width: 25px;
    height: 25px;
    padding: 5px 8px;
    font-size: 12px;
    border-radius: 50%;
    color:#26a69a  !important;
    border-color:#26a69a  !important;
  }
  .btn-circle:hover {
    background-color:#26a69a  !important;
    color:#ffffff  !important;
  }
</style>
