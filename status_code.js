module.exports = {
	SUCC: {code: 0, msg: '成功'},
	ERR_PARAM: {code: 1, msg: '缺少必要参数'},
	ERR_DB: {code: 2, msg: '数据库命令执行失败'},
    ERR_INNERR: {code: 3, msg: '内部错误'},
	FENCER_NOT_REGIST: {code: 11, msg: '选手未注册'},
    MATCH_NOT_EXIST: {code: 21, msg: '活动不存在'},
    ALREADY_ENROLLED: {code: 22, msg: '选手已报名该赛事活动'},
    PAY_FAILED: {code: 23, msg: '支付失败'},
};