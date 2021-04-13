# 安装sdk

文档： https://leancloud.cn/docs/sdk_setup-js.html#hash175614496

按要求，下载 av-core-min.js，并移动到小程序的 libs 目录下

下载最新版本的 adapter 适配器文件 index.js，移动到 libs 目录，并将文件重命名为 leancloud-adapters-weapp.js

## 验证 sdk

微信小程序管控了可以访问的网站，所以需要进行以下设置：

在开发者工具中，选择右上角的 详情-> 本地设置 -> 勾选不校验合法域名

上述设置完成后，就可以在代码中使用 LeanCloud sdk 了