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
      <a href="/#/232">
      <img src="https://files.geocollections.info/medium/9d/b5/9db5b4d9-7e83-471f-a2dd-cf2f440064f1.jpg" alt="kaltsiit" style="max-width: 750px; width: 100%;"/>
      </a>
      </div>
    </div>
    <div class="row m-2">
      <div class="col-md-12">
          |
          <a href="#/3">mineraalid</a> |
          <a href="#/799">vääriskivid</a> |
          <br>
          |
          <a href="#/113">tardkivimid</a> |
          <a href="#/21">setted </a> |
          <a href="#/6">settekivimid</a> |
          <a href="#/114">moondekivimid</a> |


          <br>
          |
          <a href="#/793">maagid</a> |
          <a href="#/796">põlevmaavarad</a> |
          <a href="#/">tööstustoormed</a> |
          <a href="#/">ehitusmaavarad</a> |

          <br>
          <div style="padding: 5px 0; font-size: 0.8em;">Viimati muudetud kirjed: <a href="#/23">aleuriit</a> | <a href="#/9">aleuroliit</a> | <a href="#/564">tšaroiit</a> | <a href="#/1071">zuniit</a> | <a href="#/601">sepioliit</a> | </div>
      </div>
    </div>


  </div>
</template>

<script>
  import VueMultiselect from 'vue-multiselect'
  import RockSearch from "../components/main/RockSearch";
  export default {
    name: "front-page",
    components: {RockSearch, VueMultiselect},
    metaInfo: {
      title: 'EUROCORE Data Portal'
    },
    created() {
      this.$emit('page-loaded',false);
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
