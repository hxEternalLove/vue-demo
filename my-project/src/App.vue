<template>
  <div id="app">
    <v-header :seller="seller"></v-header>

    <div class="tab border-1px">
      <div class="tab-item" >
        <router-link class="router-item" to="/goods">商品</router-link>
      </div>
      <div class="tab-item" >
        <router-link class="router-item" to="/ratings">评论</router-link>
      </div>
      <div class="tab-item" >
        <router-link class="router-item" to="/seller">商家</router-link>
      </div>
    </div>
    <router-view :seller="seller"></router-view>
  </div>
</template>

<script type="text/ecmascript-6">

// import header from "./components/header/header.1.vue";// transition 动画
import header from "./components/header/header.vue";// animated 动画
export default {
  name: 'App',
  data() {
    return {
      seller: {}
    };
  },
  created() {
    this.$http
      .get("static/data.json")
      .then(res => {
        console.log("res=", res.body);
        res = res.body;
        this.seller = res.seller;
        // this.$router.push({path:"/goods", query: this.seller})// 路由传值
      })
  },
  methods: {
  },
  components: {
    "v-header": header
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import './common/stylus/mixin.styl';
// #app {
//   font-family: 'Avenir', Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   color: #2c3e50;
//   margin-top: 60px;
// }
#app {
  .tab {
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;
    background-color #ae2
    border-1px(rgba(7, 17, 27, 0.1));

    .tab-item {
      flex: 1;
      text-align: center;

      // border: 1px solid rgba(0,23,234,1)
      // color: rgba(2, 123, 1, 1)
      .router-item {
        display: block;
        text-decoration: none;
        font-size: 14px;
        color: rgb(77, 85, 93);
        &.active {
          color: rgb(240, 20, 20);
        }
      }
    }
  }
}
</style>
