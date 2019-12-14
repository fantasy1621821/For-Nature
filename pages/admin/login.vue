<template lang="pug">
  .adminLogin
    .content
      h1 為自然請命後台登入
      Form.form(ref="formValidate"  :model="formValidate" :rules="ruleValidate")
        p(style={color: "red", fontSize: "20px"}) {{status}}
        FormItem(label="電子信箱 E-mail" prop="mail")
          Input(placeholder="請輸入信箱" type="email" size="large" prop="mail" v-model="formValidate.mail")
            Icon(type="ios-person-outline" slot="prepend")
        FormItem(label="密碼 Password" prop="password")
          Input( placeholder="請輸入密碼" type="password"  size="large" v-model="formValidate.password" @keyup.enter.native="login()")
            Icon(type="ios-lock-outline" slot="prepend")
        FormItem
          Button(type="primary" :loading="loading" style={float: "right"} @click="login()") 登入
          Button(type="text" style={float: "right"} @click="handleReset()") 重設
</template>

<script>
    export default {
        name: "login",
        middleware:'isLogin',
        data: function () {
            return {
                loading: false,
                status: "",
                formValidate: {
                    mail: "",
                    password: ""
                },
                ruleValidate: {
                    mail: [
                        {required: true, message: '信箱不得為空', trigger: 'blur'},
                        {type: 'email', message: '不正確的信箱格式', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '密碼不得為空', trigger: 'blur'},
                    ]
                }
            }
        },
        methods: {
            async login() {
                let vm = this;
                vm.loading = true;
                try {
                    if (await vm.$store.dispatch(
                        'login', {
                            mail: vm.formValidate.mail,
                            password: vm.formValidate.password,
                        }) === 1) {
                        this.$Message.success('登入成功！');
                        vm.loading = false;
                        await setTimeout(function () {
                            vm.$router.push('/admin')
                        }, 1000)
                    } else {
                        vm.loading = false;
                        this.$Message.error('帳號/密碼有誤，請確認後重新輸入！!');
                    }
                    vm.formValidate.mail = '';
                    vm.formValidate.password = '';
                } catch (e) {

                }
            },
            handleReset() {
                this.$refs['formValidate'].resetFields();
            }
        }

    }
</script>

<style scoped lang="sass">
  *
    box-sizing: border-box

    .content
      height: 100vh
      width: 100vw
      display: flex
      justify-content: center
      align-items: center
      flex-direction: column

    .form
      border: 2px solid #bbb
      padding: 35px 45px 5px 45px
      border-radius: 15px
      width: 350px
      margin-top: 26px
</style>
