<template>
  <div class="playlist-container">
    <div class="top-wrap">
      <div class="img-wrap">
        <img :src="playList.coverImgUrl" alt="" />
      </div>
      <div class="info-wrap">
        <p class="title">{{ playList.name }}</p>
        <div class="author-wrap">
          <img class="avatar" :src="playList.creator.avatarUrl" alt="" />
          <span class="name">{{ playList.creator.nickname }} / </span>
          <span class="time">{{ playList.createTime }} 创建</span>
        </div>
        <div class="play-wrap">
          <span class="iconfont icon-circle-play"></span>
          <span class="text">播放全部</span>
        </div>
        <div class="tag-wrap">
          <span class="title">标签:</span>
          <ul>
            <li v-for="(item, index) in playList.tags" :key="index">{{item}}</li>
            <li v-if="playList.tags.length == 0">全部</li>
          </ul>
        </div>
        <div class="desc-wrap">
          <span class="title">简介:</span>
          <span class="desc">{{ playList.description }}</span>
        </div>
      </div>
    </div>
    <el-tabs v-model="activeIndex">
      <el-tab-pane label="歌曲列表" name="1">
        <table class="el-table playlit-table">
          <thead>
            <th></th>
            <th></th>
            <th>音乐标题</th>
            <th>歌手</th>
            <th>专辑</th>
            <th>时长</th>
          </thead>
          <tbody>
            <tr class="el-table__row" v-for="(item, index) in tracks" :key="index">
              <td>{{ index + 1 }}</td>
              <td>
                <div class="img-wrap">
                  <img src="../assets/songCover.jpg" alt="" />
                  <span class="iconfont icon-play"></span>
                </div>
              </td>
              <td>
                <div class="song-wrap">
                  <div class="name-wrap">
                    <span>你要相信这不是最后一天</span>
                    <span class="iconfont icon-mv"></span>
                  </div>
                  <span>电视剧加油练习生插曲</span>
                </div>
              </td>
              <td>华晨宇</td>
              <td>你要相信这不是最后一天</td>
              <td>06:03</td>
            </tr>
          </tbody>
        </table>
      </el-tab-pane>
      <el-tab-pane label="评论" name="2">
        <!-- 精彩评论 -->
        <div class="comment-wrap">
          <p class="title">精彩评论<span class="number">({{ hotCount }})</span></p>
          <div class="comments-wrap">
            <div class="item" v-for="(item, index) in hotComment" :key="index">
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
            <div class="item" v-for="(item, index) in comment" :key="index">
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
          :page-size="10"
        >
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'playlist',
  data() {
    return {
      activeIndex: '1',
      total: 0,
      page: 1,
      playList: {},
      tracks: [],
      hotComment: [],
      hotCount: 0,
      comment: []
    };
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val
      axios({
        url: 'https://autumnfish.cn/comment/playlist',
        method: 'get',
        params: {
          id: this.$route.query.id,
          limit: 10,
          offset: (this.page - 1) * 10
        }
      }).then(res => {
        this.total = res.data.total
        this.comment = res.data.comments
        this.comment.forEach((item, index, arr) => {
          let date = new Date(item.time),
              year = date.getFullYear(),
              month = date.getMonth(),
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
    }
  },
  created() {
    axios({
      url: 'https://autumnfish.cn/playlist/detail',
      method: 'get',
      params: {
        id: this.$route.query.id
      }
    }).then(res => {
      this.playList = res.data.playlist
      this.tracks = this.playList.tracks
      let date = new Date(this.playList.createTime),
          year = date.getFullYear(),
          month = date.getMonth() + 1,
          day = date.getDate()
      month = (month < 10) ? `0${month}`: month
      day = (day < 10) ? `0${day}`: day

      this.playList.createTime = `${year}-${month}-${day}`
    }),
    axios({
      url: 'https://autumnfish.cn/comment/hot',
      method: 'get',
      params: {
        type: 2,
        id: this.$route.query.id,
        limit: 10
      }
    }).then(res => {
      this.hotComment = res.data.hotComments
      this.hotCount = res.data.total
      this.hotComment.forEach((item, index, arr) => {
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
    }),
    axios({
      url: 'https://autumnfish.cn/comment/playlist',
      method: 'get',
      params: {
        id: this.$route.query.id,
        limit: 10
      }
    }).then(res => {
      this.total = res.data.total
      this.comment = res.data.comments
      this.comment.forEach((item, index, arr) => {
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
  }
};
</script>

<style >

</style>
