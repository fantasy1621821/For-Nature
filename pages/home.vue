<template lang="pug">
  .home(@wheel.prevent="wheel($event)")
    div.container(@click="chooseAuthorModal=!chooseAuthorModal")
      span.mas 作家選擇
      button(style ={background: "url('https://img.ltn.com.tw/Upload/liveNews/BigPic/600_1995233_5.jpg'),no-repeat"} type="button" name="Hover")
    div.container
      nuxt-link(to="/introduce")
        span.mas 緣起
        button(style ={background: "url('https://travelimg.yam.com/DATA/ARTICLE/20121025035514335.jpg'),no-repeat"} type="button" name="Hover")
    div.container
      nuxt-link(to="/admin/login")
        span.mas 資料管理
        button(style ={background: "url('https://images.idgesg.net/images/article/2018/10/analytics_binary_code_network_digital-transformation-100777428-large.jpg'),no-repeat"} type="button" name="Hover")

    div.container
      nuxt-link(to="/contact")
        span.mas 聯絡我們
        button(style ={background: "url('https://www.trussvillecityschools.com/cms/lib/AL50000063/Centricity/Domain/179/contact-3.jpg'),no-repeat"} type="button" name="Hover")

    Modal(v-model="chooseAuthorModal" title="請選擇作家" ok-text="確認" cancel-text="取消" scrollable=true @on-ok="chooseAuthor")
      Select(v-model="activeAuthor" size="large" placeholder="請選擇")
        Option(v-for="item in authorList" :value="item" :key="item") {{ item }}
</template>
<script>

  export default {
      head:{
          script:[
              {src:"https://cdnjs.cloudflare.com/ajax/libs/gsap/2.1.3/TweenMax.min.js"},
          ]
      },
        data: function () {
            return {
                authorList: null,
                chooseAuthorModal: false,
                activeAuthor: "",
            }
        },
        components: {},
        methods: {
            wheel(evt){
                TweenMax.to(".container",0.3,{
                    left:"+="+evt.deltaY*2.5+"px"
                })
            },
            chooseAuthor: function () {
                let vm = this;
                vm.$router.push('/authors/'+vm.activeAuthor);
            }
        },
        mounted() {
            let vm = this;
            const axios = require('axios').default;
            vm.$Spin.show();
            axios.get('/api/getAuthorList')
                .then(response => {
                    vm.authorList = response.data;
                }).then(function () {
                vm.$Spin.hide();
            })
        }
    }
</script>
<style lang="sass" scoped>
  *
    margin: 0
    padding: 0
    box-sizing: border-box

    @mixin button($bcolor, $url,  $x1,  $y1,  $bor,  $col)
      background: $bcolor
      -webkit-mask: url($url)
      mask: url($url)
      -webkit-mask-size: $x1 $y1
      mask-size: $x1 $y1
      border: $bor
      color: $col

    .home
      background: url("https://www.ctvalleybrewing.com/wp-content/uploads/2018/06/home-bg-new.jpg")
      display: flex
      justify-content: center
      align-items: center
      min-width: 2200px
      height: 100vh

    .container
      border-radius: 10px
      margin: 0px 16px
      position: relative
      width: 900px
      height: 80vh
      overflow: hidden
      font-weight: 300
      font-size: 20px
      text-shadow: 5px 3px 10px #000
      transition: 0.5s
      letter-spacing: 1px
      box-shadow: 4px 7px 15px #222
      &:hover
        transform: translateY(-15px)

      button

        width: 101%
        height: 100%
        font-family: 'Lato', sans-serif
        font-weight: 300
        font-size: 50px
        letter-spacing: 2px
        +button(#000, "https://raw.githubusercontent.com/robin-dela/css-mask-animation/master/img/nature-sprite.png", 2300%, 100%, none, #fff)
        background-size: 100% 100%
        cursor: pointer
        -webkit-animation: ani2 0.7s steps(22) forwards
        animation: ani2 0.7s steps(22) forwards

        &:hover
          -webkit-animation: ani 0.7s steps(22) forwards
          animation: ani 0.7s steps(22) forwards

    .mas
      position: absolute
      text-align: center
      width: 101%
      font-family: 'Lato', sans-serif
      font-weight: 400
      font-size: 30px
      color: white
      letter-spacing: 4px
      margin-top: 40vh
      overflow: hidden

    @-webkit-keyframes ani
      from
        -webkit-mask-position: 0 0
        mask-position: 0 0
      to
        -webkit-mask-position: 100% 0
        mask-position: 100% 0
    @keyframes ani
      from
        -webkit-mask-position: 0 0
        mask-position: 0 0
      to
        -webkit-mask-position: 100% 0
        mask-position: 100% 0
    @keyframes ani2
      from
        -webkit-mask-position: 100% 0
        mask-position: 100% 0
      to
        -webkit-mask-position: 0 0
        mask-position: 0 0
</style>
