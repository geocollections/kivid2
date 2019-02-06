<template>
  <div :class="smallScreenDevice ? 'row ml-auto mr-auto' : ''">
    <div class="row ml-auto mr-auto"> {{$props.searchParameters.specimens.hackToFixComponentReload}}
      <button type="button" class="btn btn-outline-primary btn-custom" :class="$props.searchParameters.specimens.onlyImgs ? 'active' : ''" aria-pressed="true"
              @click="$props.searchParameters.specimens.onlyImgs = !$props.searchParameters.specimens.onlyImgs"><font-awesome-icon :icon="icon" />
        <span v-if="!smallScreenDevice">{{ $t('search.only_images') }}</span></button>
      <button type="button" class="btn btn-outline-primary btn-circle btn-git ml-4" style="font-size: xx-small;" :class="$props.searchParameters.specimens.git ? 'active' : ''" aria-pressed="true"
              @click="$props.searchParameters.specimens.git = !$props.searchParameters.specimens.git"><span style="margin-left: -0.4rem;">GIT</span></button>
      <button type="button" class="btn btn-outline-primary btn-circle btn-tug" style="font-size: xx-small;" :class="$props.searchParameters.specimens.tug ? 'active' : ''" aria-pressed="true"
              @click="$props.searchParameters.specimens.tug = !$props.searchParameters.specimens.tug"><span style="margin-left: -0.4rem;">TUG</span></button>
      <button type="button" class="btn btn-outline-primary btn-circle btn-elm" style="font-size: xx-small;" :class="$props.searchParameters.specimens.elm ? 'active' : ''" aria-pressed="true"
              @click="$props.searchParameters.specimens.elm = !$props.searchParameters.specimens.elm"><span style="margin-left: -0.5rem;">ELM</span></button>
    </div>
    <div class="row" :class="smallScreenDevice ? 'ml-auto mr-auto' : 'ml-0'">
      <span v-if="!smallScreenDevice" style="font-size:medium !important;">{{ $t('search.per_page') }}: </span>
      <div class="btn-group ml-2" >
        <button type="button"
                :class="{'active':$props.searchParameters.specimens.paginateBy === nr}"
                @click="$props.searchParameters.specimens.paginateBy=nr"
                class="btn btn-outline-primary btn-custom" aria-pressed="true" v-for="nr in [10,25,50,100]">{{nr}}</button>
      </div>
    </div>
  </div>

</template>

<script>
  import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
  import faExternalLink from '@fortawesome/fontawesome-free-solid/faCamera'
    export default {
        name: "SpecimenFilterBtns",
        components: {FontAwesomeIcon},
        props: { searchParameters: Object, smallScreenDevice: Boolean },
        computed: {
          icon() { return faExternalLink }},
        watch: {
          'searchParameters': {
            immediate: true,
            handler: function (val) {

            },
            deep: true
          }
        }
    }
</script>

<style scoped>
  .btn-custom {
    color:#26a69a  !important;
    border-color:#26a69a  !important;
    font-size:x-small !important;
  }
  .btn-custom:hover,.btn-custom.active {
    background-color:#26a69a  !important;
    color:#ffffff  !important;
  }
  .btn-circle {
    width: 30px;
    height: 30px;
    padding: 7px 12px;
    border-radius: 50%;
    color:#26a69a  !important;
    border-color:#26a69a  !important;
  }
  .btn-circle:hover,.btn-circle.active  {
    background-color:#26a69a  !important;
    color:#ffffff  !important;
  }
</style>
