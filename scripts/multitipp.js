const titles = ["Wer gewinnt?", "Wer schießt das 1. Tor?","Welcher Spieler schießt das 1. Tor?","Welche Spieler schießen ein Tor?","Wie viele Tore fallen?","Wie viele Tore schießt das Team?","Wie viele Tore fallen in der Halbzeit?","Welches Team gewinnt mit welchem Abstand?","Schießen beide Teams ein Tor?"];
const dailyTitles = ["Welches Team schießt die meisten Tore?","Welcher Spieler schießt die meisten Tore?","In welchem Spiel fallen die meisten Tore?","Welche Teams schießen kein Tor?","Welches Team gewinnt mit dem höchsten Abstand?"]
const saisonTitles = ["Wer wird Meister?", "Welcher Spieler schießt die meisten Tore?", "Welche Teams belegen die letzten 3 Plätze?","Welches deutsche Team hat die beste Platzierung?","Welches deutsche Team kommt am weitesten?"]

let championsLeagueTitles = ["In welchem Spiel fallen die meisten Tore?","Welches deutsche Team spielt am besten?","Welche deutschen Teams gewinnen?"]
let championsLeagueKnockoutTitles = ["In welcher Begegnung fallen die meisten Tore?","Welches deutsche Team spielt am besten?","Welche deutschen Teams kommen weiter?"]
const championsLeagueGamedays = [3,5,7,9,11,13,18,19]
const champiosLeagueKnockout = []
// const champiosLeagueKnockout = [{name:"Playoffs",days:[21,22]},{name:"AF",days:[24,25]},{name:"VF",days:[28,29]}]
let germanTeams = ["Dortmund","Bayern","Leverkusen","Frankfurt"]

const players = {}

let types = [];
let typesLeft = [1,2,3,4,5,6,7,8,9]
let dailyType = 1

let liveSeason = 2025;
let d = null
let liveDay = 0;
let currentDay = 0;
let liveDayData = null

let liveDayChampion = 0
let liveDayIsChampion = false
let championsDayData = []
let championsDay = null

let lastDay = null
let firstDay = null;
let goalgetters = null
let wholeTable = null
let wholeTableChampion = null

let bets = [];
let saisonBets = []
let fixes = []

let username = "";

let points = [];
let saisonPoints = [];

let playernames = [];

function moveGameday(num){
    let selectedIndex = daySelect.selectedIndex
    let maxValue = daySelect.options.length
    if(selectedIndex + num > maxValue || selectedIndex + num < 0) return;
    if(selectedIndex + num == maxValue){
        document.getElementById("moveFront").style.display = 'none';
    }else{
        document.getElementById("moveFront").style.display = '';
    }
    if(selectedIndex + num == 0){
        document.getElementById("moveBack").style.display = 'none';
    }else{
        document.getElementById("moveBack").style.display = '';
    }
    showSpieltag(selectedIndex + num,true);
    daySelect.selectedIndex = selectedIndex + num
}

function getTeams(data){
    return [data.team1,data.team2]
}

function isFix(data,type){
    if(!hasStarted(data) || type == 10 && !hasStarted(data[data.length-1])) return false;
    if((type == 10 || type == 20 || type == 25) && isOver(data[data.length-1])) return true
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
    switch (type){
        case 2: case 3:
            return getFirstGoal(data) != null;
        case 4:
            if(bet == null && data.goals.length != 0 && data.leagueShortcut != "ucl") return true
            if(bet == null && data.leagueShortcut == "ucl"){
                let goals = getGoals(data);
                if(goals[0] == 0 && germanTeams.includes(getShortName(data.team1))) return false;
                if(goals[1] == 0 && germanTeams.includes(getShortName(data.team2))) return false;
            }
            if(bet == "kein Tor" && getFirstGoal(data) != null) return true
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
                            if((totalGoals[0] == 0 || totalGoals[1] == 0) && isOver(game)) return true
                        }
                        return false
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
        case 25:
            if(isOver(data[data.length-1])) return true
            switch(dailyType){
                case 1: case 2:
                    if(bet != null){
                        if(getResult(data,25).includes(bet)) return false
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
                        let result = getResult(gameData,25)
                        for(let i = (data.length / 2)-1; i >= 0; i--){
                            if(isOver(data[i])){
                                let teams = getTeams(game)
                                teamNum = germanTeams.includes(getShortName(teams[0])) ? 0: 1;
                                if(!result.includes(getShortName(teams[teamNum]))) return true
                            }
                        }
                        return false
                    }
            }
            break;
        case 100:case 101:case 102:
            return isOver(lastDay[0])
        case 103:
            return liveDayChampion > 8
        case 104:
            return true
    }
    return false;
}

function getGoals(data){
    let goals = [0,0]
    if(!data.hasOwnProperty("goals")) return;
    for(let goal of data.goals){
        if(goal.scoreTeam1 > goals[0]) goals[0] = goal.scoreTeam1;
        if(goal.scoreTeam2 > goals[1]) goals[1] = goal.scoreTeam2;
    }
    return goals;
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

function hasStarted(data){
    if(data.length > 0) data = data[0];
    const date = new Date(data.matchDateTime);
    let now = new Date();
    if(now < date) return false;

    return true;
}

function isOver(data){
    if(data == null) return false;
    if(!data.hasOwnProperty("matchIsFinished")) return data[data.length-1].matchIsFinished;
    return data.matchIsFinished;
}

function getGameResult(data){
    const days = ["So.","Mo.","Di.","Mi.","Do.","Fr.","Sa."]
    const date = new Date(data.matchDateTime);
    let goals = getGoals(data);
    let now = new Date();
    if(now < date) return `<p class="date">${data.leagueShortcut == "ucl" && data.group.groupOrderID > 8 && date.getTime() > now.getTime() + 7*24*60*60*1000 ? (('0' + date.getDate()).slice(-2) + '.' + ('0' + (date.getMonth() + 1)).slice(-2)) : days[date.getDay()]}</p>
    <p class="date">${('0' + date.getHours()).slice(-2) + ":" + ('0' + date.getMinutes()).slice(-2)}</p>`;
    return `<p>${goals[0]}:${goals[1]}</p>`;
}

function getShortName(team){
    let teamname = team.shortName != "" ? team.shortName: team.teamName
    switch(teamname){
        case "BVB":
            return "Dortmund"
        case "HSV":
            return "Hamburg"
    }
    return teamname
}

function getTeamIcon(team){    
    if(team.shortName == "Union Berlin") return "https://derivates.kicker.de/image/fetch/f_webp/w_120%2Ch_120%2Cc_fit%2Cq_auto:best/https://mediadb.kicker.de/2021/fussball/vereine/xxl/62_20210316732.png"
    return team.teamIconUrl
}


function getPlayers(team = "all",position = "all"){
    if(team == "all" && position == "all"){
        let array = []
        for(let team of Object.keys(players)){
            for(let pos of Object.keys(players[team])){
                array = array.concat(players[team][pos])
            }
        }
        return array;
    }

    if(position == "all"){
        if(!Object.keys(players).includes(team)) return []
        let array = []
        for(let pos of Object.keys(players[team])){
            array = array.concat(players[team][pos])
        }
        return array
    }else if(team == "all") {
        let array = []
        for(let team of Object.keys(players)){
            array = array.concat(players[team][position])
        }
        return array
    }
    return players[team][position]
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

function getFix(game,i,user=""){
    for(n of fixes){
        if(n.game_id.slice(0,-1) == game.toString() && n.game_id.slice(-1) == i.toString() && n.user == user){
            return n;
        }
    }
    return null
}

function changeColorBet(data,type,hasStarted,i,bet,playername){    
    if(!hasStarted) return "white"
    let result = getResult(data,type)
    
    for(let j = 0; j < result.length; j++){
        let fixResult = getFix((type < 10 ? data.matchID: (type < 100 ? "daily" + data[0].group.groupOrderID: "saison" + (type-100))),j);
        if(fixResult != null) result[j] = fixResult.fix_data
    }

    let fixBet = getFix((type < 10 ? data.matchID: (type < 100 ? "daily" + data[0].group.groupOrderID: "saison" + (type-100))),i,playername)
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
            return "#e90000"
        }else{
            return "lightgray"
        }
    }
}

function RND(seed) {
    this.seed = seed;
    this.a = 1664525;
    this.c = 1013904223;
    this.m = Math.pow(2, 32);

    this.nextInRange = function(min, max) {
        this.seed = (this.a * this.seed + this.c) % this.m;
        var random = this.seed % (max - min + 1);
        return min + random;
    }
}

function championsLeagueDaysBeforeDay(day){
    let days = 0;
    for(let i = 0; i < championsLeagueGamedays.length; i++){
        if(championsLeagueGamedays[i] < day){
            days++;
        }else{
            break;
        }
    }
    for(let i = 0; i < champiosLeagueKnockout.length; i++){
        for(let j = 0; j < champiosLeagueKnockout[i].days.length; j++){
            if(champiosLeagueKnockout[i].days[j] < day){
                days++;
            }
        }
    }
    return days;
}


function getResult(data,t,dailyT = dailyType){
    let result,totalGoals,goals,team1,team2,firstGoal,winningTeam,totalGoalCount;
    result = [];
    if(t < 10){
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
                if(data.leagueShortcut == "ucl" && !germanTeams.includes(getShortName(goalPlayerTeam))) continue;
                
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
            let diff = Math.abs(totalGoals[0] - totalGoals[1]);
            if(diff >= 4){
                diff = "4+";
            }
            if(totalGoals[0] == totalGoals[1]){
                result.push("Unentschieden");
            }else{
                result.push(winningTeam + " & " + diff);
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
                    if(result.length == 0) result.push("kein Team");
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
        case 25:
            switch(dailyT){
                case 1:{
                    let goalsGermanTeams = []
                    let opponents = []
                    for(let n of germanTeams){
                        goalsGermanTeams.push(-100)
                    }
                    for(let game of data){
                        if(!hasStarted(game)) continue;
                        totalGoals = getGoals(game)[0] + getGoals(game)[1]
                        let germanIndex = germanTeams.indexOf(germanTeams.includes(getShortName(game.team1)) ? getShortName(game.team1): getShortName(game.team2));
                        opponents[germanIndex] = germanTeams.includes(getShortName(game.team1)) ? getShortName(game.team2): getShortName(game.team1);
                        if(goalsGermanTeams[germanIndex] == -100) goalsGermanTeams[germanIndex] = 0
                        goalsGermanTeams[germanIndex] += totalGoals;
                    }
                    let maxGoals = 0;
                    for(let i = 0; i < goalsGermanTeams.length; i++){
                        if(goalsGermanTeams[i] > maxGoals){
                            maxGoals = goalsGermanTeams[i]
                            result = [germanTeams[i] + " : " + opponents[i]]
                        }else if(goalsGermanTeams[i] == maxGoals){
                            result.push(germanTeams[i] + " : " + opponents[i])
                        }
                    }
                    break;
                }
                case 2:{
                    let teamGoals = []
                    let otherGoals = []
                    for(let n of germanTeams){
                        teamGoals.push(-100)
                        otherGoals.push(0)
                    }
                    for(let game of data){
                        if(!hasStarted(game)) continue;
                        let goals = getGoals(game);
                        if(germanTeams.includes(getShortName(game.team1))){
                            let germanIndex = germanTeams.indexOf(getShortName(game.team1));
                            if(teamGoals[germanIndex] == -100) teamGoals[germanIndex] = 0
                            teamGoals[germanIndex] += goals[0];
                            otherGoals[germanIndex] += goals[1];
                        }
                        if(germanTeams.includes(getShortName(game.team2))){
                            let germanIndex = germanTeams.indexOf(getShortName(game.team2));
                            if(teamGoals[germanIndex] == -100) teamGoals[germanIndex] = 0
                            teamGoals[germanIndex] += goals[1];
                            otherGoals[germanIndex] += goals[0];
                        }
                    }
                    let bestTeams = []
                    let bestDiff = -100
                    let bestGoals = -100
                    for(let i = 0; i < teamGoals.length; i++){
                        let diff = teamGoals[i] - otherGoals[i];
                        if(diff > bestDiff){
                            bestTeams = [germanTeams[i]]
                            bestDiff = diff
                            bestGoals = teamGoals[i]
                        }else if(diff == bestDiff && teamGoals[i] == bestGoals){
                            bestTeams.push(germanTeams[i])
                        }
                    }
                    result = bestTeams
                    break;
                }
                case 3:{
                    let differences = []
                    for(let n of germanTeams){
                        differences.push(-100)
                    }
                    for(let game of data){
                        if(!hasStarted(game)) continue;
                        let goals = getGoals(game);
                        if(germanTeams.includes(getShortName(game.team1))){
                            let germanTeam = 0;
                            let germanIndex = germanTeams.indexOf(germanTeam == 0 ? getShortName(game.team1): getShortName(game.team2));
                            if(differences[germanIndex] == -100) differences[germanIndex] = 0;
                            differences[germanIndex] += goals[germanTeam] - goals[(germanTeam+1)%2];
                        }
                        if(germanTeams.includes(getShortName(game.team2))){
                            let germanTeam = 1;
                            let germanIndex = germanTeams.indexOf(germanTeam == 0 ? getShortName(game.team1): getShortName(game.team2));
                            if(differences[germanIndex] == -100) differences[germanIndex] = 0;
                            differences[germanIndex] += goals[germanTeam] - goals[(germanTeam+1)%2];
                        }
                    }
                    for(let i = 0; i < differences.length; i++){
                        if(differences[i] > 0) result.push(germanTeams[i]);
                    }
                    break;
                }
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
            // result = [wholeTableChampion[0].name]
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

function getDailyDisplay(data, bet, type){
    if(type == 10){
        switch(dailyType){
            case 1:
                for(let game of data){
                    if(getShortName(game.team1) != bet && getShortName(game.team2) != bet) continue;
                    if(!hasStarted(game)) return bet;
                    let teamNum = getShortName(game.team1) == bet ? 0: 1;
                    let gameGoals = getGoals(game);
                    return bet + " (" + gameGoals[teamNum] + ")";
                }
            case 2:{
                let playerTeam = null;
                for(let team of Object.keys(players)){
                    for(let player of getPlayers(team)){
                        if(player == bet) playerTeam = team;
                    }
                }
                let goals = 0;
                for(let game of data){
                    if(!hasStarted(game)){
                        if(game.team1.teamName == playerTeam || game.team2.teamName == playerTeam) return bet;
                        continue;
                    }
                    let gameGoals = game.goals.sort((a, b) => {
                        const sumA = a.scoreTeam1 + a.scoreTeam2;
                        const sumB = b.scoreTeam1 + b.scoreTeam2;
                        return sumA - sumB;
                    });  
                    let lastScore = [0,0];
                    for(let goal of gameGoals){
                        let goalPlayerTeam = goal.scoreTeam1 > lastScore[0] ? game.team1.teamName: game.team2.teamName;
                        lastScore = [goal.scoreTeam1,goal.scoreTeam2];
                        if(goal.isOwnGoal || getPlayerName(goal.goalGetterName,goalPlayerTeam) != bet) continue;
                        goals ++;
                    }
                }
                return bet + " (" + goals + ")"
            }
            case 3:{
                for(let game of data){
                    if((getShortName(game.team1) + " : " + getShortName(game.team2)) != bet) continue;
                    if(!hasStarted(game)) return bet;
                    return bet + " (" + (getGoals(game)[0] + getGoals(game)[1]) + ")"
                }
            }
            case 4:
                return bet
            case 5:
                for(let game of data){
                    if((getShortName(game.team1) != bet && getShortName(game.team2) != bet)) continue;
                    if(!hasStarted(game)) return bet;
                    let teamNum = getShortName(game.team1) == bet ? 0: 1;
                    let goals = getGoals(game);
                    if(goals[teamNum] > goals[teamNum == 0 ? 1: 0]){
                        return bet + " (" + (goals[teamNum] - goals[teamNum == 0 ? 1: 0]) + ")";
                    }else{
                        return bet + " (-)";
                    }
                }
        }
    }else if(type == 20){
        switch(dailyType){
            case 1:{
                for(let game of data){
                    if((getShortName(game.team1) + " : " + getShortName(game.team2)) != bet) continue;
                    if(!hasStarted(game)) return bet;
                    return bet + " (" + (getGoals(game)[0] + getGoals(game)[1]) + ")"
                }
            }
            case 2:{
                for(let game of data){
                    if(getShortName(game.team1) != bet && getShortName(game.team2) != bet) continue;
                    if(!hasStarted(game)) return bet;
                    let teamNum = getShortName(game.team1) == bet ? 0: 1;
                    let goals = getGoals(game);
                    return bet + " (" + goals[teamNum] + ":" + goals[teamNum == 0 ? 1: 0] + ")";
                }
            }
            case 3:{
                return bet
            }
        }
    }else if(type == 25){
        switch(dailyType){
            case 1:{
                let goals = 0;
                let started = false
                for(let game of data){
                    if(!hasStarted(game)) continue;
                    let teamNum = getShortName(game.team1) == bet.split(" : ")[0] ? 0: 1;
                    let germanTeam = teamNum == 0 ? getShortName(game.team1): getShortName(game.team2);
                    let otherTeam = teamNum == 0 ? getShortName(game.team2): getShortName(game.team1);
                    if((germanTeam + " : " + otherTeam) != bet) continue;
                    started = true
                    goals += getGoals(game)[0] + getGoals(game)[1]
                }
                if(!started) return bet
                return bet + " (" + goals + ")"
            }
            case 2:{
                let onwGoals = 0;
                let otherGoals = 0;
                let started = false
                for(let game of data){
                    if(!hasStarted(game) || (getShortName(game.team1) != bet && getShortName(game.team2) != bet)) continue;
                    started = true
                    let teamNum = getShortName(game.team1) == bet ? 0: 1;
                    let goals = getGoals(game);
                    onwGoals += goals[teamNum];
                    otherGoals += goals[teamNum == 0 ? 1: 0];
                }
                if(!started) return bet
                return bet + " (" + onwGoals + ":" + otherGoals + ")";
            }
            case 3:{
                return bet;
            }
        }
    }else{
        switch(type){
            case 100:
                return bet + " (" + (wholeTable.findIndex(team => team.shortName == bet) + 1) + ".)"
            case 101:
                return bet + " (" + goalgetters.filter(player => getPlayerName(player.goalGetterName) == bet).reduce((a, b) => a + b.goalCount,0) + ")"
            case 102:
                return bet + " (" + (wholeTable.findIndex(team => team.shortName == bet) + 1) + ".)"
            case 103:
                let i = 1;
                for(let n of wholeTableChampion){
                    if(n.shortName == bet){
                        return bet + " (" + i + ".)"
                    }
                    i++;
                }
            case 104:
                return bet
        }
    }
    return bet
}

function filterGermanTeams(data){
    return data.filter(game => germanTeams.includes(getShortName(game.team1)) || germanTeams.includes(getShortName(game.team2)))
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
    localStorage.setItem("userData",JSON.stringify({
        "username": username,
        "password": userData.user_password,
        "autoLogin": true,
        "forceLogin": false,
    }));
    }catch (error) {
        if(localStorage.getItem("userData")){
            let temp = JSON.parse(localStorage.getItem("userData"));
            temp.forceLogin = false;
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
        const data = day+1 == liveDay && liveDayData != null ? liveDayData: await fetch(new URL(`https://api.openligadb.de/getmatchdata/bl1/${liveSeason}/${day+1}`)).then(response => response.json());

        for(let playerindex = 0; playerindex < bets.length; playerindex++){
            if(day > bets[playerindex.length-1]) break;
            let bet = bets[playerindex][day]
            
            points[playerindex][day] = 0;
            
            if(!bet) continue;
            for(let num = 0; num < bet.length; num++){
                if(num == 9){
                    points[playerindex][day] += 2 * getPoints(data,bet[num],10,hasStarted(data[0]),dailyInt,playerindex);
                    continue;
                }
                points[playerindex][day] += getPoints(data[num],bet[num],typesN[num],hasStarted(data[num]),null,playerindex);
            }
        }
    }

    startIndex = getLastFilledChamp(points);
    for(let day = startIndex; day <= 33 + liveDayChampion; day++){
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

        let data = championsDayData.length != 0 ? championsDayData: await fetch(new URL(`https://api.openligadb.de/getmatchdata/ucl/${liveSeason}/${day-33}`)).then(response => response.json());
        data = filterGermanTeams(data)

        for(let playerindex = 0; playerindex < bets.length; playerindex++){
            if(day > bets[playerindex.length-1]) break;
            let bet = bets[playerindex][day]

            points[playerindex][day] = 0;
            
            if(!bet) continue;
            for(let num = 0; num <= data.length; num++){
                if(num == data.length){
                    points[playerindex][day] += 2 * getPoints(data,bet[num],day <= 41 ? 20: 25,hasStarted(data[0]),dailyInt,playerindex);
                    break;
                }
                points[playerindex][day] += getPoints(data[num],bet[num],typesN[num],hasStarted(data[num]),null,playerindex);
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

function getTotalPoints(i){
    let total = 0;
    for(let day of points[i]){
        if(day) total += day;
    }
    if(liveDay == 34 && (isOver(lastDay) || isOver(d))) {
        loadSaisonPoints();
        total += saisonPoints[i];
    }
    return total;
}

function loadSaisonPoints(){
    for(let i = 0; i < bets.length; i++){
        saisonPoints[i] = 0
        saisonPoints[i] += getPoints(wholeTable, saisonBets[i][0],100, hasStarted(firstDay[0]),null, i)*10;
        saisonPoints[i] += getPoints(goalgetters, saisonBets[i][1],101, hasStarted(firstDay[0]),null, i)*10;
        saisonPoints[i] += getPoints(wholeTable, saisonBets[i][2],102, hasStarted(firstDay[0]),null, i)*5;
        saisonPoints[i] += getPoints(wholeTableChampion, saisonBets[i][3],103, liveDayChampion > 1 || hasStarted(championsDayData[0]),null, i)*5;
        saisonPoints[i] += getPoints([championsDay], saisonBets[i][4],104, liveDayChampion > 1 || hasStarted(championsDayData[0]),null, i)*5;
    }
}

function getPoints(data,bet,t,hasStarted,daily = null,playerindex){
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
    }else if((t == 20 || t == 25) && dailyInt == 3 || t == 10 && dailyInt == 4){
        count = (correct.length - (bet.length - correct.length)) / 2
        if(count < 0) count = 0;
    }else{
        count = correct.length
    }

    return count;
}