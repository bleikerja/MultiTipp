let gamedays = [
    0,
    1,
    2,
    3,
    35,
    4,
    5,
    36,
    6,
    7,
    37,
    8,
    9,
    38,
    10,
    11,
    39,
    12,
    13,
    40,
    14,
    15,
    16,
    17,
    18,
    41,
    19,
    42,
    20,
    21,
    43,
    22,
    43,
    23,
    24,
    44,
    25,
    44,
    26,
    27,
    28,
    45,
    29,
    45,
    30,
    31,
    32,
    33,
    34
]
let gamedayNames = [
    "Saisonswetten",
    "1. Spieltag",
    "2. Spieltag",
    "3. Spieltag",
    "Champions League #1",
    "4. Spieltag",
    "5. Spieltag",
    "Champions League #2",
    "6. Spieltag",
    "7. Spieltag",
    "Champions League #3",
    "8. Spieltag",
    "9. Spieltag",
    "Champions League #4",
    "10. Spieltag",
    "11. Spieltag",
    "Champions League #5",
    "12. Spieltag",
    "13. Spieltag",
    "Champions League #6",
    "14. Spieltag",
    "15. Spieltag",
    "16. Spieltag",
    "17. Spieltag",
    "18. Spieltag",
    "Champions League #7",
    "19. Spieltag",
    "Champions League #8",
    "20. Spieltag",
    "21. Spieltag",
    "Champions League Playoffs",
    "22. Spieltag",
    "Champions League Playoffs",
    "23. Spieltag",
    "24. Spieltag",
    "Champions League AF",
    "25. Spieltag",
    "Champions League AF",
    "26. Spieltag",
    "27. Spieltag",
    "28. Spieltag",
    "Champions League VF",
    "29. Spieltag",
    "Champions League VF",
    "30. Spieltag",
    "31. Spieltag",
    "32. Spieltag",
    "33. Spieltag",
    "34. Spieltag"
]

start();
function start() {
  liveDay = 34
  init();
  if(!isOver(lastDay)) {
    document.querySelector("#statsTable").classList.add("blur");
    document.querySelector("#chart").classList.add("blur");
    document.querySelector(".container.podium").classList.add("blur");
    document.querySelector("#blur-text").hidden = false
  }
}

async function init() {
  const response3 = await fetch(new URL(`https://api.openligadb.de/getmatchdata/bl1/2024/4`));
  const data3 = await response3.json();
  firstDay = data3

  const tableResponse = await fetch(new URL(`https://api.openligadb.de/getbltable/bl1/2024`));
  const tableData = await tableResponse.json();
  wholeTable = tableData
  
  //const tableResponseChampion = await fetch(new URL(`https://api.openligadb.de/getbltable/cl24de/2024`));
  //const tableDataChampion = await tableResponseChampion.json();
  const tableDataChampion = [{name:"Leverkusen", place:6},{name:"Dortmund", place:10},{name:"Bayern", place:12}, {name:"Stuttgart", place:26}, {name:"Leipzig", place:32}]
  wholeTableChampion = tableDataChampion
  
  const lastDayResponse = await fetch(new URL(`https://api.openligadb.de/getmatchdata/bl1/2024/34`));
  lastDay = await lastDayResponse.json();
  
  const goalgetterResponse = await fetch(new URL(`https://api.openligadb.de/getgoalgetters/bl1/2024`));
  const goalgetterData = await goalgetterResponse.json();
  goalgetters = goalgetterData

  const championsDayResponse = await fetch(new URL(`https://api.openligadb.de/getcurrentgroup/cl24de`));
  championsDay = await championsDayResponse.json();

  if(championsDayData.length == 0) championsDayData = await fetch(new URL(`https://api.openligadb.de/getmatchdata/cl24de/2024/${championsDay.groupOrderID}`)).then(response => response.json());
  await load();
  await loadPoints();
  await loadChart();
  loadPodium();
  loadStats();
}

function loadPodium() {
  let placements = getFinalPlacements();
  document.querySelector(".podium__city.one").innerText = placements[0][0] + " (" + placements[0][1] + ")";
  document.querySelector(".podium__city.two").innerText = placements[1][0] + " (" + placements[1][1] + ")";
  document.querySelector(".podium__city.three").innerText = placements[2][0] + " (" + placements[2][1] + ")";
}

function getFinalPlacements() {
  let placements = [];
  for(let i = 0; i < playernames.length; i++) {
    let pointsThis = getTotalPoints(i)
    placements.push([playernames[i], pointsThis]);
  }
  return placements.sort((a, b) => b[1] - a[1])
}

async function loadChart() {
gamedays = [...new Set(gamedays)]
gamedayNames = [...new Set(gamedayNames)]

let placments = getplacements(points);

  new Chart(
    document.getElementById('chart'),
    {
      type: 'line',
      data: {
        labels: gamedayNames.slice(1),
        datasets: placments
      },
      options: {
        responsive: true,
        interaction: {
          intersect: false,
          mode: 'index',
          itemSort: (a, b) => {
            return b.raw - a.raw;
          }
        },
        plugins: {
          tooltip: {
            enabled: isOver(lastDay),
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                label += ': ' + context.raw + " (" + getRealPoints(points)[context.datasetIndex][context.dataIndex] + ")";
                return label;
              }
            }
          },
          title: {
            display: true,
            text: 'Platzierungen',
            font: 
            {
              size: 20
            }
          }
        }
      }
    }
  );
};

function loadStats() {
  let tableHead = document.querySelector("#statsTable thead tr");
  let tableBody = document.querySelector("#statsTable tbody");

  for (const player of playernames) {
    tableHead.appendChild(getTableCell(player,"col"));
  }

  let totalPoints = ["Gesamtpunkte"];
  for (let i = 0; i < playernames.length; i++) {
    totalPoints.push(getTotalPoints(i));
  }
  tableBody.appendChild(getTableRow(totalPoints));

  let totalSaisonPoints = ["Saisonpunkte"];
  loadSaisonPoints();
  for (let i = 0; i < playernames.length; i++) {
    totalSaisonPoints.push(saisonPoints[i]);
  }
  tableBody.appendChild(getTableRow(totalSaisonPoints));

  let leaguePoints = ["Bundesliga Punkte"];
  for (let i = 0; i < playernames.length; i++) {
    leaguePoints.push(points[i].slice(0,34).reduce((a, b) => a + b, 0));
  }
  tableBody.appendChild(getTableRow(leaguePoints));

  let clPoints = ["Champions League Punkte"];
  for (let i = 0; i < playernames.length; i++) {
    clPoints.push(points[i].slice(34, points[i].length).reduce((a, b) => a + b, 0));
  }
  tableBody.appendChild(getTableRow(clPoints));

  let bestGameday = ["bester Spieltag"];
  let realdata = getRealPoints(points);
  for (let i = 0; i < playernames.length; i++) {
    let maxPoints = Math.max(...realdata[i]);
    bestGameday.push(gamedayNames[realdata[i].indexOf(maxPoints)+1] + " (" + maxPoints + ")");
  }
  tableBody.appendChild(getTableRow(bestGameday));


  // let bestTeam = ["bestes Team"];
  // tableBody.appendChild(getTableRow(bestTeam));
  
  let gamedayWins = ["Spieltagssiege"];
  let pointsFliped = points[0].map((_, i) => points.map(row => row[i])).filter((a) => a.filter((b) => b != null && b != 0).length > 0);

  for (let i = 0; i < playernames.length; i++) {
    gamedayWins.push(pointsFliped.reduce((a, b) => a + (b != null && b[i] == Math.max(...b) ? 1 : 0), 0));
  }
  tableBody.appendChild(getTableRow(gamedayWins));

  let missedBets = ["nicht getippt"];
  //console.log(bets[4].map((a) => a == null ? 0 : a.filter((b) => b != null && b.length > 0).length));
  for (let i = 0; i < playernames.length; i++) {
    missedBets.push(bets[i].reduce((a, b, j) => a + (j < 34 ? (b == null ? 10 : (10 - b.filter((c) => c != null && c.length > 0).length)) : j < 42 ? (b == null ? 6 : (6 - b.filter((c) => c != null && c.length > 0).length)) : (b == null ? 5 : (5 - b.filter((c) => c != null && c.length > 0).length))), 0));
  }
  tableBody.appendChild(getTableRow(missedBets));

  // let correctBets = ["korrekte Tipps"];
  // tableBody.appendChild(getTableRow(correctBets));

  // let gamedayBetPoints = ["Spieltagtipp Punkte"];
  // tableBody.appendChild(getTableRow(gamedayBetPoints));
}

function getTableRow(text, scope = null) {
  let tr = document.createElement("tr");
  for (let i = 0; i < text.length; i++) {
    tr.appendChild(getTableCell(text[i], scope == null && i == 0 ? "row" : scope));
  }
  return tr;
}

function getTableCell(text, scope = null) {
  let td = document.createElement(scope == null ? "td" : "th");
  td.innerText = text;
  if (scope) {
    td.setAttribute("scope", scope);
  }
  return td;
}

function getRealPoints(data) {
  let realdata = [];
    for(let j = 0; j < data.length; j++) {
        realdata[j] = [];
    }
    for(let i = 1; i < gamedays.length; i++) {
        let day = gamedays[i]-1;
        for(let j = 0; j < data.length; j++) {
            realdata[j].push(data[j][day]); 
        }
    }
    return realdata;
}

function getplacements(data) {
    let realdata = getRealPoints(data);

    let points = [];
    for(let i = 0; i < realdata.length; i++) {
        points[i] = [];
        for(let j = 0; j < realdata[i].length; j++) {
            if(realdata[i][j] !== null) {
                points[i].push(realdata[i][j] + (points[i][j-1] || 0));
            }else {
                points[i].push(points[i][j-1] || 0);
            }
        }
    }

    let ranks = rank(points);
    let ranking = [];
    for(let i = 0; i < points.length; i++) {
        ranking[i] = {"label": playernames[i], "data": points[i]};
    }
    return ranking;
}


function rank(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const result = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let col = 0; col < cols; col++) {
    // Extract column with value and original row index
    let column = matrix.map((row, rowIndex) => ({ value: row[col], rowIndex }));

    // Sort descending
    column.sort((a, b) => b.value - a.value);

    let rank = 1;
    for (let i = 0; i < column.length; i++) {
      if (i > 0 && column[i].value === column[i - 1].value) {
        // Same as previous: same rank
        result[column[i].rowIndex][col] = result[column[i - 1].rowIndex][col];
      } else {
        // New value: use current rank
        result[column[i].rowIndex][col] = rank;
      }
      rank = i + 2; // Always increment rank index by position + 1
    }
  }

  return result;
}