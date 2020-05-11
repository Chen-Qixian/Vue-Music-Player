<template>
  <div class="discovery-container">
    <!-- 轮播图 -->
    <el-carousel class="" :interval="4000" type="card">
      <el-carousel-item v-for="(item, index) in banner" :key="index">
        <img :src="item.imageUrl" :alt="index" @click="toPage(item.url)"/>
      </el-carousel-item>
    </el-carousel>
    <!-- 推荐歌单 -->
    <div class="recommend">
      <h3 class="title">
        推荐歌单
      </h3>
      <div class="items">
        <div class="item" v-for="(item, index) in list" :key="index" @click="toPlayList(item.id)">
          <div class="img-wrap">
            <div class="desc-wrap">
              <span class="desc">{{ item.copywriter }}</span>
            </div>
            <img :src="item.picUrl" :alt="index" />
            <span class="iconfont icon-play"></span>
          </div>
          <p class="name">{{ item.name }}</p>
        </div>
      </div>
    </div>
    <!-- 最新音乐 -->
    <div class="news">
      <h3 class="title">
        最新音乐
      </h3>
      <div class="items">
        <div class="item" v-for="(item, index) in songs" :key="index">
          <div class="img-wrap">
            <img :src="item.picUrl" :alt="index" />
            <span class="iconfont icon-play" @click="play(item.id)"></span>
          </div>
          <div class="song-wrap">
            <div class="song-name">{{ item.name }}</div>
            <div class="singer">{{ item.song.artists[0].name }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 推荐MV -->
    <div class="mvs">
      <h3 class="title">推荐MV</h3>
      <div class="items">
        <div class="item" v-for="(item, index) in mvs" :key="index">
          <div class="img-wrap" @click="playMv(item.id)">
            <img :src="item.picUrl" :alt="index" />
            <span class="iconfont icon-play"></span>
            <div class="num-wrap">
              <div class="iconfont icon-play"></div>
              <div class="num">{{ item.playCount }}</div>
            </div>
          </div>
          <div class="info-wrap">
            <div class="name">{{ item.name }}</div>
            <div class="singer">{{ item.artists[0].name }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'discovery',
  data() {
    return {
      banner: [],
      list: [],
      songs: [],
      mvs: []
    }
  },
  created() {
    axios({
      url: `https://autumnfish.cn/banner`,
      method: 'get'
    }).then(res => {
      this.banner = res.data.banners
    }),
    axios({
      url: `https://autumnfish.cn/personalized`,
      method: 'get',
      params: {
        limit: 10
      }
    }).then(res => {
      this.list = res.data.result
    }),
    axios({
      url: `https://autumnfish.cn/personalized/newsong`,
      method: 'get'
    }).then(res => {
      this.songs = res.data.result
    }),
    axios({
      url: `https://autumnfish.cn/personalized/mv`,
      method: 'get'
    }).then(res => {
      this.mvs = res.data.result
    })
  },
  methods: {
    play(id) {
      axios({
        url: `https://autumnfish.cn/song/url`,
        method: 'get',
        params: {
          id
        }
      }).then(res => {
        this.$parent.musicUrl = res.data.data[0].url
      })
    },
    playMv(id) {
      this.$router.push(`/mv?id=${id}`)
    },
    toPlayList(id) {
      this.$router.push(`/playlist?id=${id}`)
    },
    toPage(url) {
      if(url) {
        window.open(url, '_blank')
      }
    }
  }
};
</script>

<style >

</style>
