<template>
  <div class="tree">
    <ul class="tree-list">
      <node-tree :node="treeData" :current-rock-id="currentRockId"></node-tree>
    </ul>
  </div>
</template>

<script>
  import NodeTree from "./NodeTree";

  export default {
    props: {
      treeData: Object,
      currentRockId: Number
    },
    components: {
      NodeTree
    }
  };
</script>

<style>
  .tree-list ul {
    padding-left: 16px;
    margin: 0 !important;
  }
</style>
