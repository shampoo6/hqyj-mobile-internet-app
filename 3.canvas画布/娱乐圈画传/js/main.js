// 配置参数
const canvasWidth = 375 // 画布大小
const canvasHeight = 603
const btnDelayTime = 1000 // 按钮延迟
let imgMoveSpeed = 5 // 每帧图像移动像素值
const fps = 60 // 动画帧数
let timer = null

// 图片数据
const id = {
    w: 1875, // 原图宽
    h: 3015, // 原图高
    sWidth: 383, // 需要绘制的原图宽度
    sHeight: 611,// 需要绘制的原图高度
    sx: 1375, // 原图上绘图的起始横坐标
    sy: 100, // 原图上绘图的起始纵坐标
}

// 每帧绘图函数
// function step(ctx, img) {
//
//     // 按比例计算新的sx和sy
//     let newSx = id.sx - imgMoveSpeed
//     newSx = newSx > 0 ? newSx : 0
//     let newSy = newSx > 0 ?
//         newSx / (id.sx / id.sy) :
//         0
//
//     // 计算新宽度
//     let newWidth = id.w
//     let newHeight = id.h
//
//     if (newSx > 0) {
//         let newSx2 = (- newSy) / (- id.sy / - (id.w - (id.sx + id.sWidth)))
//         newSx2 += id.w
//         newWidth = newSx2 - newSx
//         // 按比例计算高度
//         newHeight = newWidth / (id.sWidth / id.sHeight)
//     }
//
//     // ctx.drawImage(img, id.sx, id.sy, id.sWidth, id.sHeight, 0, 0, canvasWidth, canvasHeight)
//     ctx.drawImage(img, newSx, newSy, newWidth, newHeight, 0, 0, canvasWidth, canvasHeight)
//
//     // 赋值id
//     id.sx = newSx
//     id.sy = newSy
//     id.sWidth = newWidth
//     id.sHeight = newHeight
// }

// imgData 是 ImageData 类实例
function step(ctx, imgData) {

    let img = imgData.img

    // 按比例计算新的sx和sy
    let newSx = id.sx - imgMoveSpeed
    newSx = newSx > 0 ? newSx : 0
    let newSy = newSx > 0 ?
        newSx / (id.sx / id.sy) :
        0

    // 计算新宽度
    let newWidth = id.w
    let newHeight = id.h

    if (newSx > 0) {
        let newSx2 = (-newSy) / (-id.sy / -(id.w - (id.sx + id.sWidth)))
        newSx2 += id.w
        newWidth = newSx2 - newSx
        // 按比例计算高度
        newHeight = newWidth / (id.sWidth / id.sHeight)
    }

    // ctx.drawImage(img, id.sx, id.sy, id.sWidth, id.sHeight, 0, 0, canvasWidth, canvasHeight)
    ctx.drawImage(img, newSx, newSy, newWidth, newHeight, 0, 0, canvasWidth, canvasHeight)

    // 赋值id
    id.sx = newSx
    id.sy = newSy
    id.sWidth = newWidth
    id.sHeight = newHeight


    // 绘制上一张图片

    let prev = imgData.prevImg
    if (!prev) return

    // 绘制一张大图来遮挡模糊的区域
    // 用来解决图像模糊的问题
    let leftWidth = imgData.sx - id.sx
    let topWidth = imgData.sy - id.sy

    let dx = (leftWidth / id.sWidth) * canvasWidth
    let dy = (topWidth / id.sHeight) * canvasHeight

    let dw = (imgData.sWidth / id.sWidth) * canvasWidth
    let dh = (imgData.sHeight / id.sHeight) * canvasHeight

    ctx.drawImage(prev.img, 0, 0, prev.w, prev.h, dx, dy, dw, dh)
}


// 开始播放动画
// img 是 imageData 对象
function startPlay(ctx, img, overCallback) {
    timer = setInterval(() => {
        // 终止循环的判断
        if (id.sx === 0) {
            stopPlay()
            overCallback()
            return
        }

        step(ctx, img)
    }, 1000 / fps)
}

// 停止播放
function stopPlay() {
    clearInterval(timer)
    timer = null
}

class ImageData {
    img // img 标签
    w // 原图宽
    h // 原图高
    sWidth // 需要绘制的原图宽度
    sHeight // 需要绘制的原图高度
    sx // 原图上绘图的起始横坐标
    sy // 原图上绘图的起始纵坐标

    prevImg // 上一个ImageData数据

    constructor(img, w, h, sWidth, sHeight, sx, sy) {
        this.img = img
        this.w = w
        this.h = h
        this.sWidth = sWidth
        this.sHeight = sHeight
        this.sx = sx
        this.sy = sy
    }
}

class Player {
    imgs // 播放图片的 ImageData 队列

    currentImg // 当前正在播放的图片

    constructor(imgs) {
        this.imgs = imgs
        this.next()
    }

    play(ctx) {
        // if (!this.currentImg) {
        //     if (this.imgs.length === 0) return
        //     this.next()
        // }
        startPlay(ctx, this.currentImg, () => {
            // play over
            // 销毁当前图片
            // this.currentImg.img.remove()
            // this.currentImg = null
            if (this.imgs.length === 0) return
            this.next()
            this.play(ctx)
        })
    }

    next() {
        // 保存上一个图片信息
        let prevImg = this.currentImg
        this.currentImg = this.imgs.shift()
        this.currentImg.prevImg = prevImg
        id.w = this.currentImg.w
        id.h = this.currentImg.h
        id.sWidth = this.currentImg.sWidth
        id.sHeight = this.currentImg.sHeight
        id.sx = this.currentImg.sx
        id.sy = this.currentImg.sy
    }

    stop() {
        stopPlay()
    }
}
