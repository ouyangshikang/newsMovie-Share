var util = require("../../utils/util.js");
var app = getApp();
Page({

  data: {
    inTheater: {},
    comingSoon: {},
    top250: {},
    containerShow:true,
    searchPannelShow:false,
    xxImageShow:false,
    searchResult: {},
  },
  onLoad: function (options) {
    var inTheatersUrl = app.globalData.baseUrl + "/v2/movie/in_theaters" + "?start=0&count=3";
    var comingSoonUrl = app.globalData.baseUrl + "/v2/movie/coming_soon" + "?start=0&count=3";
    var top250Url = app.globalData.baseUrl + "/v2/movie/top250" + "?start=0&count=3";
    this.getMovieListData(inTheatersUrl, "inTheater", "正在热映");
    this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
    this.getMovieListData(top250Url, "top250", "豆瓣Top250");
  },

  getMovieListData: function (url, settedKey, categoryTitle) {
    var that = this;
    wx.request({
      url: url,
      data: {},
      method: 'GET',
      header: {
        'content-type': 'application/xml'
      },
      success: function (res) {
        //console.log(res.data);
        that.processDoubanData(res.data, settedKey, categoryTitle);
      },
      fail: function () {

      },
    })
  },
  processDoubanData: function (data, settedKey, categoryTitle) {
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
    //console.log(movies);
    var readyData = {};
    readyData[settedKey] = {
      movies: movies,
      categoryTitle: categoryTitle
    }
    this.setData(readyData);
    //console.log(this.data)
    wx.hideNavigationBarLoading();

  },
  moreTap:function(event){
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: "more-movies/more-movies?category=" + category
    })
   },


  bindFocus:function(event){
    this.setData({
      containerShow:false,
      searchPannelShow:true,
      xxImageShow:true
    })
  },
  bindBlur: function (event){
    // this.setData({
    //   searchPannelShow: false,
    //   xxImageShow: false,
    //   containerShow: true
    // })
  },
  bindConfirm: function (event){
    var text = event.detail.value;
    //console.log(text)
    var searchUrl = app.globalData.baseUrl + "/v2/movie/search?q=" + text;
    this.getMovieListData(searchUrl, "searchResult", "");
    wx.showNavigationBarLoading();
  },
  cancelTap: function (event){
    this.setData({
      searchPannelShow: false,
      xxImageShow: false,
      containerShow: true,
      searchResult: {}
    })
  },
  movieTap : function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    console.log(movieId);
    wx.navigateTo({
      url: "movie-detail/movie-detail?id=" + movieId
    })
  }

})