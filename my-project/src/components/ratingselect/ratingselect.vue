<template>
  <div class="ratingselect">
    <div class="rating-type border-1px">
      <span @click="select(2)" class="block positive" :class="{'active':myselectType===2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
      <span @click="select(0)" class="block positive" :class="{'active':myselectType===0}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
      <span @click="select(1)" class="block negative" :class="{'active':myselectType===1}">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
    </div>
    <div @click="toggleContent" class="switch" :class="{'on':myonlyContent}">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;
export default {
  props: {
    ratings: {
      type:Array,
      default() {
        return [];
      }
    },
    selectType: {
      type: Number,
      default: ALL
    },
    onlyContent: {
      type: Boolean,
      default: false
    },
    desc: {
      type: Object,
      default() {
        return {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        }
      }
    }
  },
  data() {
    return {
      myselectType: this.selectType,//①创建props属性 selectType 的副本--myselectType
      myonlyContent: this.onlyContent
    }
  },
  computed: {
    positives(){
      return this.ratings.filter((rating)=>{
        return rating.rateType === POSITIVE;
      })
    },
    negatives(){
      return this.ratings.filter((rating)=>{
        return rating.rateType === NEGATIVE;
      })
    },
  },
  watch: {
    selectType(val){
      this.myselectType = val;//②监听外部对props属性 selectType 的变更，并同步到组件内的data属性 myselectType 中
    },
    /** 不需要通知的话，省略③、④步骤
     *  通知父组件值有改变
     */
    myselectType(val){
      this.$root.eventHub.$emit("on-selectType-change",val);//③组件内对 myselectType 变更后向外部发送事件通知
    },
    
    /**
     *  去父组件中接收改变并赋值
        this.$root.eventHub.$on('on-selectType-change',(val)=>{
          this.selectType=val;//④外层调用组件方注册变更方法，将组件内的数据变更，同步到组件外的数据状态中
        })
     */
    onlyContent(val){
      this.myonlyContent = val
    },

    myonlyContent(val){
      this.$root.eventHub.$emit("on-onlyContent-change",val);//③组件内对 myonlyContent 变更后向外部发送事件通知
    },
  },
  methods: {
    select(type){
      this.myselectType = type;
    },
    toggleContent(){
      this.myonlyContent = !this.myonlyContent
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin.styl"

  .ratingselect
    .rating-type
      padding 18px 0 
      margin 0 18px
      border-1px(rgba(7,17,27,0.1))
      .block
        display inline-block
        padding 8px 12px
        margin-right 8px
        border-radius 1px
        font-size 12px
        color rgb(77,85,93)
        &.active
          color #ffffff
        .count
          margin-left 2px
          line-height 16px
          font-size 8px
        &.positive
          background rgba(0,160,220,0.2)
          &.active
            background rgb(0,160,220)
        &.negative
          background rgba(77,85,93,0.2)
          &.active
            background rgb(77,85,93)
    .switch
      padding 12px 18px
      line-height 24px
      border-bottom 1px solid rgba(7,17,27,0.1)
      color rgb(147,153,159)
      &.on
        .icon-check_circle
          color  #00c850
      .icon-check_circle
        display inline-block
        vertical-align top
        margin-right 4px
        font-size 24px
      .text
        display inline-block
        vertical-align top
        font-size 12px


          

/*
选中代码，按下Tab（右移）
选中代码，按下Tab＋shift（左移）
*/
</style>
