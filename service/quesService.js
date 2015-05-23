/**
 * Created by mangosong on 5/15/15.
 */
var mysql = require('mysql');
var underscore = require('underscore');

var isAtHome = false;
var dbDown = false;

var mysqlURL = isAtHome ? '192.168.1.101' : 'titi.diskstation.me';

var pool = mysql.createPool({
    host     : mysqlURL,
    user     : 'bonbon',
    password : 'bonbon',
    database : 'bonbon',
    connectionLimit : 3
});

var question = {
    "pid":1,
    "name":"總統府",
    "photo_uri":"http://www.travel.taipei/d_upload_ttn/sceneadmin/pic/11000882.jpg",
    "options":"[\"外交部\", \"立法院\", \"行政院\"]",
    "geo_lon":"121.1054",
    "geo_lat":"29.504328",
    "miss_cnt":0,
    "hit_cnt":0,
    "catergory":"臺北市臺北旅遊網-景點資料(中文)",
    "tags":"政治",
    "visual_similarty":0,
    "description":"日本人統治臺灣，並不是一個單純的領土擴張，而是整個東亞殖民地計畫的第一步，所以處處都要是最好的模範，將來才好展示給其它「歸順」的新殖民地。在這個殖民地的目標下，他們學習的對象是西方，在臺灣蓋了很多歐洲巴洛克風格的建築，這些建築技術在今天看來都是很傑出的。 總統府是日據時期的總督府，於1919年完工，當時總督在辦公室面向東方，可以眺望到四獸山以內的整個臺北市，每天看著旭日東昇，擘劃著永續的宏圖偉業。從第7任總督開始，總共有13位總督在此辦公，光復後陳誠的東南軍政長官公署和中華民國行政院、中華民國總統府共用此建築，而後的歷任總統，均以此為總統府，在此日理萬機。"
};


var categories = ["文化", "景點", "宗教", "政治"];


var allQuestionQry = 'SELECT * FROM question_new';
var categoryQuestionQry = "SELECT * FROM question_new WHERE rid = '{category}'";
var categoryQuestionFromQIDQry = "SELECT * FROM question_new WHERE pid = {qID}";

var getQuestionData = function(category, callback){
    if(dbDown){
        setTimeout(function(){
            callback(question);
        }, 0);
    }else{
        var qryString = category ? categoryQuestionQry.replace(/{category}/g, category) : allQuestionQry;
        console.log(qryString);
        pool.query(qryString, function(err, rows, fields) {
            //connection.end();
            if (err) console.log(err.message);

            if(typeof callback === 'function'){
                if(rows.length === 0){
                    callback([]);
                }else{
                    callback(rows);
                }
            }
        });
    }
};

var getQuestionDataFromID = function(category, qID, callback){
    if(dbDown){
        setTimeout(function(){
            callback(question);
        }, 0);
    }else{
        var qryString = category && qID ? categoryQuestionFromQIDQry.replace(/{qID}/g, qID) : allQuestionQry;
        console.log(qryString);
        pool.query(qryString, function(err, rows, fields) {
            //connection.end();
            if (err) console.log(err.message);

            if(typeof callback === 'function'){
                if(rows.length === 0){
                    callback([]);
                }else{
                    callback(rows);
                }
            }
        });
    }
};

var getCategoriesData = function(res, callback){
    if(dbDown){
        setTimeout(function(){
            callback(categories);
        }, 0);
    }else{
        console.log('SELECT * FROM data_alias');
        pool.query('SELECT * FROM data_alias', function(err, rows, fields) {
            //connection.end();
            if (err) console.log(err.message);
            var categories = [];
            underscore.each(rows, function(row){
                categories.push({
                    data_set: row.data_set,
                    rid: row.rid
                });
            });
            if(typeof callback === 'function'){
                callback(categories);
            }
        });
    }
};

var updateQuestionData = function(qid, action, callback){
    if(dbDown){
        setTimeout(function(){
            callback(categories);
        }, 0);
    }else{
        var actionCol = action == 'hit' ? 'hit_cnt' : 'miss_cnt';
        var sql = "UPDATE question_new SET " + actionCol + " = " + actionCol + " + 1 WHERE pid = " + qid;
        console.log(sql);
        pool.query(sql, function(err, rows, fields) {
            //connection.end();
            if (err) console.log(err.message);

            if(typeof callback === 'function'){
                callback(categories);
            }
        });
    }
};


module.exports = {
    getQuestionData: getQuestionData,
    getCategoriesData: getCategoriesData,
    updateQuestionData: updateQuestionData,
    getQuestionDataFromID: getQuestionDataFromID
};