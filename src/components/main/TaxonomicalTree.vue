<template>
  <div class="row m-1">
    <div class="card rounded-0" id="tab-block">
      <div class="card-header">{{$t('item.classification')}}</div>
      <div class="card-body">
        <div class="m-1 mt-3">
          <div class="scroller scroller-left" @click="scrollLeft()"><font-awesome-icon class="tabArrow" :icon="arrowLeft"/></div>
          <div class="scroller scroller-right" @click="scrollRight()"><font-awesome-icon class="tabArrow" :icon="arrowRight"/></div>
          <div class="wrapper">
            <ul class="nav nav-tabs tab-links list" style="flex-wrap: nowrap !important;font-size: small">
              <li class="nav-item" v-for="cls in $parent.rock.classifications">
                <a :id="'id_'+cls.rock_classification_id" href="#" @click.prevent="setActiveClfTab(cls.rock_classification_id)" class="nav-link"
                   :class="{ active: $props.activeClfTab === cls.rock_classification_id }" v-translate="{ et: cls.rock_classification__name, en: cls.rock_classification__name_en, ru: cls.rock_classification__name_ru }"></a>
              </li>
            </ul>
            <div class="clt mt-2"  style="margin-top: 3rem !important;">
              <tree :tree-data="tree" :current-rock-id="$parent.rock.id"></tree>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import Tree from "./Tree";
  import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
  import faArrowRight from '@fortawesome/fontawesome-free-solid/faArrowAltCircleRight'
  import faArrowLeft from '@fortawesome/fontawesome-free-solid/faArrowAltCircleLeft'
    export default {
      name: "taxonomical-tree",
      components: {Tree,FontAwesomeIcon},
      data() {
        return {
          tree: {},
          leftAnimation: false,
          rightAnimation: false,
        }
      },
      props: {
        activeClfTab: Number,
        tabListLeftPosi: Number
      },
      computed: {
        lang() {return this.$i18n.locale},
        hierarchy() { return this.$parent.currenClfHierarchy},
        sisters() { return this.$parent.currentClfSisters},
        siblings() { return this.$parent.currentClfSiblings},
        arrowRight() { return faArrowRight },
        arrowLeft() { return faArrowLeft },
        widthOfList() {
          let itemsWidth = 0;
          $('.list li').each(function(){
            let itemWidth = $(this).outerWidth();
            itemsWidth+=itemWidth;
          });
          return itemsWidth;
        },
        widthOfHidden() {
          return (($('.wrapper').outerWidth())-this.widthOfList-this.$props.tabListLeftPosi);
        },
      },
      beforeMount() {
        window.addEventListener('resize', this.reAdjust);
      },
      beforeDestroy () {
        window.addEventListener('resize', this.reAdjust);
      },
      mounted() {
        this.composeTaxonomicTree()
        if(this.$props.tabListLeftPosi >= 0) {
          $('.list').animate({left: '-'+"="+this.$props.tabListLeftPosi+"px"}, 50);
        } else {
          $('.list').animate({left:'+'+"="+this.$props.tabListLeftPosi+"px"}, 50);
        }
        this.$nextTick(() => this.setArrows())

      },
      methods: {
        reAdjust() {
          this.$nextTick(() => this.setArrows())
        },
        setArrows: function() {

          setTimeout(() => {
            // console.log( $('#id_'+this.activeClfTab).offset().left)
            // $(".list").delay(1000).animate({left: - $('#id_'+this.activeClfTab).offset().left }, 1000);
            // console.log(this.widthOfHidden)
            // console.log('outer ' + $('.wrapper').outerWidth())
            // console.log('width of list '+this.widthOfList)
            // console.log('left pos '+this.tabListLeftPosi)
            this.widthOfHidden < 0 ? $('.scroller-right').fadeIn('fast') : $('.scroller-right').fadeOut('fast');
            this.$props.tabListLeftPosi < 0 ? $('.scroller-left').fadeIn('fast') : $('.scroller-left').fadeOut('fast');

          }, 100)

        },

        scrollArrows(animation, isLeft) {
          let this_ = this;
          if(animation === true) return
          animation = true
          $('.list').animate({left:(isLeft? '+': '-')+"="+10+"rem"},'fast',function(){
            isLeft ? this_.leftAnimation = false : this_.rightAnimation = false

            this_.$emit('set-tab-list-left-posi',true);
            this_.setArrows();
          });
        },
        scrollRight() {
          if(this.widthOfHidden > 0) return;
          this.scrollArrows(this.rightAnimation,false)
        },
        scrollLeft() {
          if(this.$props.tabListLeftPosi >= 0) return;
          this.scrollArrows(this.leftAnimation,true)
        },
        setActiveClfTab: function(id) {
          this.$emit('set-active-clf-tab',id);
          this.$nextTick(() => this.setArrows())
        },
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
  .fa-arrow-alt-circle-left, .fa-arrow-alt-circle-right {
    color:#6c757d  !important;
  }
  .scroller {
    text-align:center;
    cursor:pointer;
    display: none;
    padding-top:11px;
    white-space:no-wrap;
    vertical-align:middle;
    background-color:#fff;


  }

  .scroller-right{
    float:right;
    margin-right: -20px !important;
  }

  .scroller-left {
    float:left;
    margin-left: -20px !important;
  }

  .wrapper {
    position:relative;
    margin:0 auto;
    overflow:hidden;
    padding:5px;
    /*height:50px;*/
  }
  .list {
    position:absolute;
    left:0px;
    top:0px;
    min-width:3000px;
    margin-left:12px;
    margin-top:0px;
  }

  .list li{
    display:table-cell;
    position:relative;
    text-align:center;
    cursor:grab;
    cursor:-webkit-grab;
    color:#efefef;
    vertical-align:middle;
  }

</style>
