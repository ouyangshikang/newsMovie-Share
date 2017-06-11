var newsData = require('../../../data/posts-data.js');
var app = getApp();
Page({
  data: {
    postData: {},
    currentPostId: {},
    isPlayingMusic:false
  },
  onLoad: function (options) {
    //var globalData = app.globalData;
    //console.log(globalData)
    var postId = options.postId;
    this.data.currentPostId = postId;
    //console.log(postId)
    var newData = newsData.newsList[postId];
    //console.log(newData);
    this.setData({
      postData: newData
    });

    // var postCollected = {
    //     1:'ture',
    //     2:'false',
    //     3:'true'
    // }
    var postCollected = wx.getStorageSync('post_collected');
    if (postCollected) {
      var postCollected = postCollected[postId];
      this.setData({
        collected: postCollected
      })
    } else {
      var postCollected = {};
      postCollected[postId] = false;
      wx.setStorageSync('post_collected', postCollected)
    }
    if (app.globalData.isPlayingMusic && app.globalData.playingId === this.data.currentPostId){
      this.setData({
        isPlayingMusic: true
      })
    }
    this.musicMonitor();
  },

  musicMonitor:function(){
    //监听音乐是否被播放
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlayingMusic: true
      });
      app.globalData.isPlayingMusic = true;
      app.globalData.playingId = that.data.currentPostId;
    });
    //监听音乐是否被暂停
    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayingMusic: false
      });
      app.globalData.isPlayingMusic = false;
      app.globalData.playingId = null;
    })
    //监听音乐是否被停止
    wx.onBackgroundAudioStop(function () {
      that.setData({
        isPlayingMusic: false
      });
      app.globalData.isPlayingMusic = false;
      app.globalData.playingId = null;
    })
  },
  
  collectionTap: function (event) {
    //this.getPostCollectionSync();同步调用
    this.getPostCollectionAsy();
  },

  //异步方法
  getPostCollectionAsy:function(){
    var that =this;
    wx.getStorage({
      key: 'post_collected',
      success: function(res) {
        var postCollected = wx.getStorageSync('post_collected');
        //收藏变未收藏...
        var judge = postCollected[that.data.currentPostId];
        judge = !judge;
        postCollected[that.data.currentPostId] = judge;
        //更新文章是否收藏的缓存
        that.showToast(postCollected, judge);
    //that.showModal(postCollected, judge);
      },
    })
  },
  //同步方法
  getPostCollectionSync: function () {
    var that = this;
    var postCollected = wx.getStorageSync('post_collected');
    //收藏变未收藏...
    var judge = postCollected[that.data.currentPostId];
    judge = !judge;
    postCollected[that.data.currentPostId] = judge;
    //更新文章是否收藏的缓存
    that.showToast(postCollected, judge);
    //that.showModal(postCollected, judge);
  },


  showToast: function (postCollected, judge) {
    wx.setStorageSync('post_collected', postCollected);
    //更新数据绑定变量
    this.setData({
      collected: judge
    });
    wx.showToast({
      title: judge ? '收藏成功' : '取消收藏',
      icon: 'success',
      duration: 1000
    })
  },

  showModal: function (postCollected, judge) {
    var that = this;
    wx.showModal({
      title: judge ? '收藏' : '取消收藏',
      content: judge ?'收藏该文章':'取消收藏该文章',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#333',
      confirmText: '确定',
      confirmColor: '#405f80',
      success:function(res){
          if(res.confirm){
            wx.setStorageSync('post_collected', postCollected);
            //更新数据绑定变量
            that.setData({
              collected: judge
            });
          }
      }

    })
  },

  //分享方法,小程序不支持分享
  shareTap: function (event) {
    var itemList = [
      '分享到QQ',
      '分享到朋友圈',
      '分享到微信好友',
      '分享到新浪微博'
    ]
    wx.showActionSheet({
      itemList: itemList,
      itemColor:'#405f80',
      success:function(res){
          // res.cancel  用户是否点击取消按钮
          // res.tapIndex 用户点击数组的序号，从0开始
        if (itemList[res.tapIndex]!= undefined){
          wx.showModal({
            title: '用户' + itemList[res.tapIndex],
            content: '对不起，小程序现在不支持分享功能呢！',
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  //音乐播放控制
  musicTap:function(event){
    var postData = this.data.postData;
    var isPlayingMusic = this.data.isPlayingMusic;
    if (isPlayingMusic){
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic:false
      })
      // this.data.isPlayingMusic = false;
    }else{
      wx.playBackgroundAudio({
        dataUrl: postData.music.dataUrl,
        title: postData.music.title,
        coverImgUrl: postData.music.coverImgUrl
      });
      this.setData({
        isPlayingMusic: true
      })
      // this.data.isPlayingMusic = true;
    }
    
  }



})