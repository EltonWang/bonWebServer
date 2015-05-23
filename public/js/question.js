/**
 * Created by mangosong on 5/16/15.
 */
var questionModule = (function (questionModule) {


    questionModule.getQuestionRequest = function(category_rid, callback){
        if(hardSequenceCount < hardSequenceNum){
            $.ajax({
                url: "/data/category/" + category_rid + "/question/" + hardSequeneceIDs[hardSequenceCount],
                cache: false,
                dataType: 'json',
                success: function(data){
                    console.log(data);
                    callback(data);
                }
            });
            hardSequenceCount ++;
            return ;
        }

        $.ajax({
            url: "/data/category/" + category_rid + "/questions",
            cache: false,
            dataType: 'json',
            success: function(data){
                console.log(data);
                callback(data);
            }
        });
    };

    var updateQuestionRate = function(qid, questionState){
        $.ajax({
            url: "/data/question/" + qid + "/" + questionState,
            method: 'POST',
            cache: false,
            dataType: 'json',
            success: function (data) {
                console.log("Update " + questionState + " successfully.");
                $('#userScore').html(data.score);
            }
        });
    };

    questionModule.checkAnswer = function(question, selectedAnswer, callback){
        if(question.name === selectedAnswer){
            console.log('Correct!');
            updateQuestionRate(question.pid, 'hit');
            return true;
        }else{
            console.log('Wrong!');
            updateQuestionRate(question.pid, 'miss');
            return false;
        }
    };

    questionModule.openCopyrightModal = function(){
        $('#copyrightButton').trigger('click');
    };

    return questionModule;
}(questionModule || {}));
