<template>
  <div>
    <div class="btn-group btn-group-toggle">
      <label class="btn  btn-xs btn-secondary" :class="selectedMode === 'in_global' ? 'active': ''">
        <input type="radio" name="options" id="one" value="in_global" v-model="selectedMode">{{$t('search.worldwide')}}
      </label>
      <label class="btn  btn-xs btn-secondary"  :class="selectedMode === 'in_estonia' ? 'active': ''">
        <input type="radio" name="options" id="two" value="in_estonia" v-model="selectedMode">{{$t('search.only_estonia')}}
      </label>
    </div>
  </div>

</template>

<script>
  export default {
    name: "mode-buttons",
    data() {
      return { selectedMode:this.$localStorage.get('kivid_mode') }
    },
    watch: {
      selectedMode: function(mode){
        this.$localStorage.set('kivid_mode', mode);
      }
    }
  }
</script>
<style scoped>
  .btn-secondary:not(:disabled):not(.disabled).active {
    background-color: #F05F40 !important;
    border-color:#eb3812 !important;
    z-index: 1 !important;
  }
</style>
