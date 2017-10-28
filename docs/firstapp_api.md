# v0.1

# 一、赛事/活动相关api
```
Query: 请求时url中加入的参数
Body：POST提交的数据
      目前仅支持“application/x-www-form-urlencoded”格式
```
enroll_detail(报名详情)
```
  {
    eid: 唯一id(wxid+mid的md5值)
    title: 活动名称
    name: 选手姓名
    status: 报名状态
        0        报名成功
        1        待支付
        2        待审核
    created: 报名时间(Date)
  },
```

## 1.新建活动
## POST /api/match/new
__Query__

__Body__
- __type__ : String 活动类型
- __title__: String 活动名称
- __city__: String 城市
- __address__: String 具体地址
- __startDate__: String 开始日期 (YYYY-MM-DD格式)
- __endDate__: String 结束日期(YYYY-MM-DD格式)
- __topic__: String 形式/主题
- __swordClass__: Number 剑种（具体数字对应类型，单独配置）
- __coach__: String 教练名字（可选）
- __chiefJudge__: String 裁判长名字（可选）
- __group__: Number 组别（可选）

__Return__:
必要参数未给足，返回
```
{
  code: 1,
  msg: '缺少必要参数'
}
```
新建成功返回
```
{
  msg: "成功",
  code: 0,
  result: {
      mid: '12334',
      type: 'aaaaa',
      title: 'bbbbb',
      city: '北京',
      address: '天安门',
      startDate:  Date.now(),
      endDate: Date.now(),
      topic: '演习',
      swordClass: 1 或者对应的类型描述
      coach: '张三',
      chiefJudge: '李四',
      group: 1
  }
}
```
## 2. 查询指定活动 
## GET /api/match/detail
__Query__
- __mid__: String match的唯一id

__Return__
无效mid则返回
```
{
    code: 21,
    msg: '活动不存在'
}
```

查找成功返回的result雷同接口1的result，同时多一个字段enroll_list，单项为enroll_detail

## 3. 遍历所有活动（上线的）
## GET /api/match/list
__Query__

__Return__
返回的result是一个list/Array，单项数据同接口1

# 二、会员/剑手相关api
## 1. 注册
## POST /api/fencer/regist
__Query__

__Body__
- __wxid__: String 微信id
- __name__: String 姓名
- __birth__: String 生日 (YYYY-MM-DD)
- __gender__: Number 性别(0/1)
- __swordClass__: Number 剑种
- __address__: String 家庭住址
- __linkName__: String 联系人姓名
- __linkRelationship__: String 联系人关系
- __linkMobile__: String 联系人手机号码
- __linkEmail__: String 联系人邮箱
- __unit__: String 代表单位（可选）
- __school__: String 就读学校（可选）

__Return__
```
{
  msg: "成功",
  code: 0,
  result: {
      wxid: '5555555',
      name: '王麻子',
      birth: '2011年1月1日'(Date or String)
      gender: 0-女，1-男,
      swordClass: 5-重剑,
      address: '长安街1000号',
      link: {
        name: ‘王麻子他妈’,
        relationship: '母子',
        mobile： “13800138008”,
        email: 'wangmazi_mother@gg.com'
      },
      unit: '',
      school: '社会高中'
  }
}
```

## 2. 选手信息
## GET /api/fencer/info
__Query__
- __wxid__: String 微信id

__Return__:
没有wxid对应的选手则返回
```
{
    code: 11
    msg: '选手未注册'
}
```

查找成功返回的result雷同接口1的result，同时多一个字段enroll_list，单项为enroll_detail

# 三、报名相关api
## 1.选手报名赛事
## POST /api/enroll/join
__Query__

__Body__
- __mid__: String 活动id
- __wxid__: String 选手微信id

__Return__
未注册时返回
```
{
  code: 11,
  msg: '选手未注册'
}
```
活动不存在时返回
```
{
  code: 21,
  msg: '活动不存在'
}
```
选手已报名该赛事活动
{
  code: 22,
  msg: '选手已报名该赛事活动'
}

报名完成时返回如下（状态默认待支付），其中result为enroll_detail
```
{
  code: 0,
  msg: '成功',
  result: enroll_detail
}
```

## 2.查询单次报名详情
## GET /api/enroll/detail
__Query__
- __eid__:   String 唯一id（wxid+mid的md5值）

__Return__:
```
{
  code: 0,
  msg: '成功',
  result: {
    eid: 'aaaaaaaaa'
    mid: '123456',
    title: '活动名称',
    wxid: '55555555',
    name: '张三李四',
    status: 1 ——待支付
  }
}
```