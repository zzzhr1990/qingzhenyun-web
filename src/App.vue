<template>
  <div id="app">
    <transition
      name="bounce"
      enter-active-class="bounceInLeft"
      leave-active-class="bounceOutRight"
    >
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

/* eslint-disable */
<style>
.loginbox {
  position: absolute;
  width: 345px;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  height: 220px;
  margin: auto;
}

.icon {
  display: inline-block;
  background-repeat: no-repeat;
}

.icon.account {
  width: 18px;
  height: 19px;
  background-image: url(./assets/login/account.png);
}

.icon.email {
  width: 18px;
  height: 14px;
  background-image: url(./assets/login/e-mail.png);
}

.icon.phone {
  width: 14px;
  height: 20px;
  background-image: url(./assets/login/phone.png);
}

.icon.nickname {
  width: 20px;
  height: 18px;
  background-image: url(./assets/login/nickname.png);
}

.icon.password {
  width: 18px;
  height: 18px;
  background-image: url(./assets/login/password.png);
}
.loginbox .el-input-group {
  box-sizing: border-box;
  border: 1px solid #53D9A4;
  border-radius: 22px;
  overflow: hidden;
  margin-bottom: 20px;
}

.loginbox .el-input__inner {
  border: 0;
  box-sizing: border-box;
}

.loginbox .el-input__inner::-webkit-input-placeholder {
 color: #53D9A4;
}

.loginbox .el-input__inner::-moz-input-placeholder {
 color: #53D9A4;
}

.loginbox .el-input__inner::-ms-input-placeholder {
 color: #53D9A4;
}

.loginbox .el-input-group__prepend {
  border: 0;
  width: 60px;
  box-sizing: border-box;
}
</style>

<style>
html,
body,
#app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background: #f9f9f9;
  font-size: 14px;
}
#app {
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

ul {
  margin: 0;
  padding: 0;
}

ul li {
  list-style: none;
}
</style>
