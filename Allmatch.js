const request = require("request");
const cheerio = require("cheerio");
const scoreCardObj = require("./scorecard");

function getAllMatchesLink(url){
    request(url,function(err,response,html){
        if(err) {
            console.log(err);
        } else {
            //console.log(html);
            extractAllLinks(html);
        }
    })
}

//extract link for all ILP matches
function extractAllLinks(html) {
    let $ = cheerio.load(html);
    let scorecardElems = $("a[data-hover='Scorecard']");
    for (let i = 0; i < scorecardElems.length; i++) {
        let link = $(scorecardElems[i]).attr("href");
        let fullLink = "https://www.espncricinfo.com" + link;
        //console.log(fullLink);
        scoreCardObj.processScoreCardKey(fullLink);
       
    }
}

module.exports = {
    getAllMatches : getAllMatchesLink
}