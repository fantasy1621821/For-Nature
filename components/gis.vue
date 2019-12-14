<template lang="pug">
  .gis
    nuxt-link#lastPage.esri-widget(to="/home")
      Button( type="secondary")
        Icon(type="ios-arrow-back")
        span  回首頁
    #viewDiv
    #logoDiv.esri-widget 為自然請命
</template>

<script>

    import {loadModules} from 'esri-loader';

    export default {
        name: "GIS",
        data() {
            return {
                GISData: {}
            }
        },
        props: {
            params: String,
        },
        methods: {

            loadData() {
                let vm = this
                let params = this.params;
                if(params.indexOf('-')===-1){
                    alert("幹你娘的不要亂試");
                    vm.$router.push('/home');
                }
                let dataArr = params.split('-');
                let axios = require('axios').default;
                axios.post('/api/getStory',{name:dataArr[0],title:dataArr[1]})
                    .then(function (response) {
                        if (response.data.Items.length===0){
                            alert("幹你娘的不要亂試");
                            vm.$router.push('/home');
                        }
                        else
                          vm.GISData = response.data.Items[0];
                    })
                    .catch(function (err) {
                        console.log(err)
                    })

            },
            loadMap() {
                let vm = this;
                loadModules([
                    "esri/Map",
                    "esri/views/MapView",
                    "esri/Graphic",
                    "esri/layers/FeatureLayer"
                ])
                    .then(([Map, MapView, Graphic, FeatureLayer]) => {
                        let riverPositionX = 120.771616;
                        let riverPositionY = 23.818266;
                        const view = MapView({
                            map: new Map({
                                basemap: "hybrid"
                            }),
                            center: [riverPositionX, riverPositionY],
                            zoom: 8,
                            container: "viewDiv",
                            popup: {
                                dockEnabled: true,
                                dockOptions: {
                                    position: "top-right",
                                    breakpoint: false
                                }
                            }
                        });
                        function setLayerURL() {
                            function setLayer(data) {
                                return data
                                    .filter(function (item) {
                                        return item;
                                    })
                                    .map(function (graphicPromise) {
                                        return graphicPromise;
                                    });
                            }

                            function createLayerURL(url) {
                                return url.map(function (url) {
                                    return new FeatureLayer({
                                        url: url
                                    })
                                })
                            }

                            function addToView(layer) {
                                layer.map(function (layer) {
                                    view.map.add(layer);
                                })

                            }

                            view
                                .when()
                                .then(() => {
                                    return vm.GISData.content.GIS.GEOLayer
                                })
                                .then(setLayer)
                                .then(createLayerURL)
                                .then(addToView)

                        }
                        function setStory(){
                            function setPointData(data) {
                                return data.filter(function (item) {
                                    return item
                                })
                            }

                            let markerSymbol = {
                                type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                                color: [226, 119, 40],
                                outline: {
                                    // autocasts as new SimpleLineSymbol()
                                    color: [255, 255, 255],
                                    width: 2
                                }
                            };

                            function setPointGraphic(data) {
                                return data.map(function (item) {
                                    return new Graphic({
                                        geometry: item.geometry,
                                        symbol: markerSymbol,
                                        attributes: item.attributes,
                                        popupTemplate: {
                                            // autocasts as new PopupTemplate()
                                            title: "{title}",
                                            content: `<hr><br>{content}`
                                        }
                                    });
                                })
                            }

                            function addView(layer) {
                                layer.filter(function (item) {
                                    view.graphics.add(item)
                                })

                            }
                            view
                                .when()
                                .then(() => {
                                    return vm.GISData.content.story
                                })
                                .then(setPointData)
                                .then(setPointGraphic)
                                .then(addView)
                        }
                        setLayerURL();
                        setStory();
                        view.ui.add("logoDiv", "bottom-right");
                        view.ui.add("lastPage", "bottom-left");

                    })
                    .catch(err => {
                        // handle any errors
                        console.error(err);
                    });
            },
            async createMap() {
                let vm = this;
                await vm.loadData();
                await vm.loadMap();

            }
        },
        mounted() {
            this.createMap()
        }
    }
</script>

<style scoped lang="sass">
  html, body, #viewDiv
    width: 100vw
    height: 100vh
    margin: 0
    padding: 0

    #logoDiv
      width: 140px
      padding: 12px
      background: transparent
      border: 0 transparent
      box-shadow: 0px 0px 0px transparent !important
      font-size: 18px
      letter-spacing: 3px
      color: #eee
      text-shadow: 2px 2px 6px #222
      text-align: center
      font-weight: 800

</style>


