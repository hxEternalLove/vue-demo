<template>
  <transition name="move">
    <div v-show="showFlag" class="food">
      <Scroll class="food-wrapper" :height="foodsHeight">
        <div class="food-content">
          <div class="image-header">
            <img :src="food.image" alt="食物图片">
            <div class="back" @click="hide">
              <i class="icon-arrow_lift"></i>
            </div>
          </div>
          <div class="content">
            <h1 class="title">{{food.name}}</h1>
            <div class="detail">
              <span class="sell-count">月售{{food.sellCount}}份</span>
              <span class="rating">好评率{{food.rating}}%</span>
            </div>
            <div class="price">
              <span class="now">￥{{food.price}}</span> <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
            </div>
            <div class="cartcontrol-wrapper">
              <cartcontrol :food="food"></cartcontrol>
            </div>
            <div @click.stop.prevent="addFirst()" class="buy" v-show="!food.count || food.count===0" :class="{'animated fadeOut':food.count > 0}">加入购物车</div>
          </div>
          <split v-show="food.info"></split>
          <div class="info" v-show="food.info">
            <h1 class="title">商品信息</h1>
            <p class="text">{{food.info}}</p>
          </div>
          <split></split>
          <div class="rating">
            <h1 class="title">商品评价</h1>
            <ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>

          </div>

          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item border-1px">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" width="12" height="12" :src="rating.avatar" alt="头像">
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div> 
      </Scroll>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import cartcontrol from '../cartcontrol/cartcontrol';
import split from '../split/split';
import ratingselect from '../ratingselect/ratingselect';
import Vue from 'vue';
import { formatDate } from '../../common/js/date';
const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;
export default {
  props: {
    food: {
      type: Object
    }
  },
  data() {
    return {
      showFlag: false,
      foodsHeight:0,
      selectType: ALL,
      onlyContent: false,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
    };
  },
  methods: {
    show() {
      this.showFlag = true;
      this.selectType = ALL;
      this.onlyContent = false;
    },
    hide() {
      this.showFlag = false;
    },
    addFirst() {
      Vue.set(this.food, 'count', 1)
    },
    needShow(type,text){
      if (this.onlyContent && !text) {
        return false
      }
      if (this.selectType == ALL) {
        return true
      } else {
        return type === this.selectType;
      }
    }
  },
  created() {
    this.$nextTick(() => {
      //DOM现在更新了
      // 获取当前屏幕的高度 并减去 48
      this.foodsHeight = document.documentElement.clientHeight-50//window.innerHeight//document.body.clientHeight
      // console.log("food",this.foodsHeight);

      // 接收通知
      /**
       * 
      this.$root.eventHub.$on('on-selectType-change',(val)=>{
        this.selectType=val;//④外层调用组件方注册变更方法，将组件内的数据变更，同步到组件外的数据状态中
      })
       */
    }),
    this.$root.eventHub.$on('on-selectType-change',(val)=>{
      this.selectType=val;//④外层调用组件方注册变更方法，将组件内的数据变更，同步到组件外的数据状态中
    }),
    this.$root.eventHub.$on('on-onlyContent-change',(val)=>{
      this.onlyContent=val;//④外层调用组件方注册变更方法，将组件内的数据变更，同步到组件外的数据状态中
    })
  },
  filters: {
    formatDate(time){
      let date = new Date(time);
      return formatDate(date,'yyyy-MM-dd hh:mm');
    }
  },
  components: {
    cartcontrol,
    split,
    ratingselect
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin.styl"

  .food
    position fixed
    left 0
    top 0
    bottom 48px
    z-index 30
    width 100%
    background #ffffff
    &.move-enter-active, &.move-leave-active
      transition all 0.2s linear 
      transform translate3d(0,0,0)
    &.move-enter, &.move-leave-to
      transform translate3d(100%,0,0)
    .food-wrapper
      margin-top -20px
    .image-header
      position relative
      width 100%
      height 0
      padding-top 100%
      img
        position absolute
        top 0
        left 0
        width 100%
        height 100%
      .back
        position absolute
        top 10px
        left 0
        .icon-arrow_lift
          display block
          padding 10px
          font-size 20px
          color #ffffff
    .content
      position relative
      padding 18px
      .title
        line-height 14px
        margin-bottom 8px
        font-size 14px
        font-weight 700
        color rgb(7,17,27)
      .detail
        margin-bottom 18px
        line-height 10px
        height 10px
        font-size 0
        .sell-count, .rating
          font-size 10px
          color rgb(147,153,159)
        .sell-count
          margin-right 12px
      .price
        font-weight: 700;
        line-height: 24px;
        .now
          margin-right: 8px;
          font-size: 14px;
          color: rgb(240, 20, 20);
        .old
          text-decoration: line-through;
          font-size: 10px;
          color: rgb(147, 153, 159);
      .cartcontrol-wrapper
        position absolute
        right 12px
        // top 64px
        bottom 12px
      .buy
        position absolute
        right 18px
        // top 70px
        bottom 18px
        z-index 10
        height 24px
        line-height 24px
        padding 0 12px
        box-sizing border-box
        font-size 10px
        border-radius 12px
        color #ffffff
        background rgb(0,160,220)
    .info
      padding 18px
      .title
        line-height 14px
        margin-bottom 6px
        font-size 14px
        color rgb(7,17,27)
      .text
        line-height 24px
        padding 0 8px 
        font-size 12px
        color rgb(77,85,93)
    .rating
      padding-top 18px
      .title
        margin-left 18px
        line-height 14px
        margin-bottom 6px
        font-size 14px
        color rgb(7,17,27)
    .rating-wrapper
      padding 0 18px
      .rating-item
        position relative
        padding 16px 0
        border-1px(rgba(7,17,27,0.1))
        .user
          position absolute
          right 0
          top 16px
          line-height 12px
          font-size 0
          .name
            display inline-block
            vertical-align top
            font-size 10px
            margin-right 6px
            color rgb(147,153,159)
          .avatar
            border-radius 50%
        .time
          margin-bottom 6px
          line-height 12px
          font-size 10px
          color rgb(147,153,159)
        .text
          line-height 16px
          font-size 12px
          color rgb(7,17,27)
          .icon-thumb_up, .icon-thumb_down
            margin-right 4px
            line-height 16px
            font-size 12px
          .icon-thumb_up
            color rgb(0,160,220)
          .icon-thumb_down
            color rgb(147,153,159)
      .no-rating
        padding 16px 0
        font-size 12px
        color rgb(147,153,159)
/*
选中代码，按下Tab（右移）
选中代码，按下Tab＋shift（左移）
*/
</style>
