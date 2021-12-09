// 引入请求的方法
import { request } from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList:[],
    cateList:[],
    floorList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 发送异步请求获取轮播图数据
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success:(result) =>{
    //     this.setData({
    //       swiperList:result.data.message
    //     })
    //   }
    // })
    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
  },
  getSwiperList(){
  request({url:"/home/swiperdata"})
    .then(result => {
      this.setData({
        swiperList:result
      })
    })
  },
  getCateList(){
    request({url:"/home/catitems"})
      .then(result => {
        this.setData({
          cateList:result
        })
      })
    },
    getFloorList(){
      request({url:"/home/floordata"})
        .then(result => {
          result.forEach(v1 => {
            navigator_url: "/pages/goods_list?query=服饰";
            v1.product_list.forEach(v2 => {
              v2.navigator_url = v2.navigator_url.replace(/\?/, "/index\?");
            }); 
          });
          this.setData({
            floorList:result
          })
        })
      },
})
