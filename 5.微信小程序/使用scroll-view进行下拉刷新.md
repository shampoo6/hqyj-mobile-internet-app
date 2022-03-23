# 使用scroll-view进行下拉刷新

- 创建 `scroll-view` 如下
  ```html
  <!-- 
      给scroll-view添加下拉刷新功能
      当高度为动态计算的高度时 一定要给高度设置初始值 例如：style="height: {{scrollHeight || 666}}px" 或者 scrollHeight 初始设置为 666

      refresher-enabled 开启下拉刷新功能
      refresher-default-style 下拉时三个点的颜色
      refresher-background 下拉框背景色
      refresher-triggered 是否触发刷新 true 为触发 false 为关闭 当设置为false时将关闭下拉刷新
      bindrefresherrefresh 绑定下拉刷新事件
  -->
  <scroll-view class="my-navbar" scroll-y style="height: {{scrollHeight}}px" refresher-enabled refresher-default-style="white" refresher-background="pink" refresher-triggered="{{triggered}}" bindrefresherrefresh="onPullDownRefresh">
    ...
    页面内容写在这里
    ...
  <scroll-view>
  ```
- 实现页面依赖的 `js`
  ```js
  // js 代码的 data 和 onPullDownRefresh 如下
  Page({
    ...

    data: {
        triggered: false,
        scrollHeight: 1024, // 滚动区域高度
    },

    onPullDownRefresh() {
        this.setData({triggered: true}) // 开启刷新状态
        // todo 做刷新需要做的事情 这里用定时器来模拟网络请求
        setTimeout(()=>{
            this.setData({triggered: false}) // 只要设置 triggered 下拉刷新就会关闭
        }, 3000)
    }
  })
  ```
- 动态设置 `scroll-view` 高度
  ```js
  Page({
    ...
    // 在 onReady 事件中添加如下代码
    onReady() {

        // 这里由于使用了自定义的 van-nav-bar 所以需要获取元素高度
        // 然后使用设备高度减去 van-nav-bar 高度 得到最终 scroll-view 高度



        // 读取组件内元素的信息
        // 获取要读取的组件
        const component = this.selectComponent('.my-navbar')
        console.log(component);
        // 调用 in 函数，将组件 component 作为参数传入
        let query = wx.createSelectorQuery().in(component)
        // 下面其余部分和普通的查询元素一样
        let nodeRef = query.select('.van-nav-bar')
        nodeRef.fields({
            size: true
        }, (res) => {
            // 该 res 就是查询的结果
            console.log(res)
            // this.setData({ scrollHeight: 'calc(100% - ' + res.height + 'px)' })

            // wx.getSystemInfoSync() 同步获取设备信息
            // wx.getSystemInfoSync().windowHeight 设备显示屏的像素高度
            // wx.getSystemInfoSync().windowWidth 设备显示屏的像素宽度
            // res.height 导航栏高度
            this.setData({
                scrollHeight: wx.getSystemInfoSync().windowHeight - res.height
            })
        }).exec()
    },
    ...
  })

  ```