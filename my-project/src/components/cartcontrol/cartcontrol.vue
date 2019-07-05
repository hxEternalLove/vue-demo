<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease" v-show="food.count>0" @click="decreaseCart">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click="addCart"></div>
  </div>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue';
var eventHub = new Vue()
export default {
  props:{
    food:{
      type:Object
    }
  },
  created(){
    // console.log(this.food);
  },
  methods: {
    addCart(event) {
      // console.log(this.food);
      if (!this.food.count) {
        // this.food.count = 1;
        Vue.set(this.food,'count',1)
      } else {
        this.food.count++
      }
      eventHub.$emit('cart.add',event)
    },
    decreaseCart(){
      if (this.food.count) {
        this.food.count-- 
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .cartcontrol
    font-size 0
    .cart-decrease
      display inline-block
      padding 6px
      .inner
        display inline-block
        line-height 24px
        font-size 24px
        color rgb(0, 160, 220)
      &.move-enter-active, &.move-leave-active
        opacity 1
        transition: all 0.5s linear
        transform rotate(0)
      &.move-enter, &.move-leave-to
        opacity 0
        transform translate3d(24px,0,0) rotate(180deg)
    .cart-count
      display inline-block
      vertical-align top
      width 12px
      padding-top 6px
      line-height 24px
      text-align center
      font-size 10px
      color rgb(147,153,159)
    .cart-add
      display inline-block
      padding 6px
      line-height 24px
      font-size 24px
      color rgb(0, 160, 220)
</style>
