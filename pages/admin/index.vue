<template lang="pug">
  div.admin
    admin-menu(nowMenu=1)
    Card.content
      h3 致各位管理者
      br
      hr
      br
      p 感謝各位花心力時間共同管理這個平台，希望我們能做的會讓這個世界更美好！
      .footer
        p AC,2019年10月26日

</template>

<script>
  import adminMenu from '@/components/admin/menu'
    export default {
        name: "index",
        middleware:'auth',
        components: {
            adminMenu,
        },
    }
</script>

<style scoped lang="sass">
  .content
    padding: 15px 25px
    letter-spacing: 3px
    margin: 25px 10vw
    min-height: 80vh
  .footer
    position: absolute
    right: 15px
    bottom: 15px

</style>
