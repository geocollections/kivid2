<template>
  <div>
    <ul class="ml-0">
      <li style="list-style-type: none">
        <table>
          <tbody class="hierarchy_tree">
          <tr  v-for="item in taxonomicTree.nodes">
            <td>
              <span v-for="i in convertToNumber(item.i)" >&ensp;</span>
              <a :href="'/'+item.id" v-if="item.id !== $parent.rock.id" v-translate="{ et: item.label, en: item.label_en }"></a>
              <span class="node_in_tree_selected" v-if="item.id === $parent.rock.id" v-translate="{ et: item.label, en: item.label_en }"></span>
            </td>
          </tr>
          </tbody>
        </table>
      </li>
    </ul>
  </div>

</template>

<script>
  import Tree from "./Tree";
    export default {
      name: "taxonomical-tree",
      components: {Tree},
      data() {
        return {
          taxonomicTree: {nodes: []}
        }
      },
      computed: {
        lang() {return this.$localStorage.get('kivid_lang')},
        hierarchy() { return this.$parent.currenClfHierarchy},
        sisters() { return this.$parent.currentClfSisters}
      },
      created() {
        this.composeTaxonomicTree()
      },
      methods: {
        composeTaxonomicTree: function() {
          let hierarchy = this.reorderHierarchy();
          if (hierarchy === undefined) return;
          this.addTopRock();
          let level = 0;
          level = this.addHierarchy(hierarchy,level);
          this.addSisters(this.reorderSisters(),level)
        },
        reorderSisters: function(){
          return this.lang === 'et' ?
            this.sisters.sort((a,b) => (a.rock__name.toLowerCase() > b.rock__name.toLowerCase()) ? 1 : ((b.rock__name.toLowerCase() > a.rock__name.toLowerCase()) ? -1 : 0)) :
            this.sisters.sort((a,b) => (a.rock__name_en.toLowerCase() > b.rock__name_en.toLowerCase()) ? 1 : ((b.rock__name_en.toLowerCase() > a.rock__name_en.toLowerCase()) ? -1 : 0))
        },
        addTopRock: function() {
          let node = (
            { i:0, id:this.$parent.currentClf.rock_classification__hierarchy_top_rock_id,
              label: this.$parent.currentClf.rock_classification__hierarchy_top_rock__name,
              label_en: this.$parent.currentClf.rock_classification__hierarchy_top_rock__name_en,
             nodes: []
            });
          this.taxonomicTree.nodes.push(node)
        },
        convertToNumber: function(str) { return parseInt(str) },
        //reorder hierarchy according to hierarchy string
        reorderHierarchy: function() {
          if(this.$parent.currentClf.parent_string === undefined) return;
          let newArr = []
          let hierarchyIds = this.$parent.currentClf.parent_string.split('-');
          for (let i in hierarchyIds) {
            for (let idx in this.hierarchy) {
              if(this.convertToNumber(hierarchyIds[i]) === this.hierarchy[idx].rock_id) {
                newArr.push(this.hierarchy[idx])
              }
            }
          }
          return newArr
        },
        addHierarchy: function(filteredList,level) {
          for(let idx in filteredList) {
            level += 1;
            let node = {i:level, id:filteredList[idx].rock_id, label: filteredList[idx].rock__name, label_en: filteredList[idx].rock__name_en,siblings:[]};
            this.taxonomicTree.nodes.push(node)
          }
          return level
        },
        addSisters: function(orderedSisters,level) {
          level += 1;
          for(let idx in orderedSisters) {
            let node = {i: level, label: orderedSisters[idx].rock__name, label_en: orderedSisters[idx].rock__name_en,
               id: this.sisters[idx].rock_id,siblings:[]};
            this.taxonomicTree.nodes.push(node)
          }
        },
      }
    }
</script>
