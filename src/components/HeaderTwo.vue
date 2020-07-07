<template>
  <div class="nav flex">
    <div class="nav-weather">
      <div class="left margin-r-10"><img src="../imgs/logo-min.png" alt=""></div>
      <div class="left">{{schoolText}}</div>
    </div>
    <div class="nav-list flex flex-c">
      <div class="myleft flex">
        <router-link to="/index/gis" :class="{active:shows==='gis'}" @click.native="today_a('gis')">GIS监测</router-link>
        <router-link to="/dataAnalysis/waterAnalysis" :class="{active:(shows==='waterAnalysis'||shows==='waterPressure')}" @click.native="today_a('waterPressure')">数据分析</router-link>
      </div>
      <div class="myright flex">
        <router-link to="/index/warranty" :class="{active:shows==='warranty'}" @click.native="today_a('warranty')">报修管理</router-link>
        <router-link to="">平台管理</router-link>
      </div>
    </div>
    <div class="nav-time t-r">
      <span id="date">{{dater}}</span>
      <!--日期 -->
      <span id="time">{{timer}}</span>
      <!--时间 -->
      <router-link to="/login" class="sign">
        <img src="../imgs/off.png" alt class="m-r-5">
        <span class="margin-l-5">退出</span>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "header-two",
  data() {
    return {
      schoolText: "陕西职业技术学院",
      dater: "",
      timer: "",
      shows: ''
    };
  },
  mounted() {
    //处理默认选中
    let router = this.$route
    this.shows = router.name
    var _this = this;
    _this.time();
    setInterval(function() {
      _this.time();
    }, 60000);//每分钟刷新一次
  },
  methods: {
    today_a(namber){
        this.shows = namber;
    },
    //时间
    time() {
      var date = new Date();
      var h = date.getHours();
      var m = date.getMinutes();
      if (m < 10) {
        m = "0" + m;
      }
      this.timer = h + ":" + m;
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      var nowDate = year + "年" + month + "月" + day + "日";
      this.dater = nowDate;
    },
    sigOut() {
      this.$router.push("/login");
    }
  }
};
</script>

<style lang="scss" scoped>
.t-r {
  text-align: right !important;
}
.flex {
  display: -webkit-flex;
  display: flex;
  -webkit-align-items: center;
  align-items: center;
}
.flex-l {
  -webkit-justify-content: flex-start;
  justify-content: flex-start;
}
.flex-c {
  -webkit-justify-content: center;
  justify-content: center;
}
.flex-r {
  -webkit-justify-content: flex-end;
  justify-content: flex-end;
}
.flex-between {
  -webkit-justify-content: space-between;
  justify-content: space-between;
}
.flex-1 {
  flex: 1;
}
.nav {
  color: #9aafc9;
  background: #33465c;
  height: 58px;
  padding-left: 25px;
//   position: fixed;
font-size: 16px;
  right: 0;
  left: 0;
  z-index: 999;
}
.nav a {
  color: #9aafc9;
}
.nav .nav-weather,
.nav .nav-time {
  width: 280px;
  height: 58px;
  line-height: 58px;
}
.nav .nav-weather span {
  margin-left: 10px;
}
.nav .nav-time > span:first-child {
  margin-right: 0;
}
.nav .nav-time a.sign {
  padding-left: 20px;
  display: inline-block;
  height: 58px;
  line-height: 58px;
  margin-left: 10px;
  padding-left: 15px;
  padding-right: 20px;
  /* width: 80px; */
}
.nav .nav-time a.sign:hover {
  background: #24385e;
}
.nav .nav-time img {
  vertical-align: middle;
  margin-right: -5px;
}
.nav .nav-list {
  flex: 1;
  background: url("../imgs/title.png") no-repeat;
  background-size: contain;
  background-position: center -4px;
  height: 54px;
}
.nav .nav-list .myleft {
  margin-right: 20%;
}
.nav .nav-list .myright {
  margin-left: 15%;
}
.nav .nav-list a {
  display: inline-block;
  margin: 0 15px;
  padding: 0px 10px;
  height: 54px;
  line-height: 60px;
  /* border-bottom: 4px solid #2c465e; */
  color: #7f97bd;
  position: relative;
}
.nav .nav-list a:hover {
  color: #47acfe;
  text-shadow: 0px 0px 8px #47acfe, 0px 0px 42px #47acfe, 0px 0px 72px #47acfe,
    0px 0px 150px #47acfe;
  /* border-bottom: 3px solid #47acfe; */
}
.nav .nav-list a.active {
  color: #47acfe;
  text-shadow: 0px 0px 8px #47acfe, 0px 0px 42px #47acfe, 0px 0px 72px #47acfe,
    0px 0px 150px #47acfe;
}
.nav .nav-list a.active::after {
  content: "";
  width: 34px;
  border-bottom: 3px solid #47acfe;
  position: absolute;
  bottom: 0px;
  left: 19px;
}
</style>
