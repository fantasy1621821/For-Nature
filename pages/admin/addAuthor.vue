<template lang="pug">
  div
    admin-menu(nowMenu=2)
    div.wrap
      div.content
        img(:src="profileData.imgSRC" style={width: "250px", marginBottom: "10px"})
        Form(:model="profileData" label-position="left" :label-width="80" )
          FormItem(label="作家：")
            Input(v-model="profileData.name" placeholder="作家姓名")
          FormItem(label="作家圖片：")
            Input(v-model="profileData.imgSRC" placeholder="作家圖片")
          FormItem(label="生理性別：")
            RadioGroup(v-model="profileData.sex")
              Radio(label="男")
              Radio(label="女")
          FormItem(label="生日：")
            Input(v-model="profileData.birthday.year" placeholder="西元年" type="number")
              span( slot="prepend") 西元年
            Input(v-model="profileData.birthday.month" placeholder="月" type="number")
              span( slot="prepend") －－月
            Input(v-model="profileData.birthday.day" placeholder="日" type="number")
              span( slot="prepend") －－日
          FormItem(label="居住地：")
            Input(v-model="profileData.locate.country" placeholder="國家")
              span( slot="prepend") 國家
            Input(v-model="profileData.locate.city" placeholder="縣市")
              span( slot="prepend") 縣市
            Input(v-model="profileData.locate.district" placeholder="鄉鎮")
              span( slot="prepend") 鄉鎮
          FormItem(label="標籤：")
            span(v-for="(tag,index) in profileData.tag")
              Tag(type="dot" closable=true color="primary" checkable=true @on-change="changeTag(tag,name,index)" @on-close="removeTag(event,name,index)") {{tag}}
            Button(icon="ios-add" type="dashed" size="small" @click="tagAdd") 新增標籤
          FormItem(label="描述：")
            .quill-editor(:content="profileData.description"
              @change="onEditorChange($event)"
              @blur="onEditorBlur($event)"
              @focus="onEditorFocus($event)"
              @ready="onEditorReady($event)"
              v-quill:myQuillEditor="editorOption")
      .toolbar
        ButtonGroup(vertical)
          Tooltip(content="儲存" placement="top-end")
            Poptip(placement="right" width="200")
              Button(icon="md-send" size="large" type="success" )
              div.check(slot="content")
                h3 確定要送出嗎？
                Button(type="success" style={marginTop: "10px"} @click="profileUpload") 確定

</template>

<script>
    import adminMenu from '@/components/admin/menu'

    export default {
        name: "addAuthor",
        middleware: 'auth',
        components: {
            adminMenu
        },
        data: function () {
            return {
                profileData: {
                    "birthday": {
                        "day": 1,
                        "month": 1,
                        "year": 1900
                    },
                    "description": "",
                    "imgSRC": "",
                    "locate": {
                        "city": "",
                        "country": "",
                        "district": ""
                    },
                    "name": "",
                    "sex": "",
                    "story": [],
                    "tag": []
                },
                editorOption: {
                    // some quill options
                    modules: {
                        toolbar: [
                            [{'header': [1, 2, 3, 4, 5, 6, false]}],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{'color': []}, {'background': []}],
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
                this.profileData.description = html
            },
            profileUpload() {
                let vm = this;
                vm.$Spin.show();
                let axios = require('axios').default;
                axios.post('/api/uploadProfileData', vm.profileData)
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
                                vm.$router.push('/admin/manage')
                            },1500)

                    })
            },
            changeTag: function (checked, name, index) {
                let vm = this;
                let data = "";
                this.$Modal.confirm({
                    onOk: function () {
                        vm.$set(vm.profileData.tag, index, data);
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
                vm.profileData.tag.splice(index, 1);
            },
            tagAdd: function () {
                let vm = this;
                vm.profileData.tag.push("標籤")

            }
        }
    }
</script>

<style scoped lang="sass">
  .check
    letter-spacing: 2px
    line-height: 2
  .toolbar
    box-shadow: 2px 2px 5px #666
    z-index: 999
    position: fixed
    right: 80px
    top: 10vh
    border-radius: 6px
  .wrap
    padding: 20px 20px

</style>
