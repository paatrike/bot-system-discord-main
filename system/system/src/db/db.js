
const fs = require("fs");
const PATH_JAIL = "./src/db/jail.json";
// fs.openSync(PATH_DATA,"r");

function readJson(path) {
    const str = fs.readFileSync(path, "utf8");
    return JSON.parse(str);
}
function writeJson(path, data) {
    fs.writeFileSync(path, JSON.stringify(data));
}

// jail function.
function addToJail(userId,memberId,reason,proof,roles,timeStamp) {
    let db = readJson(PATH_JAIL);
    db["jailed"].push({"userId":userId,"memberId":memberId,"reason":reason,"proof":(proof) ? proof : null,"roles":roles,"timeStamp":timeStamp});
    writeJson(PATH_JAIL, db);
}
function removeFromJail(userId) {
    let db = readJson(PATH_JAIL);
    let roles = [];
    for (let i = 0; i < db["jailed"].length; i++) {
        if (db["jailed"][i]["userId"] == userId) {
            roles = db["jailed"][i]["roles"];
            db["jailed"].splice(i, 1);
            writeJson(PATH_JAIL,db);
            break;
        }
    }
    
    return roles;
}
function checkIfJailed(userId) {
    let db = readJson(PATH_JAIL);
    let isHere = false;
    for (let x = 0; x < db["jailed"].length; x++) {
        if (db["jailed"][x]["userId"] == userId) {
            isHere = true;
            break;
        }
    }
    return isHere;
}

function jailCount(){
    let db = readJson(PATH_JAIL);
    return db["jailed"].length;
}

function getInfoJail(userId){
    let db = readJson(PATH_JAIL);
    let info = false;
    for (let x = 0; x < db["jailed"].length; x++) {
        if (db["jailed"][x]["userId"] == userId) {
            info = db["jailed"][x];
            break;
        }
    }
    return info;
}

function whoJailed(userId){
    let db = readJson(PATH_JAIL);
    let memberId = null;
    for (let i = 0; i < db["jailed"].length; i++) {
        if(db["jailed"][i]["userId"] == userId){
            memberId = db["jailed"][i]["memberId"];
            break;
        }
    }
    return memberId;
}


module.exports = {
    addToJail,
    jailCount,
    removeFromJail,
    checkIfJailed,
    whoJailed,
    getInfoJail,
};


/**
 * Project: Management bot
 * Author: @patrick
 * this code is under the MIT license.
 * For more information, contact us at
 * https://discord.gg/sakora
 */