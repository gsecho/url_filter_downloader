# File Downloader

URL filter Downloader - chrome-extension
---
    chrome MP3 下载扩展。
    我主要用于听MP3（http://music.163.com/）时自动下载并保存到指定目录。
    URL过滤并自动添加一个下载任务。
 
原理
---
    通过运行一个bg.js在后台监听指定的URL与文件后扩展名（正则匹配），当URL加载完成时，
    自动添加一个下载任务。
    比较流量，相关于同一个文件加载2次（原网页请求与下载请求）。
    判断是否下载过功能，是通过搜索下载历史，即如果清了下载历史会重复下载。
    由于下载选项是“覆盖同名文件”，所以此处文件要唯一。本扩展取URL未的文件名。
    
![设置截图][1]

TODO:
---
    保存下载历史到localStorage,而不是通过搜索下载历史。


  [1]: https://github.com/toontong/url_filter_downloader/blob/master/440x280.png