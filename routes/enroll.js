'use strict';
// 报名相关接口

var crypto = require('crypto');

var express = require('express');
var router = express.Router();

var enroll = require('../mongodb').enroll;
var fencer = require('../mongodb').fencer;
var match = require('../mongodb').match;
var sc = require('../status_code');
var log = require('../utils/log');

function get_eid (mid, wxid) {
	return crypto.createHash('md5').update(mid + wxid).digest('hex');
}

router.post('/join', function(req, res, next) {
	let mid = req.body.mid;
	let wxid = req.body.wxid;

	if (!(mid && wxid)) {
		res.send(sc.ERR_PARAM);
		return;
	}

	let name;
	let title;
	let eid = get_eid(mid, wxid);
	try {
		// 检查是否注册为会员
		fencer.findOne({wxid: {$eq: wxid}}).then((user) => {
			if (!user) {
				log.error(`fencer ${wxid} not registed`);
				res.send(sc.FENCER_NOT_REGIST);
				return;
			}
			name = user.name;
			
			// 检查活动存在
			match.findOne({mid: {$eq: mid}}).then((matchINDB) => {
				if (!matchINDB) {
					log.error(`match ${mid} not exist`);
					res.send(sc.MATCH_NOT_EXIST);
					return;
				}
				title = matchINDB.title;

				// 检测重复报名
				enroll.findOne({eid: {$eq: eid}}).then((enrollINDB) => {
					if (enrollINDB) {
						log.error(`fencer ${wxid} already enroll match ${mid}`);
						res.send(Object.assign(sc.ALREADY_ENROLLED, {eid: eid}));
						return;
					}

					// 待支付

					// 新建
					let data = {
						eid: eid,
						mid: mid,
						title: title,
						wxid: wxid,
						name: name,
						// status: 0,
					};
					enroll.insert(data).then((enrollNEW) => {
						log.info(`fencer ${wxid} enroll match ${mid} success`);
						res.send(Object.assign(sc.SUCC, {result: enrollNEW}));
					});
				});
			});
			 
		});
	} catch (e) {
		res.send(Object.assign(sc.ERR_INNERR, {err: e}));
	}
});


router.get('/detail', function(req, res, next) {
	let eid = req.query.eid;
	if (!eid) {
		res.send(sc.ERR_PARAM);
		return;
	}

	enroll.findOne({eid: {$eq: eid}}, {_id: false, __v: false}).then((record) => {
		log.info(`get enroll ${eid} detail`);
		res.send(Object.assign(sc.SUCC, {result: record}));
	}, (err) => {
		log.error(`get enroll ${eid} error`);
		res.send(Object.assign(sc.ERR_DB, {err: err}));
	});
});

module.exports = router;
