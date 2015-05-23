/**
 * Created by ewang on 2015/5/21.
 */
/**
 * Returns the authenticated user for the session, or undefined if no one is authenticated.
 * @param req
 * @returns {User|undefined}
 */
var getUser = function (req) {
    if (!req.session) {
        return false;
    }
    return req.session.user;
};

/**
 * Sets the authenticated user for the session.
 * @param req
 * @param {User} user
 */
var setUser = function (req, user) {
    req.session.user = user;
};

var plusUserScore = function (req){
    return ++req.session.user.score;
};

var updateUserExperiencedQuestion = function (req, qid){
    req.session.user.qIDs.push(qid);
};

/**
 * Check if the user has a session
 * @param req
 * @returns {boolean}
 */
function isSessionActive(req) {
    var active = (req.session && typeof req.session.user !== 'undefined');
    return active;
}

var login = function (req, callback) {
    var anonymous = true;
    if (isSessionActive(req)) {
        callback({status: "success"});
        console.log('session alive, success!');
    } else {
        var user = {
            name: 'Guest',
            score: 0,
            qIDs: []
        };
        if (anonymous) {
            // Create a new session to prevent session fixation.
            req.session.regenerate(function (err) {
                if (err) {
                    callback({error: 'Could not regenerate session'});
                    console.log('Could not regenerate session');
                    return;
                } else {
                    setUser(req, user);
                }
            });
        } else {
            //Wait for user login mechanism
        }
    }
};

module.exports = {
    getUser: getUser,
    plusUserScore: plusUserScore,
    login: login,
    updateUserExperiencedQuestion: updateUserExperiencedQuestion
};