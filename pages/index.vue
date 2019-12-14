<template lang="pug">
  div.home
    div.homeBanner
      div.vid
        iframe(src="https://www.youtube.com/embed/Z44USdiDLFU?autoplay=1&loop=1&controls=0&showinfo=0&autohide=1\" " allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" frameborder="0" )
        p(style={transform: "translateY(-50px)", fontSize: "48px", letterSpacing: "18px"}) 為自然請命
        p(style={fontSize: "20px"}) 屬於。土地的故事
        //環境 x 資訊 x 文學
        div.btns
          nuxt-link.btn(to="/home")
            p 進入網站
</template>

<script>
    import Logo from '~/components/Logo.vue'

    export default {
        components: {
            Logo
        }
    }
</script>

<style lang="sass">
  @mixin btn($fontColor:#eee,$borderColor:#222)
    $color: $fontColor
    color: $color
    border: 3px solid $color
    padding: 10px 25px
    border-radius: 5px
    text-decoration: none

    a
      text-decoration: none
    p
      text-align: center
      color: $color
      text-shadow: 2px 2px 2px #222
      font-size: 16px
      letter-spacing: 5px
    &:hover
      transition: .6s
      transform: translate(3px)
      background: $borderColor
      border-color: $borderColor



  .homeBanner
      width: 100vw
      max-height: 90vh
      position: relative
      display: flex
      flex-wrap: wrap
      align-items: flex-start
      justify-content: center
      .vid
        position: relative
        display: flex
        justify-content: center
        align-items: center
        >iframe
          ///*position: absolute*/
          width: 100vw
          height: 100vh
          z-index: -99
        >p
          font-family: Taipei Sans TC Beta Bold
          letter-spacing: 8px
          position: absolute
          color: #eee
          font-size: 38px
          text-shadow: 4px 4px 4px #222
      .btns
          display: flex
          flex-direction: row
          position: absolute
          margin-top: 5em
          >.btn
            +btn
            margin: 13px

</style>
