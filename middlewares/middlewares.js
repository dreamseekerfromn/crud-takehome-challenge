/*"id": 1,
            "company": "Google",
            "url": "https://cooljobs.com/google-swe",
            "createdAt": "2024-01-01T00:00:00.000Z",
            "status": "APPLIED",
            "updatedAt":
*/
const fs = require('node:fs');
const FILE = '../db/data/jobApplicationsData.json';
const applicationStatuses = require('../constants.js');

const propChecker = (req, res, next) => {
    if(!req.body["company"] || !req.body["status"]){
        return res.status(401).json({error:"missing parameters"});
    } else {
        next();
    }
}

const intChecker = (req, res, next) => {
    if(!/^[0-9]*$/.test(req.params.id)){
        return res.status(401).json({error : "id must be a valid numeric" });
    }
    next();
}

const bodyChecker = (req, res, next) => {
    if(!req.body){
        return res.status(401).json({error: "missing body"});
    }

    if(!req.body.company){
        return res.status(401).json({error: "company field must be filled"});
    }

    if(!applicationStatuses[req.body.status]){
        return res.status(401).json({error: "wrong value was typed on the status."})
    }

    if(req.body.id || req.body.createdAt || req.body.updatedAt){
        return res.status(401).json({error: "unauthorized access is detected"});
    }

    for(let property in req.body){
        if(property !== 'company' || property !== 'url' || property !== 'status'){
            return res.status(401).json({error: "unauthorized access is detected"});
        }
    }

    next();
}

const dbChecker = (req, res, next) => {
    let errFlag = false;
    let errMsg = "";
    let errStatus = 500;
    fs.access(FILE, (err) => {
        if(err){
            errFlag = true;
            if(err.code === 'ENOENT'){
                errMsg = "db cannot be found";
                errStatus = 503;
                return;
            } /** ENOENT chk */
            else {
                errMsg = "something wrong in the db";
                errStatus = 500;
                return;
            }
        } /** end of 1st if */
    }) /** end of readFile */

    if(errFlag){
        return res.status(errStatus).json({error: errMsg});
    } else {
        next();
    }
} /** end of dbChecker */

module.exports = {
    propChecker,
    intChecker,
    bodyChecker,
    dbChecker,
}