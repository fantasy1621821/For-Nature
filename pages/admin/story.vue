<template lang="pug">
  div.admin
    admin-menu(nowMenu=3)
    .content
      Button(style={marginBottom:"10px"} to="/admin/addStory") 新增故事
      Table(:loading="loading" :columns="columns" :data="dataStory" height=670)
        template(slot-scope="{ row, index }" slot="action")
          ButtonGroup
            Button(type="primary" @click="editStory(row)") 故事編輯
            Button(type="error" @click="delStory(row)") 刪除
</template>

<script>
    import adminMenu from '@/components/admin/menu'
    export default {
        name: "index",
        middleware:'auth',
        components: {
            adminMenu,
        },
        data(){
          return{
              loading:true,
              columns:[
                  {
                      title: '作家姓名',
                      key: 'name'
                  },
                  {
                      title: '故事名稱',
                      key: 'title'
                  },
                  {
                      title: '動作',
                      slot: 'action',
                      align: 'center'
                  }
              ],
              dataStory:[]
          }
        },
        methods:{
            editStory(item){
                let vm = this;
                vm.$router.push('/admin/editStory/'+item.title)
            },
            delStory(item){
                let vm = this;
                let axios = require('axios').default;
                axios.post('/api/delStoryData',{name:item.name,title:item.title})
                    .then(function (response) {
                        if (response.data.Items[0])
                            vm.$Message.success(response.data.Items[1])
                        else
                            vm.$Message.error(response.data.Items[1])
                    }).then(function () {
                    setTimeout(function () {
                        vm.$router.push('/admin/story')
                    },1000)
                })

            }
        },
        mounted() {
            let vm = this;
            let axios = require('axios').default
            axios.get('/api/getAllStory')
                .then(function (response) {
                    // vm.dataStory=response.data;
                    response.data.map(function (item) {
                        vm.dataStory.push(item)
                    })
                })
                .then(function () {
                    vm.loading=false
                })
        }
    }
</script>

<style scoped lang="sass">
  .content
    margin: 3em

</style>
