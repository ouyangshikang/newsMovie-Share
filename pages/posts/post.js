var newsData = require('../../data/posts-data.js');
// 这里只能用相对路径
Page({
  data: {
    post_key: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      post_key: newsData.newsList
    });
  },
  postTap :function(event){
    var postId = event.currentTarget.dataset.postid;
    //console.log(event.currentTarget.dataset.postid);
    wx.navigateTo({
      url: 'post-detail/post-detail?postId='+postId
    })
  }
})