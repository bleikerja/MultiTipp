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
    <title>Multi Tipp</title>
    <link rel="stylesheet" href="styles/styleHelp.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
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
    <a class="menu-button" href="gruppe">
        <div class="menu-item">Gruppe</div>
    </a>
    <a class="menu-button selected" aria-disabled="true">
        <div class="menu-item selected">Hilfe</div>
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
    <h1>Hilfe</h1>
    <h4>Bundesliga</h4>
    <div class="accordion" id="accordionExample">
    <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
        <h5>Spiel</h5>
      </button>
    </h2>
    <div id="collapseOne" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
        <div class="accordion-body">
        <p>Diese Tipps werden an jedem Spieltag auf die 9 Spiele aufgeteilt.</p>
        <p class="betHeadline">Wer gewinnt?</p>
        <p class="betExplain">Das Vorraussagen des richtigen Gewinners bzw. eines Unentschiedens gibt einen Punkt</p>
        <p class="betHeadline">Wer schießt das 1. Tor?</p>
        <p class="betExplain">Das Vorraussagen des zuerst treffenden Teams gibt einen Punkt</p>
        <p class="betHeadline">Welcher Spieler schießt das 1. Tor?</p>
        <p class="betExplain">Das Vorraussagen des zuerst treffenden Spielers gibt einen Punkt (Auch bei Eigentor)</p>
        <p class="betHeadline">Welche Spieler schießen ein Tor?</p>
        <p class="betExplain">Für jeden richtig getippten Torschützen gibt es einen Punkt (ohne Eigentor). Für falsche Tipps wird ein Punkt abgezogen (min. 0 Punkte)</p>
        <p class="betHeadline">Wie viele Tore fallen?</p>
        <p class="betExplain">Für das Vorraussagen des richtigen Bereichs gibt es einen Punkt</p>
        <p class="betHeadline">Wie viele Tore schießt das Team?</p>
        <p class="betExplain">Für das Vorraussagen der richtigen Anzahl von Toren eines Teams gibt es einen Punkt</p>
        <p class="betHeadline">Wie viele Tore fallen in der Halbzeit?</p>
        <p class="betExplain">Für das Vorraussagen der richtigen Toranzahl gibt es pro Halbzeit einen Punkt</p>
        <p class="betHeadline">Welches Team gewinnt mit welchem Abstand?</p>
        <p class="betExplain">Für den Tipp mit richtigem Gewinner und richtigem Abstand gibt es einen Punkt</p>
        <p class="betHeadline">Schießen beide Teams ein Tor?</p>
        <p class="betExplain">Für den richtigen Tipp gibt es einen Punkt</p>
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
        <h5>Spieltag</h5>
      </button>
    </h2>
    <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
        <div class="accordion-body">
        <p>An jedem Spieltag wird aus diesen Tipps eine zufällig ausgewählt. Für den richtigen Tipp gibt es zwei Punkte</p>
        <p class="betHeadline">Welches Team schießt die meisten Tore?</p>
        <p class="betExplain"></p>
        <p class="betHeadline">Welcher Spieler schießt die meisten Tore?</p>
        <p class="betExplain"></p>
        <p class="betHeadline">In welchem Spiel fallen die meisten Tore?</p>
        <p class="betExplain"></p>
        <p class="betHeadline">Welche Teams schießen kein Tor?</p>
        <p class="betExplain">Für jedes richtig getippte Team gibt es einen Punkt. Für falsche Tipps wird ein Punkt abgezogen (min. 0 Punkte)</p>
        <p class="betHeadline">Welches Team gewinnt mit dem höchsten Abstand?</p>
        <p class="betExplain"></p>

      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
        <h5>Saison</h5>
      </button>
    </h2>
    <div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        <p>Diese Tipps können bis zum 3. Spieltag abgegeben werden und werden am Ende der Saison augewertet</p>
        <p class="betHeadline">Wer wird Meister?</p>
        <p class="betExplain">Für den Tipp des richtigen Erstplazierten gibt es 10 Punkte</p>
        <p class="betHeadline">Welcher Spieler schießt die meisten Tore?</p>
        <p class="betExplain">Für den Tipp des Richtigen Spielers mit den meisten Toren der Saison gibt es 10 Punkte</p>
        <p class="betHeadline">Welche Teams belegen die letzten 3 Plätze?</p>
        <p class="betExplain">Für jedes richtige Team gibt es 5 Punkte (Reihenfolge egal)</p>
      </div>
    </div>
  </div>
</div>

<h4>Champions League</h4>
<div class="accordion" id="accordion2">
    <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse1" aria-expanded="false" aria-controls="collapse1">
        <h5>Spiel</h5>
      </button>
    </h2>
    <div id="collapse1" class="accordion-collapse collapse" data-bs-parent="#accordion2">
        <div class="accordion-body">
        <p>Diese Tipps werden an jedem Spieltag auf die Spiele mit deutschen Teams aufgeteilt.</p>
        <p class="betHeadline">Wer gewinnt?</p>
        <p class="betExplain">Das Vorraussagen des richtigen Gewinners bzw. eines Unentschiedens gibt einen Punkt</p>
        <p class="betHeadline">Welche [deutsches Team] Spieler schießen ein Tor?</p>
        <p class="betExplain">Für jeden richtig getippten Torschützen gibt es einen Punkt (ohne Eigentor). Für falsche Tipps wird ein Punkt abgezogen (min. 0 Punkte)</p>
        <p class="betHeadline">Wie viele Tore fallen?</p>
        <p class="betExplain">Für das Vorraussagen des richtigen Bereichs gibt es einen Punkt</p>
        <p class="betHeadline">Wie viele Tore schießt das Team?</p>
        <p class="betExplain">Für das Vorraussagen der richtigen Anzahl von Toren eines Teams gibt es einen Punkt</p>
        <p class="betHeadline">Welches Team gewinnt mit welchem Abstand?</p>
        <p class="betExplain">Für den Tipp mit richtigem Gewinner und richtigem Abstand gibt es einen Punkt</p>
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse2" aria-expanded="false" aria-controls="collapse2">
        <h5>Spieltag</h5>
      </button>
    </h2>
    <div id="collapse2" class="accordion-collapse collapse" data-bs-parent="#accordion2">
        <div class="accordion-body">
        <p>An jedem Spieltag wird aus diesen Tipps eine zufällig ausgewählt.</p>
        <p class="betHeadline">In welchem Spiel fallen die meisten Tore?</p>
        <p class="betExplain">Für das Vorraussagen des richtigen Spiels gibt es zwei Punkte</p>
        <p class="betHeadline">Welches deutsche Team spielt am besten?</p>
        <p class="betExplain">Das Vorraussagen des Teams mit dem höchsten Sieg bzw. geringsten Niederlage gibt zwei Punkte. Bei gleicher Differenz entscheiden die eigenen Tore</p>
        <p class="betHeadline">Welche deutschen Teams gewinnen?</p>
        <p class="betExplain">Für jeden richtig Vorrausgesagten Gewinner gibt es einen Punkt. Für jeden falschen Tipp wird ein Punkt abgezogen (min. 0 Punkte)</p>

      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse3" aria-expanded="false" aria-controls="collapse3">
        <h5>Saison</h5>
      </button>
    </h2>
    <div id="collapse3" class="accordion-collapse collapse" data-bs-parent="#accordion2">
      <div class="accordion-body">
        <p>Diese Tipps müssen bis zu Beginn des ersten Champions League Spieltags abgegeben werden</p>
        <p class="betHeadline">Welches deutsche Team hat die beste Platzierung?</p>
        <p class="betExplain">Für den Tipp des in der Gruppenphase am höchsten plazierten Teams gibt es 5 Punkte</p>
        <p class="betHeadline">Welches deutsche Team kommt am weitesten?</p>
        <p class="betExplain">Für das Vorraussagen das richtigen Teams, welches als Letztes ausscheidet, gibt es 5 Punkte</p>
      </div>
    </div>
  </div>
</div>


<script>
load()
async function load() {
  try {
        await fetch('php/loginData.php')
            .then(function (response) {
            return response.json();
        });
    } catch (error) {
        window.location.href = 'anmelden';
        return;
    }
}

let editingName = false

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
</script>

</body>
</html>