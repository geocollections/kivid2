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
      <!--<tab-gallery v-if="$store.state.activeTab === 'gallery'"></tab-gallery>-->
      <tab-specimens v-if="activeTab === 'specimens'"></tab-specimens>
      <div v-if="activeTab  === 'overview'">
        <div class="row">
          <div class="col-lg-8">
            <div class="row">
              <div class="card rounded-0" style="width: 100%">
                <div class="card-body"  style="text-align: left">
                  <table class='table' id="basicInfoTable">
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
            <div class="row" v-if="isClassificationTreeLoaded">
              <div class="card rounded-0" style="width: 100%" v-if="isDefinedAndNotEmpty(rock.classifications)">
                <div class="card-header">{{$t('item.classification')}}</div>
                <div class="card-body"  style="text-align: left">
                  <div class="m-1 mt-3">
                    <ul class="nav nav-tabs tab-links" style="flex-wrap: nowrap !important;font-size: x-small">
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
            <div class="row" v-if="isDefinedAndNotEmpty(rock.references)">
              <div class="card rounded-0" style="width: 100%">
                <div class="card-header">{{$t('item.references')}}</div>
                <div class="card-body"  style="text-align: left">
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
          <div class="col-lg-4">

            <div class="row" v-if="isDefinedAndNotEmpty(rock.localities)">
              <div class="card rounded-0" style="width: 100%">
                <div class="card-header">{{$t('item.localities')}}</div>
                <div class="card-body no-padding">
                  <map-component></map-component>
                </div>
              </div>
            </div>
            <div class="row" v-if="isDefinedAndNotEmpty(rock.properties)">
              <div class="card rounded-0" style="width: 100%">
                <div class="card-header">{{$t('item.features')}}</div>
                <div class="card-body"  style="text-align: left">
                  <div v-for="item in rock.properties">
                    <span style="font-weight: bolder" v-translate="{ et: item.property, en: item.property_en }"></span>:
                    <span v-if="isDefinedAndNotNull(item.value_min) || isDefinedAndNotNull(item.value_max)">
                    {{item.value_min}} - {{item.value_max}}</span>
                    <span v-if="isDefinedAndNotNull(item.value_txt)">{{item.value_txt}}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="row" >
              <div class="card rounded-0" style="width: 100%" v-if="isDefinedAndNotEmpty(rock.synonyms)">
                <div class="card-header">{{$t('item.synonyms')}}</div>
                <div class="card-body"  style="text-align: left">
                  <div v-for="item in rock.synonyms">
                    <b>{{item.language__iso1}}</b>: {{item.name}}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
    <div class="row" v-else>
      <div class="col-md-12">
        <h3>ID {{$router.currentRoute.params.id}}: kirje ei ole kättesaadav</h3>
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
    cntSpecimenCollection
  } from '../api'
  import Lingallery from "../components/main/Lingallery";
  import TaxonomicalTree from "../components/main/TaxonomicalTree";
  import MapComponent from "../components/main/MapComponent";
  import Tabs from "../components/main/Tabs";
  import TabSpecimens from "../components/main/TabSpecimens";
  export default {
    name: "item-page",
    components: {TabSpecimens, Tabs, MapComponent, TaxonomicalTree, Lingallery},
    data() {
      return {
        fileUrl:'https://files.geocollections.info',
        geocollectionUrl: "http://geocollections.info",
        error : false,
        mode: this.$localStorage.get('mode'),
        rock : {
          id: this.$router.currentRoute.params.id,
          images: [],
          properties: [],
          references: [],
          synonyms: [],
          classifications: [],
          tree: {nodes: []},
          specimenCollectionCnt: 1
        },
        activeTab: 'overview',
        activeClfTab: '',
        currentClf: {},
        isCurrentClfSistersLoaded: false,
        isCurrenClfHierarchyLoaded: false
      }
    },
    computed: {
      isClassificationTreeLoaded() {
        return this.isCurrentClfSistersLoaded && this.isCurrenClfHierarchyLoaded}
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
      openUrl: function (params) {
        window.open(params.parent_url + '/' + params.object, '', 'width=' + params.width +
          ',height=' + params.height, scrollbars)
      },
      setFancyBoxCaption: function(el) {
        let text="",infoBtn = "", imgBtn = "", additionalInfo = {imageName: el.link_taxon, infoId:el.specimen_id, imageId: el.attachment_id, navigateId: el.link_id};

        text += "<div><button type=\"button\" class=\"btn btn-xs  btn-primary\" onclick=\"window.open('"+this.fossilsUrl+"/"+additionalInfo.navigateId+"?mode=in_baltoscandia&lang=en')\">Read more</button></div>" ;
        let someName = 'Some name, '+el.attachment__author__agent;
        if (el.image__specimen_id !== null) infoBtn = "<button type=\"button\" class=\"btn btn-sm  btn-info\" onclick=\"window.open('"+this.geocollectionUrl+"/specimen/"+el.image__specimen_id+"')\">INFO</button>"
        if(el.id !== null) imgBtn = " <button type=\"button\" class=\"btn btn-sm btn-secondary\" onclick=\"window.open('"+this.geocollectionUrl+"/file/"+el.id+"')\">IMAGE</button>"
        text += "<div class='mt-3'>someName<span></span>&ensp;&ensp;" + infoBtn + imgBtn + "</div>";
        return text
      },
      composeImageUrls(images){
        if(images === undefined || images === {} || images.length === 0) return ;
        if (images.length > 0) {
          let this_ = this;
          images.forEach(function(el) {
            el.thumbnail = this_.fileUrl + '/small/' + el.attachment__filename.substring(0, 2) + '/' + el.attachment__filename.substring(2, 4) + '/' + el.attachment__filename;
            el.src = this_.fileUrl + '/large/' + el.attachment__filename.substring(0, 2) + '/' + el.attachment__filename.substring(2, 4) + '/' + el.attachment__filename;
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
          } else this.error = true;
        });
        fetchRockImages(this.rock.id, this.mode).then((response) => {
          this.rock.images = this.isDefinedAndNotEmpty(response.results) ?
           this.composeImageUrls(response.results) : [];
        });
        // fetchGroupImages()
        fetchRockProperties(this.rock.id, this.mode).then((response) => {
          this.rock.properties = this.handleResponse(response);
        });
        // getparents
        // getchildren($id);
        // getsiblings($id);
        //
        // getminerals($id);
        // getrocksbymineral($id);
        fetchRockSynonyms(this.rock.id, this.mode).then((response) => {
          this.rock.synonyms = this.handleResponse(response);
        });
        fetchRockReferences(this.rock.id, this.mode).then((response) => {
          this.rock.references = this.handleResponse(response);
        });

        fetchRockTreeByRockId(this.rock.id, this.mode).then((response) => {
          if(this.isDefinedAndNotNull(response.results)) {
            this.rock.classifications = this.handleResponse(response);
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
      }

    },
    watch: {
      'activeClfTab': {
        handler: function () {
          this.composeTree()
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
  }
  #basicInfoTable {
    width: 100%;
    max-width: 1024px;
    text-align: left;
  }
  .col-lg-8 {
    padding-right:0.1rem !important;
  }
  .col-lg-4 {
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
</style>
