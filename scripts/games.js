let is_admin = false;

let groupForm = document.getElementById("groupAdd");
let groupInput = document.getElementById("groupInput");
let removeForm = document.getElementById("groupRemove");
let removeInput = document.getElementById("groupDelete");
let gameCarousel = document.getElementById("gameCarousel");

let sortingByTotal = true;
let editingName = false;
let selectedCarouselItem = 0;
let carouselWidth = 0;

start();
getPermission();

setInterval(() => {
    const carousel = document.getElementById('carousel');
    if(carouselWidth == 0) carouselWidth = carousel.offsetWidth
    if (carousel.offsetWidth != carouselWidth) {
        carousel.style.width = carouselWidth+"px";
    }
}, 100);

async function start(){
    gameCarousel.innerHTML = "";
    const currentDaySearch = await fetch(new URL(`https://api.openligadb.de/getcurrentgroup/bl1`));
    const currentDayData = await currentDaySearch.json();
    liveDay = currentDayData.groupOrderID;
    const responseLiveday = await fetch(new URL(`https://api.openligadb.de/getmatchdata/bl1/${liveSeason}/${liveDay}`));
    liveDayData = await responseLiveday.json();
    // liveDayChampion = (await fetch(new URL(`https://api.openligadb.de/getcurrentgroup/cl24de`)).then(response => response.json())).groupOrderID;
    
    if((championsLeagueGamedays.includes(liveDay) || champiosLeagueKnockout.some(e => e.days.includes(liveDay))) && isOver(liveDayData[liveDayData.length - 1]) 
        || (championsLeagueGamedays.includes(liveDay - 1) || champiosLeagueKnockout.some(e => e.days.includes(liveDay))) && !hasStarted(liveDayData[liveDayData.length - 1])){
        let today = new Date();
        if (today.getDay() >= 2 && today.getDay() <= 3){
            /*for(let i of championsLeagueGamedays){
                if(i <= liveDay) liveDayChampion = championsLeagueGamedays.indexOf(i)
            }*/
            liveDayIsChampion = true
            // const currentChampionsDayResponse = await fetch(new URL(`https://api.openligadb.de/getmatchdata/cl24de/${liveSeason}/${championsDay}`));
            // championsDayData = await currentChampionsDayResponse.json();
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
        }else if(champiosLeagueKnockout.some(e => e.days.includes(i))){
            let thisDay = champiosLeagueKnockout.find(e => e.days.includes(i));
            daySelect.insertAdjacentHTML('beforeend', `<option value="${35+championsLeagueGamedays.length+champiosLeagueKnockout.indexOf(thisDay)}">Champions League ${thisDay.name}</option>`);
            j++;
        }
    }

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let day = isNaN(parseInt(urlParams.get('day'))) ? urlParams.get('day'): parseInt(urlParams.get('day'))
    
    await showSpieltag(day != null ? day: (!liveDayIsChampion ? liveDay: liveDayChampion+34));

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
    let selectedOption = daySelect.options[liveDayIsChampion ? liveDay+daysBefore+2: liveDay+daysBefore];
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

    currentDay = n;
    
    if(n > 34){
        championsDay = n - 34
        // let data = championsDayData.length != 0 ? championsDayData: await fetch(new URL(`https://api.openligadb.de/getmatchdata/cl24de/${liveSeason}/${championsDay}`)).then(response => response.json());
        let rand = new RND(n);
        
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
        
        changePlayerOrder(sortingByTotal);
        selectCarouselItem(getLastStarted(data))
        document.getElementsByClassName("carousel-control-next")[0].hidden = false;
        document.getElementsByClassName("carousel-control-prev")[0].hidden = false;
        return
    }
    
    const data = n == liveDay ? liveDayData: await fetch(new URL(`https://api.openligadb.de/getmatchdata/bl1/${liveSeason}/${n}`)).then(response => response.json());
    d = [...data]

    if(n == 0 || n == 34 && isOver(data)){
        const response3 = await fetch(new URL(`https://api.openligadb.de/getmatchdata/bl1/${liveSeason}/4`));
        const data3 = await response3.json();
        firstDay = data3

        const tableResponse = await fetch(new URL(`https://api.openligadb.de/getbltable/bl1/${liveSeason}`));
        const tableData = await tableResponse.json();
        wholeTable = tableData
        
        //const tableResponseChampion = await fetch(new URL(`https://api.openligadb.de/getbltable/cl24de/${liveSeason}`));
        //const tableDataChampion = await tableResponseChampion.json();
        const tableDataChampion = [{name:"Leverkusen", place:6},{name:"Dortmund", place:10},{name:"Bayern", place:12}, {name:"Stuttgart", place:26}, {name:"Leipzig", place:32}]
        wholeTableChampion = tableDataChampion
        
        const lastDayResponse = await fetch(new URL(`https://api.openligadb.de/getmatchdata/bl1/${liveSeason}/34`));
        lastDay = await lastDayResponse.json();
        
        const goalgetterResponse = await fetch(new URL(`https://api.openligadb.de/getgoalgetters/bl1/${liveSeason}`));
        const goalgetterData = await goalgetterResponse.json();
        goalgetters = goalgetterData

        // const championsDayResponse = await fetch(new URL(`https://api.openligadb.de/getcurrentgroup/cl24de`));
        // championsDay = await championsDayResponse.json();

        // if(championsDayData.length == 0) championsDayData = await fetch(new URL(`https://api.openligadb.de/getmatchdata/cl24de/${liveSeason}/${championsDay.groupOrderID}`)).then(response => response.json());
        
        if (n == 0) {
            updateDisplay()
            loadSaisonPoints();
            changePlayerOrder(sortingByTotal);
            document.getElementsByClassName("carousel-control-next")[0].hidden = false;
            document.getElementsByClassName("carousel-control-prev")[0].hidden = false;
            return
        }
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
    
    if(!bets[0]) bets[0] = [];
    if(!bets[0][n-1]) bets[0][n-1] = [[],[],[],[],[],[],[],[],[],[]]
    
    changePlayerOrder(sortingByTotal);
    selectCarouselItem(getLastStarted(data))
    document.getElementsByClassName("carousel-control-next")[0].hidden = false;
    document.getElementsByClassName("carousel-control-prev")[0].hidden = false;
}

function displayPoints(n){
    for(let i = 0; i < playernames.length; i++){
        if(n != 0 && !points[i][n-1]) points[i][n-1] = 0;
        let player = playernames[i];
        let totalPoints = getTotalPoints(i)
        let dayPoints = n != 0 ? points[i][n-1]: saisonPoints[i];
        document.getElementById("totalPoints" + player).innerHTML = totalPoints;
        document.getElementById("dayPoints" + player).innerHTML = dayPoints;
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
            for(let i = 1; i <= data.length; i++){
                showData(data,i,false,false,null,true);
            }
        }else{
            showData(data,0,true);
            for(let i = 1; i <= data.length; i++){
                showData(data,i);
            }
        }
    }else{
        let displays = []
        displays.push(showData(wholeTable,100,true,true))
        displays.push(showData(goalgetters,101,false,true))
        displays.push(showData(wholeTable,102,false,true))
        // displays.push(showData(wholeTableChampion,103,false,true,null,true))
        // displays.push(showData([championsDay],104,false,true,null,true))
        let num = 0
        while(num < displays.length){
            let div =  `<div class="carouselItem carousel-item ${num == 0 ? "active":""}"><div class="d-flex">`
            for(let i = 0; i < getPlayerDisplayCount(); i++){
                div += displays[num]
                num++
                if(num == displays.length) break
            }
            div += `</div></div></div>`;
            gameCarousel.insertAdjacentHTML('beforeend', div);
        }
    }
    
    displayPlayerPoints();
    displayPoints(currentDay)
    selectCarouselItem(selectedCarouselItem)

    if(sortingByTotal){
        for(let i = 0; i < document.getElementsByClassName("sortTotal").length; i++){
            let sortTotal = document.getElementsByClassName("sortTotal")[i];
            sortTotal.classList.add("selected");
        }
        for(let i = 0; i < document.getElementsByClassName("sortDay").length; i++){
            let sortDay = document.getElementsByClassName("sortDay")[i];
            sortDay.classList.remove("selected");
        }
    }else{
        for(let sortTotal of document.getElementsByClassName("sortTotal")){
            sortTotal.classList.remove("selected");
        }
        for(let sortDay of document.getElementsByClassName("sortDay")){
            sortDay.classList.add("selected");
        }
    }
}

function showData(data,num,first=false,returnResult=false,nextData = null,champions=false){
    if(num % getPlayerDisplayCount() != 0 && !returnResult) return;
    
    if(num > data.length-1 && num < 100 || champions && num == 5) {
        if(returnResult) return showDaily(data,data.length,true,champions)
        showDaily(data,data.length,false,champions)
        return
    }
    let thisData = data[num]

    let newHtml = returnResult ? "": `<div class="carouselItem carousel-item ${first ? "active":""}">
          <div class="d-flex">`
    
    if(num >= 100){
        newHtml += showSaison(data,num)
    }else{
        newHtml += `
        <div class="flex-fill p-2">
            <div class="betContainer2">
                <div class="border rounded-3 border-black resultDisplay">
                    <div id="bet${thisData.matchID}" class="d-flex flex-row mb-2 game border rounded-3 border-black" aria-expanded="false" style="background-color:${changeColor(thisData,types[num],true)}">
                        <div class="border-end rounded-start-3 border-black team1 bg-white"> 
                            <div class="oneline p-2 teamText" id="name">${getShortName(thisData.team1)}</div>
                            <div class="oneline p-2 smallImg"><img src="${getTeamIcon(thisData.team1)}" alt="img" id="image"></div>
                            <br class="newLine" hidden>
                            <div class="oneline p-2 teamText1" id="name" hidden>${getShortName(thisData.team1)}</div>
                        </div>
                        <div class="p-2 gap resultDiv" id="games">
                            ${getGameResult(thisData)}
                        </div>
                        <div class="gap border-start rounded-end-3 border-black team2 bg-white">
                            <div class="oneline p-2 smallImg"><img src="${getTeamIcon(thisData.team2)}" alt="img" id="image"></div>
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
    newHtml += (num + 1) % getPlayerDisplayCount() != 0 && num < 100 ? showData(nextData != null ? nextData: data,num+1,false,true,null,champions):""  
    newHtml += returnResult ? "": `</div></div></div>`;
    

    if(returnResult) {
        return newHtml;
    }
    gameCarousel.insertAdjacentHTML('beforeend', newHtml);
}

function changeColor(data,type,result = false){
    if(type >= 100){
        if(isOver(lastDay[0]) || type == 103 && liveDayChampion > 8 || type == 104) return "#949494"
        let saisonHasStarted = type < 103 ? hasStarted(firstDay[0]): (championsDay > 1 ? true: hasStarted(championsDayData[0]))
        if(saisonHasStarted){
            return "#ffd599";  
        } 
        return "#f5f5f5";
    }
    
    
    if(((type == 10 || type == 20 || type == 25) && !hasStarted(data[0])) || !hasStarted(data)) return "#f5f5f5";
    if((!result && !isFix(data,type) || (result && !isOver(data)))) return "#ffd599";

    return "#949494"
}

function showDaily(data,num,returnResult = true,champions=false){
    let newHtml = returnResult ? "": `<div class="carouselItem carousel-item">
          <div class="d-flex">`

    newHtml += `<div class="flex-fill p-2">
        <div class="betContainer2">
            <div id="dailyContainer" class="border rounded-3 border-black">
                <div id="betDaily" class="d-flex flex-row mb-2 game border rounded-3 border-black bg-white" aria-expanded="false">
                    <h3>Spieltag</h3>
                </div>
                <div class="border rounded-3 border-black" style="min-height:77px;padding:5px;background-color:${changeColor(data,10)}">
                    ${displayResults(data,hasStarted(data[0]),champions ? (data[0].group.groupOrderID <= 8 ? 20: 25): 10)}
                </div>
            </div>
        </div>
        ${displayAllBets(num,data,hasStarted(data[0]),champions ? (data[0].group.groupOrderID <= 8 ? 20: 25): 10)}

    </div>`;
    
    newHtml += returnResult ? "": `</div></div></div>`;
    if(returnResult) return newHtml

    gameCarousel.insertAdjacentHTML('beforeend', newHtml);
}

function showSaison(data,num){
    let saisonHasStarted = num < 103 ? hasStarted(firstDay[0]): (championsDay > 1 ? true: hasStarted(championsDayData[0]))
    const newHtml = `<div class="saison flex-fill p-2">
        <div class="betContainer">
            <div id="SaisonContainer" class="border rounded-3 border-black saisonContainer">
                <div id="betDaily" class="d-flex flex-row mb-2 game border rounded-3 border-black bg-white" aria-expanded="false">
                    <h2>${num < 103 ? ("Bundesliga #"+ (num-99)):("Champions League #"+ (num-102))}</h2>
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

function displayAllBets(num,data,started,t){
    let display = `
    <div class="mobile">
        <div class="sort mobile">
            <div class="sortTotal sortText ${sortingByTotal ? "selected":""}" onclick="changePlayerOrder(true)">Gesamt</div>
            <div class="sortDay sortText ${!sortingByTotal ? "selected":""}" onclick="changePlayerOrder(false)">Spieltag</div>
        </div>
        <div class="arrowLeft sortText" data-bs-target="#carousel" data-bs-slide="prev"><</div>
        <div class="arrowRight sortText" data-bs-target="#carousel" data-bs-slide="next">></div>
    </div>
    `

    let thisPlayerBets = bets[playernames.indexOf(username)][currentDay-1]
    for(let i = 0; i < playernames.length; i++){
        let playerBets = currentDay != 0 ? bets[i]: saisonBets[i];
        
        if(!started && playernames[i] != username 
            || num == 9 && ((thisPlayerBets == null || thisPlayerBets[num].length == 0) && !hasStarted(d[d.length-1]))
            || (t == 20 || t == 25) && ((thisPlayerBets == null || thisPlayerBets[num].length == 0) && !hasStarted(d[(d.length/2)-1]))){
            let extraInfo = ""
            if(playerBets[currentDay-1] != null && playerBets[currentDay-1][num].length != 0){
                extraInfo = getBetDisplay("?")
            }
            display += getBetsDisplay(extraInfo,changeColor(data,t), playernames[i], i);
            continue;
        } 
        display += getBetsDisplay(displayBet(num,data,started,playerBets,t,i),changeColor(data,t),playernames[i], i)
    }
    
    return display;
}

function getBetsDisplay(content, color, playername, i){
    let place = 1;
    let pointsThis = getTotalPoints(i)
    for(let j = 0; j < playernames.length; j++){
        if(j == i) continue;
        if(getTotalPoints(j) > pointsThis) place++;
    }
    return `
    <div class="gap border rounded-3 border-black betsDisplay desktop${playername == username ? " bold":""}" style="padding:5px;background-color:${color}">
        ${content}
    </div>
    <div class="boxM mobile${playername == username ? " bold":""}" style="background-color:${color}">
        <div class="playerM">
            <div class="playernameM">${place}. ${playername}</div>
            <div class="pointsM">
                <div class="pointsTotalM pointsTextM">${pointsThis}</div>
                <div class="pointsDayM pointsTextM">${currentDay != 0 ? points[i][currentDay-1]: saisonPoints[i]}</div>
            </div>
        </div>
        <div class="betsDisplay">${content}</div>
    </div>
    ` 
}

function dayhasStarted(data){
    for(n of data){
        if(hasStarted(n)) return true
    }
    return false
}

function displayResults(data,started,t){
    if(data.length == 0 && t<10) throw new Error("No data provided for displayResults")

    let display = t < 10 ? getTitle(titles[t-1]): (t < 100 ? (getTitle(t == 10 ? dailyTitles[dailyType-1]: (t == 20 ? championsLeagueTitles[dailyType-1]: championsLeagueKnockoutTitles[dailyType-1] ))): getTitle(saisonTitles[t-100]));
    if(data.leagueShortcut == "cl24de" && t == 4){
        let germanTeam = germanTeams.includes(getShortName(data.team1)) ? getShortName(data.team1): getShortName(data.team2)
        display = display.replace("Spieler",germanTeam+" Spieler")
    }
    if(!started) return display;
    let result = getResult(data,t)
    display += '<div class="betResultContainer">'
    if(result.length == 0) result = getFix((t < 10 ? data.matchID: (t < 100 ? "daily" + data[0].group.groupOrderID: "saison" + (t-100))),0);
    result = result != null && result.fix_data ? [result.fix_data]: result == null ? []: result;
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
        let betDisplay = t < 10 ? (fix ? fix.fix_data : result[i]) : getDailyDisplay(data,(fix ? fix.fix_data : result[i]),t);
        if(fix == null){
            display += getBetDisplay(betDisplay,isFixBet(data,newType,t >= 10 ? result[i]: null) ? "gray": "white","",(t < 10 ? data.matchID: t < 100 ? ("daily" + data[0].group.groupOrderID): "saison" + (t-100).toString()),i);
        }else{
            display += getBetDisplay(betDisplay,isFixBet(data,newType,t >= 10 ? result[i]: null) ? "gray": "white","",fix.game_id,i)
        }
    }
    display += "</div>"
    return display;
}

function displayBet(num,data,hasStarted,currentBets,t,index){
    let display = "";
    if(currentDay != 0 && !currentBets[currentDay-1]) return "";
    let currentBet = currentDay != 0 ? currentBets[currentDay-1]: currentBets
    if(currentBet[num] == null) currentBet[num] = []
    for(let i = 0; i < currentBet[num].length; i++){
        let bet = currentBet[num][i]
        if(t == 7){
            display += "<div class='multiDisplay'>" +  getTitle(`${i+1}. Halbzeit`,false)
        }
        if(t == 6){
            display += "<div class='multiDisplay'>" +  getTitle(getShortName(getTeams(data)[i]),false)
        }

        let fix = getFix((t < 10 ? data.matchID: (t < 100 ? "daily" + data[0].group.groupOrderID: "saison" + (t-100))),i,playernames[index]);
        let betDisplay = t < 10 ? (fix ? fix.fix_data : bet) : getDailyDisplay(data,(fix ? fix.fix_data : bet),t);
        if(fix == null){
            typebet = t
            
            display += getBetDisplay(betDisplay,changeColorBet(data,typebet,hasStarted,i,bet,index),playernames[index],(t < 10 ? data.matchID: (t < 100 ? "daily" + data[0].group.groupOrderID: "saison" + (t-100))),playernames[i]);
        }else{
            display += getBetDisplay(betDisplay,changeColorBet(data,t,hasStarted,i,bet,index),playernames[index],fix.game_id,playernames[i]);
        }
        if(t == 7 || t == 6) display += "</div>"
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
                <div class="sort desktop">
                    <div class="sortTotal sortText ${sortingByTotal ? "selected":""}" onclick="changePlayerOrder(true)">Gesamt</div>
                    <div class="sortDay sortText ${!sortingByTotal ? "selected":""}" onclick="changePlayerOrder(false)">Spieltag</div>
                </div>
            </div>
            `
    for(let i = 0;i < playernames.length;i++){
        let place = 1;
        let pointsThis = getTotalPoints(i)
        for(let j = 0; j < playernames.length; j++){
            if(j == i) continue;
            if(getTotalPoints(j) > pointsThis) place++;
        }
        let player = playernames[i]
        let display = 
        `
        <div class="betContainer">
            <div class="playerPointDiv${player == username ? " bold":""}">
                <p class=playername id="name${player}">${place}. ${player}</p>
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

function changePlayerOrder(total){
    selectedCarouselItem = getSelectedCarouselItem()
    gameCarousel.innerHTML = '';
    sortingByTotal = total;
    if(total){
        let indices = Array.from({length: playernames.length}, (_, i) => i);
        indices.sort((a, b) => comparePoints(playernames[a],playernames[b]));
        playernames.sort((a, b) => comparePoints(a,b));
        bets = indices.map(i => bets[i]);
        points = indices.map(i => points[i]);
        saisonBets = indices.map(i => saisonBets[i]);
        saisonPoints = indices.map(i => saisonPoints[i]);
    }else{
        let indices = Array.from({length: playernames.length}, (_, i) => i);    
        indices.sort((a, b) => comparePointsDay(playernames[a],playernames[b]));
        playernames.sort((a, b) => comparePointsDay(a,b));
        bets = indices.map(i => bets[i]);
        points = indices.map(i => points[i]);
        saisonBets = indices.map(i => saisonBets[i]);
        saisonPoints = indices.map(i => saisonPoints[i]);
    }

    updateDisplay()
}

function comparePoints(a,b){
    const pointsA = getTotalPoints(playernames.indexOf(a));
    const pointsB = getTotalPoints(playernames.indexOf(b));
    return pointsB - pointsA;
}

function comparePointsDay(a,b){
    const pointsA = currentDay != 0 ? points[playernames.indexOf(a)][currentDay-1]: saisonPoints[playernames.indexOf(a)];
    const pointsB = currentDay != 0 ? points[playernames.indexOf(b)][currentDay-1]: saisonPoints[playernames.indexOf(b)];
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
    
    if(display == null || display == "undefined") return ""
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
    xhr.send();
    
    showEdit(false,object)
}

function getTitle(title,i=true){
    return `<p class="gameTitle" style="font-size: ${i ? 16: 15}px;">${title}</p>`
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
    let children = gameCarousel.children
    for(let n of children) n.classList.remove("active");
    if(index > children.length-1){
        children[0].classList.add("active");
    }else{
        children[index].classList.add("active");
    }
}

function getSelectedCarouselItem(){
    let children = gameCarousel.children
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

function getPermission(){
    Notification.requestPermission().then((permission) =>{
        if(permission == "granted"){
            navigator.serviceWorker.ready.then((sw) => {
                sw.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: "BDzyRQ8uYHRuucJ3MoLx-YNlsRFrg8EpU4lajmNQq-ZDdJYLjXpYSiB1giuzK6EDnTiq98fUm03yHzPYRbEaTQA"
                }).then((subscription) => {
                    fetch("php/save-subscription.php", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(subscription),
                    });
                })
            })
        }
    })
}