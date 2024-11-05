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

    <style>
        html,body{
            width: 100%;
            height: 100%;
            background-color: #f0f0f0;
        }

        @media (min-width: 1800px){
            
            li:nth-child(n+4) {
                display: none; /* 3 */
            }
            .playerPointDiv:nth-child(n+4) {
                display: none; /* Verstecke alle Elemente nach dem 4. */
            }
        }

        @media (max-width: 1800px){
            li:nth-child(n+3) {
                display: none; /* 2 */
            }
            .playerPointDiv:nth-child(n+3) {
                display: none; /* Verstecke alle Elemente nach dem 3. */
            }
        }
        
        @media (max-width: 1320px){
            li:nth-child(n+2) {
                display: none; /* 1 */
            }
            .playerPointDiv:nth-child(n+2) {
                display: none; /* Verstecke alle Elemente nach dem 2. */
            }
            
            .main{
                width: calc(100% - 40px) !important;
                height: calc(100% - 310px) !important;
            }
        }
        
        @media (max-width: 830px){
            .team1{
                font-size: 10px;
            }
            .team2{
                font-size: 10px;
            }
        }
        
        @media (min-width: 661px){
            .playernameBar{
                display: none !important;
            }
            .pointsTopSmall{
                display: none !important;
            }
            .hideBig{
                display: none !important;
            }
        }

        
        @media (max-width: 661px){
            .teamText{
                display: none !important;
            }
            .teamText1{
                display: inline-block !important;
            }
            .newLine{
                display: inline !important;
            }
            .pointsDay{
                margin-left: 10px !important;
            }
            .groupContainer{
                display: none;
            }
            .playerPointDiv{
                display: none !important;
            }
            .pointsTop{
                display: none !important;
            }
            .betsDisplay{
                max-width: 80vw !important;
                min-width: 80vw !important;
            }
            .betContainer{
                max-width: 80vw !important;
                min-width: 80vw !important;
            }
            .resultDisplay{
                max-width: 80vw !important;
                min-width: 80vw !important;
            }
            #SaisonContainer{
                max-width: 80vw !important;
                min-width: 80vw !important;
            }
            #dailyContainer{
                max-width: 80vw !important;
                min-width: 80vw !important;
            }
            .carousel{
                margin: auto !important;
            }
            .carousel-control-prev, .carousel-control-next {
                top: 50% !important;
                height: 95% !important;
            }
            .main{
                display: none !important;
            }
            .saison, .saisonContainer{
                min-width: 1px !important;
            }
            .menu-account{
                display: none !important;
            }
        }

        .saison, .saisonContainer{
            min-width: 470px;
        }
        
        .team1{
            text-align: center;
            width:100%;
            height: 100%;
        }
        .team2{
            text-align: center;
            width:100%;
            height: 100%;
        }
        .game{
            display: flex;
            align-items: center;
            min-height: 51px;
        }
        .collapse{
            margin-bottom: 10px;
        }
        .oneline {
            display: inline-block;
        }
        .form{
            margin-top: 20px;
            margin-left: 20px;
        }
        
        .gap{
            margin-left: 5px;
        }

        .small{
            width: 50px;
            height: 50px;
            text-align: center;
        }

        .title{
            width: 40px;
            position: relative;
            align-self: flex-end;
        }

        .text{
            width: 150px;
        }

        .resultDiv{
            text-align: center;
            line-height: 0;
        }

        .resultDisplay{
            padding:5px;
            width:474px;
            margin-bottom: 20px;
            background-color: white;
        }

        .date{
            font-size: 10px;
        }

        .done{
            background-color: gray;
        }

        ul {
            list-style-type: none; 
        }

        .main{
            margin-left: 20px;
            margin-right: 60px;
            margin-top: 20px;
            height: calc(100% - 275px);
            width: calc(100% - 80px);
            /* max-width: 1390px; */
            /* position: fixed; 
            left: 0;
            right: 0; */
        }

        .list-group::-webkit-scrollbar {
            display: none;
        }

        #betContent{
            margin-left: 50px;
        }

        .betContainer{
            display: flex;
            justify-content: space-between;
            align-items: center;
            min-width: 100%;
            max-width: 474px;
            /*padding: 5px;*/
            margin: 5px 0px;
            min-height: 52px;
        }

        .betContainer2{
            min-width: 100%;
            max-width: 474px;
            /*padding: 5px;*/
            margin: 5px 0px;
            min-height: 52px;
        }

        .betDisplay{
            margin: auto;
            padding: 5px;
            width:fit-content;
            display:block
        }

        .input-group{
            min-width: calc(100% - 40px);
            width: calc(100% - 40px);
            height: 40px;
            margin: auto;
        }

        #daySelect{
            text-align: center;
        }

        .betsDisplay{
            flex: 1;
            /* min-width: 300px; */
            display: flex;
            justify-content: space-evenly;
            min-height: 52px;
            margin-bottom: 5px;
            overflow-x: scroll;
        }

        .gameTitle{
            font-weight: bold;
            margin: auto;
            width: fit-content;
        }

        .topBar{
            margin-left: 25px;
            margin-top: 20px;
            display: flex;
        }

        .points{
            width: 50px;
            height: 50px;
            text-align: center;
            font-size: 30px;
            font-weight: bold;
            background-color: lightgray;
            margin-top: 1px;
        }

        .pointDisplay{
            /* max-width: 900px; */
            flex: 1;
            overflow: hidden;
            display: flex;
            justify-content: space-between;
        }

        .betResultContainer{
            display: flex;
            justify-content: space-between;
            overflow-x: scroll;
        }
       

        .playerPointDiv {
            font-size: larger;
            min-width: 300px;
            flex: 1;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: lightgray;
            border-radius: 10px;
            padding-left: 3px;
            border: 1px solid black;
            vertical-align: center;
            min-height: 52.2px;
        }

        .playerPointDiv p{
            margin: 0;
        }

        .list-group{
            overflow-y: scroll;
            overflow-x: hidden;
            width: 100%;
        }

        #betDaily{
            display: flex;
            justify-content: center; 
            align-items: center; 
        }

        #dailyContainer{
            padding:5px;
            min-width:474px;
            margin-bottom: 15px;
        }

        .searchbar{
            display:flex;
            margin-top: 0;
            margin-left: 40px;
            margin-bottom: 0;
            width: 100%;
        }

        .groupContainer{
            margin-top:134.5px;
           
        }

        .pointBar{
            margin-left: 20px;
            margin-right: 20px;
            margin-top: 10px;
            display: flex;
            justify-content: space-between;
        }

        .pointsDay{
            margin-left: 40px;
            padding: 10px;
        }

        .nav-link{
            font-size: 1.25rem;
        }

        .playername{
            font-weight: bold;
            width: 60%;
            margin: 0;
            height: 100%;
            vertical-align: middle;
        }

        .playerPoints{
            width: 100%;
            display: flex;
            justify-content: space-evenly;
            font-size: larger;
        }
        
        .playerpoints p{
            margin: 0!important;
        }
        
        .pointsTop {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .pointsTopSmall {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        #noplayer {
            flex: 0 0 40%;
        }

        li{
            list-style-type:none;
        }

        .playerPointsTop {
            flex: 0 0 60%;
            display: flex;
            justify-content: space-evenly;
            align-items: center;
        }

        #totalPoints, #dayPoints {
            font-weight: bold;
            cursor: pointer;
        }
        .playernameTop{
            width: 50%;
            margin-left: 10px;
        }
        .carousel-control-prev, .carousel-control-next {
            width: 5%; /* Breitere Buttons */
            top: 87px;
            transform: translateY(-50%);
            background-color: grey;
            height: 150px;
            border-color: black;
            border-radius: 10px;
            border-width: 5px;
        }

        .carousel-control-prev {
            left: -5%; /* Positioniere den linken Pfeil außerhalb des Carousels */
        }

        .carousel-control-next {
            right: -5%; /* Positioniere den rechten Pfeil außerhalb des Carousels */
        }
        .carousel{
            margin-right: 50px;
        }
        .playernameBar{
            display: flex;
            justify-content: space-around;
        }
        .menu{
    display: flex;
    justify-content:space-between;
    background-color: lightgray;
    margin-bottom: 15px;
    overflow-x: scroll;
    padding-left: 10px;
    padding-right: 10px;
}

.menu-main{
    display: flex;
    justify-content:flex-start;
    overflow-x: scroll;
}

.menu::-webkit-scrollbar, .menu-main::-webkit-scrollbar, .betResultContainer::-webkit-scrollbar, .betsDisplay::-webkit-scrollbar{
    display: none;
}

.menu-item{
    padding: 10px 5px 7px 5px;
    color: gray;
}

.menu-button{
    display: flex;
    justify-content:space-between;

    font-size: large;
    text-decoration: none;
}


.menu-item.selected{
    color: black;
    background-image: linear-gradient(to right, 
    transparent 0%, 
    transparent 20%, 
    black 20%, 
    black 80%, 
    transparent 80%, 
    transparent 100%);
    background-size: 100% 4px; /* Adjust the height of the border */
    background-repeat: no-repeat;
    background-position: bottom;
}

.menu-item:hover:not(.selected, .logout){
    color: black;
    background-image: linear-gradient(to right, 
    transparent 0%, 
    transparent 20%, 
    black 20%, 
    black 80%, 
    transparent 80%, 
    transparent 100%);
    background-size: 100% 4px; /* Adjust the height of the border */
    background-repeat: no-repeat;
    background-position: bottom;
    animation: border-expand 0.3s ease forwards;
}

.menu-button.logout{
    background: linear-gradient(to right, black, black 50%, gray 50%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-size: 200% 100%;
    background-position: 100%;
    transition: background-position 275ms ease;  
}

.menu-button.logout:hover{
    background-position: 0 100%;
}

@keyframes border-expand {
    0% {
        background-size: 0% 4px;
    }
    50% {
        background-size: 50% 4px;
    }
    100% {
        background-size: 100% 4px;
        background-image: linear-gradient(to right, 
            transparent 0%, 
            transparent 20%, 
            black 20%, 
            black 80%, 
            transparent 80%, 
            transparent 100%);
    }
}

.menu-button .icon {
    display: none;
}

.menu-button:hover .icon {
    display: inline-block;
}

.icon{
    color: black;
}


.menu-account{
    display: flex;
    justify-content: center;
    align-items: center;
}

#name{
    margin-right: 5px;
}

.edit-button{
    height: 70%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.edit-button svg{
    height: 120%;
}

.edit-name{
    background-color: inherit;
    border: hidden;
    width: fit-content;
    text-align: center;
}

.edit-name:focus{
    outline-width: 0;
}
    </style>
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
        <a class="menu-button" href="gruppe">
            <div class="menu-item">Gruppe</div>
        </a>
        <a class="menu-button" href="hilfe">
            <div class="menu-item">Hilfe</div>
        </a>
        <a class="menu-button logout hideBig" href="anmelden">
            <div class="menu-item logout">Ausloggen</div>
        </a>
        </div>
        <div class="menu-account">
            <form id="editForm" action="php/changePlayerName.php" method="post">
                <input name="input" id="edit-name" class="edit-name" type="text" style="display:none" autocomplete="off">
            </form>
            <div id="name"><?php echo $_SESSION["user_data"]["username"] ?></div>
            <span role="button" onClick="editName()" class="edit-button material-symbols-outlined">edit</span>
            <a class="menu-button logout" href="anmelden">
                <span class="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" height="inherit" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z"/></svg>
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
            <button class="carousel-control-prev" type="button" data-bs-target="#carousel" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carousel" data-bs-slide="next">
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

    
    <script src="scripts/games.js?v=6"></script>
</body>
</html>
