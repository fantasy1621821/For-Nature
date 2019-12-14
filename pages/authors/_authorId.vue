<template lang="pug">
  .author
    Layout
      Header(:style="{position: 'fixed', width: '100%',zIndex:'99'}")
        Menu(mode="horizontal" theme="dark" active-name="1")
          .layout-logo
            MenuItem(name="1")
              h3 {{profile.name}}
          .layout-nav
            MenuItem(name="2" to="/home")
              h3 回首頁


      Content(:style="{margin: '88px 20px 0', background: '#fff', minHeight: '80vh'}")
        .profile
          Card(style={width: "320px"})
            div(style={textAlign: "center"})
              img(:src="profile.imgSRC" width="250")
              h3 {{profile.name}}
              Button.story(@click="showstoryModal") 我的故事
          Card(style={margin: "0px 20px", flexGrow: "1"} dis-hover)
            p(slot="title") 個人資料
            p 出生日期：{{profile.birthday.year}}-{{profile.birthday.month}}-{{profile.birthday.day}}
            p 性別：{{profile.sex}}
            p 出生地：{{profile.locate.country}}{{profile.locate.city}}{{profile.locate.district}}
            .tags
              Tag(color="primary" size="medium" v-for="(item,index) in profile.tag") {{item}}

        Card.description(style={margin: "20px 20px"} dis-hover)
          div(v-html="profile.description")



      Footer
        span 2019 &copy; 為自然請命
      Modal(v-model="storyModal.active" ok-text="選擇故事" cancel-text="取消" title="請選擇故事" @on-ok="chooseStory(storyModal.chooseStory)")
        RadioGroup(v-model="storyModal.chooseStory" vertical)
          div(v-for="(item,index) in profile.story")
            Radio( :label="item")
              span {{item}}

</template>

<script>
    import axios from "../../.nuxt/axios";

    export default {
        name: "authorId",
        data() {
            return {
                storyModal: {
                    active: false,
                    chooseStory: "",
                    story: []
                },
                profile: {
                    birthday: {
                        year: "",
                        month: "",
                        day: ""
                    },
                    locate: {
                        country: "",
                        city: "",
                        district: "",
                    }
                }
            }
        },
        computed: {
            authorId: function () {
                let vm = this;
                return vm.$route.params.authorId
            }
        },
        methods: {
            showstoryModal() {
                let axios = require('axios').default;
                let vm = this;
                if(vm.profile.story.length>0)
                  this.storyModal.active = !this.storyModal.active;
                else{
                    vm.$Message.info("目前這位作家還沒有故事哦！")
                }
            },
            chooseStory(data) {
                let vm = this;
                if (data === "" || data !== vm.storyModal.chooseStory) {
                    vm.$Message.error("請選擇故事！")
                } else{
                    vm.$router.push('/gis/'+vm.profile.name+'-'+data)
                }
            }
        },
        mounted() {
            let vm = this;
            let axios = require('axios').default;
            this.$Spin.show();
            axios.post('/api/getAuthor', {
                "name": vm.authorId
            })
                .then(response => {
                    if (response.data.Items.length === 0) {
                        this.$Message.error("找不到作者，即將為您跳轉頁面");
                        setTimeout(function () {
                            vm.$router.push('/home')
                        }, 1500)
                    } else
                        vm.profile = response.data.Items[0]
                })
                .then(function () {
                    vm.$Spin.hide();
                })
        }
    }
</script>

<style scoped lang="sass">

  .author
    background: #f5f7f9
    position: relative
    overflow: hidden


    .layout-nav
      float: right

    .profile
      display: flex
      line-height: 2
      letter-spacing: 2px

    .tags
      position: absolute
      right: 10px
      bottom: 10px

    .loading-spin
      animation: ani-demo-spin 1s linear infinite

    .story
      margin-top: 10px
    .description
      letter-spacing: 2px
      line-height: 2
</style>
