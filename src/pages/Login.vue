<template>
  <div class="login">
    <div class="login-form">
      <div>
        <img src="../imgs/logo.png" alt="logo">
      </div>
      <div>
        <div class="user">
          <input type="text" name="user" placeholder="请输入用户名" autocomplete="off" ref="userName">
          <i class="iconfont icon-touxiang"></i>
        </div>
        <div class="password">
          <input type="password" name="password" placeholder="请输入密码" ref="userPassword">
          <i class="iconfont icon-mima"></i>
          <i :class="[iconfont,eye?iconyanjing:iconyanjingcopy]" id="yanjing" @click="eyeShow"></i>
        </div>
        <div class="rememberPass">
          <span :class="{active:active}" @click="active=!active"></span>记住密码
        </div>
        <div class="submit">
          技术支持 环太物联
          <input
            type="submit"
            value="登录"
            class="right"
            id="login"
            @click="submit"
            @keyup.enter="submit"
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      iconfont: "iconfont",
      iconyanjing: "icon-yanjing",
      iconyanjingcopy: "icon-yanjing--copy",
      eye: true,
      active: true
    };
  },
  created() {},
  //页面加载调用获取cookie值
  mounted() {
    this.getCookie();
  },

  methods: {
    submit() {
      this.name = this.$refs.userName.value;
      this.password = this.$refs.userPassword.value;

      if (this.name == "" || this.password == "") {
        this.$message({
          showClose: true,
          message: "请输入用户名和密码",
          type: "warning"
        });
      } else {
        const self = this;
        //判断复选框是否被勾选 勾选则调用配置cookie方法
        if (self.active == true) {
          console.log("存入cookie");
          //传入账号名，密码，和保存天数3个参数
          self.setCookie(self.name, self.password, 7);
        } else {
          console.log("清空Cookie");
          //清空Cookie
          self.clearCookie();
        }
        //与后端请求代码，本功能不需要与后台交互所以省略
        console.log("登陆成功");
        this.$router.push("/index");
      }
    },
    eyeShow() {
      // console.log(this.$refs.userPassword.type)
      if (this.$refs.userPassword.type == "password") {
        this.$refs.userPassword.type = "text";
        this.eye = false;
      } else {
        this.$refs.userPassword.type = "password";
        this.eye = true;
      }
    },
    //设置cookie
    setCookie(c_name, c_pwd, exdays) {
      console.log(c_name, c_pwd, exdays);
      var exdate = new Date(); //获取时间
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
      //字符串拼接cookie
      window.document.cookie =
        "name" + "=" + c_name + ";path=/;expires=" + exdate.toGMTString();
      console.log(window.document.cookie);
      window.document.cookie =
        "password" + "=" + c_pwd + ";path=/;expires=" + exdate.toGMTString();
    },
    //读取cookie
    getCookie: function() {
      if (document.cookie.length > 0) {
        var arr = document.cookie.split("; "); //这里显示的格式需要切割一下自己可输出看下
        for (var i = 0; i < arr.length; i++) {
          var arr2 = arr[i].split("="); //再次切割
          //判断查找相对应的值
          if (arr2[0] == "name") {
            this.name = arr2[1]; //保存到保存数据的地方
          } else if (arr2[0] == "password") {
            this.password = arr2[1];
          }
        }
      }
    },
    //清除cookie
    clearCookie: function() {
      this.setCookie("", "", -1); //修改2值都为空，天数为负1天就好了
    }
  }
};
</script>
<style lang="scss" scoped>
.login{
  margin: 0;
  width: 100%;
  min-width: 1200px;
  height: 100%;
  overflow: hidden;
  background: url('../imgs/bg.jpg') no-repeat center #192936;
}
.login-form{
  width: 446px;
  float: right;
  margin-top: 27vh;
  margin-right: 15vw;
}
.user{
  margin-top: 60px;
  margin-bottom: 26px;
  width: 100%;
  height: 50px;
  position: relative;
}
.password{
  margin-bottom: 10px;
  width: 100%;
  height: 50px;
  position: relative;
}
.user input{
  width: 100%;
  height: 100%;
  border: 1px solid #3e4856;
  background: #172430;
  padding-left: 50px;
  font-size: 15px;
  color: #9EB2CA;
  border-radius: 5px;
  box-sizing: border-box;
}

.password input{
  width: 100%;
  height: 100%;
  border: 1px solid #3e4856;
  background: #172430;
  padding-left: 50px;
  padding-right: 50px;
  font-size: 15px;
  color: #9EB2CA;
  border-radius: 5px;
  box-sizing: border-box;
}
.user .icon-touxiang{
  position: absolute;
  top: 17px;
  left:20px;
  font-size: 15px;
  color: #889aa4;
  background: #172430;
}
.password .icon-mima{
  position: absolute;
  top: 17px;
  left:20px;
  font-size: 15px;
  color: #889aa4;
  background: #172430;
}
.password #yanjing{
  position: absolute;
  top: 17px;
  right:20px;
  font-size: 15px;
  color: #889aa4;
  background: #172430;
}
.rememberPass{
  color: #ffffff;
  font-size: 15px;
  height: 50px;
  line-height: 50px;
}
.rememberPass span{
  float: left;
  width: 20px;
  height: 20px;
  background: #232d3a;
  border: 1px solid #3e4856;
  margin-top: 14px;
  margin-right: 20px;
}
.rememberPass span.active{
  background: url('../imgs/yes.png') no-repeat center #232d3a;
}
.submit{
  color: #7491ad;
  font-size: 15px;
  height: 47px;
  line-height: 47px;
  margin-top: 20px;
}
.submit input{
  width: 192px;
  height: 47px;
  background: #4ca8ee;
  background-image: linear-gradient(160deg, #4ca8ee 0%,#00b3ff 100%);
  color: #ffffff;
  font-size: 20px;
  text-align: center;
  border-radius: 5px;
}
</style>

    
