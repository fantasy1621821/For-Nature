<template lang="pug">
  div
    Menu(mode="horizontal" theme="dark" :active-name="nowMenu" )
      MenuItem(name="1" to="/admin" )
        Icon(type="ios-home")
        span 管理主頁
      MenuItem(name="2" to="/admin/manage")
        Icon(type="ios-paper")
        span 資料管理
      MenuItem(name="3" to="/admin/story")
        Icon(type="ios-book")
        span 故事管理


      p.ivu-menu-item(@click="logout" style={display:"float",float:'right'})
        Icon(type="ios-log-out")
        span 登出
      MenuItem(name="4" to="/home" style={display:"float",float:'right'})
        Icon(type="ios-arrow-forward")
        span 返回首頁
</template>

<script>

    export default {
        name: "adminMenu",
        data(){
          return{
          }
        },
        props: {
            nowMenu: String
        },
        mounted:function(){
        },
        methods: {
             logout() {
                let vm  =this;
                try {
                     vm.$store.dispatch('logout')
                } catch (e) {
                }
            }
        }
    }
</script>

<style scoped lang="sass">
  *
    list-style: none


</style>
