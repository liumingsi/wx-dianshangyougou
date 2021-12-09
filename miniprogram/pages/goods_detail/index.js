// pages/goods_detail/index.js
// 发送请求获取数据
// 点击轮播图 预览大图
    // 给轮播图绑定点击事件
    // 调用小程序的api  previewImage
// 点击 加入购物车
    // 先绑定点击事件
    // 获取缓存中的购物车数据 数组格式
    // 先判断 当前的商品是否已经存在于 购物车
    // 已经存在 修改商品数据 执行购物车数量++ 重新吧购物车数组 填充回缓存中
    // 不存在于购物车的数组中 直接给购物车数组添加一个新元素 新元素 带上 购买数量属性 num 重新吧购物车数组 填充会缓存中
    // 弹出提示
// 商品收藏
    // 页面onShow的时候 加载缓存中的商品收藏的数据
    // 判断当前商品是不是被收藏了
        // 是的话  改变页面的图标
        // 不是的话 什么也不做
    // 点击商品收藏按钮
        // 判断该商品是否存在于缓存数组中
        // 已经存在 吧该商品删除
        // 没有存在 把商品添加到收藏数组中  存入到缓存中即可
import { request } from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsObj:{},
        // 商品是否被收藏过
        isCollect:false
    },
    GoodsObj:{},

    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function () {
        let pages = getCurrentPages();//获取页面栈，从而获取options参数
        let currentPage=pages[pages.length-1];
        let options=currentPage.options;
        const {goods_id}=options;
        this.getGoodsDetail(goods_id);
    },
    // 获取商品详情数据
    async getGoodsDetail(goods_id){
        const goodsObj=await request({url:"/goods/detail",data:{goods_id}});
        this.GoodsObj = goodsObj;
        // 获取缓存中的商品收藏的数组
        let collect = wx.getStorageSync('collect')||[];
        // 判断当前商品是否被收藏
        let isCollect = collect.some(v => v.goods_id===this.GoodsObj.goods_id);
        this.setData({
            goodsObj:{
                goods_name:goodsObj.goods_name,
                goods_price:goodsObj.goods_price,
                // iphone部分手机  不识别 webp图片格式
                // 最好找到后台 让后台人员进行修改
                // 临时自己改 确保后台存在  1.webp => 1.jpg
                goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
                pics:goodsObj.pics
            },
            isCollect
        })
    },
    // 点击轮播图 放大预览
    handlePrevewImage(e){
        // 1 先构造要预览的图片数组
        const urls = this.GoodsObj.pics.map(v=>v.pics_mid);
        // 2 接收传递过来的图片url
        const current = e.currentTarget.dataset.url;
        wx.previewImage({
            current, // 当前显示图片的http链接
            urls // 需要预览的图片http链接列表
          })
    },


    // 点击加入购物车
    heldCartAdd(){
        // 1获取缓存中的购物车 数组
        let cart=wx.getStorageSync('cart')||[];
        // 2判断商品对象是否存在于购物车数组中
        let index=cart.findIndex(v=>v.goods_id===this.GoodsObj.goods_id);
        if(index===-1){
            // 不存在  第一次添加
            this.GoodsObj.num=1;
            this.GoodsObj.checked=true;
            cart.push(this.GoodsObj);
        }else{
            // 已经存在购物车数据 执行 num++
            cart[index].num++;
        }
        // 吧购物车重新添加回缓存中
        wx.setStorageSync('cart', cart);
        // 弹出提示
        wx.showToast({
          title: '加入成功',
          icon:'success',
          mask:true,
        })
    },
    // 点击 商品收藏图标
    hanldeCollect(){
        let isCollect=false;
        // 获取缓存中的商品收藏数据
        let collect=wx.getStorageSync('collect')||[];
        // 判断该商品是否被收藏过
        let index=collect.findIndex(v=>v.goods_id===this.GoodsObj.goods_id);
        // 当index！=-1表示 已经收藏过了
        if(index!=-1){
            // 找到已经收藏过的在数组中删除该商品
            collect.splice(index,1);
            isCollect=false;
            wx.showToast({
              title: '取消成功',
              icon:'success',
              mask:true
            })
        }else{
            // 没有收藏过的
            collect.push(this.GoodsObj);
            isCollect=true;
            wx.showToast({
                title: '收藏成功',
                icon:'success',
                mask:true
              })
        }
        // 吧数组存入到缓存中
        wx.setStorageSync('collect', collect);
        // 修改data中的属性 isCollect
        this.setData({
            isCollect
        })
    }

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
})