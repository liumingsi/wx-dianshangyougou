// pages/login/index.js
Page({
    data:{
    },
    hanldleGetUserProfile(e){
       wx.getUserProfile({
          desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
          success: (res) => {
            this.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            });
            const {userInfo} = this.data;
            wx.setStorageSync('userInfo',userInfo);
            wx.navigateBack({
              delta: 1,
            })
          }
        })
    }
 
})