import {request} from "../../request/index.js"
Page({
    data: {
        leftMenuList:[],
        rightContent:[],
        currentIndex:0,
        scrollTop:0
    },
  CertList:[],
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // web中的本地存储和小程序中的本地存储的区别
            // 写法不一样了
                //  web：localStorage.setItem("key","value")存数据；locationStorage.getItem("key")获取数据
                // 小程序：wx.setStorageSync("key","value")存数据;wx.getStorageSync('key')获取数据
            // 存的时候  有没有做类型转换
            // web:不管存入的是什么类型的数据，都会把数据变成字符串类型在存入
            // 小程序：没有类型转换，存入什么类型的数据，获取的时候就是什么类型的数据

            // 先判断一下本地存储中有没有旧数据
            // {time：Date.now(),data:[...]}
            // 如果没有旧数据 则直接发送新请求
            // 如果有旧数据且没有过期 就使用本地的旧数据即可

            // 获取本地存储中的数据
            const CertList = wx.getStorageSync('CertList')
            if(!CertList){
                // 不存在 发送请求获取数据 
                this.getCertList()
            }else{
                // 有旧数据 定义过期时间 10s
                if(Date.now() - CertList.time > 1000 * 10){
                    // 重新发送请求
                    this.getCertList();
                }else{
                    // 可以使用旧数据
                    this.CertList = CertList.data;
                    let leftMenuList=this.CertList.map(v=>v.cat_name);
                    // 构造右侧的商品数据
                    let rightContent=this.CertList[0].children
                    this.setData({
                    leftMenuList,
                    rightContent,
                      })
                }
            }
       
    },
    // 获取分类数据
  async  getCertList() {
        // request({
        //         url: "/categories"
        //     })
        //     .then(result => {
               
        //         this.CertList = result.data.message; 
               
        //         // 把接口的数据存入到本地存储中
        //         wx.setStorageSync('CertList',{time:Date.now(),data:this.CertList})
        //          // 构造左侧的大菜单数据
        //             let leftMenuList=this.CertList.map(v=>v.cat_name);
        //             // 构造右侧的商品数据
        //             let rightContent=this.CertList[0].children
        //         this.setData({
        //             leftMenuList,
        //             rightContent,
        //         })
        //     })

        // 使用es7的async await来发送请求
        const result = await request({url:"/categories"});
        this.CertList = result;  
        // 把接口的数据存入到本地存储中
        wx.setStorageSync('CertList',{time:Date.now(),data:this.CertList})
            // 构造左侧的大菜单数据
            let leftMenuList=this.CertList.map(v=>v.cat_name);
            // 构造右侧的商品数据
            let rightContent=this.CertList[0].children
        this.setData({
            leftMenuList,
            rightContent,
        })
    },
    // 左侧菜单的点击事件
    handIndex(e){
        // 获取被点击的标题索引值
        // 给data中的currentIndex赋值就可以了
    //    根据不同的索引值来渲染右侧的商品内容 
        const {index} = e.currentTarget.dataset;
    
        let rightContent=this.CertList[index].children
        this.setData({
            currentIndex:index,
            rightContent,
            scrollTop:0,
        })
    }

})