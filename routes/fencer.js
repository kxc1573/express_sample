'use strict';
// 运动员/会员相关接口

var express = require('express');
var router = express.Router();

var fencer = require('../mongodb').fencer;
var enroll = require('../mongodb').enroll;
var sc = require('../status_code');
var log = require('../utils/log');

router.post('/regist', function(req, res, next) {
	let wxid = req.body.wxid;
	let name = req.body.name;
	let birth = req.body.birth;		// yyyy-mm-dd
	let gender = req.body.gender;
	let swordClass = req.body.swordClass;
	let address = req.body.address;
	let linkName = req.body.linkName;
	let linkRelationship = req.body.linkRelationship;
	let linkMobile = req.body.linkMobile;
	let linkEmail = req.body.linkEmail;
	let unit = req.body.unit;
	let school = req.body.school;

	if (!(wxid && name && birth && gender && swordClass && address && 
		linkName && linkRelationship && linkMobile && linkEmail)) {
		res.send(sc.ERR_PARAM);
		return;
	}

	let data = {
		wxid: wxid,
		name: name,
		birth: new Date(birth),
		gender: gender,
		swordClass: swordClass,
		address: address,
		linkman: {
			name: linkName,
			relationship: linkRelationship,
			mobile: linkMobile,
			email: linkEmail,
		},
		unit: unit,
		school: school,
	};
	fencer.insert(data).then((record) => {
		log.info(`fencer regist record: ${record}`);
		res.send(Object.assign(sc.SUCC, {result: record}));
	}, (err) => {
		log.error(`fencer regist error: ${err}`);
		res.send(Object.assign(sc.ERR_DB, {err: err}));
	});
});

router.get('/info', function(req, res, next) {
	let wxid = req.query.wxid;

	if (!wxid) {
		res.send(sc.ERR_PARAM);
		return;
	}

	fencer.findOne({wxid: {$eq: wxid}}, {_id: false, __v: false}).then((record) => {
		if (!record) {
			log.warn(`fencer ${wxid} not find`);
			res.send(sc.FENCER_NOT_REGIST);
			return;
		} else {
			log.info(`fencer ${wxid} info: ${record}`);
			let result = record._doc;
			enroll.find(
				{wxid: {$eq: wxid}},
				{_id: false, __v: false, mid: false, wxid: false}
				).then((records) => {
					result.enroll_list = records;
					res.send(Object.assign(sc.SUCC, {result: result}));
			}, (err) => {
				log.error(`get fencer ${wxid} enroll_list info error: ${err}`);
				res.send(Object.assign(sc.ERR_DB, {err: err}));
			});
		}
	}, (err) => {
		log.error(`get fencer ${wxid} info error: ${err}`);
		res.send(Object.assign(sc.ERR_DB, {err: err}));
	});
});

module.exports = router;