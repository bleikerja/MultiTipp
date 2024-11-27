const players = {}

let titles = ["Wer gewinnt?", "Wer schießt das 1. Tor?","Welcher Spieler schießt das 1. Tor?","Welche Spieler schießen ein Tor?","Wie viele Tore fallen?","Wie viele Tore schießt das Team?","Wie viele Tore fallen in der Halbzeit?","Welches Team gewinnt mit welchem Abstand?","Schießen beide Teams ein Tor?"];
let dailyTitles = ["Welches Team schießt die meisten Tore?","Welcher Spieler schießt die meisten Tore?","In welchem Spiel fallen die meisten Tore?","Welche Teams schießen kein Tor?","Welches Team gewinnt mit dem höchsten Abstand?"]
const saisonTitles = ["Wer wird Meister?", "Welcher Spieler schießt die meisten Tore?", "Welche Teams belegen die letzten 3 Plätze?","Welches deutsche Team hat die beste Platzierung?","Welches deutsche Team kommt am weitesten?"]

let championsLeagueTitles = ["In welchem Spiel fallen die meisten Tore?","Welches deutsche Team spielt am besten?","Welche deutschen Teams gewinnen?"]
const championsLeagueGamedays = [3,5,7,9,11,13,18,19]

let types = [];
let typesLeft = [1,2,3,4,5,6,7,8,9];
let extraInfo = [];
let dailyType = 2;

let d = null;
let liveDayData = null
let lastDay = null
let firstDay = null
let goalgetters = null
let wholeTable = null
let wholeTableChampion = null
let championsDay = null
let championsDayData = null

let shift = 0
let saisonShift = 0


let bets = [];
let saisonBetsFix = []
let saisonBets = []
let saisonOrder = [100,101,102]
let points = [];
let currentDay = 0;
let currentDayIndex = 0;
let liveDay = 0;
let liveDayChampion = 0;
let liveDayIsChampion = false
let positionDaily = 9

let playernames = []

let is_admin = false;
let username = "";
let fixes = []

let groupForm = document.getElementById("groupAdd");
let groupInput = document.getElementById("groupInput");
let removeForm = document.getElementById("groupRemove");
let removeInput = document.getElementById("groupDelete");

let editingName = false
let selectedCarouselItem = 0
 
let carouselWidth = 0;

start();

setInterval(() => {
    const carousel = document.querySelector('#carousel');
    if(carouselWidth == 0) carouselWidth = carousel.offsetWidth
    if (carousel.offsetWidth != carouselWidth) {
        carousel.style.width = carouselWidth+"px";
    }
}, 100);
async function start(){
    const currentDaySearch = await fetch(new URL(`https://api.openligadb.de/getcurrentgroup/bl1`));
    const currentDayData = await currentDaySearch.json();
    liveDay = currentDayData.groupOrderID;
    const responseLiveday = await fetch(new URL(`https://api.openligadb.de/getmatchdata/bl1/2024/${liveDay}`));
    liveDayData = await responseLiveday.json();
    
    if(championsLeagueGamedays.includes(liveDay) && isOver(liveDayData[liveDayData.length - 1]) || championsLeagueGamedays.includes(liveDay - 1) && !hasStarted(liveDayData[liveDayData.length - 1])){        
        let today = new Date();
        if (today.getDay() >= 2 && today.getDay() <= 3){
            for(let i of championsLeagueGamedays){
                if(i <= liveDay) liveDayChampion = championsLeagueGamedays.indexOf(i)
            }
            liveDayIsChampion = true
            const currentChampionsDayResponse = await fetch(new URL("https://api.openligadb.de/getmatchdata/ucl2024/2024/1"));
            championsDayData = await currentChampionsDayResponse.json();    
        }else{
            liveDayIsChampion = false
        }
    }
    await load(); 
    await loadPoints(); 

    daySelect.insertAdjacentHTML('beforeend', `<option value="0">Saisonswetten</option>`);

    let j = 1
    for(let i = 1; i <= 34; i++){
        daySelect.insertAdjacentHTML('beforeend', `<option value="${i}">${i}. Spieltag</option>`);
        if(championsLeagueGamedays.includes(i)){
            daySelect.insertAdjacentHTML('beforeend', `<option value="${34+j}">Champions League #${j}</option>`);
            j++;
        }
    }

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let day = isNaN(parseInt(urlParams.get('day'))) ? urlParams.get('day'): parseInt(urlParams.get('day'))
    
    showSpieltag(day != null ? day: (!liveDayIsChampion ? liveDay: liveDayChampion+35));
}
async function showSpieltag(n,index = false){
    if(index){
        showSpieltag(parseInt(daySelect.options[n].value))
        return;
    }
 
    if(n == 34){
        document.getElementById("moveFront").style.display = 'none';
    }else{
        document.getElementById("moveFront").style.display = '';
    }
    if(n == 0){
        document.getElementById("moveBack").style.display = 'none';
    }else{
        document.getElementById("moveBack").style.display = '';
    }
    
    var newURL = updateURLParameter(window.location.href, 'locId', 'newLoc');
    newURL = updateURLParameter(newURL, 'resId', 'newResId');

    window.history.replaceState('', '', updateURLParameter(window.location.href, "day", n));
    document.getElementById("link").href = "tippen?day=" + n

    
    gameCarousel.innerHTML = '';
    let daysBefore = championsLeagueDaysBeforeDay(liveDay);
    let selectedOption = daySelect.options[liveDayIsChampion ? liveDay+daysBefore+1: liveDay+daysBefore];
    selectedOption.style.fontWeight = "bold";
  
    let options = daySelect.options;
    for (let i = 0; i < options.length; i++) {
        if (options[i] !== selectedOption) {
            options[i].style.fontWeight = "normal";
        }
        if(options[i].value == n) {
            daySelect.selectedIndex = i;
            currentDayIndex = i;
        }
    }

    currentDay = n;
    shift = 0
    positionDaily = 9
    
    
    if(n > 34){
        let tempChamp = championsDayData != null ? championsDayData: await fetch(new URL(`https://api.openligadb.de/getmatchdata/ucl2024/2024/1`)).then(response => response.json());
        let rand = new RND(n);
        
        let startIndex = (n-35)*18
        let data = [];
        let germanTeams = ["Stuttgart","Dortmund","Bayern","Leipzig","Leverkusen"]
        
        for(let i = startIndex; i < startIndex+18; i++){
            if(germanTeams.includes(getShortName(tempChamp[i].team1)) || germanTeams.includes(getShortName(tempChamp[i].team2))) data.push(tempChamp[i]);
        }


        d = [...data]

        typesLeft = [1,4,5,6,8];
        types = []
        for(let i = 0; i < 5; i++){
            let nextI = rand.nextInRange(0,typesLeft.length-1);
            let next = typesLeft[nextI];
            typesLeft.splice(nextI,1);
            types.push(next);
        }
        dailyType = rand.nextInRange(1,3);

        if(!bets[0][n-1]) bets[0][n-1] = [[],[],[],[],[],[]]
        showData(data,0,true,false,null,true);
        for(let i = 1; i <= 5; i++){
            showData(data,i,false,false,null,true);
        }
        
        displayPlayerPoints();
        displayPoints(n)

        return
    }
    
    const data = n == liveDay ? liveDayData: await fetch(new URL(`https://api.openligadb.de/getmatchdata/bl1/2024/${n}`)).then(response => response.json());
    d = [...data]

    if(n == 0){
        const response3 = await fetch(new URL(`https://api.openligadb.de/getmatchdata/bl1/2024/4`));
        const data3 = await response3.json();
        dataDay3 = data3

        const tableResponse = await fetch(new URL(`https://api.openligadb.de/getbltable/bl1/2024`));
        const tableData = await tableResponse.json();
        wholeTable = tableData
        
        const tableResponseChampion = await fetch(new URL(`https://api.openligadb.de/getbltable/ucl2024/2024`));
        const tableDataChampion = await tableResponseChampion.json();
        wholeTableChampion = tableDataChampion
        
        const lastDayResponse = await fetch(new URL(`https://api.openligadb.de/getmatchdata/bl1/2024/34`));
        lastDay = await lastDayResponse.json();
        
        const goalgetterResponse = await fetch(new URL(`https://api.openligadb.de/getgoalgetters/bl1/2024`));
        const goalgetterData = await goalgetterResponse.json();
        goalgetters = goalgetterData

        const championsDayResponse = await fetch(new URL(`https://api.openligadb.de/getcurrentgroup/ucl2024`));
        championsDay = await championsDayResponse.json();

        if(championsDayData == null) championsDayData = await fetch(new URL(`https://api.openligadb.de/getmatchdata/ucl2024/2024/1`)).then(response => response.json());
        
        showData(tableData,100,true,false,goalgetterData)
        showData(goalgetterData,101,false,false,tableData)
        showData(tableData,102,false,false,tableDataChampion)
        showData(tableDataChampion,103,false,false,championsDay,true)
        showData([championsDay],104,false,false,null,true)

        displayPlayerPoints();
        displayPoints(n)
        return
    }

    let rand = new RND(n);

    typesLeft = [1,2,3,4,5,6,7,8,9];
    types = []
    for(let i = 0; i < 9; i++){
        let nextI = rand.nextInRange(0,typesLeft.length-1);
        let next = typesLeft[nextI];
        typesLeft.splice(nextI,1);
        types.push(next);
    }
    dailyType = rand.nextInRange(1,5);
    
    if(!bets[0][n-1]) bets[0][n-1] = [[],[],[],[],[],[],[],[],[],[]]
    
    showData(data,0,true);
    for(let i = 1; i <= data.length; i++){
        showData(data,i);
    }
    
    displayPlayerPoints();
    displayPoints(n)
    selectCarouselItem(getLastStarted(data))
}

function displayPoints(n){
    
    for(let i = 0; i < playernames.length; i++){
        if(!points[i][n-1]) points[i][n-1] = 0;
        let player = playernames[i];
        let totalPoints = getTotalPoints(i)
        let dayPoints = points[i][n-1]
        document.getElementById("totalPoints" + player).innerHTML = totalPoints;
        document.getElementById("dayPoints" + player).innerHTML = dayPoints;
        document.getElementById("name" + player).innerText = player
        for(let n of document.getElementsByClassName("totalPoints" + player)){
            n.innerHTML = totalPoints
        }
        for(let n of document.getElementsByClassName("dayPoints" + player)){
            n.innerHTML = dayPoints
        }
    }

}

function updateDisplay(){
    let data = d;
    gameCarousel.innerHTML = '';
    
    if(currentDay != 0){
        if(currentDay > 34){
            showData(data,0,true,false,null,true);
            for(let i = 1; i <= 5; i++){
                showData(data,i,false,false,null,true);
            }
        }else{
            showData(data,0,true);
            for(let i = 1; i <= data.length; i++){
                showData(data,i);
            }
        }
    }else{
        for(let n of saisonOrder){
            if(n == 100){
                showData(wholeTable,100,true)
            }else if(n == 101){
                showData(goalgetters,101)
            }else if(n == 102){
                showData(wholeTable,102)
            }
        }
    }
    
    displayPlayerPoints();
    displayPoints(currentDay)
    selectCarouselItem(selectedCarouselItem)
}

function moveGameday(num){
    let maxValue = daySelect.options.length
    if(currentDayIndex + num > maxValue || currentDayIndex + num < 0) return;
    if(currentDayIndex + num == maxValue){
        document.getElementById("moveFront").style.display = 'none';
    }else{
        document.getElementById("moveFront").style.display = '';
    }
    if(currentDayIndex + num == 0){
        document.getElementById("moveBack").style.display = 'none';
    }else{
        document.getElementById("moveBack").style.display = '';
    }
    showSpieltag(currentDayIndex + num,true);
}

function updateURLParameter(url, param, paramVal){
    var newAdditionalURL = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = "";
    if (additionalURL) {
        tempArray = additionalURL.split("&");
        for (var i=0; i<tempArray.length; i++){
            if(tempArray[i].split('=')[0] != param){
                newAdditionalURL += temp + tempArray[i];
                temp = "&";
            }
        }
    }

    var rows_txt = temp + "" + param + "=" + paramVal;
    return baseURL + "?" + newAdditionalURL + rows_txt;
}

function showData(data,num,first=false,returnResult=false,nextData = null,champions=false){
    if(num % getPlayerDisplayCount() != 0 && !returnResult) return;
    
    if(num > data.length-1 && num < 100 || champions && num == 5) {
        if(returnResult) return showDaily(data,data.length,true,champions)
        showDaily(data,data.length,false,champions)
        return
    }
    let thisData = data[num]
    let newDisplay = document.getElementById("gameCarousel")

    let newHtml = returnResult ? "": `<div class="carouselItem carousel-item ${first ? "active":""}">
          <div class="d-flex">`
    
    if(num >= 100){
        newHtml += showSaison(data,num)
    }else{
        newHtml += `<div class="flex-fill p-2">
            <div class="betContainer2">
            <div class="border rounded-3 border-black resultDisplay">
                    <div id="bet${thisData.matchID}" class="d-flex flex-row mb-2 game border rounded-3 border-black" aria-expanded="false" style="background-color:${changeColor(thisData,types[num],true)}">
                        <div class="border-end rounded-start-3 border-black team1 bg-white"> 
                            <div class="oneline p-2 teamText" id="name">${getShortName(thisData.team1)}</div>
                            <div class="oneline p-2 small"><img src="${getTeamIcon(thisData.team1)}" alt="img" height="100%" id="image"></div>
                            <br class="newLine" hidden>
                            <div class="oneline p-2 teamText1" id="name" hidden>${getShortName(thisData.team1)}</div>
                        </div>
                        <div class="p-2 gap resultDiv" id="games">
                            ${getGameResult(thisData)}
                        </div>
                        <div class="gap border-start rounded-end-3 border-black team2 bg-white">
                            <div class="oneline p-2 small"><img src="${getTeamIcon(thisData.team2)}" alt="img" height="100%" id="image"></div>
                            <br class="newLine" hidden>
                            <div class="oneline p-2 teamText1" id="name">${getShortName(thisData.team2)}</div>
                        </div>
                    </div>
                    <div class="border rounded-3 border-black" style="min-height:77px;padding:5px;background-color:${changeColor(thisData,types[num])}">
                        ${displayResults(thisData,hasStarted(thisData),types[num])}
                    </div>
                </div>
                ${displayAllBets(num,data[num],hasStarted(data[num]),types[num])}
            </div>
        </div>`
    
    }    
    newHtml += (num + 1) % getPlayerDisplayCount() != 0 && num != 104 ? showData(nextData != null ? nextData: data,num+1,false,true,null,champions):""  
    newHtml += returnResult ? "": `</div></div></div>`;
    

    if(returnResult) {
        return newHtml;
    }
    newDisplay.insertAdjacentHTML('beforeend', newHtml);
}

function changeColor(data,type,result = false){
    if(type >= 100){
        if(isOver(lastDay[0])) return "#949494"
        let saisonHasStarted = type < 103 ? hasStarted(dataDay3[0]): (championsDay.groupOrderID > 1 ? true: hasStarted(championsDayData[0]))
        if(saisonHasStarted) return "#ffd599";
        return "#f5f5f5";
    }
    
    
    if(((type == 10 || type == 20) && !hasStarted(data[0])) || !hasStarted(data)) return "#f5f5f5";
    if((!result && !isFix(data,type) || (result && !isOver(data)))) return "#ffd599";

    return "#949494"
}

function changeColorBet(data,type,hasStarted,i,bet,playerindex){    
    if(!hasStarted) return "white"
    let result = getResult(data,type)
    
    for(let j = 0; j < result.length; j++){
        let fixResult = getFix((type < 10 ? data.matchID: (type < 100 ? "daily" + data[0].group.groupOrderID: "saison" + (type-100))),j);
        if(fixResult != null) result[j] = fixResult.fix_data
    }

    let fixBet = getFix((type < 10 ? data.matchID: (type < 100 ? "daily" + data[0].group.groupOrderID: "saison" + (type-100))),i,playernames[playerindex])
    if(fixBet != null) bet = fixBet.fix_data
    
    let typeMod = type < 10 && type != 4 ? type+(i*0.5):type
    
    if((type != 6 && type != 7 && result.includes(bet)) || ((type == 6 || type == 7) && result[i] == bet)){
        if(isFixBet(data,typeMod,bet)){
            return "green"
        }else{
            return "#c3f7c8"
        }
    }else{
        if(isFixBet(data,typeMod,bet)){
            return "red"
        }else{
            return "lightgray"
        }
    }
}

function showDaily(data,num,returnResult = true,champions=false){
    let newDisplay = document.getElementById("gameCarousel")
    
    let newHtml = returnResult ? "": `<div class="carouselItem carousel-item">
          <div class="d-flex">`

    newHtml += `<div class="flex-fill p-2">
        <div class="betContainer">
            <div id="dailyContainer" class="border rounded-3 border-black">
                <div id="betDaily" class="d-flex flex-row mb-2 game border rounded-3 border-black bg-white" aria-expanded="false">
                    <h3>Spieltag</h3>
                </div>
                <div class="border rounded-3 border-black" style="min-height:77px;padding:5px;background-color:${changeColor(data,10)}">
                    ${displayResults(data,hasStarted(data[0]),champions ? 20: 10)}
                </div>
            </div>
        </div>
        ${displayAllBets(num,data,hasStarted(data[0]),champions ? 20: 10)}

    </div>`;
    
    newHtml += returnResult ? "": `</div></div></div>`;
    if(returnResult) return newHtml

    newDisplay.insertAdjacentHTML('beforeend', newHtml);
}

function showSaison(data,num){
    let saisonHasStarted = num < 103 ? hasStarted(dataDay3[0]): (championsDay.groupOrderID > 1 ? true: hasStarted(championsDayData[0]))
    const newHtml = `<div class="saison flex-fill p-2">
        <div class="betContainer">
            <div id="SaisonContainer" class="border rounded-3 border-black saisonContainer">
                <div id="betDaily" class="d-flex flex-row mb-2 game border rounded-3 border-black bg-white" aria-expanded="false">
                    <h1>${num < 103 ? ("Bundesliga #"+ (num-99)):("Champions League #"+ (num-102))}</h1>
                </div>
                <div class="border rounded-3 border-black" style="min-height:77px;padding:5px;background-color:${changeColor(data,num,true)}">
                    ${displayResults([...data],saisonHasStarted,num)}
                </div>
            </div>
            
        </div>
        ${displayAllBets(num-100,[...data],saisonHasStarted,num)}
    </div>`;
    return newHtml
}

function isFix(data,type){
    if(!hasStarted(data) || type == 10 && !hasStarted(data[data.length-1])) return false;
    if((type == 10 || type == 20) && isOver(data[data.length-1])) return true
    if(isOver(data)) return true;
    switch (type){
        case 2: case 3:
            return getFirstGoal(data) != null;
        case 9:
            let goals = getGoals(data);
            return goals[0] != 0 && goals[1] != 0;
        default:
            return false;
    }
}

function isFixBet(data,type,bet = null){
    if(type > 10 && type < 20) type = 10;
    if(isOver(data) && type != 10) return true;
    let germanTeams = ["Stuttgart","Dortmund","Bayern","Leipzig","Leverkusen"]

    switch (type){
        case 2: case 3:
            return getFirstGoal(data) != null;
        case 4:
            if(bet == null && data.goals.length != 0) return true
            if(bet == "kein Tor" && !isOver(data)) return false
            return getResult(data,type).includes(bet) 
        case 5:
            if(bet == null || bet == "6+") return (getGoals(data)[0] + getGoals(data)[1]) >= 6
            let split = bet.split(" ")
            return (getGoals(data)[0] + getGoals(data)[1]) > parseInt(split[split.length - 1])
        case 6:
            if(bet == null || bet == "4+") return getGoals(data)[0] >= 4
            return getGoals(data)[0] > parseInt(bet);
        case 6.5:
            if(bet == null || bet == "4+") return getGoals(data)[1] >= 4
            return getGoals(data)[1] > parseInt(bet);
        case 7:
            if(isHalbzeit(data)) return true;
            if(bet == null || bet == "4+") return getGoalsHz(data,1) >= 4
            return getGoalsHz(data,1) > parseInt(bet)
        case 7.5:
            if(bet == null || bet == "4+") return getGoalsHz(data,2) >= 4
            return getGoalsHz(data,2) > parseInt(bet)
        case 9:
            return getGoals(data)[0] != 0 && getGoals(data)[1] != 0;
        case 10:
            if(isOver(data[data.length-1])) return true
            switch(dailyType){
                case 2:
                    if(bet != null){
                        if(getResult(data,10).includes(bet)) return false
                        let gameData = null
                        for(let game of data){
                            let teamPlayers1 = getPlayers(game.team1.teamName)
                            let teamPlayers2 = getPlayers(game.team2.teamName)
                            if(teamPlayers1.includes(bet) || teamPlayers2.includes(bet)){
                                gameData = game;
                            } 
                        }
                        return isOver(gameData);
                    }
                case 4:
                    if(bet != null && bet != "kein Team"){
                        let gameData = null
                        let teamNum = 0;
                        for(let game of data){
                            let teams = getTeams(game)
                            if(getShortName(teams[0]) == bet || getShortName(teams[1]) == bet){
                                gameData = game;
                                teamNum = getShortName(teams[0]) == bet ? 0: 1;
                            } 
                        }
                        if(getGoals(gameData)[teamNum] != 0) return true
                        return isOver(gameData);
                    }else if(bet == "kein Team"){
                        for(let game of data){
                            let totalGoals = getGoals(game)
                            if(totalGoals[0] == 0 && totalGoals[1] == 0) return false
                        }
                        return true
                    }
                case 1: case 3: case 5:
                    if(bet != null){
                        if(getResult(data,10).includes(bet)) return false
                        let gameData = null
                        for(let game of data){
                            let teams = getTeams(game)
                            if(bet.includes(getShortName(teams[0])) || bet.includes(getShortName(teams[1]))){
                                gameData = game;
                            } 
                        }
                        
                        return isOver(gameData);
                    }
            }
            break;
        case 20:
            if(isOver(data[data.length-1])) return true
            switch(dailyType){
                case 1: case 2:
                    if(bet != null){
                        if(getResult(data,20).includes(bet)) return false
                        let gameData = null
                        for(let game of data){
                            let teams = getTeams(game)
                            if(bet.includes(getShortName(teams[0])) || bet.includes(getShortName(teams[1]))){
                                gameData = game;
                            } 
                        }
                        return isOver(gameData);
                    }
                case 3:
                    
                    if(bet != null && bet != "kein Team"){
                        let gameData = null
                        for(let game of data){
                            let teams = getTeams(game)
                            if(getShortName(teams[0]) == bet || getShortName(teams[1]) == bet){
                                gameData = game;
                            }
                        }
                        return isOver(gameData);
                    }else if(bet == "kein Team"){
                        for(let game of data){
                            if(!isOver(game)) continue;
                            let teams = getTeams(game)
                            let totalGoals = getGoals(game)
                            teamNum = germanTeams.includes(getShortName(teams[0])) ? 0: 1;
                            let winner = totalGoals[0] > totalGoals[1] ? 0: 1;
                            if(teamNum == winner && totalGoals[0] != totalGoals[1]) return true
                        }
                        return false
                    }
            }
            break;
        case 100:case 101:case 102:
            return isOver(lastDay[0])
        case 103:
            return championsDay.groupOrderID > 1
        case 104:
            false
    }
    return false;
}

function getGoalsHz(data,hz){
    let goalsHZ = 0;
    if(data.matchResults.length != 0){
        goalsHZ = data.matchResults[0].pointsTeam1 + data.matchResults[0].pointsTeam2;
    }else{
        goalsHZ = getGoals(data)[0] + getGoals(data)[1];
    }
    if(hz == 1) return goalsHZ;
    return (getGoals(data)[0] + getGoals(data)[1]) - goalsHZ;
}

function isHalbzeit(data){
    const time = new Date(data.matchDateTime);
    const now = new Date();
    const diff = Math.floor((now - time) / (1000 * 60));
    return diff > 55;
}

function isOver(data){
    return data.matchIsFinished;
}

function displayAllBets(num,data,hasStarted,t){
    let display = `<div class="pointsTopSmall">
                <p id="noplayer"></p>
                <div class="playerPointsTop">
                    <p id="totalPoints" onclick="changePlayerOrder(true)">Gesamt</p>
                    <p id="dayPoints" onclick="changePlayerOrder(false)">Spieltag</p>  
                </div>
            </div>`;
    for(let i = 0; i < playernames.length; i++){
        let player = currentDay != 0 ? bets[i]: saisonBets[i];
        display += 
        `<div class="playernameBar">
            <p class="playernameTop nameTop${playernames[i]}" id="name${playernames[i]}">${playernames[i]}</p>
            <div class="playerPoints">
                <p class="totalPoints${playernames[i]}"></p>
                <p class="dayPoints${playernames[i]}"></p>  
            </div>
        </div>`

        if(!hasStarted && playernames[i] != username || num == 9 && ((bets[playernames.indexOf(username)][currentDay-1] == null || bets[playernames.indexOf(username)][currentDay-1][num].length == 0) && !this.hasStarted(d[d.length-1]))){
            let extraInfo = ""
            if(player[currentDay-1] != null && player[currentDay-1][num].length != 0){
                extraInfo = getBetDisplay("?")
            }
            display += `<div class="gap border rounded-3 border-black betsDisplay" style="padding:5px;background-color:${changeColor(data,t)}">
                ${extraInfo}
            </div>`
            continue;
        } 
        display += `<div class="gap border rounded-3 border-black betsDisplay" style="padding:5px;background-color:${changeColor(data,t)}">
            ${displayBet(num,data,hasStarted,player,t,i)}
        </div>`
    }
    
    return display;
}


function dayhasStarted(data){
    for(n of data){
        if(hasStarted(n)) return true
    }
    return false
}


function displayResults(data,started,t){
    let display = t < 10 ? getTitle(titles[t-1]): (t < 100 ? (getTitle(t == 10 ? dailyTitles[dailyType-1]: championsLeagueTitles[dailyType-1])): getTitle(saisonTitles[t-100]));
    if(data.leagueShortcut == "ucl2024" && t == 4){
        let germanTeams = ["Stuttgart","Dortmund","Bayern","Leipzig","Leverkusen"]
        let germanTeam = germanTeams.includes(getShortName(data.team1)) ? getShortName(data.team1): getShortName(data.team2)
        display = display.replace("Spieler",germanTeam+" Spieler")
    }
    if(!started) return display;
    let result = getResult(data,t)
    display += '<div class="betResultContainer">'
    for(let i = 0; i < result.length;i++){
        let newType = t;
        if(t == 7 || t == 6) newType = t + (0.5 * i)
        if(t == 7){
            display += getTitle(`${i+1}. Halbzeit`,false)
        }
        if(t == 6){
            display += getTitle(getShortName(getTeams(data)[i]),false)
        }
        let fix = getFix((t < 10 ? data.matchID: (t < 100 ? "daily" + data[0].group.groupOrderID: "saison" + (t-100))),i);
        if(fix == null){
            display += getBetDisplay(result[i],t < 100 ? (isFixBet(data,newType,t >= 10 ? result[i]: null) ? "gray": "white"): "gray","",(t < 10 ? data.matchID: t < 100 ? ("daily" + data[0].group.groupOrderID): "saison" + (t-100).toString()),i);
        }else{
            display += getBetDisplay(fix.fix_data,t < 100 ? (isFixBet(data,newType,t >= 10 ? result[i]: null) ? "gray": "white"): "gray","",fix.game_id,i)
        }
    }
    display += "</div>"
    return display;
}

function getTeams(data){
    return [data.team1,data.team2]
}

function getFix(game,i,user=""){
    for(n of fixes){
        if(n.game_id.slice(0,-1) == game.toString() && n.game_id.slice(-1) == i.toString() && n.user == user){
            return n;
        }
    }
    return null
}

function getResult(data,t,dailyT = dailyType){
    let result,totalGoals,goals,team1,team2,firstGoal,winningTeam,totalGoalCount;
    let germanTeams = ["Stuttgart","Dortmund","Bayern","Leipzig","Leverkusen"]
    result = [];
    if(t != 10 && t != 20 && t < 100){
        totalGoals = getGoals(data);
        goals = data.goals.sort((a, b) => {
            const sumA = a.scoreTeam1 + a.scoreTeam2;
            const sumB = b.scoreTeam1 + b.scoreTeam2;
            return sumA - sumB;
        });
        team1 = getShortName(data.team1);
        team2 = getShortName(data.team2);
        firstGoal = getFirstGoal(data);
        winningTeam = totalGoals[0] > totalGoals[1] ? team1: team2;
        totalGoalCount = totalGoals[0] + totalGoals[1];
    }

    switch (t){
        case 1:
            if(totalGoals[0] > totalGoals[1]){
                result.push(team1);
            }else if(totalGoals[0] < totalGoals[1]){
                result.push(team2);
            }else{
                result.push("Unentschieden");
            }
            break;
        case 2:
            if(!firstGoal){
                result.push("kein Tor")
            }else if(firstGoal.scoreTeam1 != 0){
                result.push(team1);
            }else{
                result.push(team2);
            }
            break;
        case 3:
            if(firstGoal == null){
                result.push("kein Tor")
            }else{
                let goalPlayerTeam = firstGoal.scoreTeam1 != 0 && !firstGoal.isOwnGoal || firstGoal.scoreTeam1 == 0 && firstGoal.isOwnGoal? data.team1.teamName: data.team2.teamName;
                result.push(firstGoal.goalGetterName != "" ? getPlayerName(firstGoal.goalGetterName,goalPlayerTeam):"?");
            }
            break;
        case 4:
            let lastScore = [0,0]
            if(goals.length == 0) result.push("kein Tor")
            for(let goal of goals){
                if(goal.scoreTeam1 == 0 && goal.scoreTeam2 == 0) continue;
                let goalPlayerTeam = goal.scoreTeam1 > lastScore[0] ? data.team1: data.team2;
                lastScore = [goal.scoreTeam1,goal.scoreTeam2];
                if(data.leagueShortcut == "ucl2024" && !germanTeams.includes(getShortName(goalPlayerTeam))) continue;
                
                let goalPlayer = goal.goalGetterName != "" ? getPlayerName(goal.goalGetterName,goalPlayerTeam.teamName): "?";
                
                if(!result.includes(goalPlayer) && !goal.isOwnGoal) result.push(goalPlayer);
            }
            if(result.length == 0) result.push("kein Tor")
            break;
        case 5:
            if(totalGoalCount >= 6){
                result.push("6+")
            }else if(totalGoalCount % 2 == 0){
                result.push(totalGoalCount + " - " + (totalGoalCount + 1))
            }else{
                result.push((totalGoalCount - 1) + " - " + totalGoalCount)
            }
            break;
        case 6:
            if(totalGoals[0] >= 4){
                result.push("4+");
            }else{
                result.push(totalGoals[0] + "");
            }
            if(totalGoals[1] >= 4){
                result.push("4+");
            }else{
                result.push(totalGoals[1] + "");
            }
            break;
        case 7:
            if(data.matchResults.length == 0){
                result.push((totalGoalCount >= 4 ? "4+": totalGoalCount) + "");
                result.push("0");
            }else{
                let goalsHZ = data.matchResults[0].pointsTeam1 + data.matchResults[0].pointsTeam2
                result.push((goalsHZ >= 4 ? "4+": goalsHZ) + "");
                result.push(((totalGoalCount - goalsHZ) >= 4 ? "4+": (totalGoalCount - goalsHZ)) + "");
            }
            break;
        case 8:
            if(totalGoals[0] == totalGoals[1]){
                result.push("Unentschieden");
            }else if(totalGoals[0] < totalGoals[1]){
                result.push(winningTeam + " & " + (totalGoals[1] - totalGoals[0]));
            }else{
                result.push(winningTeam + " & " + (totalGoals[0] - totalGoals[1]));
            }
            break;
        case 9:
            if(totalGoals[0] != 0 && totalGoals[1] != 0){
                result.push("Ja");
            }else{
                result.push("Nein");
            }
            break;
        case 10:
            let highestGoal = 0;
            switch(dailyT){
                case 1:
                    let highestTeam = []
                    let highestGoals = 0
                    for(let game of data){
                        if(!hasStarted(game)) continue;
                        let gameGoals = getGoals(game);
                        if(gameGoals[0] > highestGoals){
                            highestGoals = gameGoals[0]
                            highestTeam = [getShortName(game.team1)]
                        }else if(gameGoals[0] == highestGoals){
                            highestTeam.push(getShortName(game.team1))
                        }
                        if(gameGoals[1] > highestGoals){
                            highestGoals = gameGoals[1]
                            highestTeam = [getShortName(game.team2)]
                        }else if(gameGoals[1] == highestGoals){
                            highestTeam.push(getShortName(game.team2))
                        }
                    }
                    result = highestTeam;
                    break;
                case 2:
                    let highestPlayer = [];
                    highestGoal = 0;
                    for(let game of data){
                        playerGoals = []
                        goalsCount = []
                        let gameGoals = game.goals.sort((a, b) => {
                            const sumA = a.scoreTeam1 + a.scoreTeam2;
                            const sumB = b.scoreTeam1 + b.scoreTeam2;
                            return sumA - sumB;
                        });                    
                        let lastScore = [0,0];
                        for(let goal of gameGoals){
                            if(!hasStarted(game)) continue;
                            let goalPlayerTeam = goal.scoreTeam1 > lastScore[0] ? game.team1.teamName: game.team2.teamName;
                            lastScore = [goal.scoreTeam1,goal.scoreTeam2];
                            if(goal.isOwnGoal) continue;
                            let player = getPlayerName(goal.goalGetterName,goalPlayerTeam);
                            if(playerGoals.includes(player)){
                                goalsCount[playerGoals.indexOf(player)]++
                            }else{
                                playerGoals.push(player)
                                goalsCount.push(1);
                            }
                            if(goalsCount[playerGoals.indexOf(player)] > highestGoal){
                                highestGoal = goalsCount[playerGoals.indexOf(player)];
                                highestPlayer = [player]
                            }else if(goalsCount[playerGoals.indexOf(player)] == highestGoal){
                                highestPlayer.push(player)
                            }
                        }
                    }
                    result = highestPlayer
                    break;
                case 3:
                    let highestGame = []
                    highestGoal = 0;
                    for(let game of data){
                        if(!hasStarted(game)) continue;
                        totalGoals = getGoals(game)[0] + getGoals(game)[1]
                        if(totalGoals > highestGoal){
                            highestGoal = totalGoals;
                            highestGame = [getShortName(game.team1) + " : " + getShortName(game.team2)]
                        }else if(totalGoals == highestGoal){
                            highestGame.push(getShortName(game.team1) + " : " + getShortName(game.team2))
                        }
                    }
                    result = highestGame
                    break;
                case 4:
                    for(let game of data){
                        if(!hasStarted(game)) continue;
                        goals = getGoals(game);
                        if(goals[0] == 0) result.push(getShortName(game.team1));
                        if(goals[1] == 0) result.push(getShortName(game.team2));
                    }
                    break;
                case 5:
                    let highestWinner = []
                    let highestDifference = 0;
                    for(let game of data){
                        if(!hasStarted(game)) continue;
                        goals = getGoals(game);
                        if(goals[0] == goals[1]) continue;
                        let winner = goals[0] > goals[1] ? getShortName(game.team1): getShortName(game.team2);
                        let difference = Math.abs(goals[0] - goals[1]);
                        if(difference > highestDifference){
                            highestWinner = [winner]
                            highestDifference = difference;
                        }else if(difference == highestDifference){
                            highestWinner.push(winner);
                        }
                    }
                    result = highestWinner;
                    break;
            }
            break;
        case 20:
            switch(dailyT){
                case 1:
                    let highestGame = []
                    let highestGoal = 0;
                    for(let game of data){
                        totalGoals = getGoals(game)[0] + getGoals(game)[1]
                        if(totalGoals > highestGoal){
                            highestGoal = totalGoals;
                            highestGame = [getShortName(game.team1) + " : " + getShortName(game.team2)]
                        }else if(totalGoals == highestGoal){
                            highestGame.push(getShortName(game.team1) + " : " + getShortName(game.team2))
                        }
                    }
                    result = highestGame
                    break;
                case 2:
                    let highestWinner = []
                    let highestDifference = -100;
                    let highestDifferenceGoals = -1
                    for(let game of data){
                        if(!hasStarted(game)) continue;
                        goals = getGoals(game);
                        let germanIndex = germanTeams.includes(getShortName(game.team1)) ? 0: 1;
                        let germanTeam = germanIndex == 0 ? getShortName(game.team1): getShortName(game.team2);
                        let difference = goals[germanIndex] - goals[(germanIndex+1)%2];
                        if(difference > highestDifference || difference == highestDifference && goals[germanIndex] > highestDifferenceGoals){
                            highestWinner = [germanTeam]
                            highestDifference = difference;
                            highestDifferenceGoals = goals[germanIndex];
                        }else if(difference == highestDifference && goals[germanIndex] == highestDifferenceGoals){
                            highestWinner.push(germanTeam);
                        }
                    }
                    result = highestWinner;
                    break;
                case 3:
                    for(let game of data){
                        goals = getGoals(game);
                        if(goals[0] == goals[1]) continue;
                        let winner = goals[0] > goals[1] ? getShortName(game.team1): getShortName(game.team2);
                        if(germanTeams.includes(winner)){
                            result.push(winner);
                        }
                    }
                    if(result.length == 0) result.push("kein Team")
                    break;
            }
            break;
        case 100:
            result.push(getShortName(wholeTable[0]))
            break;
        case 101:
            if(goalgetters.length == 0) return result
            result.push(getPlayerName(goalgetters[0].goalGetterName))
            break;
        case 102:
            let dataCopy = [...wholeTable]
            for (let n = 0; n < 3; n++){
                result.push(getShortName(dataCopy.pop()))
            }
            break;
        case 103:
            for(let n of wholeTableChampion){
                if(germanTeams.includes(getShortName(n))){
                    result = [getShortName(n)]
                    break;
                }
            }
            break;
        case 104:
            
            for(let n of championsDayData){
                if(germanTeams.includes(getShortName(n.team1)) && !result.includes(getShortName(n.team1))){
                    
                    result.push(getShortName(n.team1))
                }else if(germanTeams.includes(getShortName(n.team2)) && !result.includes(getShortName(n.team2))){
                    
                    result.push(getShortName(n.team2))
                }
            }
            break
    }
    return result;
}

function getGoals(data){
    let goals = [0,0]
    if(!data.hasOwnProperty("goals")) return;
    for(let goal of data.goals){
        if(goal.scoreTeam1 > goals[0]) goals[0] = goal.scoreTeam1;
        if(goal.scoreTeam2 > goals[1]) goals[1] = goal.scoreTeam2;
    }
    return goals
}

function getFirstGoal(data){
    let firstGoal = null;
    if(!data.hasOwnProperty("goals")) return;
    for(let goal of data.goals){
        if(!firstGoal) firstGoal = goal;
        if(goal.goalID < firstGoal.goalID) firstGoal = goal;
    }
    return firstGoal;
}

function getPlayerName(name,team=null){
    let playerName = name
    let secondName = name.split(" ",2)[1]
    let firstName = name.split(" ",2)[0]
    if(team != null){
        
        for(let player of getPlayers(team)){
            if(player.includes(secondName)) playerName = player;
        }
        for(let player of getPlayers(team)){
            if(player.includes(firstName)) playerName = player;
        }
    }else{
        for(let team of Object.keys(players)){
            for(let player of getPlayers(team)){
                if(player.includes(secondName) || player.includes(firstName)) return player
            }
        }
    }
    return playerName;
}


function getGameResult(data){
    const days = ["So.","Mo.","Di.","Mi.","Do.","Fr.","Sa."]
    const date = new Date(data.matchDateTime);
    let goals = getGoals(data);
    let now = new Date();
    if(now < date) return `<p class="date">${days[date.getDay()]}</p>
    <p class="date">${('0' + date.getHours()).slice(-2) + ":" + ('0' + date.getMinutes()).slice(-2)}</p>`;
    return `<p>${goals[0]}:${goals[1]}</p>`;
}

function hasStarted(data){
    if(!data) return false;
    const date = new Date(data.matchDateTime);
    let now = new Date();
    if(now < date) return false;
    return true;
}

function displayBet(num,data,hasStarted,currentBets,t,index){
    let display = "";
    if(currentDay != 0 && !currentBets[currentDay-1]) return "";
    let currentBet = currentDay != 0 ? currentBets[currentDay-1]: currentBets
    if(currentBet[num] == null) currentBet[num] = []
    for(let i = 0; i < currentBet[num].length; i++){
        let bet = currentBet[num][i]
        //if(t == 7 || t == 6) newType = t + (0.5 * i)
        if(t == 7){
            display += getTitle(`${i+1}. Halbzeit`,false)
        }
        if(t == 6){
            display += getTitle(getShortName(getTeams(data)[i]),false)
        }

        let fix = getFix((t < 10 ? data.matchID: (t < 100 ? "daily" + data[0].group.groupOrderID: "saison" + (t-100))),i,playernames[index]);
        if(fix == null){
            typebet = t
            
            display += getBetDisplay(bet,changeColorBet(data,typebet,hasStarted,i,bet,index),playernames[index],(t < 10 ? data.matchID: (t < 100 ? "daily" + data[0].group.groupOrderID: "saison" + (t-100))),i);
        }else{
            display += getBetDisplay(fix.fix_data,changeColorBet(data,t,hasStarted,i,bet,index),playernames[index],fix.game_id,i)
        }
    }
    return display;
}

function findInArray(arr,obj){
    for(let i = 0; i < arr.length;i++){
        if(arr[i].includes(obj)) return i;
    }
    return -1
}

function displayPlayerPoints(){
    let setIn = document.getElementById("groupContainer")
    setIn.innerHTML = `
            <div class="pointsTop">
                <p id="noplayer"></p>
                <div class="playerPointsTop">
                    <p id="totalPoints" onclick="changePlayerOrder(true)">Gesamt</p>
                    <p id="dayPoints" onclick="changePlayerOrder(false)">Spieltag</p>  
                </div>
            </div>
            `
    for(let i = 0;i < playernames.length;i++){
        let player = playernames[i]
        let display = 
        `
        <div class="betContainer">
            <div class="playerPointDiv">
                
                <p class=playername id="name${player}">${player}</p>

            
                <div class="playerPoints">
                    <p id="totalPoints${player}"></p>
                    <p id="dayPoints${player}"></p>  
                </div>
                
            </div>
        </div>`;
        setIn.insertAdjacentHTML("beforeend",display);
    }
   
    document.getElementsByClassName("pointsTop")[0].style.width = document.getElementsByClassName("playerPointDiv")[0].clientWidth + "px"
    document.getElementsByClassName("groupContainer")[0].style.width = document.getElementsByClassName("playerPointDiv")[0].clientWidth + "px"
    
}

function shiftPlayerOrder(forward){
    if(playernames.length - getPlayerDisplayCount() <= 0) return;
    if(forward){
        if(shift >= playernames.length - getPlayerDisplayCount()) return;
        playernames.push(playernames.shift());
        bets.push(bets.shift());
        points.push(points.shift());
        shift++;
    }else{
        if(shift == 0) return;
        playernames.unshift(playernames.pop());
        bets.unshift(bets.pop());
        points.unshift(points.pop());
        shift--;
    }
    
    updateDisplay();
}

function changePlayerOrder(total){
    shift = 0;
    selectedCarouselItem = getSelectedCarouselItem()
    gameCarousel.innerHTML = '';
    if(total){
        let indices = Array.from({length: playernames.length}, (_, i) => i);
        indices.sort((a, b) => comparePoints(playernames[a],playernames[b]));
        playernames.sort((a, b) => comparePoints(a,b));
        bets = indices.map(i => bets[i]);
        points = indices.map(i => points[i]);
    }else{
        let indices = Array.from({length: playernames.length}, (_, i) => i);    
        indices.sort((a, b) => comparePointsDay(playernames[a],playernames[b]));
        playernames.sort((a, b) => comparePointsDay(a,b));
        bets = indices.map(i => bets[i]);
        points = indices.map(i => points[i]);
    }
    
    
    
    updateDisplay()
}

function comparePoints(a,b){
    const pointsA = getTotalPoints(playernames.indexOf(a));
    const pointsB = getTotalPoints(playernames.indexOf(b));
    return pointsB - pointsA;
}

function comparePointsDay(a,b){
    
    const pointsA = points[playernames.indexOf(a)][currentDay-1];
    const pointsB = points[playernames.indexOf(b)][currentDay-1];
    return pointsB - pointsA;
}   

function getBetDisplay(display,color="white",user="",matchId,orderId){
    
    if(is_admin){
        return `
        <div>
            <p class="border rounded-3 border-black betDisplay" style="background-color: ${color};" onClick="showEdit(true,parentElement)">${display}</p>
            <form onsubmit="changeContent(this.children[0].value,'${user}',parentElement,'${matchId}${orderId}');return false">
                <input type="hidden" value='${display}' class="border rounded-3 border-black betDisplay" style="background-color: ${color};">
            </form>
        </div>
    `
    }
    
    return `<p class="border rounded-3 border-black betDisplay" style="background-color: ${color};">${display}</p>`
}

function showEdit(show,object){
    var input = object.querySelector("input");
    var p = object.querySelector("p")
    if(show){
        input.type = "text";
        input.focus();
        var val = p.innerText; 
        input.value = ''; 
        input.value = val;
        p.style.display = "none";
    }else{
        input.type = "hidden";
        p.style.display = "";
        p.innerText = input.value;
    }
}

function changeContent(content,user,object,matchId){ 
    
    var xhr = new XMLHttpRequest();
    xhr.open("GET", 
    "php/submitChanges.php?match=" + encodeURIComponent(matchId) + 
        "&user=" + encodeURIComponent(user) + 
        "&data=" + encodeURIComponent(content), true);
    xhr.onload = function() {
        if (xhr.status == 200) {
            // Antwort von der PHP-Funktion
            
        }
    };
    xhr.send();
    
    showEdit(false,object)
}   

function getPlayers(team,position=null){
    if(position == null){
        let array = []
        for(let pos of Object.keys(players[team])){
            for(let player of players[team][pos]){
                array.push(player)
            }
        }
        return array
    }
    return players[team][position]
}

function getTitle(title,i=true){
    return `<p class="gameTitle" style="font-size: ${i ? 17: 15}px;">${title}</p>`
}

function RND(seed) {
    // Initialisierung der Variablen
    this.seed = seed;
    this.a = 1664525;
    this.c = 1013904223;
    this.m = Math.pow(2, 32);

    // Methode zur Generierung einer ganzen Zufallszahl innerhalb eines Bereichs
    this.nextInRange = function(min, max) {
        this.seed = (this.a * this.seed + this.c) % this.m;
        var random = this.seed % (max - min + 1); // Normalisiere die Zufallszahl auf [0, max - min]
        return min + random; // Verschiebe die Zufallszahl um 'min'
    }
}

function getPoints(num,data,bet,t,hasStarted,daily = null,playerindex){
    if(!hasStarted) return 0;
    
    const result = getResult(data,t,daily)

    for(let i = 0; i < result.length; i++){
        let fixResult = getFix((t < 10 ? data.matchID: (t < 100 ? "daily" + data[0].group.groupOrderID: "saison" + (t-100))),i);
        if(fixResult != null) result[i] = fixResult.fix_data
    }
    
    for(let i = 0; i < bet.length; i++){
        let fixBet = getFix((t < 10 ? data.matchID: (t < 100 ? "daily" + data[0].group.groupOrderID: "saison" + (t-100))),i,playernames[playerindex])
        if(fixBet != null) bet[i] = fixBet.fix_data
    }
    const correct = result.filter(value => bet.includes(value));
    let count = 0;
    
    if(t == 7){
        if(result[0] == bet[0]) count++;
        if(result[1] == bet[1]) count++;
    }else if(t == 6){
        if(result[0] == bet[0]) count++;
        if(result[1] == bet[1]) count++;
    }else if(t == 4){
        count = correct.length - (bet.length - correct.length)
        if(count < 0) count = 0;
    }else if(t == 20 && dailyInt == 3 || t == 10 && dailyInt == 4){
        count = (correct.length - (bet.length - correct.length)) / 2
        if(count < 0) count = 0;
    }else{
        count = correct.length
    }

    return count;
}

function getTotalPoints(i){
    let total = 0;
    for(let day of points[i]){
        if(day) total += day;
    }
    return total;
}

async function load(){
    try{
        let userData = await fetch('php/loginData.php')
        .then(function (response) {
        return response.json();
    });

    username = userData.username
    
    const data = await fetch('php/data.php')
        .then(function (response) {
            return response.json();
        });

    fixes = await fetch('php/fixes.php')
    .then(function (response) {
        return response.json();
    });

    is_admin = await fetch('php/is_admin.php')
        .then(function (response) {
            return response.json();
        });

    const teamData = await fetch('php/teamData.php')
    .then(function (response) {
        return response.json();
    });
    for(let n of teamData){
        players[n.team_name] = JSON.parse(n.team_players)
    }
    bets,playernames,saisonBets = []
    bets.push(JSON.parse(userData.user_data))
    saisonBets.push(JSON.parse(userData.saison_bets))
    
    points.push(JSON.parse(userData.user_points))
    playernames.push(username);

    if(userData.user_group != null){
        for(let player of data){
            if(userData.user_group == player.user_group && player.username != username){
                bets.push(JSON.parse(player.user_data))
                saisonBets.push(JSON.parse(player.saison_bets))
                playernames.push(player.username);
                
                points.push(JSON.parse(player.user_points))
            }
        }
    }
    saisonBetsFix = structuredClone(saisonBets)
    localStorage.setItem("userData",JSON.stringify({
        "username": username,
        "password": userData.user_password,
        "autoLogin": true,
        "forceLogin": false,
    }));
    }catch (error) {
        if(localStorage.getItem("userData")){
            let temp = JSON.parse(localStorage.getItem("userData"));
            temp.forceLogin = true;
            localStorage.setItem("userData",JSON.stringify(temp));
            
        } 
        
        window.location.href = 'anmelden';
        return;
    }
}

async function loadPoints(){
    let startIndex = getLastFilled(points)

    for(let day = startIndex; day < liveDay; day++){
        let rand = new RND(day+1);
        let typesLeftN = [1,2,3,4,5,6,7,8,9];
        let typesN = []
        for(let i = 0; i < 9; i++){
            let nextI = rand.nextInRange(0,typesLeftN.length-1);
            let next = typesLeftN[nextI];
            typesLeftN.splice(nextI,1);
            typesN.push(next);
        }
        dailyInt = rand.nextInRange(1,5)
        const data = day+1 == liveDay ? liveDayData: await fetch(new URL(`https://api.openligadb.de/getmatchdata/bl1/2024/${day+1}`)).then(response => response.json());

        for(let playerindex = 0; playerindex < bets.length; playerindex++){
            if(day > bets[playerindex.length-1]) break;
            let bet = bets[playerindex][day]
            
            points[playerindex][day] = 0;
            
            if(!bet) continue;
            for(let num = 0; num < bet.length; num++){
                if(num == 9){
                    points[playerindex][day] += 2 * getPoints(num,data,bet[num],10,hasStarted(data[0]),dailyInt,playerindex);
                    continue;
                }
                points[playerindex][day] += getPoints(num,data[num],bet[num],typesN[num],hasStarted(data[num]),null,playerindex);
            }
        }
    }

    startIndex = getLastFilledChamp(points)
    
    
    for(let day = startIndex; day <= 34 + liveDayChampion; day++){
        let rand = new RND(day+1);
        let typesLeftN = [1,4,5,6,8];
        let typesN = []
        for(let i = 0; i < 5; i++){
            let nextI = rand.nextInRange(0,typesLeftN.length-1);
            let next = typesLeftN[nextI];
            typesLeftN.splice(nextI,1);
            typesN.push(next);
        }
        dailyInt = rand.nextInRange(1,3)

        let tempChamp = championsDayData != null ? championsDayData: await fetch(new URL(`https://api.openligadb.de/getmatchdata/ucl2024/2024/1`)).then(response => response.json());
        let startIndexThis = (day-34)*18
        let data = [];
        let germanTeams = ["Stuttgart","Dortmund","Bayern","Leipzig","Leverkusen"]
        
        for(let i = startIndexThis; i < startIndexThis+18; i++){
            if(germanTeams.includes(getShortName(tempChamp[i].team1)) || germanTeams.includes(getShortName(tempChamp[i].team2))) data.push(tempChamp[i]);
        }

        
        for(let playerindex = 0; playerindex < bets.length; playerindex++){
            if(day > bets[playerindex.length-1]) break;
            let bet = bets[playerindex][day]
            
            points[playerindex][day] = 0;
            
            if(!bet) continue;
            for(let num = 0; num < bet.length; num++){
                if(num == 5){
                    points[playerindex][day] += 2 * getPoints(num,data,bet[num],20,hasStarted(data[0]),dailyInt,playerindex);
                    break;
                }
                
                points[playerindex][day] += getPoints(num,data[num],bet[num],typesN[num],hasStarted(data[num]),null,playerindex);
            }
        }
    }
    
    for(let i = 0; i < playernames.length; i++){
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "php/savePoints.php?data=" + encodeURIComponent(JSON.stringify(points[i]))
        + "&user=" + encodeURIComponent(playernames[i]), true);
        xhr.send();
    }
}

function getShortName(team){
    let teamname = team.shortName != "" ? team.shortName: team.teamName
    switch(teamname){
        case "BVB":
            return "Dortmund"
        case "AC Milan":
            return "Milan"
        case "AS Monaco":
            return "Monaco"
        case "Aston Villa FC":
            return "Aston Villa"
        case "Atalanta Bergamo":
            return "Atalanta"
        case "Atletico Madrid":
            return "Atletico"
        case "Bologna FC":
            return "Bologna"
        case "Benfica Lissabon":
            return "Benfica"
        case "YB":
            return "Bern"
        case "Celtic Glasgow":
            return "Glasgow"
        case "Dinamo Zagreb":
            return "Dinamo"
        case "FC Barcelona":
            return "Barcelona"
        case "FC Brügge":
            return "Brügge"
        case "FC Liverpool":
            return "Liverpool"
        case "FC Red Bull Salzburg":
            return "Salzburg"
        case "Feyenoord Rotterdam":
            return "Feyenoord"
        case "Inter Mailand":
            return "Inter"
        case "Juve":
            return "Juventus"
        case "Manchester City":
            return "Manchester"
        case "OSC Lille":
            return "Lille"
        case "Paris Saint-Germain":
            return "Paris"
        case "PSV Eindhoven":
            return "Eindhoven"
        case "Roter Stern Belgrad":
            return "Belgrad"
        case "Shakhtar Donetsk":
            return "Donezk"
        case "Sparta Prag":
            return "Prag"
        case "Sporting CP":
            return "Sporting"
        case "Stade Brest":
            return "Brest"
        case "Madrid":
            return "Real"
        case "München":
            return "Bayern"
    }
    return teamname
}

function getTeamIcon(team){    
    switch(team.teamName){
        case "Dinamo Zagreb":
            return "https://derivates.kicker.de/image/fetch/f_webp/w_76%2Ch_76%2Cc_fit%2Cq_auto:best/https://mediadb.kicker.de/2021/fussball/vereine/xxl/1029_20210309974.png"
        case "AC Milan":
            return "https://upload.wikimedia.org/wikipedia/de/thumb/1/16/AC_Milan_Logo.svg/1200px-AC_Milan_Logo.svg.png"
        case "Benfica Lissabon":
            return "https://tmssl.akamaized.net/images/wappen/big/10330.png?lm=1535908439"
        case "FC Barcelona":
            return "https://upload.wikimedia.org/wikipedia/de/thumb/a/aa/Fc_barcelona.svg/180px-Fc_barcelona.svg.png"
        case "Juventus Turin":
            return "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Juventus_FC_-_pictogram_black_%28Italy%2C_2017%29.svg/800px-Juventus_FC_-_pictogram_black_%28Italy%2C_2017%29.svg.png"
        case "Shakhtar Donetsk":
            return "https://upload.wikimedia.org/wikipedia/de/thumb/1/13/Fc_shaktar_%28neu%29.svg/180px-Fc_shaktar_%28neu%29.svg.png"
        case "ŠK Slovan Bratislava":
            return "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/SK_Slovan_Bratislava_logo.svg/285px-SK_Slovan_Bratislava_logo.svg.png"
        case "SK Sturm Graz":
            return "https://upload.wikimedia.org/wikipedia/de/thumb/2/20/SK_Sturm_Graz_Logo.svg/300px-SK_Sturm_Graz_Logo.svg.png"
        case "Stade Brest":
            return "https://derivates.kicker.de/image/fetch/f_webp/w_30%2Ch_30%2Cc_fit%2Cq_auto:best/https://mediadb.kicker.de/2013/fussball/vereine/xxl/1745_20180228949.png"
        case "Roter Stern Belgrad":
            return "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/FK_Crvena_Zvezda_Logo.svg/1200px-FK_Crvena_Zvezda_Logo.svg.png"
    }
    
    return team.teamIconUrl
}

function championsLeagueDaysBeforeDay(day){
    let days = 0;
    for(let i = 0; i < championsLeagueGamedays.length; i++){
        if(championsLeagueGamedays[i] < day){
            days += 1;
        }else{
            break;
        }
    }
    return days;
}

function getLastFilled(arr){
    for(let i = 33; i >= 0; i--){
        for(let player of arr){
            if(player[i] > 0){
                return i
            };
        }
    }
    return 0
}

function getLastFilledChamp(arr){
    for(let player of arr){
        for(let i = player.length-1; i >= 34; i--){
            if(player[i] != 0) return i
        }
    }
    return 34
}

function getPlayerDisplayCount(){
    if(window.matchMedia("(max-width: 1320px)").matches){
        return 1;
    }else if(window.matchMedia("(max-width: 1800px)").matches){
        return 2;
    }else{
        return 3;
    }
}

function editName(){
    let input = document.getElementById("edit-name")
    let nameText = document.getElementById("name")
    if(editingName == false){
        input.style.display = "";
        input.focus(); 
        var val = nameText.innerText; 
        input.value = ''; 
        input.value = val;
        nameText.style.display = "none";
    }else{
        input.style.display = "none";
        nameText.style.display = "";
        nameText.innerText = input.value;
    }
    editingName = !editingName
}

function selectCarouselItem(index){
    let children = document.getElementById("gameCarousel").children
    for(let n of children) n.classList.remove("active");
    if(index > children.length-1){
        children[0].classList.add("active");
    }else{
        children[index].classList.add("active");
    }
}

function getSelectedCarouselItem(){
    let children = document.getElementById("gameCarousel").children
    for(let i = 0; i < children.length; i++) if(children[i].classList.contains("active")) return i
    return 0
}

function getLastStarted(data){
    let j = -1
    for(let i = 0; i < data.length; i++){
        if(!hasStarted(data[i]) && j != -1) return j
        if(i % getPlayerDisplayCount() == 0) j++
        if(hasStarted(data[i]) && !isOver(data[i])) return j
    }
    return 0
}
