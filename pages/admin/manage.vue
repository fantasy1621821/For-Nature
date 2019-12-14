<template lang="pug">
  div.admin
    admin-menu(nowMenu=2)
    div.content
      Button(to="/admin/addAuthor" style={marginBottom:"10px"}) 新增作家資料
      Modal(v-model="profileModal.isActive" fullscreen :title="profileModal.data.name+' 資料更改'" ok-text="確認更改" cancel-text="取消" @on-ok="profileUpdate")
        div
          Split(v-model="split")
            div(slot="left" class="demo-split-pane")
              img(:src="profileModal.data.imgSRC" width=300)
              br
              Input(v-model="profileModal.data.imgSRC")
              h2 作家: {{profileModal.data.name}}
              h2 性別: {{profileModal.data.sex}}
              h2 生日: {{profileModal.data.birthday.year +"-"+profileModal.data.birthday.month +"-"+profileModal.data.birthday.day}}
              h2 居住地: {{ profileModal.data.locate.country + profileModal.data.locate.city + profileModal.data.locate.district}}

            div(slot="right" class="demo-split-pane")
              div.content
                Form(:model="profileModal.data" label-position="left" :label-width="80" )
                  FormItem(label="作家：")
                    Input(v-model="profileModal.data.name" placeholder="作家姓名")
                  FormItem(label="生理性別：")
                    RadioGroup(v-model="profileModal.data.sex")
                      Radio(label="男")
                      Radio(label="女")
                  FormItem(label="生日：")
                    Input(v-model="profileModal.data.birthday.year" placeholder="西元年" type="number")
                      span( slot="prepend") 西元年
                    Input(v-model="profileModal.data.birthday.month" placeholder="月" type="number")
                      span( slot="prepend") －－月
                    Input(v-model="profileModal.data.birthday.day" placeholder="日" type="number")
                      span( slot="prepend") －－日
                  FormItem(label="居住地：")
                    Input(v-model="profileModal.data.locate.country" placeholder="國家")
                      span( slot="prepend") 國家
                    Input(v-model="profileModal.data.locate.city" placeholder="縣市")
                      span( slot="prepend") 縣市
                    Input(v-model="profileModal.data.locate.district" placeholder="鄉鎮")
                      span( slot="prepend") 鄉鎮
                  FormItem(label="標籤：")
                    span(v-for="(tag,index) in profileModal.data.tag")
                      Tag(type="dot" closable=true color="primary" checkable=true @on-change="changeTag(tag,name,index)" @on-close="removeTag(event,name,index)") {{tag}}
                    Button(icon="ios-add" type="dashed" size="small" @click="tagAdd") 新增標籤
                  FormItem(label="描述：")
                    .quill-editor(:content="profileModal.data.description"
                      @change="onEditorChange($event)"
                      @blur="onEditorBlur($event)"
                      @focus="onEditorFocus($event)"
                      @ready="onEditorReady($event)"
                      v-quill:myQuillEditor="editorOption")


      Table(:loading="loading" :columns="columns" :data="data" height=670)
        template(slot-scope="{ row }" slot="name")
          strong {{ row.name }}
        template(slot-scope="{ row }" slot="birthday")
          span {{ row.birthday.year +"-"+row.birthday.month +"-"+row.birthday.day }}
        template(slot-scope="{ row, index }" slot="action")
          ButtonGroup
            Button(type="primary" @click="editProfile(index)") 個人資料編輯
            Button(type="error" @click="delProfile(index)") 刪除
        template(slot-scope="{ row }" slot="city")
          span {{row.locate.city}}
        template(slot-scope="{ row }" slot="district")
          span {{row.locate.district}}

</template>

<script>
    import editor from "~/components/editor";
    import adminMenu from '@/components/admin/menu'
    export default {
        name: "manage",
        middleware: 'auth',
        data: function () {
            return {
                split: 0.3,
                profileModal: {
                    isActive: false,
                    data: {
                        birthday: {
                            year: 0,
                            month: 0,
                            day: 0
                        },
                        locate: {},
                        tag: []
                    }
                },
                storyModal: {
                    isActive: false,
                    name: "",
                    data: [],

                },
                data: [],
                loading: true,
                columns: [
                    {
                        title: '姓名',
                        key: 'name',
                        slot: "name"
                    },
                    {
                        title: '性別',
                        key: 'sex'
                    },
                    {
                        title: '生日',
                        key: 'birthday',
                        slot: "birthday"
                    },
                    {
                        title: '出生地',
                        key: 'locate',
                        children: [
                            {
                                title: "縣市",
                                key: "city",
                                slot: "city"
                            },
                            {
                                title: "鄉鎮",
                                key: "district",
                                slot: "district"
                            }
                        ]
                    },
                    {
                        title: '動作',
                        slot: 'action',
                        width: 450,
                        align: 'center'
                    }
                ],
                editorOption: {
                    // some quill options
                    modules: {
                        toolbar: [
                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ 'color': [] }, { 'background': [] }],
                            [{'align': []}],
                            [{'list': 'ordered'}, {'list': 'bullet'}],
                            ['blockquote'],
                            ['clean']
                        ]
                    },
                    placeholder: '請輸入內容...',
                }
            }
        },
        components: {
            adminMenu, editor
        },

        methods: {
            onEditorBlur(editor) {
                // console.log('editor blur!', editor)
            },
            onEditorFocus(editor) {
                // console.log('editor focus!', editor)
            },
            onEditorReady(editor) {
                // console.log('editor ready!', editor)
            },
            onEditorChange({editor, html, text}) {
                // console.log('editor change!', editor, html, text)
                this.profileModal.data.description = html
            },
            profileUpdate() {
                let vm = this;
                vm.$Spin.show();
                let axios = require('axios').default;
                axios.post('/api/updateProfileData', vm.profileModal.data)
                    .then(function (response) {
                        if(response.data[0])
                          vm.$Message.success(response.data[1])
                        else
                            vm.$Message.error(response.data[1])
                    }).then(function () {
                    vm.$Spin.hide();
                })
            },
            editProfile: function (index) {
                let vm = this;
                let data = vm.data[index];
                vm.profileModal.isActive = true;
                vm.profileModal.data = data;
            },
            delProfile:function(index){
                let vm = this;
                let name = vm.data[index].name;
                vm.$Spin.show();
                let axios = require('axios').default;
                axios.post('/api/delProfileData',{
                    name:name
                })
                    .then(function (response) {
                        if (response.data[0]){
                            vm.$Message.success(response.data[1] );
                        }
                        else{
                            vm.$Message.error(response.data[1]);
                        }
                        return response.data[0]
                    })
                    .then(function (status) {
                        vm.$Spin.hide();
                        if(status){
                            vm.loading = true;
                            let axios = require('axios').default;
                            axios.get('/api/getAllAuthor')
                                .then(response => {
                                    vm.data = response.data.Items;
                                })
                                .then(() => {
                                    vm.loading = false;
                                })
                          }
                      })
            },
            changeTag: function (checked, name, index) {
                let vm = this;
                let data = "";
                this.$Modal.confirm({
                    onOk: function () {
                        vm.$set(vm.profileModal.data.tag, index, data);
                    },
                    okText: "確認修改",
                    cancelText: "取消",
                    render: (h) => {
                        return h('Input', {
                            props: {
                                value: this.value,
                                autofocus: true,
                                placeholder: '請輸入標籤名稱'
                            },
                            on: {
                                input: (val) => {
                                    data = val;
                                }
                            }
                        })
                    }
                });

            },
            removeTag: function (event, name, index) {
                let vm = this;
                vm.profileModal.data.tag.splice(index, 1);
            },
            tagAdd: function () {
                let vm = this;
                vm.profileModal.data.tag.push("標籤")

            }

        },
        mounted() {
            let vm = this;
            let axios = require('axios').default;
            axios.get('/api/getAllAuthor')
                .then(response => {
                    vm.data = response.data.Items;
                })
                .then(() => {
                    vm.loading = false;
                })
        }
    }
</script>

<style scoped lang="sass">
  .content
    margin: 3em


</style>
