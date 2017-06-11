var app = getApp();
import {Movie} from 'class/Movie.js';
Page({

  data: {
    movie:{}
  },

  onLoad: function (options) {
    var movieId = options.id;
    var url = app.globalData.baseUrl + '/v2/movie/subject/' + movieId;
    // util.http(url, this.processDoubanData)
    var movie = new Movie(url);
    //var that = this;
    // movie.getMovieData(function(movie){
    //   that.setData({
    //     movie: movie
    //   })
    // })
    //用箭头函数替换
    movie.getMovieData((movie) => {
      this.setData({
        movie:movie
      })
    })

  },
  // processDoubanData: function (data) {
  //   //console.log(data);
  //   if (!data) {
  //     return;
  //   }
  //   var director = {
  //     avatar: "",
  //     name: "",
  //     id: ""
  //   }
  //   if (data.directors[0] != null) {
  //     if (data.directors[0].avatars != null) {
  //       director.avatar = data.directors[0].avatars.large

  //     }
  //     director.name = data.directors[0].name;
  //     director.id = data.directors[0].id;
  //   }
  //   var movie = {
  //     movieImg: data.images ? data.images.large : "",//电影海报
  //     country: data.countries[0],   //制片国家/地区	
  //     title: data.title,     //电影题目
  //     originalTitle: data.original_title, //原名
  //     wishCount: data.wish_count,  //想看的人数
  //     commentCount: data.comments_count,   //短评数量
  //     year: data.year,  //年代
  //     generes: data.genres.join("、"), //影片类型
  //     stars: util.convertToStarsArray(data.rating.stars),  
  //     score: data.rating.average,   //评分
  //     director: director,  //导演
  //     casts: util.convertToCastString(data.casts), //主演
  //     castsInfo: util.convertToCastInfos(data.casts),
  //     summary: data.summary  //简介
  //   }
  //   this.setData({
  //     movie:movie
  //   })
  //   console.log(this.data.movie)
  // },
  /*预览图片*/
  viewMoviePostImg: function (e) {
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // 需要预览的图片http链接列表
    })
  }
})