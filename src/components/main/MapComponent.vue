<template>
    <div v-if="mapData" id="map" style="height: 300px"></div>
</template>

<script>
    export default {
        name: "map-component",
        data() {
          return {
              map: null,
              groupedLayers: null,
              tileLayer: null,
              geologicalLayer: null,
              layers: [
                  {id: 0, name: 'localities', active: true, features: []}
              ]
          }
        },
        computed : {
            lang() {return this.$localStorage.get('kivid_lang')},
            mapData() {return this.$parent.rock.localities}
        },
        mounted (){
            if(this.getLocationsObject(this.mapData)) {
                this.loadMap()
                this.initLayers()
                this.checkAllLayers()
            }

        },
        methods: {
            checkAllLayers() {
                this.layers.sort((a, b) => a.id - b.id);
                for(let i = 0; i < this.layers.length; i++){
                    if(this.layers[i].active)
                        this.map.addLayer(this.layers[i].leaflatObjects)
                }
            },
            initLayers : function() {
              this.layers.forEach((layer) => {
                  let leaflatObjects = []
                  layer.features.forEach((feature) => {
                      feature.leafletObject = L.circle(feature.coords,{color: 'rgba(240, 95, 37,0.7)', opacity: 0.7 ,weight:6, zIndexOffset: 1})
                          .bindPopup(feature.locid === null ? feature.name : '<a target="_blank" href="http://geocollections.info/locality/'+feature.locid+'">'+feature.name+'</a>',
                              {className: "custom-popup-text"})
                      // if(layer.active)feature.leafletObject.addTo(this.map)

                      leaflatObjects.push(feature.leafletObject)
                  });
                  layer.leaflatObjects = L.layerGroup(leaflatObjects)
              });
              let overlays = {}
              overlays[this.$t('map.overlay_title')+'<br /><img src="http://gis.geokogud.info/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=IGME5000:EuroGeology&legend_options=fontName:DejaVu%20Sans%20ExtraLight;fontAntiAliasing:true;fontColor:0x333333;fontSize:10;bgColor:0xFFFFff;dpi:96" /> '] = this.geologicalLayer

              L.control.layers(null, overlays).addTo(this.map);

            },

            loadMap : function() {
                document.getElementById('map').style.cursor = 'default';
                this.map = L.map('map',{
                    fullscreenControl: true,
                })
                this.map.setView([58.5,25.5], 6);
                this.tileLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoia3V1dG9iaW5lIiwiYSI6ImNpZWlxdXAzcjAwM2Nzd204enJvN2NieXYifQ.tp6-mmPsr95hfIWu3ASz2w',
                    {
                        minZoom: 1,
                        maxZoom: 18,
                        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                    }
                ).addTo(this.map);
              this.geologicalLayer = L.tileLayer.wms('http://gis.geokogud.info/geoserver/wms', {
                  layers: 'IGME5000:EuroGeology',
                  transparency: 'true',
                  format: 'image/png',
                  opacity: 0.5
              }).addTo(this.map);

            },

            getLocationsObject : function(object) {
                if (object === undefined || object === {} || object === false || object.length === 0) return;
                let this_ = this;
                object.forEach(function(element,index) {
                    if (element.locality !== null && element.locality__latitude !=null && element.locality__longitude !== null) {
                        this_.layers[0].features.push({
                            id: index,
                            coords: [element.locality__latitude,element.locality__longitude],
                            type: element.src,
                            name: this_.$parent.translate(element.locality__locality_en,element.locality__locality,element.locality__locality_ru),
                            locid: element.locality
                        });
                    }
                });
                return true
            },
        }
    }
</script>
<style>
    .custom-popup-text a{
        color:#F05F40;
        font-family: 'Open Sans', 'Helvetica Neue', Arial, sans-serif;
        font-size: 10pt;
        text-align: left;
        font-weight: 700;
    }
</style>
