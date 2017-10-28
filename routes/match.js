'use strict';
// 赛事活动相关接口

var express = require('express');
var router = express.Router();

var match = require('../mongodb').match;
var enroll = require('../mongodb').enroll;
var sc = require('../status_code');
var log = require('../utils/log');
var uuid = require('../utils/uuid');

router.post('/new', function(req, res, next) {
	let type = req.body.type;
	let title = req.body.title;
	let city = req.body.title;
	let address = req.body.address;
	let startDate = req.body.startDate; 	// yyyy-mm-dd
	let endDate = req.body.endDate;
	let topic = req.body.topic;
	let swordClass = req.body.swordClass;
	let coach = req.body.coach;
	let chiefJudge = req.body.chiefJudge;
	let group = req.body.group;

	log.info(req.body);
	if (!(type && title && city && address && startDate && endDate && topic && swordClass)) {
		res.send(sc.ERR_PARAM);
		return;
	}

	let data = {
		mid: uuid(),
		type: type,
		title: title,
		city: city,
		address: address,
		startDate: new Date(startDate),
		endDate: new Date(endDate),
		topic: topic,
		swordClass: swordClass,
		coach: coach,
		chiefJudge: chiefJudge,
		group: group
	};
	match.insert(data).then((record) => {
		log.info(`new match record: ${record}`);
		res.send(Object.assign(sc.SUCC, {result: record}));
	}, (err) => {
		log.error(`new match error: ${err}`);
		res.send(Object.assign(sc.ERR_DB, {err: err}));
	});
});

router.get('/detail', function(req, res, next) {
	let mid = req.query.mid;
	if (!mid) {
		res.send(sc.ERR_PARAM);
		return;
	}

	match.findOne({mid: {$eq: mid}}, {_id: false, __v: false}).then((record) => {
		if(!record) {
			log.warn(`match ${mid} not exist`);
			res.send(sc.MATCH_NOT_EXIST);
		} else {
			log.info(`get match ${mid} detail: ${record}`);
			enroll.find(
				{mid: {$eq: mid}}, 
				{_id: false, __v: false, mid: false, wxid: false}
				).then((records) => {
					let result = Object.assign(record._doc, {enroll_list: records});
					res.send(Object.assign(sc.SUCC, {result: result}));
			}, (err) => {
				log.error(`get match ${mid} enroll_list error: ${err}`);
				res.send(Object.assign(sc.ERR_DB, {err: err}));
			});
		}
	}, (err) => {
		log.error(`get match ${mid} error: ${err}`);
		res.send(Object.assign(sc.ERR_DB, {err: err}));
	});
});

router.get('/list', function(req, res, next) {
	match.find({softDel: {$eq: false}}, {_id: false, __v: false}).then((records) => {
		log.info(`list matchs result: ${records}`);
		res.send(Object.assign(sc.SUCC, {result: records}));
	}, (err) => {
		log.error(`list matchs error: ${err}`);
		res.send(Object.assign(sc.ERR_DB, {err:err}));
	});
});

module.exports = router;