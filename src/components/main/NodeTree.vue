<template>
  <li class="node-tree">
    <button type="button" class="btn btn-outline-primary btn-circle" :class="node.id === currentRockId ? 'btn-selected': ''" style="font-size: xx-small;" v-on:click.prevent="navigate(node.id)"><font-awesome-icon :icon="icon" /></button>
    <a class="label ml-2" :href="'/'+node.id" v-if="node.id !== currentRockId" v-translate="{ et: capitalizeFirstLetter(node.label), en: capitalizeFirstLetter(node.label_en) }"></a>
    <span class="label selected ml-2" v-if="node.id === currentRockId" v-translate="{ et:capitalizeFirstLetter(node.label), en: capitalizeFirstLetter(node.label_en) }"></span>
    <ul v-if="node.children && node.children.length">
      <node v-for="(child,idx) in node.children" :key="idx" :node="child" :current-rock-id="currentRockId"></node>
    </ul>
  </li>
</template>

<script>
  import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
  import faExternalLink from '@fortawesome/fontawesome-free-solid/faAngleRight'
    export default {
      name: "node",
      components: {FontAwesomeIcon},
      props: {
        node: Object,
        currentRockId: Number
      },
      computed: {
        icon() { return faExternalLink }
      },
      methods: {
        navigate: function(id) {
          if(id === this.currentRockId) return
          this.$router.push({ path: `/${id}`});
          // reload
          this.$router.go(this.$router.currentRoute)
        },
        capitalizeFirstLetter(string) {
          return string ? string.charAt(0).toUpperCase() + string.slice(1):'';
        },
      }
    }
</script>

<style scoped>
  .label {
    color: #373737;
    font-size: small
  }
  .label.selected {
    font-weight: bolder;
  }
  .btn-selected {
    background-color:#26a69a  !important;
    color:white !important;
    pointer-events: none;

  }
</style>
