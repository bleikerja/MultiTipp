let allTeams = [];

let lastSelectedSaison = 0
let editingName = false;

let scrolling = false;

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
        }else if(champiosLeagueKnockout.some(e => e.days.includes(i))){
            let thisDay = champiosLeagueKnockout.find(e => e.days.includes(i));
            daySelect.insertAdjacentHTML('beforeend', `<option value="${35+championsLeagueGamedays.length+champiosLeagueKnockout.indexOf(thisDay)}">Champions League ${thisDay.name}</option>`);
            j++;
        }
    }
    liveDay = await getLiveday();
    liveDayData = await getData()
    liveDayChampion = await getLiveday(CL);

    if((championsLeagueGamedays.includes(liveDay) || champiosLeagueKnockout.some(e => e.days.includes(liveDay))) && isOver(liveDayData[liveDayData.length - 1]) 
        || (championsLeagueGamedays.includes(liveDay - 1) || champiosLeagueKnockout.some(e => e.days.includes(liveDay))) && !hasStarted(liveDayData[liveDayData.length - 1])){
        let today = new Date();
        if (today.getDay() >= 2 && today.getDay() <= 3){
            // for(let i of championsLeagueGamedays){
            //     if(i <= liveDay) liveDayChampion = championsLeagueGamedays.indexOf(i)
            // }
            liveDayIsChampion = true
            currentChampionsDay = liveDayChampion;
            championsDayData = await getData(currentChampionsDay, CL);
        }else{
            liveDayIsChampion = false
        }
    }

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let day = isNaN(parseInt(urlParams.get('day'))) ? urlParams.get('day'): parseInt(urlParams.get('day'))
    
    await showSpieltag(day != null ? day: (!liveDayIsChampion ? liveDay: liveDayChampion+34));
    scrollSetup();    
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

    var newURL = updateURLParameter(window.location.href, 'locId', 'newLoc');
    newURL = updateURLParameter(newURL, 'resId', 'newResId');

    window.history.replaceState('', '', updateURLParameter(window.location.href, "day", n));
    document.getElementById("link").href = "übersicht?day=" + n

    list.innerHTML = "";
    document.getElementById("bottomRow").innerHTML = "";
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
        }
    }

    allTeams = await fetch(new URL(`https://api.openligadb.de/getavailableteams/bl1/${liveSeason}`)).then(response => response.json());

    if(n == 0){
        const dataStartDay = await getData(firstDayNum);
        let saisonHasStarted = liveDay > firstDayNum || (liveDay === firstDayNum && hasStarted(dataStartDay[0]))
        if(championsDayData.length == 0) {
            championsDayData = await getData(firstDayClNum, CL);
        }
        let championHasStarted = hasStarted(championsDayData[0])
        wholeTable = await getTable()

        wholeTableChampion = await getTable(CL)
        
        lastDay = await getData(34)
        
        goalgetters = await getGoalgetters()

        currentChampionsDay = await getLiveday(CL);

        showSaison(null,1,saisonHasStarted)
        showSaison(null,2,saisonHasStarted)
        showSaison(null,3,saisonHasStarted)
        // showSaison(data,4,championHasStarted)
        // showSaison(data,5,championHasStarted)
    }else if(n > 34){
        currentChampionsDay = n - 34
        let dataChamp = championsDayData.length != 0 ? championsDayData: await getData(currentChampionsDay,CL);

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

        d = dataChamp;

        if(!bets[n-1]) bets[n-1] = [[],[],[],[],[],[]]
        for(let i = 0; i < dataChamp.length; i++){
            showData(dataChamp[i],i,true);
        }
        showDaily(dataChamp,dataChamp.length,true);
    }else {
        let data = n == liveDay ? liveDayData: await getData(n);
        d = data;

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
    
    for(let element of document.querySelectorAll('.toggleButton.active')) {
        checkButton(element, true);
    }
}

function showData(data,num,champions=false){
    // document.getElementById("Saison-warning").hidden = true
    let displayTitle = titles[types[num]-1]
    if(data.leagueShortcut == CL && types[num] == 4){
        let germanTeam = germanTeams.includes(getShortName(data.team1)) ? getShortName(data.team1): getShortName(data.team2)
        displayTitle = displayTitle.replace("Spieler",germanTeam+" Spieler")
    }
    const newHtml = `<li>
        <div id="bet${data.matchID}" class="game" role="button">
            <div id="bet${data.matchID}" class="resultContainer">
                <div class="team1"> 
                    <div class="oneline text" id="name">${getShortName(data.team1)}</div>
                    <div class="oneline smallImg"><img src="${getTeamIcon(data.team1)}" alt="img" id="image"></div>
                    <div class="oneline text textBelow" id="name">${getShortName(data.team1)}</div>
                </div>
                <div class="resultDiv" id="games">
                    ${getGameResult(data)}
                </div>
                <div class="team2">
                    <div class="oneline smallImg"><img src="${getTeamIcon(data.team2)}" alt="img" id="image"></div>
                    <div class="oneline text" id="name">${getShortName(data.team2)}</div>
                </div>
            </div>
            <div class="selectedBetDisplay">
                <div id="betContainer${data.matchID}" class="betContainer">
                    ${getBetContent(data,types[num],num,champions)}
                </div>
            </div>
        </div>
    </li>`;

    let navLogo = `
        <div id="logoButton${data.matchID}" class="logoButton ${hasStarted(data) ? "started" : ""} ${bets[currentDay-1][num] == null || bets[currentDay-1][num].length == 0 || bets[currentDay-1][num] == "" ? "" : "bet"}" 
        onclick="document.getElementById('bet${data.matchID}').scrollIntoView({ behavior: 'smooth', inline: 'start' });">
            <img class="left" src=${getTeamIcon(data.team1)} alt="${getShortName(data.team1)}">
            <img class="right" src=${getTeamIcon(data.team2)} alt="${getShortName(data.team2)}">
        </div>
    `;

    document.getElementById("bottomRow").insertAdjacentHTML('beforeend', navLogo);
    list.insertAdjacentHTML('beforeend', newHtml);
}

function showDaily(data,num,champions){
    const newHtml = `<li>
        <div id="betDaily" class="game" role="button">
            <div class="resultContainer">
                <h1>Spieltag</h1>
            </div>
            <div class="selectedBetDisplay">
                <div id="betContainerDaily" class="betContainer">
                    ${getBetContent(data,champions ? (data[0].group.groupOrderID <= 8 ? 20: 25): 10,num,champions)}
                </div>
            </div>
        </div>
    </li>`;

    let navLogo = `
        <div id="logoButtonDaily" class="logoButton ${hasStarted(data[0]) ? "started" : ""} ${bets[currentDay-1][num] == null || bets[currentDay-1][num].length == 0 || bets[currentDay-1][num] == "" ? "" : "bet"}" 
        onclick="document.getElementById('betDaily').scrollIntoView({ behavior: 'smooth' });">
            <img src=logo.png alt="Daily">
        </div>
    `;

    document.getElementById("bottomRow").insertAdjacentHTML('beforeend', navLogo);
    list.insertAdjacentHTML('beforeend', newHtml);
}

function showSaison(data,num,saisonHasStarted){
    // document.getElementById("Saison-warning").hidden = saisonHasStarted
    let newHtml = `<li>
        <div id="betSaison${num}" class="game" role="button">
            <div class="resultContainer">
                <h1>${num < 4 ? ("Bundesliga #"+ (num)):("Champions League #"+ (num-3))}</h1>
            </div>
            <div class="selectedBetDisplay">
                <div id="betContainerSaison${num}" class="betContainer">
                    ${getBetContent(data,num+100,num+100,false,saisonHasStarted)}
                </div>
            </div>
        </div>
    </li>`;

    list.insertAdjacentHTML('beforeend', newHtml);
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
        let displayBet = bet;
        if(t >= 10) displayBet = getDailyDisplay(data,bet,t);
        display += getBetDisplay(displayBet,changeColorBet(data,t,data == null ? false: hasStarted(t < 10 ? data: data[0]),i,bet));
    }
    return display;
}

function getBetDisplay(display,color="white"){
    if(display == null || display == undefined) return "";
    return `
    <p class="betDisplay" style="background-color: ${color};">${display}</p>
`
}

function getBetContent(data,type,num,champions=false,saisonHasStarted=null){
    let elements = "";
    let teams = [];
    let allPlayers = []
    let title = type < 10 ? getTitle(titles[type-1]): (type < 100 ? (getTitle(type == 10 ? dailyTitles[dailyType-1]: (type == 20 ? championsLeagueTitles[dailyType-1]: championsLeagueKnockoutTitles[dailyType-1] ))): getTitle(saisonTitles[type-101]));
    switch (type) {
        case 1:
            return title +  getButtonToggle(data,getShortName(data.team1),data.matchID,num,type) + getButtonToggle(data,"Unentschieden",data.matchID,num,type) + getButtonToggle(data,getShortName(data.team2),data.matchID,num,type);
        case 2:
            return title +  getButtonToggle(data,getShortName(data.team1),data.matchID,num,type) + getButtonToggle(data,getShortName(data.team2),data.matchID,num,type) + getButtonToggle(data,"kein Tor",data.matchID,num,type);
        case 3:
            allPlayers = sortPlayers(getPlayers(data.team1.teamName).concat(getPlayers(data.team2.teamName)))
            for(let player of allPlayers){
                elements += getButtonToggle(data,player,data.matchID,num,type) + "\n"
            }
            elements += getAddButton(data,data.matchID,num,type)
            return title + getSearch([getPlayers(data.team1.teamName),getPlayers(data.team2.teamName)],data.matchID,[data.team1,data.team2]) + getButtonToggle(data,"kein Tor",data.matchID,num,type) + `<div id="${data.matchID}" class="betButtons noSelect">` + elements + "</div>"
        case 4:
            allPlayers = sortPlayers(getPlayers(data.team1.teamName).concat(getPlayers(data.team2.teamName)))
            for(let player of allPlayers){
                elements += getButtonToggle(data,player,data.matchID,num,type,false) + "\n"
            }
            elements += getAddButton(data,data.matchID,num,type)
            teams = []
            if(!champions || germanTeams.includes(getShortName(data.team1))) teams.push(data.team1)
            if(!champions || germanTeams.includes(getShortName(data.team2))) teams.push(data.team2)
            return title + getSearch([getPlayers(data.team1.teamName),getPlayers(data.team2.teamName)],data.matchID,teams) + getButtonToggle(data,"kein Tor",data.matchID,num,type,false) + `<div id="${data.matchID}" class="betButtons noSelect">` + elements + "</div>"
        case 5:
            elements = title
            for(let i = 0; i < 6;i+=2){
                elements += getButtonToggle(data,i + " - " + (i+1),data.matchID,num,type) + "\n"
            }
            elements += getButtonToggle(data,6 + "+",data.matchID,num,type) + "\n"
            return elements
        case 6:
            elements = title;
            elements += '<div class="betButtons">';
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
            elements += '</div>';
            return elements
        case 7:
            elements = title;
            elements += '<div class="betButtons">';
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
            elements += '</div>';
            return elements
        case 8:
            elements = title;
            elements += '<div class="betButtons">';
            for(let i = 1; i < 4;i++){
                elements += getButtonToggle(data,getShortName(data.team1) + " & " + i,data.matchID,num,type) + "\n"
            }
            elements += getButtonToggle(data,getShortName(data.team1) + " & " + 4 + "+",data.matchID,num,type) + "\n"
            for(let i = 1; i < 4;i++){
                elements += getButtonToggle(data,getShortName(data.team2) + " & " + i,data.matchID,num,type) + "\n"
            }
            elements += getButtonToggle(data,getShortName(data.team2) + " & " + 4 + "+",data.matchID,num,type) + "\n"
            elements += getButtonToggle(data,"Unentschieden",data.matchID,num,type)
            elements += '</div>';
            return elements
        case 9:
            return title + getButtonToggle(data,"Ja",data.matchID,num,type) + getButtonToggle(data,"Nein",data.matchID,num,type);
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
                    return title + getSearch([teams],"Daily") + `<div id="Daily" class="betButtons">` + elements + "</div>"
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
                    return title + getSearch(teamList,"Daily",allTeams) + `<div id="Daily" class="betButtons">` + elements + "</div>"
                case 3:
                    elements = title;
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
                    return title + getSearch([teams],"Daily") + getButtonToggle(data[0],"kein Team","Daily",num,type,false) + `<div id="Daily" class="betButtons noSelect">` + elements + "</div>"
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
                    return title + getSearch([teams],"Daily") + `<div id="Daily" class="betButtons">` + elements + "</div>"
            }
            break;
        case 20:
            switch(dailyType){
                case 1:
                    elements = title;
                    for(let game of data){
                        elements += getButtonToggle(data[0],getShortName(game.team1) + " : " + getShortName(game.team2),"Daily",num,type,true,hasStarted(data[0]) && !hasStarted(game) ? bets[currentDay-1][data.length].length != 0: null)
                    }
                    return elements
                case 2:
                    elements = title;
                    for(let team of germanTeams){
                        let game = data.find(game => getShortName(game.team1) == team || getShortName(game.team2) == team)
                        elements += getButtonToggle(data[0],team,"Daily",num,type,true,hasStarted(data[0]) && !hasStarted(game) ? bets[currentDay-1][data.length].length != 0: null)
                    }
                    return elements
                case 3:
                    elements = title;
                    elements += getButtonToggle(data[data.length - 1],"kein Team","Daily",num,type,false, hasStarted(data[0]) && !hasStarted(data[data.length - 1]) ? bets[currentDay-1][data.length].length != 0: null)
                    for(let team of germanTeams){
                        let game = data.find(game => getShortName(game.team1) == team || getShortName(game.team2) == team)
                        elements += getButtonToggle(data[0],team,"Daily",num,type,false,hasStarted(data[0]) && !hasStarted(game) ? bets[currentDay-1][data.length].length != 0: null)
                    }
                    return elements
            }
            break;
        case 25:
            switch(dailyType){
                case 1:
                    elements = title;
                    for(let i = 0; i < data.length/2; i++){
                        let game = data[i]
                        let germanIndex = germanTeams.includes(getShortName(game.team1)) ? 0: 1
                        let germanTeam = germanIndex == 0 ? game.team1: game.team2
                        let otherTeam = germanIndex == 0 ? game.team2: game.team1
                        elements += getButtonToggle(data[0],getShortName(germanTeam) + " : " + getShortName(otherTeam),"Daily",num,type,true,hasStarted(data[0]) && !hasStarted(game) ? bets[currentDay-1][data.length].length != 0: null)
                    }
                    return elements
                case 2:
                    elements = title;
                    for(let i = 0; i < data.length/2; i++){
                        let game = data[i]
                        if(germanTeams.includes(getShortName(game.team1))) elements += getButtonToggle(data[0],getShortName(game.team1),"Daily",num,type,true,hasStarted(data[0]) && !hasStarted(game) ? bets[currentDay-1][data.length].length != 0: null)
                        if(germanTeams.includes(getShortName(game.team2))) elements += getButtonToggle(data[0],getShortName(game.team2),"Daily",num,type,true,hasStarted(data[0]) && !hasStarted(game) ? bets[currentDay-1][data.length].length != 0: null)
                    }
                    return elements
                case 3:
                    elements = title;
                    elements += getButtonToggle(data[0],"kein Team","Daily",num,type,false)
                    for(let i = 0; i < data.length/2; i++){
                        let game = data[i]
                        if(germanTeams.includes(getShortName(game.team1))) elements += getButtonToggle(data[0],getShortName(game.team1),"Daily",num,type,false,hasStarted(data[0]) && !hasStarted(game) ? bets[currentDay-1][data.length].length != 0: null)
                            if(germanTeams.includes(getShortName(game.team2))) elements += getButtonToggle(data[0],getShortName(game.team2),"Daily",num,type,false,hasStarted(data[0]) && !hasStarted(game) ? bets[currentDay-1][data.length].length != 0: null)
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
                elements += getButtonToggle(null,team,"Saison1",0,type,true,saisonHasStarted)
            }
            return title + getSearch([teams],"Saison1") + `<div id="Saison1" class="betButtons">` + elements + "</div>"
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
                elements += getButtonToggle(null,player,"Saison2",1,type,true,saisonHasStarted)
            }
            elements += getAddButton(null,"Saison2",1,type,saisonHasStarted)
            return title + getSearch(teamList,"Saison2",allTeams) + `<div id="Saison2" class="betButtons">` + elements + "</div>"
        case 103:
            elements = "";
            teams = []
            for(let team of allTeams){
                teams.push(getShortName(team))
            }
            teams.sort()
            for(let team of teams){
                elements += getButtonToggle(null,team,"Saison3",2,type,false,saisonHasStarted)
            }
            return title + getSearch([teams],"Saison3") + `<div id="Saison3" class="betButtons">` + elements + "</div>"
        case 104: case 105:
            elements = "";
            teams = []
            for(let team of germanTeams){
                teams.push(team)
            }
            teams.sort()
            for(let team of teams){
                elements += getButtonToggle(null,team,"Saison"+(type-100),type-101,type,true,saisonHasStarted)
            }
            return title + `<div id="Saison${type-100}" class="betButtons">` + elements + "</div>"
        }
}

function getAddButton(data,group,num,type,thisHasStarted=null){
    return `<button id="addNewButtom${group}" class="toggleButton add" name="${group}" id="addNew${group}" onClick="toggleButton(this);saveBet('customValue',${num},${type},'${group == "Daily" || typeof group =="string" ? group: data.matchID}',this.name)" style="display: none;" ${(thisHasStarted == null ? !hasStarted(data): thisHasStarted) ? "disabled":""}>
                hinzufügen
            </button>`
}

function getButtonToggle(data,name,group,num,type,radio=true,thisHasStarted=null){
    let checked = false;
    if(currentDay != 0 && bets[currentDay-1].length <= num) bets[currentDay-1][num] = []
    if(currentDay == 0 && saisonBets.length <= num) saisonBets[num] = [];
    let currentBet = currentDay != 0 ? bets[currentDay-1][num]: saisonBets[num];
    if(type == 7 && currentBet[0] == name){
        checked = true;
    }else if(type == 7.5 && currentBet[1] == name){
        checked = true;
    }else if(type == 6 && currentBet[0] == name){
        checked = true;
    }else if(type == 6.5 && currentBet[1] == name){
        checked = true;
    }else if((type <= 5 || type >= 8) && currentBet.includes(name)){
        checked = true;
    }

    return `<button id="${name + "" + group}" class="toggleButton${checked ? " active" : ""}${radio ? " radio" : ""}" name="${group}" id="${name + "" + group}" onClick="toggleButton(this);saveBet('${name}',${num},${type},'${group == "Daily" || typeof group =="string" ? group: data.matchID}',this.name)" ${(thisHasStarted == null ? hasStarted(data): thisHasStarted) ? "disabled":""}>
                ${name}
            </button>`
}

function getSearch(teams,group,teamnames=null){
    let playersList = [];
    for(let team of teams){
        for(let player of team){
            playersList.push("\'"+player+"\'");
        }
    }

    let search = `<div id='selectedBets${group}' class='selectedBetsContainer'></div>`;
    search += `<input id="Search${group}" type="text" class="form-control" placeholder="" autocomplete="off" onInput="showPlayers('${group}',[${playersList}],value)">`
    if(teamnames != null){
        let teamnamesNames = []
        for(let n of teamnames){
            teamnamesNames.push("\'"+n.teamName+"\'");
        }
        search += `<div class="filterContainer">
        <select id="teamFilter${group}" onChange="filterResults('${group}')" class="form-select">
        <option value="all" selected>alle Teams</option>`            
        
        teamnames.sort((a, b) => getShortName(a).localeCompare(getShortName(b)));
        for(let team of teamnames){
            search += `<option value="${team.teamName}">${getShortName(team)}</option>`
        }
        search += "</select>"

        search += `<select id="positionFilter${group}" onChange="filterResults('${group}')" class="form-select">
        <option value="all" selected>alle Positionen</option>`            
        
        for(let pos of Object.keys(players[teamnames[0].teamName])){
            search += `<option>${pos}</option>`
        }
        search += "</select></div>"
    }
    
    return search;
}

function filterResults(id) {
    let element = document.getElementById(id);
    for(let e of element.children){
        e.hidden = true;
    }

    let currentFilterTeam = document.getElementById("teamFilter" + id).value;
    let currentFilterPosition = document.getElementById("positionFilter" + id).value;

    let playernames = getPlayers(currentFilterTeam,currentFilterPosition);

    for(let player of playernames){
        let element = document.getElementById(player + id);
        if(element) element.hidden = false;
    }
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
            document.getElementById(player + id).style.display = "";
            found = true
        }
    }
    let addButton = document.getElementById("addNewButtom"+id)
    if(!found){
        addButton.innerText = '\"'+document.getElementById('Search'+ id).value+"\""
        addButton.style.display = ""
    }else{
        addButton.style.display = "none"
    }
}

function getTitle(title,i=true){
    return `<p class="gameTitle" style="font-size: ${i ? 17: 15}px;">${title}</p>`
}

function saveBet(bet,i,type,id,groupId){
    if(type < 100 && ((type < 10) && hasStarted(d[i]))){
        if(bets[currentDay - 1][i].length > 0) checkButton(document.getElementById(bets[currentDay - 1][i][type == 6.5 ||type == 7.5 ? 1:0]+groupId), true)
        checkButton(document.getElementById(bet+groupId), false)
        return;
    }

    if(bet == "customValue"){
        bet = document.getElementById('Search'+ id).value
    }

    if(type == 4 || (type == 20 || type == 25) && dailyType == 3 || type == 10 && dailyType == 4){
        if(bets[currentDay - 1][i].includes(bet)){
            bets[currentDay - 1][i] = bets[currentDay - 1][i].filter(function(item) {
                return item !== bet;
            });
        }else{
            if(bets[currentDay - 1][i].includes("kein Team") || bets[currentDay - 1][i].includes("kein Tor")) {
                checkButton(document.getElementById(bets[currentDay - 1][i][0]+groupId), false)
                bets[currentDay - 1][i] = []
            }
            if(bet == "kein Team" || bet == "kein Tor"){
                for(let j = 0; j < bets[currentDay - 1][i].length; j++){
                    checkButton(document.getElementById(bets[currentDay - 1][i][j]+groupId), false)
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
                    checkButton(document.getElementById(saisonBets[i][lastSelectedSaison]+groupId), false)
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
    let matchId = d[i] != null ? d[i].matchID: groupId;
    if(type < 100){
        if (bets[currentDay-1][i] == null || bets[currentDay-1][i].length == 0 || bets[currentDay-1][i] == ""){
            document.getElementById("logoButton"+matchId).classList.remove("bet");
        }else{
            document.getElementById("logoButton"+matchId).classList.add("bet");
        }
    }
    save(currentDay - 1,i < d.length ? d[i].matchDateTime: null);
}

function toggleButton(button) {
    const buttons = document.querySelectorAll(`.toggleButton[name="${button.name}"]`);
    if(button.classList.contains("radio")){
        buttons.forEach(btn => {
            checkButton(btn, false);
        });
        checkButton(button, true);
    }else{
        checkButton(button, !button.classList.contains("active"));
    }
}

function checkButton(button, check = true) {
    if (check) {
        button.classList.add("active");
    } else {
        button.classList.remove("active");
    }

    let selectedBetsContainer = document.getElementById('selectedBets'+ button.name);
    if(selectedBetsContainer){
        if(button.parentElement != selectedBetsContainer){
            if (check) {
                let clonedButton = button.cloneNode(true);
                clonedButton.id = button.id + "selected";
                clonedButton.onclick = function() {
                    button.click();
                }
                selectedBetsContainer.appendChild(clonedButton);
            } else {
                if (selectedBetsContainer.contains(document.getElementById(button.id + "selected"))) {
                    selectedBetsContainer.removeChild(document.getElementById(button.id + "selected"));
                }
            }
        }
    }
}


function save(index,betTime){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "php/saveData.php?data=" + encodeURIComponent(JSON.stringify(bets[index]))
        + "&index=" + encodeURIComponent(index), true);
    xhr.send();

    var xhrBetTime = new XMLHttpRequest();
    xhrBetTime.open("GET", "php/updateBetDate.php?data=" + encodeURIComponent(betTime), true);
    xhrBetTime.send();
}

function saveSaison(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "php/saveSaison.php?data=" + encodeURIComponent(JSON.stringify(saisonBets)), true);
    xhr.send();
}

async function load(){
    try {
        let userData = await fetch('php/loginData.php')
            .then(function (response) {
                return response.json();
            });

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
    } catch (error) {
        if(localStorage.getItem("userData")){
            let temp = JSON.parse(localStorage.getItem("userData"));
            temp.forceLogin = true;
            localStorage.setItem("userData",JSON.stringify(temp));  
        }
        window.location.href = 'anmelden';
        return;
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
