<template lang="pug">
  .introduce
    Card.card
      h3 為自然請命
      p 人們書寫自然，必然是在觀察中，嘗試以想像力解讀自然出發。早年在中西方的「關涉自然書寫」，多半與「想像」、「物活」有關。傳統的自然與生態書寫者及研究者往往只能透過文本中的片段圖文來描繪當地的景物，於讀者而言對整個文本中對空間的想像來架構整個文本的世界觀，因此想藉由開發一個由地圖為主架構的圖文系統來幫助讀者了解文本的脈絡以及作者的足跡。
      hr
      p 希望藉由本系統讓自然、生態書寫者及研究者得透過資訊的力量及便利性來構建各自的地圖故事，期望能促進人文研究發展並在未來得以累績足夠數據，進一步做數據分析，創造更多有價值的資源。
</template>

<script>
    export default {
        name: "introduce",
        components:{
        }
    }
</script>

<style scoped lang="sass">
  .introduce
    height: 100vh
    display: flex
    justify-content: center
    align-items: center
  .card
    h3
      font-size: 18px
      text-align: center
    hr
      margin: 18px 10px
    padding: 20px 35px
    width: 650px
    letter-spacing: 6px
    line-height : 2
</style>
