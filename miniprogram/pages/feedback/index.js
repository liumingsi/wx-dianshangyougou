/*
1 点击 +号 触发tap点击事件
    1 调用小程序内置的选择图片的api
    2 获取到图片的路径数组
    3 把图片路径 存到data的变量中
    4 页面就可以根据 图片数组进行循环显示 需要自己定一个封装组件
点击 自定义组件图片
    获取被点击的元素的索引
    获取data中的图片数组
    根据索引 数组中删除对应的元素
    把数组重新设置回data中
点击 "提交"
    1 获取文本域的内容 类似 输入框的获取
        1 data中定义变量 表示 输入框的内容
        2 文本域 绑定输入事件 事件触发的时候 把输入框的值 存入到变量中
    2 对这些内容进行合法性验证
    3 验证通过 用户选择的图片 上传到专门的图片存储服务器 返回图片外网的链接
        遍历图片数组
        挨个上传
        自己在维护图片数组 存放 图片上传后的外网的链接
    4 文本域和外网的图片路径 一起提交到服务器
    5 清空当前页面
    6 返回上一页

*/

Page({
    data: {
        tabs: [
            {
                id: 0,
                value: "体验问题",
                isActive: true,
            },
            {
                id: 1,
                value: "商品、商家投诉",
                isActive: false,
            }
        ],
        // 被选中的图片路径  数组
        chooseImgs: [],
        textVal:''
    },
    // 外网的图片的路径数组
    UpLoadImg:[],
    tabsItemChange(e) {
        //   1,获取被点击的标题索引
        const { index } = e.detail;
        // 修改原数组
        let { tabs } = this.data;
        tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
        //   赋值到data中
        this.setData({
            tabs
        })
    },
    // 点击  + 号 选择图片
    handleChooseImg() {
        // 调用小程序内置的选择图片api
        wx.chooseImage({
            // 同时选中的图片数量
            count: 9,
            //   图片的格式  原图   压缩
            sizeType: ['original', 'compressed'],
            // 图片的来源  相册  照相机
            sourceType: ['album', 'camera'],
            success: (result) => {
                this.setData({
                    chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
                })
            }
        })
    },
    // 点击自定义图片组件
    handleRemoveImg(e) {
        // 获取被点击的组件的索引
        console.log(e);
        const { index } = e.currentTarget.dataset;
        // 获取data中的图片数组
        let { chooseImgs } = this.data;
        // 删除元素
        chooseImgs.splice(index, 1);
        this.setData({
            chooseImgs
        })
    },
    
    handleInput(e){
        this.setData({
            textVal:e.detail.value
        })
    },
    // 提交按钮的点击
    handleFormSubmit(){
        // 获取文本域的内容
        const {textVal,chooseImgs} = this.data;
        // 合法性的验证
        if(!textVal.trim()){
            // 不合法
            wx.showToast({
              title: '输入不合法',
              icon:'none',
              mask:true
            });
            return;     
        };
        // 显示正在等待的图片
        wx.showLoading({
          title: '正在上传',
          mask:true
        });
        // 判断有没有需要上传的图片数组
        if(chooseImgs.length!=0){
           chooseImgs.forEach((v, i) => {
            wx.uploadFile({
              // 图片上传到的位置
              url: 'https://img.coolcr.cn/api/upload',
              // 被上传的文件的路径
              filePath: v,
              // 上传的文件的名称 后台来获取文件 file
              name: "image",
              // 顺带的文本信息
              formData: {},
              success:(result)=>{
                let url=JSON.parse (result.data).data.url;
                this.UpLoadImg.push(url);
                // 所有的图片都上传完毕了才触发
                if(i===chooseImgs.length-1){
                    wx.hideLoading({
                      success: (res) => {},
                    })
                    console.log("把文本的内容和外网的图片数组 提交到后台中");
                    // 提交都成功了
                    // 重置页面
                    this.setData({
                        textVal:"",
                        chooseImgs:[]
                    })
                    // 返回上一个页面
                    wx.navigateBack({
                      delta: 1,
                    });
                }
              }
            })
          })
        }else{
            setTimeout(()=>{
                 wx.hideLoading({
                success: (res) => {},
              })
            },2000)
           
              console.log("只提交了文本");
              // 提交都成功了
              // 重置页面
              this.setData({
                  textVal:"",
              })
              // 返回上一个页面
              wx.navigateBack({
                delta: 1,
              });
            
        }   
    }
})

