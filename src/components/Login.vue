<template>
  <div class="login-container">
    <div class="login-cover"></div>
    <div class="login-box">
      <div class="login-avatar">
        <img :src="avatar" alt="头像">
      </div>
      <el-form label-width="0px" class="login-form" :model="loginForm" :rules="loginRules" ref="loginRef">
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-lock" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" prefix-icon="iconfont icon-user" v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-form-item class="login-btn">
          <el-button type="primary" @click="login">Sign in</el-button>
          <el-button type="info" @click="reset">Sign up</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: "login",
    data() {
      return {
        // 头像
        avatar: 'https://cdn.jsdelivr.net/gh/coolinovo/cdn@1.3/img/social/avatar.JPG',
        // 登录表单的数据对象
        loginForm: {
          username: 'admin',
          password: '123456'
        },
        // 登录表单的验证规则
        loginRules: {
          username: [
            {required: true, message: '请输入你的用户名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入你的密码', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      reset() {
        // 拿到引用的实例对象
        // console.log(this.$refs)
        this.$refs.loginRef.resetFields()
      },
      login() {
        this.$refs.loginRef.validate(async valid => {
          // valid 是表单预验证的结果（布尔值）
          if (!valid) return
          // 发送请求
          // 把 data 解构出来重命名为 res
          const {data:res} = await this.$http.post('login', this.loginForm)
          if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
          this.$msg.success(res.meta.msg)
          window.sessionStorage.setItem('token', res.data.token)
          // 编程式导航
          this.$router.push('/home')
        })
      }
    }
  }
</script>

<style lang="less" scoped>
.login-container {
  background-color: #66b1ffb3;
  height: 100%;

  .login-cover {
    width: 100%;
    position: relative;
  }

  .login-box {
    width: 450px;
    height: 300px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -100%);
    background-color: #ffffff;
    border-radius: 6px;
    box-shadow: 0 10px 35px rgba(0,0,0,.2);

    .login-avatar {
      width: 100px;
      height: 100px;
      position: fixed;
      left: 50%;
      transform: translate(-50%, -50%);
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0px 25px rgba(0,0,0,.2);
      background-color: #fff;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .login-form {
      position: absolute;
      bottom: 20px;
      width: 100%;
      padding: 0 60px;
      box-sizing: border-box;

      .login-btn {
        display: flex;
        justify-content: flex-end;

        button {
          width: 90px;
        }
      }
    }
  }
}
</style>