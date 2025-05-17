<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Multi Tipp</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />

    <link rel="shortcut icon" type="x-icon" href="logo.png">
    <link rel="stylesheet" href="styles/stats.css?v=2">
    <link rel="stylesheet" href="styles/navBar.css?v=2">
</head>
<body>
    <div class="menu">
        <div class="menu-main">
        <img id="logo" src="logo.png" alt="logo" width="44" height="44">
        <a class="menu-button" id="link" href="übersicht">
            <div class="menu-item">Übersicht</div>
        </a>
        <a class="menu-button" href="tippen">
            <div class="menu-item">Tippen</div>
        </a>
        <a class="menu-button selected" aria-disabled="true">
            <div class="menu-item selected">Statistiken</div>
        </a>
        <a class="menu-button" href="gruppe">
            <div class="menu-item">Gruppe</div>
        </a>
        <a class="menu-button" href="hilfe">
            <div class="menu-item">Hilfe</div>
        </a>
        <a class="menu-button" href="einstellungen">
            <span role="button" class="menu-item material-symbols-outlined">settings</span>
        </a>
        <a class="menu-button logout hideBig" href="anmelden">
            <div class="menu-item logout">Ausloggen</div>
        </a>
        </div>
        <div class="menu-account">
            <a class="menu-button logout" href="anmelden">
                <span class="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z"/></svg>
                </span>
                <div class="menu-item logout">Ausloggen</div>
            </a>
        </div> 
    </div>

<div id="blur-text" hidden>
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z"/></svg>
    <h1>Verfügbar nach Ende der Saison</h1>
</div>


<div class="container podium">
  <div class="podium__item">
    <p class="podium__city two">2</p>
    <div class="podium__rank second">2</div>
  </div>
  <div class="podium__item">
    <p class="podium__city one">1</p>
    <div class="podium__rank first">
      <svg class="podium__number" viewBox="0 0 27.476 75.03" xmlns="http://www.w3.org/2000/svg">
      <g transform="matrix(1, 0, 0, 1, 214.957736, -43.117417)">
        <path class="st8" d="M -198.928 43.419 C -200.528 47.919 -203.528 51.819 -207.828 55.219 C -210.528 57.319 -213.028 58.819 -215.428 60.019 L -215.428 72.819 C -210.328 70.619 -205.628 67.819 -201.628 64.119 L -201.628 117.219 L -187.528 117.219 L -187.528 43.419 L -198.928 43.419 L -198.928 43.419 Z" style="fill: #000;"/>
      </g>
    </svg>
    </div>
</div>
  <div class="podium__item">
    <p class="podium__city three">3</p>
    <div class="podium__rank third">3</div>
  </div>
</div>
<div id="chartContainer">
    <canvas id="chart"></canvas>
</div>

<div id="statsTableContainer">
    <table id="statsTable" class="table table-bordered border-black">
       <thead>
        <tr>
            <th scope="col"></th>
        </tr>
      </thead>
      <tbody class="table-group-divider">

       </tbody>
    </table>
</div>

</table>

<script src="http://code.highcharts.com/highcharts.js"></script>
<script src="http://code.highcharts.com/modules/exporting.js"></script>


<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="scripts/multitipp.js?v=2"></script>
<script src="scripts/stats.js?v=3"></script>
</body>
</html>
