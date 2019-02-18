<template>
  <div class="clt mt-2" >
    <tree :tree-data="tree" :current-rock-id="$parent.rock.id"></tree>
  </div>
</template>

<script>
  import Tree from "./Tree";
    export default {
      name: "taxonomical-tree",
      components: {Tree},
      data() {
        return {
          tree: {}
        }
      },
      computed: {
        lang() {return this.$i18n.locale},
        hierarchy() { return this.$parent.currenClfHierarchy},
        sisters() { return this.$parent.currentClfSisters},
        siblings() { return this.$parent.currentClfSiblings}
      },
      mounted() {
        this.composeTaxonomicTree()
      },
      methods: {
        composeTaxonomicTree: function() {
          let hierarchy = this.reorderHierarchy();
          if (hierarchy === undefined) return;
          this.addTopRock();
          let level = 0,prevNode;
          level,prevNode = this.addHierarchy(hierarchy,level);
          if(this.sisters.length === 1 && this.sisters[0].parent_id === null) {this.addSiblings(this.reorderSiblings(), level,prevNode);}
          else this.addSisters(this.reorderSisters(),level,prevNode)
        },
        reorderSisters: function(){
          return this.sisters === undefined ? [] :
            this.lang === 'et' ?
            this.sisters.sort((a,b) => (a.rock__name.toLowerCase() > b.rock__name.toLowerCase()) ? 1 : ((b.rock__name.toLowerCase() > a.rock__name.toLowerCase()) ? -1 : 0)) :
            this.sisters.sort((a,b) => (a.rock__name_en.toLowerCase() > b.rock__name_en.toLowerCase()) ? 1 : ((b.rock__name_en.toLowerCase() > a.rock__name_en.toLowerCase()) ? -1 : 0))
        },
        reorderSiblings: function(){
          return this.siblings === undefined ? [] :
            this.lang === 'et' ?
            this.siblings.sort((a,b) => (a.rock__name.toLowerCase() > b.rock__name.toLowerCase()) ? 1 : ((b.rock__name.toLowerCase() > a.rock__name.toLowerCase()) ? -1 : 0)) :
            this.siblings.sort((a,b) => (a.rock__name_en.toLowerCase() > b.rock__name_en.toLowerCase()) ? 1 : ((b.rock__name_en.toLowerCase() > a.rock__name_en.toLowerCase()) ? -1 : 0))
        },
        addTopRock: function() {
          this.tree = (
            { i:0, id:this.$parent.currentClf.rock_classification__hierarchy_top_rock_id,
              label: this.$parent.currentClf.rock_classification__hierarchy_top_rock__name,
              label_en: this.$parent.currentClf.rock_classification__hierarchy_top_rock__name_en,
             children: []
            });
        },
        convertToNumber: function(str) { return parseInt(str) },
        //reorder hierarchy according to hierarchy string
        reorderHierarchy: function() {
          if(this.$parent.currentClf.parent_string === undefined || this.$parent.currentClf.parent_string === null) return
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
          let node,prevNode;
          for(let idx in filteredList) {
            level += 1;
            prevNode = node ? node : this.tree;
            if(filteredList[idx].rock_id === prevNode.id) continue
            node = {i:level, id:filteredList[idx].rock_id, label: filteredList[idx].rock__name, label_en: filteredList[idx].rock__name_en,children:[]};
            prevNode.children = [node]
          }
          if (node === undefined) node = this.tree
          return level,node
        },
        addSisters: function(orderedSisters,level,prevNode) {
          level += 1;
          for(let idx in orderedSisters) {
            let node = {i: level, label: orderedSisters[idx].rock__name, label_en: orderedSisters[idx].rock__name_en,
               id: orderedSisters[idx].rock_id,children:[]};
            if(node.id === this.$parent.rock.id) this.addSiblings(this.reorderSiblings(), level,node);
            prevNode.children.push(node)
          }
        },
        addSiblings: function(orderedSiblings,level, currentRock){
          for(let idx in orderedSiblings) {
            let node = {i: level, label: orderedSiblings[idx].rock__name, label_en: orderedSiblings[idx].rock__name_en,
              id: orderedSiblings[idx].rock_id, children:[]};
            currentRock.children.push(node)
          }
        }
      }
    }
</script>
<style>
  .clt, .clt ul, .clt li {
    position: relative;
  }

  .clt ul {
    list-style: none;
    padding-left: 32px;
  }
  .clt li::before, .clt li::after {
    content: "";
    position: absolute;
    left: -12px;
  }
  .clt li::before {
    border-top: 1px solid #26a69a;
    top: 9px;
    width: 8px;
    height: 0;
  }
  .clt li::after {
    border-left: 1px solid #26a69a;
    height: 100%;
    width: 0px;
    top: 2px;
  }
  .clt ul > li:last-child::after {
    height: 8px;
  }
</style>
