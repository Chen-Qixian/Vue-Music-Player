<template>
  <div class="playlists-container">
    <!-- 头部 -->
    <div class="top-card">
      <div class="icon-wrap">
        <img :src="topList.coverImgUrl" alt="topList" />
      </div>
      <div class="content-wrap">
        <div class="tag">精品歌单</div>
        <div class="title">
          {{ topList.name }}
        </div>
        <div class="info">
          {{ topList.description }}
        </div>
      </div>
      <img :src="topList.coverImgUrl" alt="topList" class="bg" />
      <div class="bg-mask"></div>
    </div>
    <!-- 歌单列表 -->
    <div class="tab-container">
      <!-- tab栏 顶部 -->
      <div class="tab-bar">
        <span class="item" :class="{active: tag=='全部'}" @click="tag='全部'">全部</span>
        <span class="item" :class="{active: tag=='欧美'}" @click="tag='欧美'">欧美</span>
        <span class="item" :class="{active: tag=='华语'}" @click="tag='华语'">华语</span>
        <span class="item" :class="{active: tag=='流行'}" @click="tag='流行'">流行</span>
        <span class="item" :class="{active: tag=='说唱'}" @click="tag='说唱'">说唱</span>
        <span class="item" :class="{active: tag=='摇滚'}" @click="tag='摇滚'">摇滚</span>
        <span class="item" :class="{active: tag=='民谣'}" @click="tag='民谣'">民谣</span>
        <span class="item" :class="{active: tag=='电子'}" @click="tag='电子'">电子</span>
        <span class="item" :class="{active: tag=='轻音乐'}" @click="tag='轻音乐'">轻音乐</span>
        <span class="item" :class="{active: tag=='影视原声'}" @click="tag='影视原声'">影视原声</span>
        <span class="item" :class="{active: tag=='ACG'}" @click="tag='ACG'">ACG</span>
        <span class="item" :class="{active: tag=='怀旧'}" @click="tag='怀旧'">怀旧</span>
        <span class="item" :class="{active: tag=='治愈'}" @click="tag='治愈'">治愈</span>
        <span class="item" :class="{active: tag=='旅行'}" @click="tag='旅行'">旅行</span>
      </div>
      <!-- tab的内容区域 -->
      <div class="tab-content">
        <div class="items">
          <div class="item" v-for="(item, index) in list" :key="index" @click="toPlayList(item.id)">
            <div class="img-wrap">
              <div class="num-wrap">
                播放量:
                <span class="num">{{ item.playCount }}</span>
              </div>
              <img :src="item.coverImgUrl" :alt="index" />
              <span class="iconfont icon-play"></span>
            </div>
            <p class="name">{{ item.name }}</p>
          </div>
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
      :page-size="10"
    >
    </el-pagination>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'recommend',
  data() {
    return {
      total: 0,
      page: 1,
      topList: {},
      list: [],
      tag: '全部'
    };
  },
  watch: {
    tag() {
      this.topData()
      this.listData()
      this.page = 1
    }
  },
  methods: {
    topData() {
      axios({
        url: `https://autumnfish.cn/top/playlist/highquality`,
        method: 'get',
        params: {
          limit: 1,
          cat: this.tag
        }
      }).then(res => {
        // console.log(res)
        this.topList = res.data.playlists[0]
      })
    },
    listData() {
      axios({
        url: `https://autumnfish.cn/top/playlist/`,
        method: 'get',
        params: {
          limit: 10,
          offset: (this.page - 1) * 10,
          cat: this.tag
        }
      }).then(res => {
        // console.log(res)
        this.list = res.data.playlists
        this.total = res.data.total
      })
    },
    handleCurrentChange(val) {
      this.page = val
      this.listData()
    },
    toPlayList(id) {
      this.$router.push(`/playlist?id=${id}`)
    }
  },
  created() {
    this.topData()
    this.listData()
  }
};
</script>

<style >

</style>
