<template>
  <div class="goods" id="goodWrapper">
    <Scroll class="menu-wrapper" ref="menuWrapper" :height="goodsHeight">
      <ul>
        <li
          v-for="(item,index) in goods"
          class="menu-item"
          :class="{'current':currentIndex==index}"
          @click="selectMenu(index)" ref="menuList"
        >
          <span class="text border-1px">
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>
            {{item.name}}
          </span>
        </li>
      </ul>
    </Scroll>
    <Scroll class="foods-wrapper" ref="foodsWrapper" :height="goodsHeight">
      <ul>
        <li v-for="item in goods" class="food-list food-list-hook" ref="foodList">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="food in item.foods" class="food-item border-1px">
              <div class="icon">
                <img width="57" height="57" :src="food.icon" alt="食物">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span>
                  <span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span>
                  <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </Scroll>
    <shopcart :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"/>
  </div>
</template>

<script type="text/ecmascript-6">
import shopcart from '../shopcart/shopcart'
export default {
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      goods: [],
      listHeight: [],
      menuListHeight: [],
      scrollY: 0,
      goodsHeight: 0
    };
  },
  computed: {
    currentIndex() {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i];
        let height2 = this.listHeight[i + 1];
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i;
        }
      }
      return 0;
    }
  },
  created() {
    this.classMap = ["decrease", "discount", "guarantee", "invoice", "special"];
    this.$http.get("static/data.json").then(res => {
      // console.log("res=", res.body);
      res = res.body;
      this.goods = res.goods;
      setTimeout(() => {
        //DOM还没更新
        this.$nextTick(() => {
          //DOM现在更新了
          this._initScroll();
          this._calculateHeight();
        });
      }, 0);
    });
  },
  methods: {
    selectMenu(index) {
      console.log(index,"\n",this.listHeight);
      let foodscroll = this.$refs.foodsWrapper.$el.children[0];
      let scrollY = this.listHeight[index];
      foodscroll.scrollTop = scrollY;
      // console.log("foodscroll", foodscroll, "\nscrollY=", scrollY);
    },
    _initScroll() {
      
      console.log("query=", this.$route.query.deliveryPrice,"\nseller=",this.seller);
      this.foodsScroll = this.$refs.foodsWrapper.$el.children[0];
      this.menuScroll = this.$refs.menuWrapper.$el.children[0];
    
      this.foodsScroll.addEventListener("scroll", pos => {
        this.scrollY = Math.abs(Math.round(pos.target.scrollTop));
        if (this.currentIndex == 0){
          this.menuScroll.scrollTop = 0;
        } else if (this.goodsHeight-48<this.menuListHeight[this.currentIndex]) {
          this.menuScroll.scrollTop = this.menuListHeight[this.currentIndex]-this.goodsHeight+72;
        }
        // console.log(this.goodsHeight,"=\n",this.menuListHeight[this.currentIndex])
      });
      this.goodsHeight = document.getElementById("goodWrapper").clientHeight;
    },
    _calculateHeight() {
      let foodList = this.$refs.foodList;
      // console.log("\nfoodList",foodList);
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i];
        height += item.scrollHeight;//clientHeight;
        this.listHeight.push(height);
      }

      let menuList = this.$refs.menuList;
      // console.log("\nmenuList",menuList);
      let meHeight = 0;
      this.menuListHeight.push(meHeight);
      for (let i = 0; i < menuList.length; i++) {
        let item = menuList[i];
        meHeight += item.scrollHeight;//clientHeight;
        this.menuListHeight.push(meHeight);
      }
    }
  },
  components: {
    shopcart
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../common/stylus/mixin.styl';

.goods {
  display: flex;
  position: absolute;
  top: 190px;
  bottom: 48px;
  width: 100%;
  overflow: hidden; // 超过部分隐藏

  /*
  order　　项目的排列顺序。数值越小，排列越靠前，默认为0。
  flex-grow　　项目的放大比例，默认为0，即如果存在剩余空间，也不放大。
  flex-shrink　　项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。
  flex-basis　　在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为auto，即项目的本来大小。
  flex　　是flex-grow, flex-shrink 和 flex-basis的简写，默认值为0 1 auto。后两个属性可选。
  align-self　　允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性。默认值为auto，表示继承父元素的align-items属性，如果没有父元素，则等同于stretch。
  */
  .menu-wrapper {
    flex: 0 0 80px;
    width: 80px;
    background: #f3f5f7;

    .menu-item {
      display: table;
      height: 54px;
      width: 80px;
      line-height: 14px;
      padding: 0 12px;

      &.current {
        position: relative;
        z-index: 10;
        margin-top: -1px;
        background: #ffffff;
        font-weight: 700;

        .text {
          border-none();
        }
      }

      .icon {
        display: inline-block;
        width: 12px;
        height: 12px;
        margin-right: 2px;
        background-size: 12px 12px;
        background-repeat: no-repeat;

        &.decrease {
          bg-image('../../../resource/img/decrease_3');
        }

        &.discount {
          bg-image('../../../resource/img/discount_3');
        }

        &.guarantee {
          bg-image('../../../resource/img/guarantee_3');
        }

        &.invoice {
          bg-image('../../../resource/img/invoice_3');
        }

        &.special {
          bg-image('../../../resource/img/special_3');
        }
      }

      .text {
        display: table-cell;
        width: 56px;
        vertical-align: middle;
        border-1px(rgba(7, 17, 27, 0.1));
        font-size: 12px;
      }
    }
  }

  .foods-wrapper {
    flex: 1;

    .title {
      padding-left: 14px;
      height: 26px;
      line-height: 26px;
      border-left: 2px solid #d9dde1;
      font-size: 12px;
      color: rgb(147, 153, 159);
      background: #f3f5f7;
    }

    .food-item {
      display: flex;
      margin: 18px;
      padding-bottom: 18px;
      border-1px(rgba(7, 17, 27, 0.1));

      &:last-child {
        border-none();
        padding-bottom: 0x;
      }

      .icon {
        flex: 0 0 57px;
        margin-right: 10px;
      }

      .content {
        flex: 1;

        .name {
          margin: 2px 0 8px 0;
          height: 14px;
          line-height: 14px;
          font-size: 14px;
          color: rgb(7, 17, 27);
        }

        .desc, .extra {
          line-height: 10px;
          font-size: 10px;
          color: rgb(147, 153, 159);
        }

        .desc {
          line-height: 12px;
          margin-bottom: 8px;
        }

        .extra {
          .count {
            margin-right: 12px;
          }
        }

        .price {
          font-weight: 700;
          line-height: 24px;

          .now {
            margin-right: 8px;
            font-size: 14px;
            color: rgb(240, 20, 20);
          }

          .old {
            text-decoration: line-through;
            font-size: 10px;
            color: rgb(147, 153, 159);
          }
        }
      }
    }
  }
}
</style>