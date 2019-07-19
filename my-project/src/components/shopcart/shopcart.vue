<template>
  <div>
    <div class="shopcart">
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight': totalCount > 0}">
              <i class="icon-shopping_cart" :class="{'highlight': totalCount > 0}"></i>
            </div>
            <div class="num" v-show="totalCount>0">{{totalCount}}</div>
          </div>
          <div class="price" :class="{'highlight': totalCount > 0}">￥{{totalPrice}}元</div>
          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right" @click.stop.prevent="pay">
          <!-- @click.stop.prevent 阻止冒泡点击事件 -->
          <div class="pay" :class="payClass">{{payDesc}}</div>
        </div>
      </div>
      <div class="ball-container">
        <transition-group name="drop"
            v-on:before-enter="beforeEnter"
            v-on:enter="enter"
            @after-enter="afterEnter">
          <div v-for="(ball,index) in balls" :key="index+'key'" v-show="ball.show" class="ball">
            <div class="inner inner-hook"></div>
          </div>
        </transition-group>
      </div>
      <transition name="fold"
        enter-active-class="animated slideInUp">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content">
            <Scroll  ref="foodsWrapper" :height="foodsHeight">
              <ul>
                <li class="food" v-for="food in selectFoods">
                  <span class="name">{{food.name}}</span>
                  <div class="price">
                    <span>￥{{food.price*food.count}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol :food="food"></cartcontrol>
                  </div>
                </li>
              </ul>
            </Scroll>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" @click="hideList" v-show="listShow"></div>
    </transition>
  </div>
</template> 

<script type="text/ecmascript-6">
 
import cartcontrol from '../cartcontrol/cartcontrol'
export default {
  props: {
    selectFoods: {
      type: Array,
      default() {
        return [
          {
            price:10,
            count:1
          }
        ];
      }
    },
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice:{
      type: Number,
      default: 0
    }
  },
  data(){
    return{
      balls:[
        {
          show:false
        },
        {
          show:false
        },
        {
          show:false
        },
        {
          show:false
        },
        {
          show:false
        }
      ],
      dropBalls: [],
      fold: true
    }
  },
  computed: {
    foodsHeight() {
      let count = 0;
      let foodName = "";
      this.selectFoods.forEach((food)=>{
        if (foodName !== food.name) {
          count++;
        }
      })
      if (48*count+18 > 200) {
        return 200
      }
      return 48*count+18;
    },
    totalPrice() {
      let total = 0;
      this.selectFoods.forEach((food) => {
        total += food.price * food.count;
      })
      return total;
    },
    totalCount() {
      let count = 0;
      this.selectFoods.forEach((food) => {
        count += food.count; 
      })
      return count;
    },
    payDesc() {
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}元起送`;
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice;
        return `还差￥${diff}元起送`
      } else {
        return '去结算'
      }
    },
    payClass() {
      if (this.totalPrice < this.minPrice) {
        return 'not-enough';
      } else {
        return 'enough';
      }
    },
    listShow() {
      if (!this.totalCount) {
        this.fold = true;
        return false;
      }
      let show = !this.fold
      // console.log("show=",show)
      return show;
    }
  },
  methods:{
    drop(el){
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i];
        // console.log("ball.show=",ball.show,'\n!show',!ball.show);
        if (!ball.show) {
          ball.show = true;
          ball.el = el;
          this.dropBalls.push(ball);
          // console.log("add ball=",ball,'\nthis=',this);
          return;
        }
        
      }
    },
    beforeEnter(el) {
      let count = this.balls.length;
      while (count--) {
        let ball = this.balls[count];
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect();
          // console.log("rect=",rect)
          let x = rect.left - 32;
          let y = -(window.innerHeight - rect.top - 22);
          el.style.display = '';
          // el.style.webkitTransform = `translate3d(0,${y}px, 0)`;
          // el.style.transform = `translate3d(0px,${y}px,0)`;
          // let inner = el.getElementsByClassName('inner-hook')[0];
          // inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
          // inner.style.transform = `translate3d(${x}px,0,0)`;
          el.style.webkitTransform = `translate3d(${x}px,${y}px, 0)`;
          el.style.transform = `translate3d(${x}px,${y}px,0)`;
          let inner = el.getElementsByClassName('inner-hook')[0];
          // console.log("beforeEnter=>inner",inner)
          inner.style.webkitTransform = `translate3d(${x}px,${y}px,0)`;
          inner.style.transform = `translate3d(${x}px,${y}px,0)`;
        }
      }
    },
    enter(el) {
      /* eslint-disable no-unused-vars  */
      let rf = el.offsetHeight;
      this.$nextTick(()=>{
        el.style.webkitTransform = 'translate3d(0,0,0)';
        el.style.transform = 'translate3d(0,0,0)';
        let inner = el.getElementsByClassName('inner-hook')[0];
        inner.style.webkitTransform = 'translate3d(0, 0, 0)';
        inner.style.transform = 'translate3d(0, 0, 0)';
      });
    },
    afterEnter(el) {
      // console.log("afterEnter=>el",el,"\ndropBalls=",this.dropBalls)
      let ball = this.dropBalls.shift();
      if (ball) {
        ball.show = false;
        el.style.display = 'none';
      }
    },
    toggleList() {
      if (!this.totalCount) {
        return;
      }
      this.fold = !this.fold;
      console.log("this.fold=",this.fold)
    },
    empty() {
      this.selectFoods.forEach((food)=>{
        food.count = 0;
      })
    },
    hideList(){
      this.fold = true;
    },
    pay() {
      if (this.totalPrice < this.minPrice) {
        return;
      }
      // 去结算方法
      alert(`支付${this.totalPrice}元`)
    }
  },
  components: {
    cartcontrol
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
 @import "../../common/stylus/mixin.styl";
  .shopcart
    position fixed
    left 0
    bottom 0
    z-index 50
    width 100%
    height 48px
    background red
    .content
      display flex
      background #141d27
      color rgba(255,255,255,0.4)
      .content-left
        flex 1
        .logo-wrapper
          display inline-block
          vertical-align top
          position relative
          top -10px
          margin 0 12px
          padding 6px
          width 56px
          height 56px
          box-sizing border-box
          border-radius 50%
          background #141d27
          .logo
            width 100%
            height 100%
            border-radius 50%
            text-align center
            background #2b343c
            &.highlight
              background rgb(0 ,160, 220)
            .icon-shopping_cart
              line-height 44px
              font-size 24px
              color #80858a
              &.highlight
                color #ffffff
          .num
            position absolute
            top 0
            right 0
            width 24px
            height 16px
            line-height 16px
            text-align center
            border-radius 16px
            font-size 9px
            font-weight 700
            color #ffffff
            background rgb(240,20,20)
            box-shadow 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        .price
          display inline-block
          vertical-align top
          line-height 24px
          margin-top 12px
          padding-right 12px
          box-sizing border-box
          border-right 1px solide rgba(255,255,255,0.1)
          font-size 16px
          font-weight 700
          &.highlight
            color #fff
        .desc
          display inline-block
          vertical-align top
          line-height 24px
          margin 12px 
      .content-right
        flex 0 0 105px
        width 105px
        .pay
          height 48px
          line-height 48px
          text-align center
          font-size 12px
          font-weight 700
          &.not-enough
            background #2b333b
          &.enough
            background #00b43c
            color #ffffff
    .ball-container
      .ball
        position fixed
        left 32px
        bottom 22px
        z-index 200

        &.drop-enter-active, &.drop-leave-active
          transition all 1s cubic-bezier(0.13, 1.7, 0.83, 1.24)
          .inner
            width 16px
            height 16px
            border-radius 50%
            background rgb(0, 160, 220)
    .shopcart-list 
      position absolute
      left 0
      bottom 48px
      z-index -1
      width 100%
      // &.fold-enter-active, 
      &.fold-leave-actice
        transition all 0.5s
        transform translate3d(0, -100%, 0)
      // &.fold-enter, 
      &.fold-leave-to
        transform translate3d(0,0,0)
      .list-header
        height 40px
        line-height 40px
        padding 0 18px
        background #f3f5f7
        border-bottom 1px solid rgba(7,17,27,0.1)
        .title
          float left
          font-size 14px
          color rgb(7,17,27)
        .empty
          float right
          font-size 12px
          color rgb(0, 160, 220)
      .list-content
        padding 0 18px
        max-height 217px
        overflow hidden
        background #ffffff
        .food
          position relative
          padding 12px 0
          box-sizing border-box
          border-1px(rgba(7,17,27,0.1))
          .name
            line-height 24px
            font-size 14px
            color rgb(7,17,27)

          .price
            position absolute
            right 90px
            bottom 12px
            line-height 24px
            font-size 14px
            font-weight 700
            color rgb(240,20,20)

          .cartcontrol-wrapper
            position absolute
            right 0px
            bottom 6px

  .list-mask
    position fixed
    top 0
    left 0
    width 100%
    height  100%
    z-index 40
    background rgba(7,17,27,0.6)
    &.fade-enter-active, &.fade-leave-active
      transition all 0.5s
      opacity 1
      background rgba(7,17,27,0.6)
    &.fade-enter, &.fade-leave-to
      opacity 0
      background rgba(7,17,27,0)

</style>
