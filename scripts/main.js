const players = {}

let types = [];
let typesLeft = [1,2,3,4,5,6,7,8,9]
let dailyType = 5  
let extraInfo = [];

const titles = ["Wer gewinnt?", "Wer schießt das 1. Tor?","Welcher Spieler schießt das 1. Tor?","Welche Spieler schießen ein Tor?","Wie viele Tore fallen?","Wie viele Tore schießt das Team?","Wie viele Tore fallen in der Halbzeit?","Welches Team gewinnt mit welchem Abstand?","Schießen beide Teams ein Tor?"];
const dailyTitles = ["Welches Team schießt die meisten Tore?","Welcher Spieler schießt die meisten Tore?","In welchem Spiel fallen die meisten Tore?","Welche Teams schießen kein Tor?","Welches Team gewinnt mit dem höchsten Abstand?"]
const saisonTitles = ["Wer wird Meister?", "Welcher Spieler schießt die meisten Tore?", "Welche Teams belegen die letzten 3 Plätze?","Welches deutsche Team hat die beste Platzierung?","Welches deutsche Team kommt am weitesten?"]

let championsLeagueTitles = ["In welchem Spiel fallen die meisten Tore?","Welches deutsche Team spielt am besten?","Welche deutschen Teams gewinnen?"]
const championsLeagueGamedays = [3,5,7,9,11,13,18,19]


let bets = []
let saisonBets = []
let currentDay = 0;
let currentDayIndex = 0;
let liveDay = 0;
let liveDayChampion = 0
let liveDayIsChampion = false
let championsDayData = null
let lastDay = null
let firstDay = null
let goalgetters = null
let wholeTable = null
let wholeTableChampion = null
let championsDay = null
let username = "";
let d = null
let fixes = []

let allTeams = [];

let lastSelectedSaison = 0

let editingName = false

let currentFilterTeam = "all"
let currentFilterPosition = "all"

start();
async function start(){
   await load(); 
   daySelect.insertAdjacentHTML('beforeend', `<option value="0">Saisonswetten</option>`);

    let j = 1
    for(let i = 1; i <= 34; i++){
        daySelect.insertAdjacentHTML('beforeend', `<option value="${i}">${i}. Spieltag</option>`);
        if(championsLeagueGamedays.includes(i)){
            daySelect.insertAdjacentHTML('beforeend', `<option value="${34+j}">Champions League #${j}</option>`);
            j++;
        }
    }
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

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let day = isNaN(parseInt(urlParams.get('day'))) ? urlParams.get('day'): parseInt(urlParams.get('day'))
    
    showSpieltag(day != null ? day: (!liveDayIsChampion ? liveDay: liveDayChampion+35));
}

async function showSpieltag(n=null,index = false){
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
    currentDay = n;
    currentFilterPosition = "all"
    currentFilterTeam = "all"

    var newURL = updateURLParameter(window.location.href, 'locId', 'newLoc');
    newURL = updateURLParameter(newURL, 'resId', 'newResId');

    window.history.replaceState('', '', updateURLParameter(window.location.href, "day", n));
    document.getElementById("link").href = "übersicht?day=" + n


    list.innerHTML = "";
    betContent.innerHTML = "";
    daySelect.selectedIndex = n;

    
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

    const data = n == liveDay ? liveDayData: await fetch(new URL(`https://api.openligadb.de/getmatchdata/bl1/2024/${n}`)).then(response => response.json());
    d = data;

    const url1 = new URL(`https://api.openligadb.de/getavailableteams/bl1/2024`);
    const response1 = await fetch(url1);
    allTeams = await response1.json();

    if(n == 0){
        const urlDay3 = new URL(`https://api.openligadb.de/getmatchdata/bl1/2024/4`);
        const responseDay3 = await fetch(urlDay3);
        const dataDay3 = await responseDay3.json();
        let saisonHasStarted = liveDay > 4 ? true: (liveDay < 4 ? false: hasStarted(dataDay3[0]))
        if(championsDayData == null) championsDayData = await fetch(new URL(`https://api.openligadb.de/getmatchdata/ucl2024/2024/1`)).then(response => response.json());
        let championHasStarted = hasStarted(championsDayData[0])
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

        showSaison(data,1,saisonHasStarted)
        showSaison(data,2,saisonHasStarted)
        showSaison(data,3,saisonHasStarted)
        showSaison(data,4,championHasStarted)
        showSaison(data,5,championHasStarted)
        
        return;
    }
    if(n > 34){
        if(championsDayData == null) championsDayData = await fetch(new URL(`https://api.openligadb.de/getmatchdata/ucl2024/2024/1`)).then(response => response.json());
        let tempChamp = championsDayData

        let rand = new RND(n);
        typesLeft = [1,4,5,6,8];
        types = []

        for(let i = 0; i < 5; i++){
            let nextI = rand.nextInRange(0,typesLeft.length-1);
            let next = typesLeft[nextI];
            typesLeft.splice(nextI,1);
            types.push(next);
        }
        dailyType = rand.nextInRange(1,3);

        let startIndex = (n-35)*18
        let dataChamp = [];
        let germanTeams = ["Stuttgart","Dortmund","Bayern","Leipzig","Leverkusen"]
        
        for(let i = startIndex; i < startIndex+18; i++){
            if(germanTeams.includes(getShortName(tempChamp[i].team1)) || germanTeams.includes(getShortName(tempChamp[i].team2))) dataChamp.push(tempChamp[i]);
        }
        d = dataChamp;

        if(!bets[n-1]) bets[n-1] = [[],[],[],[],[],[]]
        for(let i = 0; i < dataChamp.length; i++){
            showData(dataChamp[i],i,true);
        }
        showDaily(dataChamp,dataChamp.length,true);
        return;
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

    
    if(!bets[n-1]) bets[n-1] = [[],[],[],[],[],[],[],[],[],[]]
    for(let i = 0; i < data.length; i++){
        showData(data[i],i);
    }
    showDaily(data,data.length);
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



function showData(data,num,champions=false){
    const days = ["So.","Mo.","Di.","Mi.","Do.","Fr.","Sa."]
    const date = new Date(data.matchDateTime);
    const newHtml = `<li>
        <div id="bet${data.matchID}" class="game" role="button" onClick="showBet('${data.matchID}')">
            <div id="bet${data.matchID}" class="resultContainer">
                <div class="team1"> 
                    <div class="oneline text" id="name">${getShortName(data.team1)}</div>
                    <div class="oneline small"><img src="${getTeamIcon(data.team1)}" alt="img" height="100%" id="image"></div>
                </div>
                <div class="resultDiv" id="games">
                    ${getGameResult(data)}
                </div>
                <div class="team2">
                    <div class="oneline small"><img src="${getTeamIcon(data.team2)}" alt="img" height="100%" id="image"></div>
                    <div class="oneline text" id="name">${getShortName(data.team2)}</div>
                </div>
            </div>
            <div class="selectedBetDisplay">
                ${getTitle(titles[types[num]-1])}
                <div id="betContainer${data.matchID}">
                    ${displayResults(num,data,types[num])}
                </div>
            </div>
        </div>
    </li>`;
    
    let newBet = `<div id="main${data.matchID}" class="border border-black rounded-3 betContent" style="display:none;padding:8px">
                    ${getBetContent(data,types[num],num,champions)}
                </div>`;
    

    list.insertAdjacentHTML('beforeend', newHtml);
    betContent.insertAdjacentHTML('beforeend', newBet);
    
    if(num == 0){
        showBet(data.matchID);
    }

}

function showDaily(data,num,champions){
    const newHtml = `<li>
        <div id="betDaily" class="game" role="button" onClick="showBet('Daily')">
            <div class="resultContainer">
                <h1>Spieltag</h1>
            </div>
            <div class="selectedBetDisplay">
                ${getTitle(!champions ? dailyTitles[dailyType-1]: championsLeagueTitles[dailyType-1])}
                <div id="betContainerDaily">
                    ${displayResults(num,data,champions ? 20: 10)}
                </div>
            </div>
        </div>
    </li>`;

    let newBet = `<div id="mainDaily" class="border border-black rounded-3 betContent" style="display:none;padding:8px">
                    ${getBetContent(data,champions ? 20: 10,num,champions)}
                </div>`;
    

    list.insertAdjacentHTML('beforeend', newHtml);
    betContent.insertAdjacentHTML('beforeend', newBet);
}

function showSaison(data,num,saisonHasStarted){
    document.getElementById("Saison-warning").hidden = saisonHasStarted
    let newHtml = `<li>
        <div id="betSaison${num}" class="game" role="button" onClick="showBet('Saison${num}')">
            <div class="resultContainer">
                <h1>${num < 4 ? ("Bundesliga #"+ (num)):("Champions League #"+ (num-3))}</h1>
            </div>
            <div class="selectedBetDisplay">
                ${getTitle(saisonTitles[num-1])}
                <div id="betContainerSaison${num}">
                    ${displayResults(num-1,data,num+99,num)}
                </div>
            </div>
        </div>
    </li>`;

    let newBet = `<div id="mainSaison${num}" class="border border-black rounded-3 betContent" style="display:none;padding:8px">
                    ${getBetContent(data,num+100,num+100,false,saisonHasStarted)}
                </div>`;
    

    list.insertAdjacentHTML('beforeend', newHtml);
    betContent.insertAdjacentHTML('beforeend', newBet);

    if(num == 1){
        showBet("Saison1")
    }
}

function displayResults(num,data,t,teams = null){
    let display =  "";
    if(currentDay == 0 && saisonBets[num] == null) saisonBets[num] = []
    let result = currentDay != 0 ? bets[currentDay-1][num]: saisonBets[num]
    
    for(let i = 0; i < result.length;i++){
        if(t == 7){
            display += getTitle(`${i+1}. Halbzeit`,false)
        }
        if(t == 6){
            display += getTitle(teams == null ? getShortName(getTeams(data)[i]): teams[i],false)
        }
        let bet = result[i]
        let fixBet = data == null ? null: getFix((t < 10 ? data.matchID: (t < 100 ? "daily" + data[0].group.groupOrderID: "saison" + (t-100))),i,username)
        if(fixBet != null) bet = fixBet.fix_data    
        display += getBetDisplay(bet,changeColorBet(data,t,data == null ? false: hasStarted(data),i,bet));
    }
    return display;
}

function getBetDisplay(display,color="white"){
    return `
    <p class="betDisplay" style="background-color: ${color};">${display}</p>
`
}

function getTeams(data){
    return [data.team1,data.team2]
}


function getBetContent(data,type,num,champions=false,saisonHasStarted=null){
    let elements = "";
    let teams = [];
    let allPlayers = []
    let germanTeams = ["Stuttgart","Dortmund","Bayern","Leipzig","Leverkusen"]
    switch (type) {
        case 1:
            return getTitle("Wer gewinnt?") +  getButtonToggle(data,getShortName(data.team1),data.matchID,num,type) + getButtonToggle(data,"Unentschieden",data.matchID,num,type) + getButtonToggle(data,getShortName(data.team2),data.matchID,num,type);
        case 2:
            return getTitle("Wer schießt das 1. Tor?") +  getButtonToggle(data,getShortName(data.team1),data.matchID,num,type) + getButtonToggle(data,getShortName(data.team2),data.matchID,num,type) + getButtonToggle(data,"kein Tor",data.matchID,num,type);
        case 3:
            allPlayers = sortPlayers(getPlayers(data.team1.teamName).concat(getPlayers(data.team2.teamName)))
            for(let player of allPlayers){
                elements += getButtonToggle(data,player,data.matchID,num,type) + "\n"
            }
            elements += getAddButton(data,data.matchID,num,type)
            return getTitle("Welcher Spieler schießt das 1. Tor?") + getButtonToggle(data,"kein Tor",data.matchID,num,type) + getSearch([getPlayers(data.team1.teamName),getPlayers(data.team2.teamName)],data.matchID,[data.team1,data.team2]) + `<div id="${data.matchID}">` + elements + "</div>"
        case 4:
            allPlayers = sortPlayers(getPlayers(data.team1.teamName).concat(getPlayers(data.team2.teamName)))
            for(let player of allPlayers){
                elements += getButtonToggle(data,player,data.matchID,num,type,false) + "\n"
            }
            elements += getAddButton(data,data.matchID,num,type)
            teams = []
            if(!champions || germanTeams.includes(getShortName(data.team1))) teams.push(data.team1)
            if(!champions || germanTeams.includes(getShortName(data.team2))) teams.push(data.team2)
            return getTitle("Welche Spieler schießen ein Tor?") + getButtonToggle(data,"kein Tor",data.matchID,num,type,false) + getSearch([getPlayers(data.team1.teamName),getPlayers(data.team2.teamName)],data.matchID,teams) + `<div id="${data.matchID}">` + elements + "</div>"
        case 5:
            elements = getTitle("Wie viele Tore fallen?");
            for(let i = 0; i < 6;i+=2){
                elements += getButtonToggle(data,i + " - " + (i+1),data.matchID,num,type) + "\n"
            }
            elements += getButtonToggle(data,6 + "+",data.matchID,num,type) + "\n"
            return elements
        case 6:
            elements = getTitle("Wie viele Tore schießt das Team?");
            elements += getTitle(data.team1.teamName,false);
            for(let i = 0; i < 4;i++){
                elements += getButtonToggle(data,i,data.matchID,num,type) + "\n"
            }
            elements += getButtonToggle(data,4 + "+",data.matchID,num,type) + "\n"
            elements += getTitle(data.team2.teamName,false);
            for(let i = 0; i < 4;i++){
                elements += getButtonToggle(data,i,data.matchID+"team2",num,type+0.5) + "\n"
            }
            elements += getButtonToggle(data,4 + "+",data.matchID+"team2",num,type+0.5) + "\n"
            return elements
        case 7:
            elements = getTitle("Wie viele Tore fallen in der Halbzeit?");
            elements += getTitle("1. Halbzeit",false)
            for(let i = 0; i < 4;i++){
                elements += getButtonToggle(data,i,data.matchID,num,type) + "\n"
            }
            elements += getButtonToggle(data,4 + "+",data.matchID,num,type) + "\n"
            elements += getTitle("2. Halbzeit",false)
            for(let i = 0; i < 4;i++){
                elements += getButtonToggle(data,i,data.matchID+"2.Hz",num,type+0.5) + "\n"
            }
            elements += getButtonToggle(data,4 + "+",data.matchID+"2.Hz",num,type+0.5) + "\n"
            return elements
        case 8:
            elements = getTitle("Welches Team gewinnt mit welchem Abstand?");
            //elements += `<p>${getShortName(data.team1)}: </p>`
            for(let i = 1; i < 4;i++){
                elements += getButtonToggle(data,getShortName(data.team1) + " & " + i,data.matchID,num,type) + "\n"
            }
            elements += getButtonToggle(data,getShortName(data.team1) + " & " + 4 + "+",data.matchID,num,type) + "\n"
            //elements += `<p>${getShortName(data.team2)}: </p>`
            for(let i = 1; i < 4;i++){
                elements += getButtonToggle(data,getShortName(data.team2) + " & " + i,data.matchID,num,type) + "\n"
            }
            elements += getButtonToggle(data,getShortName(data.team2) + " & " + 4 + "+",data.matchID,num,type) + "\n"
            elements += getButtonToggle(data,"Unentschieden",data.matchID,num,type)
            return elements
        case 9:
            return getTitle("Schießen beide Teams ein Tor?") +  getButtonToggle(data,"Ja",data.matchID,num,type) + getButtonToggle(data,"Nein",data.matchID,num,type);
        case 10:
            switch(dailyType){
                case 1:
                    elements = "";
                    teams = []
                    if(bets[currentDay-1].length <= num) bets[currentDay-1].push([])
                    for(let game of data){
                        if(!hasStarted(game) || bets[currentDay-1][9].length != 0 || hasStarted(data[data.length - 1])){
                            teams.push(getShortName(game.team1))
                            teams.push(getShortName(game.team2))
                        }
                    }
                    teams.sort()
                    for(let team of teams){
                        elements += getButtonToggle(data[0],team,"Daily",num,type,true,hasStarted(data[0]) && !hasStarted(data[data.length - 1]) ? bets[currentDay-1][9].length != 0: null)
                    }
                    return getTitle("Welches Team schießt die meisten Tore?") + getSearch([teams],"Daily") + `<div id="Daily">` + elements + "</div>"
                case 2:
                    elements = "";
                    let teamList = []
                    allPlayers = []
                    for(let game of data){
                        if(!hasStarted(game) || bets[currentDay-1][9].length != 0 || hasStarted(data[data.length - 1])){
                            teamList.push(getPlayers(game.team1.teamName))
                            teamList.push(getPlayers(game.team2.teamName));
                            allPlayers = allPlayers.concat(getPlayers(game.team1.teamName))
                            allPlayers = allPlayers.concat(getPlayers(game.team2.teamName));
                        }
                    }
                    allPlayers = sortPlayers(allPlayers)
                    for(let player of allPlayers){
                        elements += getButtonToggle(data[0],player,"Daily",num,type,true,hasStarted(data[0]) && !hasStarted(data[data.length - 1]) ? bets[currentDay-1][9].length != 0: null)
                    }
                    elements += getAddButton(data[0],"Daily",num,type)
                    return getTitle("Welcher Spieler schießt die meisten Tore?") + getSearch(teamList,"Daily",allTeams) + `<div id="Daily">` + elements + "</div>"
                case 3:
                    elements = getTitle("In welchem Spiel fallen die meisten Tore?")
                    for(let game of data){
                        if(!hasStarted(game) || bets[currentDay-1][9].length != 0 || hasStarted(data[data.length - 1])){
                            elements += getButtonToggle(data[0],getShortName(game.team1) + " : " + getShortName(game.team2),"Daily",num,type,true,hasStarted(data[0]) && !hasStarted(data[data.length - 1]) ? bets[currentDay-1][9].length != 0: null)
                        }
                    }
                    return elements
                case 4:
                    elements = "";
                    teams = []
                    if(bets[currentDay-1].length <= num) bets[currentDay-1].push([])
                    for(let team of allTeams){
                        teams.push(getShortName(team))
                    }
                    teams.sort()
                    for(let game of data){
                        if(!hasStarted(game) || bets[currentDay-1][9].length != 0 || hasStarted(data[data.length - 1])){
                            elements += getButtonToggle(data[0],getShortName(game.team1),"Daily",num,type,false,hasStarted(data[0]) && !hasStarted(data[data.length - 1]) ? bets[currentDay-1][9].length != 0: null)
                            elements += getButtonToggle(data[0],getShortName(game.team2),"Daily",num,type,false,hasStarted(data[0]) && !hasStarted(data[data.length - 1]) ? bets[currentDay-1][9].length != 0: null)
                        }
                    }
                    return getTitle("Welche Teams schießen kein Tor?") + getButtonToggle(data[0],"kein Team","Daily",num,type) + getSearch([teams],"Daily") + `<div id="Daily">` + elements + "</div>"
                case 5:
                    elements = "";
                    teams = []
                    if(bets[currentDay-1].length <= num) bets[currentDay-1].push([])
                    for(let game of data){
                        if(!hasStarted(game) || bets[currentDay-1][9].length != 0 || hasStarted(data[data.length - 1])){
                            teams.push(getShortName(game.team1))
                            teams.push(getShortName(game.team2))
                        }
                    }
                    teams.sort()
                    for(let team of teams){
                        elements += getButtonToggle(data[0],team,"Daily",num,type,true,hasStarted(data[0]) && !hasStarted(data[data.length - 1]) ? bets[currentDay-1][9].length != 0: null)
                    }
                    return getTitle("Welches Team gewinnt mit dem höchsten Abstand?") + getSearch([teams],"Daily") + `<div id="Daily">` + elements + "</div>"
            }
            break;
        case 20:
            switch(dailyType){
                case 1:
                    elements = getTitle(championsLeagueTitles[dailyType-1])
                    for(let game of data){
                        elements += getButtonToggle(data[0],getShortName(game.team1) + " : " + getShortName(game.team2),"Daily",num,type)
                    }
                    return elements
                case 2:
                    elements = getTitle(championsLeagueTitles[dailyType-1])
                    for(let team of germanTeams){
                        elements += getButtonToggle(data[0],team,"Daily",num,type)
                    }
                    return elements
                case 3:
                    elements = getTitle(championsLeagueTitles[dailyType-1])
                    elements += getButtonToggle(data[0],"kein Team","Daily",num,type,false)
                    for(let team of germanTeams){
                        elements += getButtonToggle(data[0],team,"Daily",num,type,false)
                    }
                    return elements
            }
            break;
        case 101:
            elements = "";
            teams = []
            for(let team of allTeams){
                teams.push(getShortName(team))
            }
            teams.sort()
            for(let team of teams){
                elements += getButtonToggle(data[0],team,"Saison1",0,type,true,saisonHasStarted)
            }
            return getTitle(saisonTitles[0]) + getSearch([teams],"Saison1") + `<div id="Saison1">` + elements + "</div>"
        case 102:
            elements = "";
            let teamList = []
            allPlayers = []
            for(let team of Object.keys(players)){
                teamList.push(getPlayers(team));
                allPlayers = allPlayers.concat(getPlayers(team))
            }
            allPlayers = sortPlayers(allPlayers)
            for(let player of allPlayers){
                elements += getButtonToggle(data[0],player,"Saison2",1,type,true,saisonHasStarted)
            }
            elements += getAddButton(data[0],"Saison2",1,type)
            return getTitle(saisonTitles[1]) + getSearch(teamList,"Saison2",allTeams) + `<div id="Saison2">` + elements + "</div>"
        case 103:
            elements = "";
            teams = []
            for(let team of allTeams){
                teams.push(getShortName(team))
            }
            teams.sort()
            for(let team of teams){
                elements += getButtonToggle(data[0],team,"Saison3",2,type,true,saisonHasStarted)
            }
            return getTitle(saisonTitles[2]) + getSearch([teams],"Saison3") + `<div id="Saison3">` + elements + "</div>"
        case 104: case 105:
            elements = "";
            teams = []
            for(let team of germanTeams){
                teams.push(team)
            }
            teams.sort()
            for(let team of teams){
                elements += getButtonToggle(data[0],team,"Saison"+(type-100),type-101,type,true,saisonHasStarted)
            }
            return getTitle(saisonTitles[type-101]) + getSearch([teams],"Saison"+(type-100)) + `<div id="Saison${type-100}">` + elements + "</div>"
        }
}

function getAddButton(data,group,num,type){
    return `<div id="addNewButtom${group}" class="chooseAdd" style="display:none"> 
                <input type="buttom" class="btn-check" id="addNew${group}" onClick="saveBet('customValue',${num},${type},'${group == "Daily" || typeof group =="string" ? group: data.matchID}','${getShortName(getTeams(data)[0])}','${getShortName(getTeams(data)[1])}',this.name)">
                <label class="btn btn-outline-secondary" for="addNew${group}">hinzufügen</label>
             </div>`
}

function getButtonToggle(data,name,group,num,type,toggle=true,thisHasStarted=null){
    
    let checked = false;
    if(currentDay != 0 && bets[currentDay-1].length <= num) bets[currentDay-1][num] = []
    let currentBet = currentDay != 0 ? bets[currentDay-1][num]: saisonBets[num];
    if(type == 7 && currentBet[0] == name){
        checked = true;
    }else if(type == 7.5 && currentBet[1] == name){
        checked = true;
    }else if(type == 6 && currentBet[0] == name){
        checked = true;
    }else if(type == 6.5 && currentBet[1] == name){
        checked = true;
        
    }else if(currentBet.includes(name)){
        checked = true;
    }

    return `<div id="full${name + group}" class="choose"> 
                <input type="${toggle ? "radio" : "checkbox"}" class="btn-check" name="${group}" id="${name + "" + group}" autocomplete="off" onClick="saveBet('${name}',${num},${type},'${group == "Daily" || typeof group =="string" ? group: data.matchID}','${getShortName(getTeams(data)[0])}','${getShortName(getTeams(data)[1])}',this.name)" ${checked ? "checked":""} ${(thisHasStarted == null ? hasStarted(data): thisHasStarted) ? "disabled":""}>
                <label class="btn btn-outline-secondary" for="${name + "" + group}">${name}</label>
             </div>`
}

function getSearch(teams,group,teamnames=null){
    let playersList = [];
    for(let team of teams){
        for(let player of team){
            playersList.push("\'"+player+"\'");
        }
    }
    
    let search = `<input id="Search${group}" type="text" class="form-control" placeholder="" autocomplete="off" onInput="showPlayers('${group}',[${playersList}],value)">`
    if(teamnames != null){
        let teamnamesNames = []
        for(let n of teamnames){
            teamnamesNames.push("\'"+n.teamName+"\'");
        }
        search += `<div class="filterContainer"><select onChange="filterResultsTeam('${group}',[${playersList}],this.options[this.selectedIndex].value,[${teamnamesNames}])" class="form-select">
        <option value="all" selected>alle Teams</option>`            
        
        teamnames.sort((a, b) => getShortName(a).localeCompare(getShortName(b)));
        for(let team of teamnames){
            search += `<option value="${team.teamName}">${getShortName(team)}</option>`
        }
        search += "</select>"


        search += `<select onChange="filterResultsPosition('${group}',[${playersList}],this.options[this.selectedIndex].value,[${teamnamesNames}])" class="form-select">
        <option value="all" selected>alle Positionen</option>`            
        
        for(let pos of Object.keys(players[teamnames[0].teamName])){
            search += `<option>${pos}</option>`
        }
        search += "</select></div>"
    }
    
    return search;
}

function filterResultsTeam(id,playerlist,value,teamnames,first = true){
    if(first){
        let element = document.getElementById(id);
        for(let e of element.children){
            e.hidden = false;
        }
    }
    currentFilterTeam = value
    
    if(value == "all"){
        if(first) filterResultsPosition(id,playerlist,currentFilterPosition,teamnames,false);
        return;
    }
    for(let player of playerlist){
        if(!getPlayers(value).includes(player)){
            document.getElementById("full" + player + id).hidden = true;
        }
    }
    if(first) filterResultsPosition(id,playerlist,currentFilterPosition,teamnames,false);
}

function filterResultsPosition(id,playerlist,value,teamnames,first = true){
    if(first){
        let element = document.getElementById(id);
        for(let e of element.children){
            e.hidden = false;
        }
    }
    currentFilterPosition = value
    if(value == "all"){
        if(first) filterResultsTeam(id,playerlist,currentFilterTeam,teamnames,false);
        return;
    }
    for(let player of playerlist){
        let found = false
        for(let team of teamnames){
            if(players[team][value].includes(player)){
                found = true
            }
        }
        if(!found) document.getElementById("full" + player + id).hidden = true;
    }
    if(first) filterResultsTeam(id,playerlist,currentFilterTeam,teamnames,false);
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


function getPlayers(team,position=null){
    if(!Object.keys(players).includes(team)) return []
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

function sortPlayers(playerlist){
    playerlist.sort((a, b) => a.split(" ").pop().localeCompare(b.split(" ").pop()));
    return playerlist
}


function showPlayers(id,list,value){
    let element = document.getElementById(id);
    for(let e of element.children){
        e.style.display = "none";
    }
    let capitalizedStr = value.charAt(0).toUpperCase() + value.slice(1);
    let found = false
    for(let player of list){
        if(player.includes(capitalizedStr)){
            document.getElementById("full" + player + id).style.display = "";
            found = true
            //element.insertAdjacentHTML('beforeend', getButtonToggle(data,player));
        }
    }
    let addButton = document.getElementById("addNewButtom"+id)
    if(!found){
        addButton.children[1].innerText = '\"'+document.getElementById('Search'+ id).value+"\""
        addButton.style.display = ""
    }else{
        addButton.style.display = "none"
    }
}

function getTitle(title,i=true){
    return `<p class="gameTitle" style="font-size: ${i ? 17: 15}px;">${title}</p>`
}

function randomNumber(min,max){
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function showBet(id){
    currentFilterPosition = "all"
    currentFilterTeam = "all"
    for(let bet of document.getElementsByClassName("game")){
        bet.style.backgroundColor = "white"
    }
    document.getElementById("bet" + id).style.backgroundColor = "#bdb3b3"
    for(let bet of betContent.children){
        bet.style.display = "none";
    }
    let element = document.getElementById("main" + id);
    element.style.display = "";
}

function saveBet(bet,i,type,id,team1,team2,groupId){
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    if(type < 100 && ((type != 10 && type != 20) && hasStarted(d[i]))){
        if(bets[currentDay - 1][i].length > 0) document.getElementById(bets[currentDay - 1][i][type == 6.5 ||type == 7.5 ? 1:0]+groupId).checked = true
        document.getElementById(bet+groupId).checked = false
        return;
    }

    if(bet == "customValue"){
        bet = document.getElementById('Search'+ id).value
    }

    if(type == 4 || type == 20 && dailyType == 3 || type == 10 && dailyType == 4){
        if(bets[currentDay - 1][i].includes(bet)){
            bets[currentDay - 1][i] = bets[currentDay - 1][i].filter(function(item) {
                return item !== bet;
            });
        }else{
            if(bets[currentDay - 1][i].includes("kein Team") || bets[currentDay - 1][i].includes("kein Tor")) {
                document.getElementById(bets[currentDay - 1][i][0]+groupId).checked = false
                bets[currentDay - 1][i] = []
            }
            if(bet == "kein Team" || bet == "kein Tor"){
                for(let j = 0; j < bets[currentDay - 1][i].length; j++){
                    document.getElementById(bets[currentDay - 1][i][j]+groupId).checked = false
                }
                bets[currentDay - 1][i] = [bet]
            }else{
                bets[currentDay - 1][i].push(bet);
            }
        }
    }else if(type == 7){
        bets[currentDay - 1][i][0] = bet;
    }else if(type == 7.5){
        bets[currentDay - 1][i][1] = bet;  
    }else if(type == 6){
        bets[currentDay - 1][i][0] = bet;
    }else if(type == 6.5){
        bets[currentDay - 1][i][1] = bet;
    }else if(currentDay == 0){
        if(i == 2){
            if(saisonBets[i].includes(bet)){
                saisonBets[i] = saisonBets[i].filter(function(item) {
                    return item !== bet;
                });
            }else{
                if(saisonBets[i].length == 3){
                    document.getElementById(saisonBets[i][lastSelectedSaison]+groupId).checked = false
                    saisonBets[i][lastSelectedSaison] = bet
                    lastSelectedSaison = (lastSelectedSaison + 1) % 3
                }else{
                    saisonBets[i].push(bet);
                }
            }
        }else{
            saisonBets[i][0] = bet
        }
        saveSaison()
    }else{
        bets[currentDay - 1][i][0] = bet;
    }
    let thisBetDisplay = document.getElementById("betContainer" + id.replace("2.Hz","").replace("team2",""))
    thisBetDisplay.innerHTML = '';
    thisBetDisplay.innerHTML = displayResults(i,null,types[i],[team1,team2])
    save();
}

function RND(s) {
    // Initialisierung der Variablen
    this.seed = s;
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

function getGoals(data){
    let goals = [0,0]
    if(!data.hasOwnProperty("goals")) return;
    for(let goal of data.goals){
        if(goal.scoreTeam1 > goals[0]) goals[0] = goal.scoreTeam1;
        if(goal.scoreTeam2 > goals[1]) goals[1] = goal.scoreTeam2;
    }
    return goals
    
}

function getGameResult(data){
    const days = ["So.","Mo.","Di.","Mi.","Do.","Fr.","Sa."]
    const date = new Date(data.matchDateTime);
    let goals = getGoals(data);
    let now = new Date();
    if(now < date) return `<p class="date">${days[date.getDay()]}</p>
    <p class="date">${('0' + date.getHours()).slice(-2) + ":" + ('0' + date.getMinutes()).slice(-2)}</p>`;
    return `<p class="result">${goals[0]}:${goals[1]}</p>`;
}

function hasStarted(data){
    const date = new Date(data.matchDateTime);
    let now = new Date();
    if(now < date) return false;

    return true;
}

function isOver(data){
    return data.matchIsFinished;
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

function changeColorBet(data,type,hasStarted,i,bet){
    if(!hasStarted) return "white"
    let result = getResult(data,type)
    
    for(let j = 0; j < result.length; j++){
        let fixResult = getFix((type < 10 ? data.matchID: (type < 100 ? "daily" + data[0].group.groupOrderID: "saison" + (type-100))),j);
        if(fixResult != null) result[j] = fixResult.fix_data
    }
    
    let fixBet = getFix((type < 10 ? data.matchID: (type < 100 ? "daily" + data[0].group.groupOrderID: "saison" + (type-100))),i,username)
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
                        goals = getGoals(game);
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

function getFirstGoal(data){
    let firstGoal = null;
    if(!data.hasOwnProperty("goals")) return;
    for(let goal of data.goals){
        if(!firstGoal) firstGoal = goal;
        if(goal.goalID < firstGoal.goalID) firstGoal = goal;
    }
    return firstGoal;
}

function getFix(game,i,user=""){
    for(n of fixes){
        if(n.game_id.slice(0,-1) == game.toString() && n.game_id.slice(-1) == i.toString() && n.user == user){
            return n;
        }
    }
    return null
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

function isHalbzeit(data){
    const time = new Date(data.matchDateTime);
    const now = new Date();
    const diff = Math.floor((now - time) / (1000 * 60));
    return diff > 55;
}

function save(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "php/saveData.php?data=" + encodeURIComponent(JSON.stringify(bets)), true);
    xhr.onload = function() {
        if (xhr.status == 200) {
            // Antwort von der PHP-Funktion
        }
    };
    xhr.send();
}

function saveSaison(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "php/saveSaison.php?data=" + encodeURIComponent(JSON.stringify(saisonBets)), true);
    xhr.onload = function() {
        if (xhr.status == 200) {
            // Antwort von der PHP-Funktion
        }
    };
    xhr.send();
}

async function load(){
    let userData;
    try {
        userData = await fetch('php/loginData.php')
            .then(function (response) {
            return response.json();
        });
    } catch (error) {
        window.location.href = 'anmelden';
        return;
    }

    const teamData = await fetch('php/teamData.php')
    .then(function (response) {
        return response.json();
    });
    fixes = await fetch('php/fixes.php')
    .then(function (response) {
        return response.json();
    });

    for(let n of teamData){
        players[n.team_name] = JSON.parse(n.team_players)
    }

    username = userData.username
    
    bets = JSON.parse(userData.user_data);
    saisonBets = JSON.parse(userData.saison_bets);
    localStorage.setItem("userData",JSON.stringify({
        "username": username,
        "password": userData.user_password,
        "autoLogin": true,
        "forceLogin": false,
    }));
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
