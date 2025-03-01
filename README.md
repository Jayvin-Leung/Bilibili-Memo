<p align="center"><img width="300" src="https://github.com/user-attachments/assets/d19a3c11-21fc-49cc-9193-6f2423e7305a"></p>
<p align="center">B站收藏视频备注+自动备份、视频笔记下载、分p/合集视频随机播放……</p>

## 安装

- Greasyfork：https://greasyfork.org/zh-CN/scripts/528432
- Greasyfork镜像：https://gfork.dahi.icu/zh-CN/scripts/528432
- Github：https://github.com/Jayvin-Leung/Bilibili-Memo/releases
- Gitee：https://gitee.com/Jayvin_Leung/Bilibili-Memo/releases

## 注意事项

- 该项目是一款油猴脚本插件，需要依赖脚本管理器来运行，如Tampermonkey（篡改猴）或Violentmonkey（暴力猴）等
- 该插件是个三合一功能合集，可以单独使用其中的一个或多个，但所有功能的代码逻辑会完整加载
- 该插件基于B站的「新版」网页端（B站个人空间可切换新版/旧版）制作，部分功能在旧版网页端中无法使用
- 本人能力有限，只对插件进行了轻度测试以确保功能正常稳定，但仍可能存在未测试到的bug，当然，有问题我会尽快跟进处理，同时也希望大家多多提出改进建议

**如果您能接受以上几点，那么请继续往下查看该插件的功能描述，如果符合您的需求，欢迎安装使用！！！**

## 主要功能

什么？收藏了一大堆视频？但忘了当初为什么收藏？

**收藏视频备注**

- 支持在收藏视频时添加备注信息
- 支持在收藏夹中快速查看和管理各个视频的备注信息

**备份数据至云端**

- 支持将插件数据（如收藏视频的备注信息等）备份到云端（金山文档WPS），并按情况从云端恢复到本地
- 支持按时间间隔自动备份，减轻老是忘记备份的烦恼
- 同时也提供常见的导入导出功能，多种备份手段组合使用

收藏视频备注+数据备份，让你轻松跨浏览器管理B站收藏夹，不忘收藏初心，让视频收藏更有意义！！！

> [!CAUTION]
> 数据资产无比珍贵，任何单一手段都无法保障数据绝对安全，请务必做好二手容灾补救措施！！！

## 其他功能

**视频笔记下载**

- 支持将私人笔记内容转换为符合Markdown语法的.md文件并下载到本地
- 支持自定义Markdown语法，包括加粗、列表等样式
- 支持根据时间标记分割笔记内容并按分p组合到对应分p标题下
- 合集视频支持下载合集中的所有的私人笔记

**分p/合集视频的列表随机播放**

- 支持自动、点击、快捷键、蓝牙多种方式随机切换下一个
- 支持单个页面开启/关闭而不影响其他页面
- 适合分p/合集视频听歌时使用

## 使用说明

详情请查看：https://www.bilibili.com/video/BV1Q2XRYyETJ

**收藏视频备注**

![20250301173359_收藏夹备注3](https://github.com/user-attachments/assets/bc97cce2-e08b-4b2f-bc08-b91f5a329c84)
![20250301173309_收藏夹备注2](https://github.com/user-attachments/assets/d1be12a5-8992-4fef-bf90-6936f3a51ff0)
![20250301173218_收藏夹备注1](https://github.com/user-attachments/assets/0ae969c6-95bc-4988-af0a-c9a2ebfd848d)

**视频笔记下载**

![20250301173515_视频笔记下载](https://github.com/user-attachments/assets/3ced2036-583b-4161-971d-63a12399344a)

**列表随机播放**

![20250301173614_随机播放1](https://github.com/user-attachments/assets/a9cc9869-d651-45b4-978d-c72556f0c930)

**页面展示**

![20250301173843_展示2](https://github.com/user-attachments/assets/1b353a72-00d8-4dc9-981e-2f67635ce943)
![20250301173725_展示](https://github.com/user-attachments/assets/17f17c67-3823-474c-86a4-5cb04a799a8c)

## 兼容性

本人开发测试所用环境如下，理论上等于或高于我所使用的版本即可

- 系统：Windows 7 Service Pack 1 64位
- 浏览器：chrome(109.0.5414.120)、firefox(115.1.0esr)、edge(109.0.1518.140)
- 脚本管理器：Tampermonkey(5.1.1)、Violentmonkey(2.30.0)

## 后续计划

- 优化标签功能，提供快速选择，支持自定义管理
- 新增按备注信息搜索的功能
- 新增标签筛选功能，支持按单个或多个标签筛选过滤搜索结果
- ……

## 参考感谢

- https://github.com/SocialSisterYi/bilibili-API-collect
- https://github.com/magicdawn/Bilibili-Gate
