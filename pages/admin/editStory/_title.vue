<template lang="pug">
  div
    Affix()
      admin-menu(nowMenu=3)
      Card
        Steps(:current="step.current" :status="step.error")
          Step(title="選擇作家" content="請選擇要建立故事的作家" icon="ios-person")
          Step(title="建立故事" content="請建立故事" icon="ios-book")
          Step(title="選擇故事座標" content="請選擇故事座標與內容" icon="md-locate")
          Step(title="確認資料" content="請確認故事相關資料與內容" icon="md-checkmark")
        Button(type="primary" @click="uploadStoryData" style={position:"absolute",bottom:"10px",right:"10px"} :disabled="status.sendDisabled") 送出
    Card.flow(v-if="step.current===-1")
      h3(slot="title" style={display:"flex" , justifyContent:"left" , alignItems:"center"})
        Icon(type="ios-document" size="25")
        span  說明
      .intro
        p.title 各位故事管理者大家好，下方是教學影片唷！可以參考教學影片學習，如有不會可以聯絡管理者哦！
        iframe(width="900"  height="500" src="https://www.youtube.com/embed/wcMsuqSSzN8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen)
    Card.flow(v-if="step.current===0")
      h3(slot="title" style={display:"flex" , justifyContent:"left" , alignItems:"center"})
        Icon(type="ios-person" size="30")
        span  請選擇作家
      Form
          FormItem(label="選擇作家" :label-width="80")
            Select(v-model="createData.author" filterable placeholder="請選擇作家" not-found-text="找不到內容" size="large" disabled)
              Option(v-for="item in storyData.author" :value="item") {{ item }}
      .action
        Button( @click="last()" style={marginRight:"10px"}) 上一步
        Button(type="primary" @click="next()") 確認
    Card.flow(v-if="step.current===1")
      h3(slot="title" style={display:"flex" , justifyContent:"left" , alignItems:"center"})
        Icon(type="ios-book" size="25")
        span  建立故事
      div
        Form
          FormItem(label="故事名稱" :label-width="80")
            Input(placeholder="請輸入故事名稱" v-model="createData.title" disabled)
          FormItem(label="故事地點" :label-width="80")
            Select(v-model="createData.content.GIS.GEOLayer" filterable placeholder="請選擇故事地點" not-found-text="找不到內容" size="large" multiple)
              OptionGroup(v-for="layers in storyData.GEOLayer" :label="layers.name")
                Option(v-for="item in layers.list" :value="item.url") {{ layers.name+'-'+item.name }}
      .action
        Button( @click="last()" style={marginRight:"10px"}) 上一步
        Button(type="primary" @click="next()") 確認
    Card.flow(v-if="step.current===2")
      h3(slot="title" style={display:"flex" , justifyContent:"left" , alignItems:"center"})
        Icon(type="md-locate" size="25")
        span  選擇故事座標
      Card
        div#viewDiv3
      div
        h3(style={margin:"16px 0px"}) 新的故事
        Tabs
          TabPane(v-for="(item,index) in createData.content.story" :label="'故事' + (index+1)")
            Card
              Form(:model="item" :label-width="80")
                FormItem(label="故事名稱")
                  Input(v-model="item.attributes.title" placeholder="請輸入故事名稱")
                FormItem(label="故事內容")
                  Input(v-model="item.attributes.content" type="textarea" :rows="8" placeholder="請輸入故事內容")
                FormItem(label="緯度")
                  Input(v-model="item.geometry.latitude" disabled)
                FormItem(label="經度")
                  Input(v-model="item.geometry.longitude"  disabled)
              Button(type="error" @click="delStory(index)" shape="circle"  icon="ios-trash")
      .action
        Button( @click="last()" style={marginRight:"10px"}) 上一步
        Button(type="primary" @click="next()") 確認
    Card.flow(v-if="step.current===3")
      h3(slot="title" style={display:"flex" , justifyContent:"left" , alignItems:"center"})
        Icon(type="md-checkmark" size="25")
        span  確認資料
      Card
        h3 {{createData.title}}
      Card(v-for="(item,index) in createData.content.story" style={margin:"16px"})
        p 標題：{{item.attributes.title}}
        p 內容：{{item.attributes.content}}
        Button(type="error" @click="delStory(index)" shape="circle"  icon="ios-trash")
      .action
        Button( @click="last()" style={marginRight:"10px"}) 上一步

</template>

<script>
    import adminMenu from '@/components/admin/menu'
    import auth from "../../../middleware/auth";
    import {loadModules} from 'esri-loader';
    export default {
        name: "addStory",
        middleware: 'auth',
        components: {
            adminMenu,
        },
        data() {
            return {
                temp:"",
                GISData: {},
                step: {
                    current: 0,
                    error: null
                },
                status: {
                    sendDisabled:true
                },
                storyData: {
                    author: [],
                    GEOLayer:[],
                    nowPosition:{x:0,y:0}
                },
                createData: {
                    preTitle:"",
                    author: "",
                    content:{
                        GIS:{
                            GEOLayer: [],
                            IMGLayer:[]
                        },
                        story:[

                        ]
                    },
                    title:""
                }
            }
        },
        methods: {
            uploadStoryData(){
                let vm = this;
                vm.$Spin.show();
                let axios = require('axios').default;
                axios.post('/api/updateStoryData', {
                    title:vm.createData.title,
                    name:vm.createData.author,
                    content:vm.createData.content,
                })
                    .then(function (response) {
                        if (response.data[0]) {
                            vm.$Message.success(response.data[1] + "，正在為您導向...");
                        } else
                            vm.$Message.error(response.data[1]);
                        return response.data[0]
                    })
                    .then(function (status) {
                        vm.$Spin.hide();
                        if (status)
                            setTimeout(function () {
                                vm.$router.push('/admin/story')
                            },1500)

                    })

            },
            delStory(index){
              let vm = this;
              vm.createData.content.story.splice(index,1)
            },
            last(){
                let vm = this;
                if (vm.step.current ===3)
                    setTimeout(function () {
                        vm.loadMap();
                    },1000)
                if (vm.step.current > -1)
                    vm.step.current--;
            },
            next(index) {
                let vm = this;
                if (vm.step.current ===1)
                    setTimeout(function () {
                        vm.loadMap();
                    },1000)
                if (vm.step.current ===2)
                    vm.status.sendDisabled=false;
                if (vm.step.current < 3)
                    vm.step.current++;
            },
            error() {
                let vm = this;
                if (vm.step.error === "")
                    vm.step.error = "error";
                else
                    vm.step.error = "";
            },
            getAllAuthor() {
                let author = []
                let axios = require('axios').default;
                let vm = this;
                vm.$Spin.show();
                axios.get('/api/getAllAuthor')
                    .then((response) => {
                        response.data.Items.map(function (item) {
                            vm.storyData.author.push(item.name)
                        })
                    })
                    .then(function () {
                        axios.get('/api/getAllLayer')
                            .then(function (response) {
                                response.data.map(function (item) {
                                    vm.storyData.GEOLayer.push(item)
                                })
                            })
                            .then(function () {
                                vm.$Spin.hide();
                            })
                    });
                return author;
            },
            createModal(latitude,longitude){
                let vm = this;
                vm.$Modal.confirm({
                    title: "新增新的故事",
                    okText:"確定新增",
                    cancelText:"取消",
                    onOk:function () {
                        vm.createData.content.story.push({
                            attributes:{
                                content:"",
                                title:vm.temp
                            },
                            geometry:{
                                latitude:latitude,
                                longitude:longitude,
                                type:"point"
                            }
                        });
                        vm.temp="";

                    },
                    onCancel(){
                        vm.temp="";
                    },
                    render: (h) => {
                        return h('Input', {
                            props: {
                                value: vm.temp,
                                autofocus: true,
                                placeholder: '請輸入欲新增的故事名稱'
                            },
                            on: {
                                input: (val) => {
                                    vm.temp = val;
                                }
                            }
                        })
                    }
                })
            },
            loadMap() {
                let vm = this;
                loadModules([
                    "esri/Map",
                    "esri/views/MapView",
                    "esri/Graphic",
                    "esri/layers/FeatureLayer",
                    "esri/widgets/Search"
                ])
                    .then(([Map, MapView, Graphic, FeatureLayer,Search]) =>{
                        let riverPositionX = 120.771616;
                        let riverPositionY = 23.818266;
                        const view = MapView({
                            map: new Map({
                                basemap: "hybrid"
                            }),
                            center: [riverPositionX, riverPositionY],
                            zoom: 8,
                            container: "viewDiv3",
                            popup: {
                                dockEnabled: true,
                                dockOptions: {
                                    position: "top-right",
                                    buttonEnabled: true,
                                    breakpoint: false
                                }
                            }
                        });
                        const searchWidget = new Search({
                            view: view
                        });
                        view.when(function () {
                            view.on("click", function(event) {
                                // Make sure that there is a valid latitude/longitude
                                if (event && event.mapPoint) {
                                    // Create lat/lon vars to display in popup title
                                    let lat = event.mapPoint.latitude * 1000 / 1000;
                                    let lon = event.mapPoint.longitude * 1000 / 1000;
                                    vm.createModal(lat,lon);

                                } else {
                                    view.popup.open({
                                        // Set the popup's title to the coordinates of the location
                                        title: "Invalid point location",
                                        location: event.mapPoint, // Set the location of the popup to the clicked location
                                        content: "Please click on a valid location."
                                    });
                                }
                            });
                        })

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
                                    return vm.createData.content.GIS.GEOLayer
                                })
                                .then(setLayer)
                                .then(createLayerURL)
                                .then(addToView)

                        }
                        setLayerURL();
                        function showCoordinates(pt) {
                            vm.storyData.nowPosition.x=pt.latitude.toFixed(3);
                            vm.storyData.nowPosition.y= pt.longitude.toFixed(3);

                        }
                        view.ui.add(searchWidget, {
                            position: "top-right"
                        });
                        view.on(["pointer-down","pointer-move"], function(evt) {
                            showCoordinates(view.toMap({ x: evt.x, y: evt.y }));
                        });


                    })
            }
        },
        mounted() {
            let axios = require('axios').default;
            let vm = this;
            vm.getAllAuthor()
            let title =vm.$route.params.title;
            let arr =title.split('_');
            let name = arr[0];
            console.log(name);
            axios.post('/api/getStory',{
                name:name,
                title:title
            })
                .then(function (response) {
                    let data = response.data.Items[0];
                    vm.createData.title = data.title;
                    vm.createData.content = data.content;
                    vm.createData.author = data.name;

                });
            vm.loadMap();

        }
    }
</script>

<style scoped lang="sass">
  #viewDiv3
    height: 600px
  .intro
    display: flex
    align-items: center
    justify-content: center
    flex-direction: column
    >.title
      letter-spacing: 3px
      margin: 25px
      font-size: 16px
  .flow
    margin: 25px 10vw
  .action
    margin-top: 20px
</style>
