<template>
  <div class="ratings" id="ratings">
    <Scroll :height="ratingsHeight">
      <div class="ratings-content">
        <div class="overview">
          <div class="overview-left">
            <h1 class="score">{{seller.score}}</h1>
            <div class="title">综合评分</div>
            <div class="rank">高于周边商家{{seller.rankRate}}</div>
          </div>
          <div class="overview-right">
            <div class="score-wrapper">
              <span class="title">服务态度</span>
              <star :size="36" :score="seller.serviceScore"></star>
              <span class="score">{{seller.serviceScore}}</span>
            </div>
            <div class="score-wrapper">
              <span class="title">商品评分</span>
              <star :size="36" :score="seller.foodScore"></star>
              <span class="score">{{seller.foodScore}}</span>
            </div>
            <div class="delivery-wrapper">
              <span class="title">送达时间</span>
              <span class="delivery">{{seller.deliveryTime}}分钟   </span>
            </div>
          </div>
        </div>
        <split></split>
        <ratingselect :select-type="selectType" :desc="desc" :only-content="onlyContent"  :ratings="ratings"></ratingselect>
        <div class="rating-wrapper">
          <ul>
            <li v-for="rating in ratings" class="rating-item" v-show="needShow(rating.rateType,rating.text)">
              <div class="avatar">
                <img width="28" height="28" :src="rating.avatar" alt="头像">
              </div>
              <div class="content">
                <h1 class="name">{{rating.username}}</h1>
                <div class="star-wrapper">
                  <star :size="24" :score="rating.score"></star>
                  <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}</span>
                </div>
                <p class="text">{{rating.text}}</p>
                <div class="recommend" v-show="rating.recommend.length">
                  <span class="icon-thumb_up"></span>
                  <span class="item" v-for="item in rating.recommend">{{item}}</span>
                </div>
                <div class="time">
                  {{rating.rateTime | formatDate}}
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import star from '../star/star'
import ratingselect from '../ratingselect/ratingselect'
import split from '../split/split'
import { formatDate } from '../../common/js/date';

const ALL = 2;
export default {
  props: {
    seller:{
      type: Object
    }
  },
  data(){
    return {
      ratingsHeight: 0,
      ratings:[],
      showFlag: false,
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
    }
  },
  created() {
    this.$http.get("static/data.json").then(res => {
      // console.log("res=", res.body);
      res = res.body;
      this.ratings = res.ratings;
      // console.log(res);
      this.$nextTick(() => {
        this.ratingsHeight = document.getElementById("ratings").clientHeight;
        this.$root.eventHub.$on('on-selectType-change',(val)=>{
          this.selectType=val;//④外层调用组件方注册变更方法，将组件内的数据变更，同步到组件外的数据状态中
        }),
        this.$root.eventHub.$on('on-onlyContent-change',(val)=>{
          this.onlyContent=val;//④外层调用组件方注册变更方法，将组件内的数据变更，同步到组件外的数据状态中
        })
      })
    });
  },
  components: {
    star,
    split,
    ratingselect
  },
  filters: {
    formatDate(time){
      let date = new Date(time);
      return formatDate(date,'yyyy-MM-dd hh:mm');
    }
  },
  methods: {
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
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import  "../../common/stylus/mixin.styl"
  .ratings
    position absolute
    top 174px
    bottom 0
    left 0
    width 100%
    overflow hidden
    .overview
      display flex
      padding 18px 0
      .overview-left
        flex 0 0 137px;
        padding 6px 0
        width 137px
        text-align center
        border-right 1px solid rgba(7,17,27,0.1)
        @media only screen and (max-width 320px){// 当且仅当屏幕宽为320px时生效
          flex 0 0 120px
          width 120px
        }
        .score
          margin-bottom 6px
          line-height 28px
          font-size 24px
          color rgb(255,153,0)
        .title
          margin-bottom 8px
          line-height 12px
          font-size 12px
          color rgb(7,17,27)
        .rank
        padding-bottom 6px
          line-height 10px
          font-size 10px
          color rgb(147,153,159)
      .overview-right
        flex 1
        padding 6px 0 6px 24px// 上 右 下 左
        @media only screen and (max-width 320px){// 当且仅当屏幕宽为320px时生效
          padding-left 6px
        }
        .score-wrapper
          line-height 18px
          margin-bottom 8px
          font-size 0
          .title
            display inline-block
            line-height 18px
            vertical-align top
            font-size 12px
            color rgb(7,17,27)
          .star
            display inline-block
            margin 0 12px
            vertical-align top
          .score
            display inline-block
            line-height 18px
            vertical-align top
            font-size 12px
            color rgb(255,153,0)
        .delivery-wrapper
          font-size 0
          .title
            line-height 18px
            font-size 12px
            color rgb(7,17,27)
          .delivery
            margin-left 12px
            font-size 12px
            color rgb(147,153,159)
    .rating-wrapper
      padding 0 18px
      .rating-item
        display flex
        padding 18px 0
        border-1px(rgba(7,17,27,0.1))
        .avatar
          flex 0 0 28px
          width 28px
          margin-right 12px
          img
            border-radius 50%
        .content
          display inline-block
          position relative
          flex 1
          .name
            margin-bottom 4px
            line-height 12px
            font-size 10px
            color rgb(7,17,27)
          .star-wrapper
            margin-bottom 16px
            font-size 0
            .star
              display inline-block
              margin-right 6px
              vertical-align top
            .delivery
              display inline-block
              vertical-align top
              color rgb(17,153,159)
          .text
            line-height 18px
            font-size 12px
            margin-bottom 18px
            color rgb(7,17,27)
          .recommend
            line-height 16px
            font-size 0
            .icon-thumb_up, .item 
              display inline-block
              margin 0 8px 4px 0
              font-size 9px
            .icon-thumb_up
              color rgb(0,160,220)
            .item
              padding 0 6px
              border 1px solid rgba(7,17,27,0.1)
              border-radius 1px
              color rgb(147,153,159)
              background #ffffff
          .time
            position absolute
            top 0
            right 0
</style>
