<template>
    <div id="#tab-specimens" class="tab-pane" :class="{active: $parent.activeTab === 'specimens'}" role="tabpanel">
      <spinner v-show="loading" class="loading-overlay" size="massive" :message="$t('main.overlay')"></spinner>
      <b-row class="ml-3">
        <specimen-filter-btns :search-parameters="searchParameters" v-if="!isSmallScreenDevice && !loading" :small-screen-device="false"/>
      </b-row>
        <b-row class="m-1 table-responsive" style="margin-top: -2rem !important;">
          <specimen-filter-btns class="mt-4" :search-parameters="searchParameters" v-if="isSmallScreenDevice && !loading" :small-screen-device="true"/>
            <div class="col-xs-12 pagination-center mb-5" :class="isSmallScreenDevice ? ' mt-3': ''">
              <b-pagination v-if="$parent.isDefinedAndNotEmpty(response.results) && !loading" size="sm" :align="isSmallScreenDevice ? 'center' : 'right'" :limit="5" :hide-ellipsis="true" :total-rows="response.count" v-model="searchParameters.specimens.page" :per-page="searchParameters.specimens.paginateBy"></b-pagination>
            </div>
            <table class="table table-bordered table-hover mobile-padding-fix " style="font-size: smaller;" id="table-search">
                <thead class="thead-default">
                <tr>
                    <th><sort-field value = "specimen_number" name="search.specimen.number" :searchParameters="searchParameters"></sort-field></th>
                    <th><sort-field value = "rock,rock_en" name="search.specimen.name" :searchParameters="searchParameters"></sort-field></th>
                    <th><sort-field value = "locality,locality_en" name="search.specimen.locality" :searchParameters="searchParameters"></sort-field></th>
                    <th><sort-field value = "depth" name="search.specimen.depth_m" :searchParameters="searchParameters"></sort-field></th>
                    <th><sort-field value = "stratigraphy,stratigraphy_en" name="search.specimen.stratigraphy" :searchParameters="searchParameters"/></th>
                    <!--<th><sort-field value = "original_status,original_status_en" name="search.specimen.status" :searchParameters="searchParameters"></sort-field></th>-->
                    <th>{{ $t('search.specimen.images') }}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in response.results">
                    <td class="text-nowrap" ><a href="#" @click.prevent="$parent.openUrl({parent_url:$parent.geocollectionUrl+'/specimen',object:item.id, width:500,height:500})">
                        {{ item.acronym}} {{ item.specimen_number }}</a>
                    </td>
                    <!--<td class="text-nowrap">{{item.specimen_number_old}}</td>-->
                    <td>
                        <!-- Currently both are links because rock__name is mostly null. -->
                        <div>
                            <router-link :to="'/'+item.rock_id" v-translate="{et:item.rock,en:item.rock_en,ru:item.rock_ru}"></router-link>
                            <span v-if="$parent.isDefinedAndNotNull(item.rock) &&
                            $parent.isDefinedAndNotNull(item.rock_txt)"> | </span>
                            <span v-if="($parent.isDefinedAndNotNull(item.rock_txt) || $parent.isDefinedAndNotNull(item.rock_txt_en))
                            && ((item.rock !== item.rock_txt) || (item.rock_en !== item.rock_txt_en))">
                            <i><span v-translate="{et:item.rock_txt,en:item.rock_txt_en,ru:item.rock_txt_ru}"></span></i>
                            </span>
                        </div>
                    </td>
                    <td v-if="!isSmallScreenDevice || (isSmallScreenDevice && ($parent.isDefinedAndNotNull(item.locality) || $parent.isDefinedAndNotNull(item.locality_en) || $parent.isDefinedAndNotNull(item.locality_free)))">
                        <div v-if="$parent.isDefinedAndNotNull(item.locality) || $parent.isDefinedAndNotNull(item.locality_en)">
                            <a href="#"
                                    @click.prevent="$parent.openUrl({parent_url:$parent.geocollectionUrl+'/locality',object:item.locality_id, width:500,height:500})">
                                <span v-translate="{et:item.locality,en:item.locality_en,ru:item.locality_ru}"></span></a>
                        </div>
                        <span v-if="$parent.isDefinedAndNotNull(item.locality_free)"> {{item.locality_free}}</span>
                    </td>
                    <td  v-if="!isSmallScreenDevice || (isSmallScreenDevice && ($parent.isDefinedAndNotNull(item.depth) || $parent.isDefinedAndNotNull(item.depth_interval)))">
                        {{item.depth}}<span v-if="item.depth_interval != null && item.depth_interval"> - {{ item.depth_interval }}</span>
                    </td>
                    <td v-if="!isSmallScreenDevice || (isSmallScreenDevice && ($parent.isDefinedAndNotNull(item.stratigraphy)
                    ||$parent.isDefinedAndNotNull(item.stratigraphy_en))
                    ||$parent.isDefinedAndNotNull(item.stratigraphy_txt))">
                        <a v-if="$parent.isDefinedAndNotNull(item.stratigraphy)||$parent.isDefinedAndNotNull(item.stratigraphy_en)" href="#"
                                @click.prevent="$parent.openUrl({parent_url:$parent.geocollectionUrl+'/stratigraphy',object:item.stratigraphy_id, width:500,height:500})">
                            <span v-translate="{et:item.stratigraphy,en:item.stratigraphy_en,ru:item.stratigraphy_ru}"></span></a>

                        <span v-if="(item.stratigraphy_en == null && item.stratigraphy == null)
                                            || (item.lithostratigraphy_en == null && item.lithostratigraphy == null)"
                              v-for="(txt,idx) in item.stratigraphy_txt">{{ txt }}<span v-if="idx !== item.stratigraphy_txt.length -1">,</span></span>
                    </td>

                    <!--
                    <td v-if="!isSmallScreenDevice || (isSmallScreenDevice && ($parent.isDefinedAndNotNull(item.original_status)||$parent.isDefinedAndNotNull(item.original_status_en)))">
                        <span v-if="$parent.isDefinedAndNotNull(item.original_status)||$parent.isDefinedAndNotNull(item.original_status_en)"
                              v-translate="{et:item.original_status,en:item.original_status_en}"></span>
                    </td>
                    -->
                    <td v-if="!isSmallScreenDevice || (isSmallScreenDevice && ($parent.isDefinedAndNotNull(item.image_preview_url)))">
                      <a data-fancybox="gallery3" :href="item.image_url" :data-caption="item.caption" v-if="$parent.isDefinedAndNotNull(item.image_preview_url)">
                        <img class="img-thumbnail previewImage" :src="item.image_preview_url" style="max-height: 6rem;max-width:3rem "/>
                        </a>
                    </td>
                </tr>
                </tbody>
            </table>
            <div class="col-xs-12 pagination-center" v-if="$parent.isDefinedAndNotEmpty(response.results) && !loading" >
                <b-pagination
                        size="sm" :align="isSmallScreenDevice ? 'center' : 'right'" :limit="5" :hide-ellipsis="true" :total-rows="response.count" v-model="searchParameters.specimens.page" :per-page="searchParameters.specimens.paginateBy">
                </b-pagination>
            </div>
        </b-row>
    </div>
</template>

<script>
  import Spinner from 'vue-simple-spinner'
    import {
        fetchSpecimenCollection
    } from '../../api'

    import SortField from "./SortField";
    import SpecimenFilterBtns from "./SpecimenFilterBtns";
    export default {
        name: "TabSpecimens",
        components: {SpecimenFilterBtns, SortField,Spinner},
        data() {
            return {
              // searchParameters: {
              //   specimens: { page: 1, paginateBy: 25, sortBy: 'specimen_number',  sortByAsc: true, order: "ASCENDING",
              //   onlyImgs: false,git: false,tug: false,elm: false, hackToFixComponentReload: ''},
              // },
              loading: true, clientWidth : document.documentElement.clientWidth, response: this.setDefaultResponse()
            }
        },
        props: {
          searchParameters: Object
        },
        computed: {
            rock () {return this.$parent.rock},
            isSmallScreenDevice () { return this.clientWidth < 439 }
        },
        mounted () {
            window.addEventListener('resize', () => {
                this.clientWidth = document.documentElement.clientWidth;
            });
            this.getSpecimens();
        },
        methods: {
            getSpecimens() {
                this.loading = true;
                this.setDefaultResponse();
                fetchSpecimenCollection(this.$parent.rock.id,this.mode, this.searchParameters).then((response) => {
                    this.response = response;
                    this.loading = false;
                    this.$emit('specimen-filter-applied', this.response.count)
                });
            },
            setDefaultResponse() {
                return {
                    count: 0,
                    results: []
                }
            },
          searchParamsChanged(param) {
              console.log(param)
          }

        },
        watch: {
            'searchParameters.specimens': {
                handler: function () {
                    this.getSpecimens()
                },
                deep: true
            },
            'document.documentElement.clientWidth'(clientWidth) {
                if (clientWidth) {
                    console.log(clientWidth)
                }
            },

        },
    }
</script>

<style scoped>
    #table-search .btn{
        padding:0;
        margin:0;
    }
    /* search table*/
    .thead-default th {
      background-color: #eceeef;
      color:#464a4c;
    }
    #table-search td {
      color: #292b2c;
    }
    #table-search td:first-child {
      font-weight:700;
    }
    #table-search tr > th > span,
    #table-search tr > th > em {
      font-size: small !important;
    }
    #table-search tr > th > em > .btn{
      color:#464a4c;
      text-decoration: none;
      font-style: italic;
    }
    #table-search tr > th,
    #table-search tr > th > .btn{
      color:#464a4c;
      text-decoration: none;
      text-transform: uppercase;
      font-size: small;
    }
    #table-search tr > th > .btn:hover{
      color: #270807;
    }
    #table-search tr > td > a {
      color:#eb3812;
    }
    #table-search tr > td > a:hover {
      color:#FF2F00;
    }

    table tr > td:first-child {
      font-weight: 700;
    }

    #table-search {
      empty-cells: show;
    }
    @media screen and (min-width : 439px) and (max-width : 800px) {


      #table-search tr > th > .btn{
        color:#464a4c;
        text-decoration: none;
        font-size: x-small;
      }
    }

    @media only screen and (max-width: 439px) {

      .table-responsive {
        border: 0px;
      }

      /* Force table to not be like tables anymore */
      #table-search table,
      #table-search thead,
      #table-search tbody,
      #table-search th,
      #table-search td,
      #table-search tr {
        display: block;
        margin-bottom: 8px;
      }

      /* Hide table headers (but not display: none;, for accessibility) */
      #table-search thead tr {
        position: absolute;
        top: -9999px;
        left: -9999px;
      }

      #table-search tr { border: 1px solid #ccc; }

      #table-search td {
        /* Behave  like a "row" */
        border: none;
        border-bottom: 1px solid #eee;
        position: relative;
        /*padding-left: 50%;*/
        padding: 0.4rem !important;
        white-space: normal;
        text-align: left;
      }

      #table-search td:empty {
        padding-top: 20px;
      }
      #table-search td:before {
        /* Now like a table header */
        position: absolute;
        /* Top/left values mimic padding */
        top: 6px;
        left: 6px;
        width: 45%;
        padding-right: 10px;
        white-space: nowrap;
        text-align:left;
        font-weight: bold;
      }

      /*
      Label the data
      */
      #table-search td:before { content: attr(data-title); }
    }
</style>
