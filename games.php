<?php
    session_start();
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" type="x-icon" href="logo.png">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
    <title>Multi Tipp</title>
    <link rel="stylesheet" href="styles/games.css?v=12">
    <link rel="stylesheet" href="styles/navBar.css?v=2">
</head>
<body>
    <div class="menu">
        <div class="menu-main">
        <img id="logo" src="logo.png" alt="logo" width="44" height="44">
        <a class="menu-button selected" aria-disabled="true">
            <div class="menu-item selected">Übersicht</div>
        </a>
        <a class="menu-button" id="link" href="tippen<?php echo isset($_GET['day']) ? '?day='.$_GET['day'] : ''; ?>">
            <div class="menu-item ">Tippen</div>
        </a>
        <!-- <a class="menu-button" href="statistiken">
            <div class="menu-item">Statistiken</div>
        </a> -->
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

    <div class="input-group">
        <button id="moveBack" type="button" class="btn btn-outline-secondary border-black" onClick="moveGameday(-1)"><</button>
        <select class="form-select border-black bg-body-secondary" aria-label="Default select example" id="daySelect" onchange="showSpieltag(parseInt(this.options[this.selectedIndex].value));">
        </select>
        <button id="moveFront" type="button" class="btn btn-outline-secondary border-black" onClick="moveGameday(1)">></button>
    </div>

    <div class="pointBar">
       <div id="groupContainer" class="groupContainer">
            
        </div>

        <div id="pointDisplay" class="pointDisplay" hidden>
        
        </div>

        <div id="carousel" class="carousel slide">
            <div id="gameCarousel" class="carousel-inner">
                
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carousel" data-bs-slide="prev" hidden>
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carousel" data-bs-slide="next" hidden>
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>



        <div class="navBar" style="display:block;min-width: 36px;" hidden>
            <button type="button" class="btn btn-outline-secondary border-black" onClick="shiftBetOrder(true)" id="shiftBetForward">></button>
            <br>
            <button type="button" class="btn btn-outline-secondary border-black" onClick="shiftBetOrder(false)" style="margin-top:30px" id="shiftBetBack" hidden><</button>
        </div>
        
    </div>
    <script src="scripts/multitipp.js?v=7"></script>
    <script src="scripts/games.js?v=3"></script>
    <script>
        navigator.serviceWorker.register('sw.js');
    </script>
</body>
</html>
