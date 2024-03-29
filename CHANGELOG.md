# <small>sqle-ui [依赖升级](https://github.com/actiontech/sqle-ui/pull/257)后的变更</small>

* [x] [fix]: 修改 i18n 插值配置 <https://github.com/actiontech/sqle-ui/pull/258>  
* [x] [fix]: 修复同步数据源页面路由错误的问题 <https://github.com/actiontech/sqle-ui/pull/259>(dms 中 sqle 的同步外部数据源已移除)
* [x] [fix]: 修复订阅审核失败消息表单数据错误的问题 <https://github.com/actiontech/sqle-ui/pull/260>
* [x] [feature]: 添加数据源时根据数据源类型自动切换默认端口 <https://github.com/actiontech/sqle-ui/pull/263>
* [x] [test]: 完成遗留的单元测试问题 <https://github.com/actiontech/sqle-ui/pull/264>
* [x] [feature]: API服务里，工单执行完成后，可以提供一个回调地址去通知调用API的服务 <https://github.com/actiontech/sqle-ui/pull/266>
* [x] [fix]: 修复 sql 审核结果列表中的 执行语句未高亮的问题 <https://github.com/actiontech/sqle-ui/pull/267>
* [x] [fix]: 添加 renderOrderDesc 并修改创建工单的工单名称的正则校验 <https://github.com/actiontech/sqle-ui/pull/268>
* [x] [feature]: 工单上线中止功能. 补充 useGenerateOrderStepInfo 单元测试 <https://github.com/actiontech/sqle-ui/pull/269>
* [x] [fix]: 问题修复: 在点击工单概览中被禁用的按钮时，会切换到其他的tab选项卡  <https://github.com/actiontech/sqle-ui/pull/275>
* [x] [chore]: 2.2305.0 界面优化 <https://github.com/actiontech/sqle/issues/1508>
* [x] [fix]: react-monaco-editor 组件全部添加属性:  automaticLayout: true, 解决生产环境下在弹窗里第一次打开时无法输入的问题. <https://github.com/actiontech/sqle-ui/pull/276> (dms 中已更换成 @monaco-editor/react)
* [x] [chore]: 2.2306.0 界面优化 <https://github.com/actiontech/sqle/issues/1549>
* [x] [feature]: 工单列表支持工单号展示以及筛选 <https://github.com/actiontech/sqle-ui/pull/280>
* [x] [chore]: 项目成员界面优化(dms中已移除此页面) <https://github.com/actiontech/sqle-ui/pull/278> (该页面在 dms 已移除)
* [x] [feature]: 全局配置添加 操作记录的过期时间配置项 <https://github.com/actiontech/sqle-ui/pull/281> (需要后端支持)
* [x] [feature]: 优化系统配置中开关的交互流程 <https://github.com/actiontech/sqle-ui/pull/283> (已将 sqle 下的登录对接已经消息推送迁移至dms下, 并更新为最新版本代码)
* [x] [feature]: 支持格式化 SQL 语句 <https://github.com/actiontech/sqle-ui/pull/284>
* [x] [feature]: 添加公共组件 EnterpriseFeatureDisplay 统一处理 ce 模式与 ee 模式下的某些页面的不同表现 <https://github.com/actiontech/sqle-ui/pull/285>
* [x] [fix]: 修复: 对创建好的扫描任务中的数据源跟数据库进行移除，点击保存之后还存在 <https://github.com/actiontech/sqle-ui/pull/287>
* [x] [fix]: 修复: 格式化 SQL 语句后审核时解析出错(后续格式化功能可能会移至后端处理) <https://github.com/actiontech/sqle-ui/pull/288>
* [x] [chore]: 一些界面优化:  <https://github.com/actiontech/sqle-ui/pull/289>  <https://github.com/actiontech/sqle-ui/pull/290>
* [x] [fix]:系统设置中 Webhook 配置文案错误 以及 测试微信推送永远显示成功  <https://github.com/actiontech/sqle-ui/pull/291>
* [x] [feature]: 重构项目概览页面 <https://github.com/actiontech/sqle-ui/pull/292>
* [x] [chore]: 界面优化长期任务【2.2307.0】 <https://github.com/actiontech/sqle/issues/1658>
* [x] [feature]: 新增自定义规则页面 <https://github.com/actiontech/sqle-ui/pull/294>
* [x] [fix]: 在不同时间段执行 Order/Detail/index.test.tsx 和  AuditResultCollection.test.tsx 时, 生成的快照文件不一致. 原因: 这两个页面中有些按钮的状态需要通过当前时间和工单概览接口返回的数据源运维时间做判断, 由于在 test case 中未 mock 当前时间, 导致不同时间段的按钮状态不一致. <https://github.com/actiontech/sqle-ui/pull/298>
* [x] [fix]: 将 RuleList 中的 ALL Tab 固定在第一位. 优化自定义规则表单. 优化创建完自定义规则后的页面展示. 创建规则模板和修改规则模板新增参数: is_custom_rule. <https://github.com/actiontech/sqle-ui/pull/299>
* [x] [feature]: 页面增加数据库Logo 遗留问题: 1. selectOptionByIndex 方法改造, 支持自定义的 option. 2. 图片资源缓存问题 <https://github.com/actiontech/sqle-ui/pull/301>
* [x] [test]: 增加 selectCustomOptionByClassName 并修改部分单元测试 <https://github.com/actiontech/sqle-ui/pull/303>
* [x] [fix]: 补充系统配置的单元测试, 测试企业微信配置时添加字段校验 <https://github.com/actiontech/sqle-ui/pull/302>
* [x] [fix]: 规则列表分类进行排序, 优化编辑规则模板时的规则列表样式  <https://github.com/actiontech/sqle-ui/pull/304>
* [x] [chore]: 项目概览界面中数据源最小单位改成1，数据源tips提示文案修改, 没有任何工单时总计显示 0. <https://github.com/actiontech/sqle-ui/pull/305>
* [x] [fix]:修复在创建自定义规则时先修改了按钮状态然后才进行表单校验, 导致按钮状态未复原的问题 <https://github.com/actiontech/sqle-ui/pull/306>
* [x] [feature]: 项目概览的工单状态报表添加 正在上线 状态 <https://github.com/actiontech/sqle-ui/pull/308>
* [x] [chore]: 测试企业微信配置时接收着UserId 添加 tips <https://github.com/actiontech/sqle-ui/pull/309>

* [ ] [chore]: 扩宽部分表单 name 限制长度: <https://github.com/actiontech/sqle-ui/pull/310>
* [ ] [feature]: 工单列表添加筛选项, 导出历史工单同时添加该筛选条件 <https://github.com/actiontech/sqle-ui/pull/311>
* [ ] [feature]: 支持导出 智能扫描 审核报告 <https://github.com/actiontech/sqle-ui/pull/312>
