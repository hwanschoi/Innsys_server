var express = require('express');
var async = require("async");
var multiparty = require('multiparty');
var router = express.Router();
var fs = require('fs');

function userInfo() { }
function summaryRequestCounselItem() { }
function counselItem() { }
function expertInfo() { }

exports.parseuserInfo = function(doc){
    var ui = new userInfo();
    ui.id = doc._doc.id;
    ui.password = doc._doc.password;
    ui.name = doc._doc.name;
    ui.nickname = doc._doc.nickname;
    ui.email = doc._doc.email;
    ui.address = doc._doc.address;
    ui.auth = doc._doc.auth;
    ui.interest_area = doc._doc.interest_area;
    ui.phone_number = doc._doc.phone_number;
    ui.gender = doc._doc.gender;
    ui.job = doc._doc.job;
    ui.created_at = doc._doc.created_at;
    ui.updated_at = doc._doc.updated_at;

    return ui;
};

exports.parseExpertInfo = function(doc) {
    var ei = new expertInfo();
    ei.email = doc._doc.email;
    ei.password = doc._doc.password;
    ei.nickname = doc._doc.nickname;
    return ei;
};

exports.parseSummaryRequestCounselItem = function(doc) {
    var trc = new summaryRequestCounselItem();
    trc.id = doc._doc._id.toString();
    trc.user_id = doc._doc.user_id;
    trc.name = doc._doc.name;
    trc.nickname = doc._doc.nickname;
    trc.title = doc._doc.title;
    trc.age = doc._doc.age;
    var moment = require('moment');
    var formattedDate = moment(doc._doc.created_at).format('MM-DD HH:mm');
    trc.created_at = formattedDate;
    trc.measure_part = doc._doc.measure_part;
    trc.text = doc._doc.text;
    trc.img_thumbnail_path = doc._doc.img_thumbnail_path;
    return trc;
};

exports.parseCounselItem = function(model) {
    var ci = new counselItem();
    ci.id = model._id;
    ci.request_counsel_id = model.request_counsel_id;
    ci.parentId = model.parentId;
    ci.expert_id = model.expert_id;
    ci.expert_nick = model.expert_nick;
    ci.title = model.title;
    ci.text = model.text;
    ci.created_at = model.created_at;
    ci.updated_at = model.modify_date;
    ci.attach_file = model.attach_file;
    return ci;
};

exports.createCounselItem = function(expertInfo, requestCounselItemId, parentId, text) {
    var ci = new counselItem();
    ci.request_counsel_id = requestCounselItemId;
    ci.parentId = parentId;
    ci.expert_id = expertInfo.email;
    ci.expert_nick = expertInfo.nickname;
    ci.text = text;
    ci.created_at = new Date();
    ci.updated_at = new Date();
    ci.attach_file = "";
    return ci;
};