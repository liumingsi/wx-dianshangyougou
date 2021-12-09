// pages/goods_list/index.js
//用户上滑页面 滚动条触底 开始加载下一页数据
   // 找到滚动条触底事件 
   // 判断还有没有下一页数据
         // 获取到总页数  但只有总条数
               // 总页数 = Math.ceil(总条数 / 页容量  pagesize)
                        //  =Math.ceil(23 / 10)
                        // = 3
               // 获取到当前的页码  pagenum
               // 判断一下 当前的页码是否大于等于 总页数
                     // 表示 没有下一页数据

   // 假如没有下一页数据 弹出一个提示
   // 假如还有下一页数据 来加载下一页数据
         // 当前的页码 ++
         // 重新发送请求
         // 数据请求回来  要对data中的数组 进行 拼接   而不是全部替换
// 下拉刷新页面
   // 触发下拉刷新事件 需要在页面的json文件中开启一个配置项
   // 找到触发下拉刷新的事件
   // 重置 数据 数组
   // 重置页码 设置为1 
   // 重新发送请求




import { request } from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({

    /**
     * 页面的初始数据
     */
    data: {
       tabs:[
           {
          id:0,
          value:"综合",
          isActive:true,
       },
       {
        id:1,
        value:"数量",
        isActive:false,
     },
     {
        id:2,
        value:"价格",
        isActive:false,
     }
    ],
    goodsList:[]
    },
    //接口要的参数
    QueryParams:{
       query:"",
       cid:"",
       pagenum:1,
       pagesize:10
    },
    totalPages:1,

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
         this.QueryParams.cid=options.cid||"";
         this.QueryParams.query=options.query||"";
         this.getGoodsList();
    },
    //获取商品列表数据
    async getGoodsList(){
       const res=await request({url:"/goods/search",data:this.QueryParams});
      //  获取总条数
      const total=res.total;
      // 计算总页数
      this.totalPages=Math.ceil(total/this.QueryParams.pagesize);
       this.setData({
         //  拼接数组
          goodsList:[...this.data.goodsList,...res.goods]
       })

      //  关闭下拉刷新的窗口
      wx.stopPullDownRefresh();
    },
     //标题点击事件 从子组件传递过来
     tabsItemChange(e){ 
      //   1,获取被点击的标题索引
      const {index}=e.detail;
      // 修改原数组
      let {tabs}=this.data;
      tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
      //   赋值到data中
      this.setData({
         tabs
      })
     },
     onReachBottom(){
       if(this.QueryParams.pagenum>=this.totalPages){
       wx.showToast({
          title:"没有下一页数据了"
       })
       }else{
          this.QueryParams.pagenum++;
          this.getGoodsList();
       }
     },
     onPullDownRefresh(){
      //   重置数组
        this.setData({
           goodsList:[]
        })
      //   重置页码
      this.QueryParams.pagenum=1;
      // 发送请求
      this.getGoodsList();

     }
   
})