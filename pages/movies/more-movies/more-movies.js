var util = require("../../../utils/util.js");
var app = getApp();

Page({
  data: {
    movies: {},
    requestUrl: '',
    totalCount: 0,
    isEmpty:true
  },

  onLoad: function (options) {
    var category = options.category;
    console.log(category);
    wx.setNavigationBarTitle({
      title: category
    });
    var dataUrl = "";
    switch (category) {
      case "正在热映":
        dataUrl = app.globalData.baseUrl + "/v2/movie/in_theaters";
        break;
      case "即将上映":
        dataUrl = app.globalData.baseUrl + "/v2/movie/coming_soon";
        break;
      case "豆瓣Top250":
        dataUrl = app.globalData.baseUrl + "/v2/movie/top250";
        break;
    }
    this.data.requestUrl = dataUrl
    util.http(dataUrl, this.processDoubanData);

  },

  processDoubanData: function (data) {
    //console.log(data);
    var movies = [];
    for (var idx in data.subjects) {
      var subject = data.subjects[idx];
      var title = subject.title;
      if (title.length >= 7) {
        title = title.substring(0, 7) + "...";
      }
      var temp = {
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id,
        stars: util.convertToStarsArray(subject.rating.stars),

      }
      movies.push(temp);
    }
    var totalMovies = {};
    if(!this.data.isEmpty){
      totalMovies = this.data.movies.concat(movies);
    } else{
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    //console.log(movies);
    this.setData({
      movies: totalMovies
    });
    this.data.totalCount += 20;
    console.log(this.data)
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

  // scrollLower: function (event) {
  //   var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
  //   util.http(nextUrl, this.processDoubanData);
  //   wx.showNavigationBarLoading();
  // },
  onReachBottom: function (event) {
    var nextUrl = this.data.requestUrl +
      "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processDoubanData)
    wx.showNavigationBarLoading()
  },
  onPullDownRefresh: function (event){
    var refreshUrl = this.data.requestUrl +"?star=0&count=20";
    this.data.movies = {};
    this.data.isEmpty = true;
    this.data.totalCount = 0;
    util.http(refreshUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },

  movieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    console.log(movieId);
    wx.navigateTo({
      url: "../movie-detail/movie-detail?id=" + movieId
    })
  }
})
