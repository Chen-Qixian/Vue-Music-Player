<template>
  <div class="mv-container">
    <div class="mv-wrap">
      <h3 class="title">mv详情</h3>
      <!-- mv -->
      <div class="video-wrap">
        <video
          controls
          :src="url"
        ></video>
      </div>
      <!-- mv信息 -->
      <div class="info-wrap">
        <div class="singer-info">
          <div class="avatar-wrap">
            <img :src="singerPic" :alt="mvInfo.artistName" />
          </div>
          <span class="name">{{ mvInfo.artistName }}</span>
        </div>
        <div class="mv-info">
          <h2 class="title">{{ mvInfo.name }}</h2>
          <span class="date">发布：{{ mvInfo.publishTime }}</span>
          <span class="number">播放：{{ mvInfo.playCount }}次</span>
          <p class="desc">
            {{ mvInfo.desc }}
          </p>
        </div>
      </div>
      <!-- 精彩评论 -->
      <div class="comment-wrap">
        <p class="title">精彩评论<span class="number">({{ hotComments.length }})</span></p>
        <div class="comments-wrap">
          <div class="item" v-for="(item, index) in hotComments" :key="index">
            <div class="icon-wrap">
              <img :src="item.user.avatarUrl" :alt="index" />
            </div>
            <div class="content-wrap">
              <div class="content">
                <span class="name">{{ item.user.nickname }}：</span>
                <span class="comment">{{ item.content }}</span>
              </div>
              <div class="re-content" v-if="item.beReplied.length != 0">
                <span v-for="(it, idx) in item.beReplied" :key="idx">
                  <span class="name">{{ it.user.nickname }}：</span>
                  <span class="comment">{{ it.content }}</span>
                </span>
              </div>
              <div class="date">{{ item.time }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 最新评论 -->
      <div class="comment-wrap">
        <p class="title">最新评论<span class="number">({{ total }})</span></p>
        <div class="comments-wrap">
          <div class="item" v-for="(item, index) in comments" :key="index">
            <div class="icon-wrap">
              <img :src="item.user.avatarUrl" :alt="index" />
            </div>
            <div class="content-wrap">
              <div class="content">
                <span class="name">{{ item.user.nickname }}：</span>
                <span class="comment">{{ item.content }}</span>
              </div>
              <div class="re-content" v-if="item.beReplied.length != 0">
                <span v-for="(it, idx) in item.beReplied" :key="idx">
                  <span class="name">{{ it.user.nickname }}：</span>
                  <span class="comment">{{ it.content }}</span>
                </span>
              </div>
              <div class="date">{{ item.time }}</div>
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
        :page-size="limit"
        :limit="limit"
      >
      </el-pagination>
    </div>
    <div class="mv-recommend">
      <h3 class="title">相关推荐</h3>
      <div class="mvs">
        <div class="items">
          <div class="item" v-for="(item, index) in relative" :key="index">
            <div class="img-wrap" @click="playMv(item.id)">
              <img :src="item.cover" :alt="index" />
              <span class="iconfont icon-play"></span>
              <div class="num-wrap">
                <div class="iconfont icon-play"></div>
                <div class="num">{{ item.playCount }}</div>
              </div>
              <span class="time">{{ item.duration }}</span>
            </div>
            <div class="info-wrap">
              <div class="name">{{ item.name }}</div>
              <div class="singer">{{ item.artistName }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'mv',
  data() {
    return {
      total: 20,
      page: 1,
      limit: 10,
      url: '',
      relative: [],
      mvInfo: {},
      singerPic: '',
      hotComments: [],
      comments: []
    };
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val
    },
    getMvUrl() {
      axios({
        url: 'https://autumnfish.cn/mv/url',
        method: 'get',
        params: {
          id: this.$route.query.id
        }
      }).then(res => {
        this.url = res.data.data.url
      })
    },
    getRelatedMv() {
      axios({
        url: 'https://autumnfish.cn/simi/mv',
        method: 'get',
        params: {
          mvid: this.$route.query.id
        }
      }).then(res => {
        this.relative = res.data.mvs
        this.relative.forEach((item, index, arr) => {
          if(item.playCount > 100000000) {
            arr[index].playCount = `${(item.playCount / 100000000).toFixed(1)}亿`
          }
          else if(item.playCount > 10000) {
            arr[index].playCount = `${(item.playCount / 10000).toFixed(1)}万`
          }

          let dur = item.duration,
              min = parseInt(dur / 1000 / 60),
              sec = parseInt(dur / 1000 % 60)
          min = (min < 10) ? `0${min}`: min
          sec = (sec < 10) ? `0${sec}`: sec
          arr[index].duration = `${min}:${sec}`
        })
      })
    },
    getMvInfo() {
      axios({
        url: 'https://autumnfish.cn/mv/detail',
        method: 'get',
        params: {
          mvid: this.$route.query.id
        }
      }).then(res => {
        this.mvInfo = res.data.data
        if(this.mvInfo.playCount > 100000000) {
          this.mvInfo.playCount = `${(this.mvInfo.playCount / 100000000).toFixed(1)}亿`
        }
        else if(this.mvInfo.playCount > 10000) {
          this.mvInfo.playCount = `${(this.mvInfo.playCount / 10000).toFixed(1)}万`
        }
        axios({
          url: 'https://autumnfish.cn/artists',
          method: 'get',
          params: {
            id: this.mvInfo.artists[0].id
          }
        }).then(res => {
          this.singerPic = res.data.artist.picUrl
        })
      })
    },
    getCommentList() {
      axios({
        url: 'https://autumnfish.cn/comment/mv',
        method: 'get',
        params: {
          id: this.$route.query.id,
          limit: this.limit,
          offset: (this.page - 1) * this.limit
        }
      }).then(res => {
        if(res.data.hotComments) {
          this.hotComments = res.data.hotComments
          this.hotComments.forEach((item, index, arr) => {
            let date = new Date(item.time),
                year = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate(),
                hour = date.getHours(),
                min = date.getMinutes(),
                sec = date.getSeconds()
            month = (month < 10) ? `0${month}`: month
            day = (day < 10) ? `0${day}`: day
            hour = (hour < 10) ? `0${hour}`: hour
            min = (min < 10) ? `0${min}`: min
            sec = (sec < 10) ? `0${sec}`: sec  
            arr[index].time = `${year}-${month}-${day} ${hour}:${min}:${sec}`
          })
        }
        this.comments = res.data.comments
        this.total = res.data.total
        this.comments.forEach((item, index, arr) => {
          let date = new Date(item.time),
              year = date.getFullYear(),
              month = date.getMonth() + 1,
              day = date.getDate(),
              hour = date.getHours(),
              min = date.getMinutes(),
              sec = date.getSeconds()
          month = (month < 10) ? `0${month}`: month
          day = (day < 10) ? `0${day}`: day
          hour = (hour < 10) ? `0${hour}`: hour
          min = (min < 10) ? `0${min}`: min
          sec = (sec < 10) ? `0${sec}`: sec  
          arr[index].time = `${year}-${month}-${day} ${hour}:${min}:${sec}`
        })
      })
    },
    newPage() {
      this.page = 1
      this.getMvUrl()
      this.getRelatedMv()
      this.getMvInfo()
      this.getCommentList()
    },
    playMv(id) {
      this.$router.push(`/mv?id=${id}`)
      this.newPage()
    }
  },
  watch: {
    page() {
      this.getCommentList()
    }
  },
  created() {
    this.newPage()
  }
};
</script>

<style></style>
