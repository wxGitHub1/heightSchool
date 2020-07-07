<template>
  <div class="app-container">
    <header-two></header-two>
    <div class="clearfix content" ref="content"> 
        <!-- 室外 -->
        <!-- <amap/> -->
        <router-view></router-view>
    </div>
  </div>
</template>

<script>
import HeaderTwo from "@/components/HeaderTwo";
// import Amap from "@/components/Amap";

export default {
  components: {
    "header-two": HeaderTwo,
    // "amap": Amap,
  },
  
  data() {
    return { 

    };
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
.app-container {
  height: 100%;
  width: 100%;
}
</style>