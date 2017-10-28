/**
 * The database schemas
 */

// 联系人
var LINKMAN = {
    name: String,               // 姓名
    relationship: String,       // 关系
    mobile: String,             // 电话
    email: String,              // 电子邮件
    _id: false
};

module.exports = {
    // 赛事活动
    MATCH: {
        mid: {type: String, required: true, uniqueue: true},
        type: {type: String, required: true},       // 活动类型
        title: {type: String, required: true},      // 活动名称
        city: {type: String, required: true},       // 城市
        address: {type: String, required: true},    // 具体地址
        startDate: {type: Date, required: true},    // 开始日期
        endDate: {type: Date, required: true},      // 结束日期
        topic: {type: String, required: true},      // 形式/主题
        swordClass: {type: Number, required: true}, // 剑种
        coach: String,                              // 教练
        chiefJudge: String,                         // 裁判长
        group: Number,                              // 组别   
        softDel: {type: Boolean, default: false},
        created: {type: Date, default: Date.now}
    }, 

    // 剑手/击剑运动员
    FENCER: {
        wxid: {type: String, required: true, uniqueue: true},   // 微信id
        name: {type: String, required: true},       // 姓名
        birth: {type: Date, required: true},        // 出生日期
        gender: {type: Number, required: true},     // 性别
        swordClass: {type: Number, required: true}, // 剑种
        address: {type: String, required: true},    // 家庭住址
        linkman: LINKMAN,                           // 联系人
        unit: String,                               // 代表单位
        school: String,                             // 就读学校     
        created: {type: Date, default: Date.now}
    },

    // 报名记录
    ENROLL: {
        eid: {type: String, required: true, uniqueue: true},
        mid: {type: String, required: true},        // 活动id
        title: {type: String, required: true},      // 活动名称
        wxid: {type: String, required: true},       // 剑手微信id
        name: {type: String, required: true},       // 剑手姓名
        status: {type: Number, required: true, default: 1},     // 报名状态
        created: {type: Date, default: Date.now}
    }
};