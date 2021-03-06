/*
1 输入框绑定值改变事件 input事件
    1 获取输入框的值
    2 合法性判断
    3 检验通过 吧输入框的值 发送到后台
    4 返回的数据打印到页面上
防抖（防止抖动）定时器  节流
    防抖 一般 用在输入框中 防止重复输入  重复发送请求
    节流 一般是用在页面下拉和上拉
    定义全局的定时器id
*/
import { request } from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({
    data: {
        goods: [],
        // 按钮状态
        isFocus:false,
        // 输入框的值
        inpValue:''
    },
    TimeId: 1,
    // 输入框的值改变 就会触发的事件
    handleInput(e) {
        // 获取输入框的值
        const { value } = e.detail;
        // 检验合法性
        if (!value.trim()) {
            this.setData({
                goods:[],
                isFocus:false
            })
            // 值不合法
            return;
        };
        // 准备发送请求获取数据 使用防抖技术
        this.setData({
            isFocus:true
        })
        clearTimeout(this.TimeId);
        this.TimeId = setTimeout(() => {
            this.qsearch(value)
        }, 1000)

    },
    async qsearch(query) {
        const res = await request({ url: "/goods/qsearch", data: { query } });
        this.setData({
            goods: res
        })
    },
    handleCancel(){
        this.setData({
            inpValue:"",
            isFocus:false,
            goods:[]
        })
    }
})