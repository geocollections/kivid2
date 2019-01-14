<template>
  <nav class="navbar navbar-expand-lg navbar-light fixed-top" id="mainNav" >
    <div class="container">
      <h1>
        <router-link class="navbar-brand" to="/" :style="{
                  'color':scroll ? '#eb3812' : '',
                  // 'letter-spacing': scroll ? '0px':'2px',
                  'font-size':scroll ? '18px' : 'larger',
                  'text-transform': 'uppercase','font-weight':'700 !important'}">kivid.info</router-link>
      </h1>

      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive"
              aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <form class="form-inline my-lg-0 mr-5">
        <vue-multiselect class="align-middle" style=" width: 20em !important;"
                         id="search"
                         :custom-label="displayResults" track-by="code"
                         :placeholder="$t('header.search')"
                         :options="searchResults"
                         :searchable="true"
                         :loading="isLoading"
                         :max-height="600"
                         :show-no-results="false"
                         :show-labels="false"
                         @select="onSelect" @search-change="doSearch">
          <template slot="noResult"><b>NoRes</b></template>
        </vue-multiselect> &ensp; <font-awesome-icon :icon="icon" />
        <!--or <i class="fas fa-search"></i><span class="badge badge-primary badge-pill badge-info ml-1" style="font-size: 0.7rem "><i class="fas fa-cog"></i></span></a>-->
      </form>
      <div class="collapse navbar-collapse" id="navbarResponsive">
        <ul class="navbar-nav ml-auto">



          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">LANG</a>
            <div class="dropdown-menu">
              <a class="dropdown-item" href="#">EN</a>
              <a class="dropdown-item" href="#">EST</a>
            </div>
          </li>
          <!--<li class="nav-item">-->
            <!--<router-link class="nav-link" to="/drillcore">DRILLCORES</router-link>-->
          <!--</li>-->
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
  import VueMultiselect from 'vue-multiselect'
  import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
  import faSearch from '@fortawesome/fontawesome-free-solid/faSearch'

  export default {
    components: {
      VueMultiselect,
      FontAwesomeIcon
    },
    name: "app-header",

    data() {
      return {
        fastSearch: '',
        scroll:false,
        isLoading:false,
        selectedItem:null,
        searchResults: []
      }
    },

    computed: {
      icon() {
        return faSearch
      }
    },

    mounted: function () {

    },

    methods: {
      doSearch(value) {
        if(value.length < 3)  this.searchResults = [];
        if(value.length > 2) {
          this.isLoading = true;
          // fetchearch(value).then((response) => {
          //   this.isLoading = false;
          //   this.searchResults = response.results
          // });
        }
      },
      onSelect (value) {
        this.selectedItem = null;
        location.replace('/'+value.id)
      },
      displayResults: function (item) {
        return `${item.name}`
      },
    }
  }
</script>

<style scoped>


  #mainNav {
    background-color : white;
    box-shadow: 0 0 50px #9c9d9e;
    background-image: -webkit-linear-gradient(left, #f7f7f7 0%, #d6d6d6 100%), -webkit-linear-gradient(left, #f7f7f7  0%, #d6d6d6 100%);
    background-image: -moz-linear-gradient(left, #f7f7f7  0%, #d6d6d6 100%), -moz-linear-gradient(left, #f7f7f7  0%, #d6d6d6 100%);
    background-image: linear-gradient(to right, #f7f7f7  0%, #d6d6d6 100%), linear-gradient(to right, #f7f7f7  0%, #d6d6d6 100%);
    background-image: -o-linear-gradient(left, #f7f7f7 0%, #d6d6d6 100%), -o-linear-gradient(left, #f7f7f7  0%, #d6d6d6 100%);
  }

  .nav-link {
    color: #004393 !important;
    font-weight: 700;
  }

  .nav-link:hover {
    opacity: 0.7;
  }

  /*a.router-link-exact-active {*/
    /*color: #6bb745 !important;*/
    /*font-size: 1.05rem;*/
  /*}*/

  a.router-link-active {
    color: #6bb745 !important;
    font-size: 1.05rem;
  }

  @media (min-width: 992px) {
    #fast-search {
      width: 20%;
    }
  }

  #fast-search {
    position: relative;
  }

  #fast-search > input {
    border: 2px solid #004393;
    color: #6bb745;
    font-weight: bold;
    border-radius: 30px;
    padding-right: 35px;
  }

  #fast-search > input:focus {
    outline: 0 !important;
    border-color: #6bb745;
    color: #004393;
    -webkit-transition : border 500ms ease-out;
    -moz-transition : border 500ms ease-out;
    -o-transition : border 500ms ease-out;
    -webkit-transition : color 500ms ease-out;
    -moz-transition : color 500ms ease-out;
    -o-transition : color 500ms ease-out;
  }

  .icon {
    position: absolute;
    right: 1%;
    top: -2%;
    padding: 10px;
    color: #004393;
  }


</style>
