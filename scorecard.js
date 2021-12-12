 //const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard";

const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");

function processScoreCard(url){
    request(url,function(err,response,html){
        if(err) {
            console.log(err);
        } else {
            extractMatchDetails(html);
        }
    })
}

//extract mathcDetails for all indvidual matches
function extractMatchDetails(html) {
    let $ = cheerio.load(html);
    let descElem = $(".header-info .description");
    let result = $(".event .status-text");
    let stringArr = descElem.text().split(",");
    //date ,venue , result will be common for both teams
    let venue = stringArr[1];
    let date = stringArr[2];
    result = result.text();

    let innings = $(".card.content-block.match-scorecard-table >.Collapsible");
    //let htmlString = "";
    for(let i=0; i<innings.length; i++) {
       // htmlString += $(innings[i]).html();

       let teamName = $(innings[i]).find("h5").text();
       teamName = teamName.split("INNINGS")[0].trim();

       let opponentIndex = i == 0 ? 1 : 0;
       let opponentName = $(innings[opponentIndex]).find("h5").text();
       opponentName = opponentName.split("INNINGS")[0].trim();

       let cInning = $(innings[i]);
       console.log(`${venue}| ${date}| ${teamName}| ${opponentName}| ${result}`);
       let allRows =  cInning.find(".table.batsman tbody tr");
       for(let j=0; j<allRows.length; j++) {
           let allCols = $(allRows[j]).find("td");
           let isWorthy = $(allCols[0]).hasClass("batsman-cell");
           if(isWorthy==true) {
               let playerName = $(allCols[0]).text().trim();
               let runs = $(allCols[2]).text().trim();
               let balls = $(allCols[3]).text().trim();
               let fours = $(allCols[5]).text().trim();
               let sixes = $(allCols[6]).text().trim();
               let sr = $(allCols[7]).text().trim();
               console.log(`${playerName} ${runs} ${balls} ${fours} ${sixes} ${sr}`);
               processPlayer(teamName, playerName, runs, balls, fours, sixes, sr, opponentName, venue, date, result);
           }
       }
    }
    
}

function processPlayer(teamName, playerName, runs, balls, fours, sixes, sr, opponentName, venue, date, result) {
    let teamPath = path.join(__dirname, "ipl", teamName);
    dirCreater(teamPath);

    let filePath = path.join(teamPath, playerName+".xlsx");
    let content = excelReader(filePath, playerName);
    let playerObj = {
        teamName, 
        playerName, 
        runs, 
        balls, 
        fours, 
        sixes, 
        sr, 
        opponentName, 
        venue, 
        date, 
        result
    }

    content.push(playerObj);
    excelWriter(filePath, content, playerName);
}

//xlsx module functionality
function excelWriter(filePath, json, sheetName) {
    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    xlsx.writeFile(newWB, filePath);
}

//xlsx module functionality
function excelReader(filePath, sheetName) {
    if (fs.existsSync(filePath) == false) {
        return [];
    }
    let wb = xlsx.readFile(filePath);
    let excelData = wb.Sheets[sheetName];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
}

function dirCreater(filePath) {
    if(fs.existsSync(filePath) == false) {
        fs.mkdirSync(filePath);
    }
}


module.exports = {
    processScoreCardKey : processScoreCard
}