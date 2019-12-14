<template lang="pug">
  .gis
    GIS(:params="author")

</template>

<script>
  import GIS from '~/components/gis'
    export default {
        name: "authorId",
        data(){
          return{
          }
        },
        computed:{
            author(){
                let vm = this;
                return vm.$route.params.authorId
            }
        },
        components:{
          GIS
        },
        methods:{
        },
        mounted() {
            let vm = this;
            this.$Spin.show({
                render: (h) => {
                    return h('div', [
                        h('Icon', {
                            'class': 'loading-icon',
                            props: {
                                type: 'ios-loading',
                                size: 18
                            }
                        }),
                        h('div', '資料加載中...')
                    ])
                }
            });
            setTimeout(() => {
                this.$Spin.hide();
            }, 3000);
        }
    }
</script>

<style scoped lang="sass">
  html, body
    width: 100vw
    height: 100vh
    margin: 0
    padding: 0
  .loading-icon
    animation: ani-demo-spin 1s linear infinite
</style>
