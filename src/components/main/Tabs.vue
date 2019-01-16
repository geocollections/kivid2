<template>
    <div class="m-1 mt-3">
        <ul class="nav nav-tabs tab-links" style="flex-wrap: nowrap !important;">
            <li class="nav-item">
                <a href="#" v-on:click.prevent="setActiveTab('overview')" class="nav-link"  :class="{ active: $parent.activeTab === 'overview' }">{{ $t('item.tab_overview') }}</a>
            </li>
            <li class="nav-item" v-if="!!$parent.rock.specimenCollectionCnt && $parent.rock.specimenCollectionCnt > 0">
                <a href="#"  v-on:click.prevent="setActiveTab('specimens')" class="nav-link"  :class="{ active: $parent.activeTab === 'specimens' }">{{ $t('item.tabs_specimens') }}
                    <span class="badge badge-secondary badge-pill">{{$parent.rock.specimenCollectionCnt}}</span>
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "Tabs",
        data() {
          return {
            activeTab: 'overview'
          }
        },
        methods: {
            setActiveTab: function(tab) {
              this.$emit('tab-changed',tab)
            }
        }
    }
</script>
