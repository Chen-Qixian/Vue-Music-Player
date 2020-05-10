<template>
  <div class="result-container">
    <div class="title-wrap">
      <h2 class="title">{{ $route.query.q }}</h2>
      <span class="sub-title">找到{{ count }}个结果</span>
    </div>
    <el-tabs v-model="activeIndex">
      <el-tab-pane label="歌曲" name="songs">
        <table class="el-table">
          <thead>
            <th></th>
            <th>音乐标题</th>
            <th>歌手</th>
            <th>专辑</th>
            <th>时长</th>
          </thead>
          <tbody>
            <tr 
              class="el-table__row" 
              v-for="(item, index) in songList" 
              :key="index"
              @click="playMusic(item.id)" 
            >
              <td>{{ index + 1 }}</td>
              <td>
                <div class="song-wrap">
                  <div class="name-wrap">
                    <span>{{ item.name }}</span>
                    <span class="iconfont icon-mv" v-if="item.mvid != 0"></span>
                  </div>
                  <span v-if="item.alias.length != 0">{{ item.alias[0] }}</span>
                </div>
              </td>
              <td>{{ item.artists[0].name }}</td>
              <td>{{ item.album.name }}</td>
              <td>{{ item.duration }}</td>
            </tr>
          </tbody>
        </table>
        <!-- 分页器 -->
        <el-pagination
          @current-change="handleCurrentChange"
          background
          layout="prev, pager, next"
          :total="count"
          :current-page="page"
          :page-size="10"
          :limit="limit"
        >
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="歌单" name="lists">
        <div class="items">
          <div class="item" v-for="(item, index) in playList" :key="index">
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
        <!-- 分页器 -->
        <el-pagination
          @current-change="handleCurrentChange"
          background
          layout="prev, pager, next"
          :total="count"
          :current-page="page"
          :page-size="10"
          :limit="limit"
        >
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="MV" name="mv">
        <div class="items mv">
          <div class="item" v-for="(item, index) in mvList" :key="index">
            <div class="img-wrap">
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
        <!-- 分页器 -->
        <el-pagination
          @current-change="handleCurrentChange"
          background
          layout="prev, pager, next"
          :total="count"
          :current-page="page"
          :page-size="8"
          :limit="limit"
        >
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'result',
  data() {
    return {
      activeIndex: 'songs',
      songList: [],
      playList: [],
      mvList: [],
      count: 0,
      page: 1,
      limit: 10,
      type: 1
    };
  },
  watch: {
    activeIndex() {
      this.page = 1
      switch(this.activeIndex) {
        case 'songs': {
          this.type = 1
          this.limit = 10
          break
        }
        case 'lists': {
          this.type = 1000
          this.limit = 10
          break
        }
        case 'mv': {
          this.type = 1004
          this.limit = 8
          break
        }
        default: break
      }

      this.getList()
    }
  },
  methods: {
    playMusic(id) {
      axios({
        url: 'https://autumnfish.cn/song/url',
        method: 'get',
        params: {
          id
        }
      }).then(res => {
        console.log(res)
        this.$parent.musicUrl = res.data.data[0].url
      })
    },
    getList() {
      axios({
        url: 'https://autumnfish.cn/search',
        method: 'get',
        params: {
          type: this.type,
          keywords: this.$route.query.q,
          limit: this.limit,
          offset: (this.page - 1) * this.limit
        }
      }).then(res => {
        if(this.type == 1) {
          this.count = res.data.result.songCount
          this.songList = res.data.result.songs
          this.songList.forEach((item, index, arr) => {
            let dur = item.duration

            let min = parseInt(dur / 1000 / 60)
            min = (min < 10) ? `0${min}` : min
            let sec = parseInt(dur / 1000 % 60)
            sec = (sec < 10) ? `0${sec}` : sec
            
            arr[index].duration = `${min}:${sec}`
          })
        }
        else if(this.type == 1000) {
          this.playList = res.data.result.playlists
          this.count = res.data.result.playlistCount
          this.playList.forEach((item, index, arr) => {
            if(item.playCount > 100000000) {
              arr[index].playCount = `${(item.playCount / 100000000).toFixed(1)}亿`
            }
            else if(item.playCount > 10000) {
              arr[index].playCount = `${(item.playCount / 10000).toFixed(1)}万`
            }
          })
        }
        else if(this.type == 1004) {
          this.count = res.data.result.mvCount
          this.mvList = res.data.result.mvs

          this.mvList.forEach((item, index, arr) => {
            let dur = item.duration
            let min = parseInt(dur / 1000 / 60)
            let sec = parseInt(dur / 1000 % 60)
            min = (min < 10) ? `0${min}`: min
            sec = (sec < 10) ? `0${sec}`: sec
            arr[index].duration = `${min}:${sec}`

            if(item.playCount > 100000000) {
              arr[index].playCount = `${(item.playCount / 100000000).toFixed(1)}亿`
            }
            else if(item.playCount > 10000) {
              arr[index].playCount = `${(item.playCount / 10000).toFixed(1)}万`
            }
            
          })
        }
      })
    },
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    }
  },
  created() {
    this.getList()
  }
}
</script>

<style >

</style>
