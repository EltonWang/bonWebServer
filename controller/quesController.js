var quesService = require('../service/quesService.js');
var async = require('async');
var authentication = require('../lib/authentication.js');

var getQuestionInitialPage = function(req, res){
    var pageData = {};
    var getPageDataTasks = [];

    authentication.login(req, function(response){
        console.log(response);
    });

    getPageDataTasks.push(function(taskCallback){
        taskCallback();
    });

    getPageDataTasks.push(function(taskCallback){
        quesService.getCategoriesData(res, function(rowData){
            pageData.categories = rowData;
            taskCallback();
        });
    });

    async.parallel(getPageDataTasks, function(){
        res.render('index', { 'pageData': JSON.stringify(pageData), user: authentication.getUser(req) });
    })

};

var getQuestionData = function(req, res){
    var category = req.params.category;
    quesService.getQuestionData(category, function(rowData){
        var question = selectQuestionMethodology(authentication.getUser(req), 'random', rowData);
        res.json(question);
    });
};

var getQuestionDataFromID = function(req, res){
    var category = req.params.category;
    var qID = req.params.qID;
    quesService.getQuestionDataFromID(category, qID, function(rowData){
        //var question = selectQuestionMethodology(authentication.getUser(req), 'random', rowData);
        res.json(rowData[0]);
    });
};

var selectQuestionMethodology = function(user, method, questions){
    if(questions.length == 0){
        return {};
    }
    if(method=='random'){
        var randomNum = Math.floor(Math.random() * (questions.length - 0)) + 0;
        /*
        do {
            randomNum = Math.floor(Math.random() * (questions.length - 0)) + 0;
        }
        while (user.qIDs.indexOf(randomNum)!=-1);
        */
        return questions[randomNum];
    }
    return {};
};

function updateQuestionRate(req, res){
    var qid = req.params.qid;
    var action = req.params.action;
    if(typeof authentication.getUser(req).score === 'undefined'){
        var ttt=0;
    }
    var userScore = action == 'hit' ? authentication.plusUserScore(req) : authentication.getUser(req).score;
    //authentication.updateUserExperiencedQuestion(req, qid);
    quesService.updateQuestionData(qid, action, function(){
        res.json({'state': 'success', 'score': userScore});
    });
}

module.exports = {
    getQuestionInitialPage: getQuestionInitialPage,
    getQuestionData: getQuestionData,
    updateQuestionRate: updateQuestionRate,
    getQuestionDataFromID: getQuestionDataFromID
};