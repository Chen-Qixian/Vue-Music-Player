<template>
  <div class="mvs-container">
    <div class="filter-wrap">
      <!-- 地区 -->
      <div class="seciton-wrap">
        <span class="section-type">地区:</span>
        <ul class="tabs-wrap">
          <li class="tab" @click="area='全部'">
            <span class="title" :class="{active: area == '全部'}">全部</span>
          </li>
          <li class="tab" @click="area='内地'">
            <span class="title" :class="{active: area == '内地'}">内地</span>
          </li>
          <li class="tab" @click="area='港台'">
            <span class="title" :class="{active: area == '港台'}">港台</span>
          </li>
          <li class="tab" @click="area='欧美'">
            <span class="title" :class="{active: area == '欧美'}">欧美</span>
          </li>
          <li class="tab" @click="area='日本'">
            <span class="title" :class="{active: area == '日本'}">日本</span>
          </li>
          <li class="tab" @click="area='韩国'">
            <span class="title" :class="{active: area == '韩国'}">韩国</span>
          </li>
        </ul>
      </div>
      <!-- 类型 -->
      <div class="type-wrap">
        <span class="type-type">类型:</span>
        <ul class="tabs-wrap">
          <li class="tab" @click="type = '全部'">
            <span class="title" :class="{active: type == '全部'}">全部</span>
          </li>
          <li class="tab" @click="type = '官方版'">
            <span class="title" :class="{active: type == '官方版'}">官方版</span>
          </li>
          <li class="tab" @click="type = '原声'">
            <span class="title" :class="{active: type == '原声'}">原声</span>
          </li>
          <li class="tab" @click="type = '现场版'">
            <span class="title" :class="{active: type == '现场版'}">现场版</span>
          </li>
          <li class="tab" @click="type = '网易出品'">
            <span class="title" :class="{active: type == '网易出品'}">网易出品</span>
          </li>
        </ul>
      </div>
      <!-- 排序 -->
      <div class="order-wrap">
        <span class="order-type">排序:</span>
        <ul class="tabs-wrap">
          <li class="tab" @click="order = '上升最快'">
            <span class="title" :class="{active: order == '上升最快'}">上升最快</span>
          </li>
          <li class="tab" @click="order = '最热'">
            <span class="title" :class="{active: order == '最热'}">最热</span>
          </li>
          <li class="tab" @click="order = '最新'">
            <span class="title" :class="{active: order == '最新'}">最新</span>
          </li>
        </ul>
      </div>
    </div>
    <!-- mv容器 -->
    <!-- 推荐MV -->
    <div class="mvs">
      <div class="items">
        <div class="item" v-for="(item, index) in list" :key="index">
          <div class="img-wrap" @click="toMv(item.id)">
            <img :src="item.cover" :alt="index" />
            <div class="num-wrap">
              <div class="iconfont icon-play"></div>
              <div class="num">{{ item.playCount }}</div>
            </div>
          </div>
          <div class="info-wrap">
            <div class="name">{{ item.name }}</div>
            <div class="singer">{{ item.artistName }}</div>
          </div>
        </div>
      </div>
      <!-- 分页器 -->
      <el-pagination
        @current-change="handleCurrentChange"
        background
        layout="prev, pager, next"
        :total="total"
        :current-page="page"
        :page-size="8"
        :limit="limit"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'mvs',
  data() {
    return {
      total: 20,
      page: 1,
      limit: 8,
      area: '全部',
      type: '全部',
      order: '上升最快',
      list: []
    };
  },
  watch: {
    area() {
      this.getMvList()
      this.page = 1
    },
    type() {
      this.getMvList()
      this.page = 1
    },
    order() {
      this.getMvList()
      this.page = 1
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val
      this.getMvList()
    },
    getMvList() {
      axios({
        url: `https://autumnfish.cn/mv/all`,
        method: 'get',
        params: {
          area: this.area,
          type: this.type,
          order: this.order,
          limit: this.limit,
          offset: (this.page - 1) * this.limit
        }
      }).then(res => {
        if(res.data.count) {
          this.total = res.data.count
        }
        this.list = res.data.data
        for (let i = 0 ; i < this.list.length ; i ++) {
          if (this.list[i].playCount > 10000) {
            let num = (this.list[i].playCount / 10000).toFixed(1)
            this.list[i].playCount = `${num}万`
          }
        }
      })
    },
    toMv(id) {
      this.$router.push(`/mv?id=${id}`)
    }
  },
  created() {
    this.getMvList()
  }
};
</script>

<style >

</style>
