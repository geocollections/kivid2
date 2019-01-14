<template>
  <div class="item-page">
    <div v-if="!error">

      <div class="row">
        <div class="col-md-12">
          <h1>{{capitalizeFirstLetter(rock.name)}}</h1>
          <h6><i>{{rock.name_en}}</i></h6>
        </div>
      </div>

      <div class="row">
        <div class="col-md-8">
          <div class="row">
            <div class="card rounded-0" style="width: 100%">
              <div class="card-body"  style="text-align: left">
                <table class='table' id="basicInfoTable">
                  <tbody>
                  <tr v-if="isDefinedAndNotNull(rock.rocktype) || isDefinedAndNotNull(rock.rockrank)">
                    <th>Tüüp/tase</th><td>{{rock.rocktype}} | {{rock.rockrank}}</td>
                  </tr>
                  <tr v-if="isDefinedAndNotNull(rock.formula_html)">
                    <th>Koostis</th><td v-html="rock.formula_html"></td>
                  </tr>
                  <tr v-if="isDefinedAndNotNull(rock.description)">
                    <th>Kirjeldus</th><td>{{rock.description}}</td>
                  </tr>
                  <tr v-if="isDefinedAndNotNull(rock.description_en)">
                    <th>Kirjeldus, ingl. k.</th><td>{{rock.description_en}}</td>
                  </tr>
                  <tr v-if="isDefinedAndNotNull(rock.description_in_estonia)">
                    <th>Eestis</th><td>{{rock.description_in_estonia}}</td>
                  </tr>
                  <tr v-if="isDefinedAndNotNull(rock.description_in_estonia_en)">
                    <th>Eestis, ingl. k.</th><td>{{rock.description_in_estonia_en}}</td>
                  </tr>
                  <tr v-if="isDefinedAndNotNull(rock.description_usage)">
                    <th>Kasutus</th><td>{{rock.description_usage}}</td>
                  </tr>
                  <tr v-if="isDefinedAndNotNull(rock.description_usage_en)">
                    <th>Kasutus, ingl. k.</th><td>{{rock.description_usage_en}}</td>
                  </tr>
                  <tr v-if="isDefinedAndNotNull(rock.remarks)">
                    <th>Lisainfo</th><td>{{rock.remarks}}</td>
                  </tr>
                  <tr v-if="isDefinedAndNotNull(rock.name)">
                    <th>SARV</th><td>
                    <a :href="'http://geocollections.info/specimen?name_geology_1=1&name_geology='+rock.name+'&currentTable=specimen&paginateBy=25&sort=id&sortdir=DESC'" target='_blank'>Otsi vasteid Eesti geokogude portaalist</a> | <a :href="'http://geocollections.info/specimen?name_geology_1=1&name_geology='+rock.name+'&search_images=1&currentTable=specimen&paginateBy=25&sort=id&sortdir=DESC'" target='_blank'>Pildiotsing</a>
                  </td>
                  </tr>
                  <tr v-if="isDefinedAndNotNull(rock.mindat_id)">
                    <th>Mindat ID</th><td><a :href="'http://mindat.org/min-'+rock.mindat_id+'.html'">{{rock.mindat_id}}</a></td>
                  </tr>
                  <tr v-if="isDefinedAndNotNull(rock.link_wikipedia) || isDefinedAndNotNull(rock.link_wikipedia_en)">
                    <th>Lisainfo</th><td><a target='_blank' :href="'http://et.wikipedia.org/wiki/'+rock.link_wikipedia">{{rock.link_wikipedia}}</a> | <a target='_blank' :href="'http://en.wikipedia.org/wiki/'+rock.link_wikipedia_en">{{rock.link_wikipedia_en}}</a></td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="row" >
            <div class="card rounded-0" style="width: 100%" v-if="isDefinedAndNotEmpty(rock.synonyms)">
              <div class="card-header">Sünonüümid</div>
              <div class="card-body"  style="text-align: left">
                <div v-for="item in rock.synonyms">
                  <b>{{item.language__iso1}}</b>: {{item.name}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="row" v-if="isDefinedAndNotEmpty(rock.images)" >
            <lingallery ref="lingallery" :items="rock.images"/>
          </div>
          <div class="row">
            <div class="card rounded-0" style="width: 100%">
              <div class="card-header">Omadused</div>
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

        </div>
      </div>

    </div>
    <div class="row" v-else>
      <div class="col-md-12">
        <h3>ID {{$router.currentRoute.params.id}}: kirje ei ole kättesaadav</h3>
      </div>
    </div>
    {{rock}}
  </div>
</template>

<script>
  import {
    fetchRock,
    fetchRockImages,
    fetchRockProperties,
    fetchRockSynonyms
  } from '../api'
  import Lingallery from "../components/main/Lingallery";
  export default {
    name: "item-page",
    components: {Lingallery},
    data() {
      return {
        error : false,
        mode: this.$localStorage.get('mode'),
        rock : {
          id: this.$router.currentRoute.params.id
        }
      }
    },

    created() {
      this.loadFullRockInfo()
    },
    methods: {
      isDefinedAndNotNull(value) { return !!value && value !== null },
      isDefinedAndNotEmpty(value) { return !!value && value.length > 0 },
      capitalizeFirstLetter(string) {
        return string ? string.charAt(0).toUpperCase() + string.slice(1):'';
      },
      composeImageUrls(images){
        if(images === undefined || images === {} || images.length === 0) return ;
        if (images.length > 0) {
          let this_ = this;
          images.forEach(function(el) {
            el.thumbnail = el.image__image_url;
            el.src = el.image__image_url;
            el.caption = '';
          });
          return images
        }
      },
      loadFullRockInfo() {
        fetchRock(this.rock.id, this.mode).then((response) => {
          if(response.results.length === 0) {
            this.error = true
          }
          this.rock = Object.assign(this.rock,response.results[0]);
        });
        fetchRockImages(this.rock.id, this.mode).then((response) => {
          this.rock.images = this.composeImageUrls(response.results);
        });
        // fetchGroupImages()
        fetchRockProperties(this.rock.id, this.mode).then((response) => {
          this.rock.properties = response.results;
        });
        // getparents
        // getchildren($id);
        // getsiblings($id);
        //
        // getminerals($id);
        // getrocksbymineral($id);
        fetchRockSynonyms(this.rock.id, this.mode).then((response) => {
          this.rock.synonyms = response.results;
        });
        fetchRockSynonyms(this.rock.id, this.mode).then((response) => {
          this.rock.reference = response.results;
        });
        // getlocalities($id);
        // getspecimensall($id);

      },

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
  .row {
    margin-top:20px;
  }
</style>
