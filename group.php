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
    <link rel="stylesheet" href="styles/group.css?v=2">
    <link rel="stylesheet" href="styles/navBar.css?v=2">
    <title>Multi Tipp</title>
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
        <a class="menu-button" href="statistiken">
            <div class="menu-item">Statistiken</div>
        </a>
        <a class="menu-button selected" aria-disabled="true">
            <div class="menu-item selected">Gruppe</div>
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

    <?php 
        if(!array_key_exists("user_data",$_SESSION)){
            header("Location: anmelden");
        }
    ?>

    <?php if($_SESSION["user_data"]["user_group"] != null){
        require_once "dbh.php";
        $group_name = json_encode($_SESSION["user_data"]["user_group"]);
        $query = "SELECT * FROM groups WHERE group_name = $group_name;";
        //echo $query;
        $stmt = $pdo->prepare($query);

        //$stmt->bindParam("group_name", $group_name);

        $stmt->execute();
        $group_result = $stmt->fetch(PDO::FETCH_ASSOC);
        ?>
        <div style="display:flex;justify-content:center">
            <h1 id="groupName" style="width: fit-content;"><?php echo $_SESSION["user_data"]["user_group"] ?></h1>
            <form id="editForm" action="php/changeGroupName.php" method="post">
                <input name="input" id="editGroupname" class="editGroupname" type="text" value="newGroup" style="display:none" autocomplete="off">
            </form>
            <?php if($group_result["group_admin"] == $_SESSION["user_data"]["id"]){ ?> <span role="button" id="editButton" class="material-symbols-outlined" onclick="setEdit(true)"> edit </span> 
            <?php }else{ ?>
                <form action="php/removeFromGroup.php" method="post">
                        <input name="input" value="<?php echo $_SESSION["user_data"]["username"] ?>" type="hidden">
                        <button type="submit" class="material-symbols-outlined remove-button">
                            logout
                        </button>
                    </form>
            <?php } ?>
        </div>
        
        <?php if($group_result["group_admin"] == $_SESSION["user_data"]["id"]){ ?> 
        <form action="php/addToGroup.php" method="post" class="searchbar" id="groupAdd">
            <div>
                <label for="groupInput" class="visually-hidden">Name</label>
                <input name="input" type="text" class="form-control" id="groupInput" placeholder="name">
            </div>
            <div>
                <button type="submit" class="btn btn-secondary">Einladen</button>
            </div>
        </form>
        <button type="submit" class="btn btn-secondary searchbar" onclick="copyToClipboard('<?php echo $_SESSION['user_data']['user_group'] ?>');">Einladungslink kopieren</button>
        <?php } ?>

        <ul class="list-group">
            <?php
                $username = $_SESSION["user_data"]["username"];
                $group_name = $_SESSION["user_data"]["user_group"];

                $query = "SELECT * FROM users WHERE user_group = :group_name;"; //AND username != :username
                $stmt = $pdo->prepare($query);

                //$stmt->bindParam("username", $username);
                $stmt->bindParam("group_name", $group_name);

                $stmt->execute();
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

                //echo json_encode($username);
                //echo json_encode($group_name);
                //echo json_encode($stmt);

                foreach ($result as $user) {
                    $this_username = htmlspecialchars($user["username"]);
                    $bg = $user["username"] == $username ? ';background-color:lightgray':'';
                    echo '<li class="list-group-item" style="display: flex;justify-content: space-between'. $bg .';">
                            <p>' . $this_username . '</p>';
                    if($group_result["group_admin"] == $_SESSION["user_data"]["id"] && $_SESSION["user_data"]["username"] != $this_username){    
                        echo '<form action="php/removeFromGroup.php" method="post">
                            <input name="input" value="'. $this_username .'" type="hidden"</input>
                            <button type="submit" class="material-symbols-outlined remove-button">
                                person_remove
                            </button> 
                        </form>';  
                            
                    }
                    echo '</li>';
                }

                $invite_group_name = $_SESSION["user_data"]["user_group"];

                $invite_query = "SELECT * FROM users WHERE group_invite = :group_name;";
                $invite_stmt = $pdo->prepare($invite_query);

                //$stmt->bindParam("username", $username);
                $invite_stmt->bindParam("group_name", $group_name);

                $invite_stmt->execute();
                $invite_result = $invite_stmt->fetchAll(PDO::FETCH_ASSOC);

                //echo json_encode($username);
                //echo json_encode($group_name);
                //echo json_encode($stmt);

                foreach ($invite_result as $invite_user) {
                    $invite_this_username = htmlspecialchars($invite_user["username"]);
                    echo '<li class="list-group-item" style="display: flex;justify-content: space-between;">
                            <p>' . $invite_this_username . '</p>
                            <p style="color:gray"> Eingeladen </p>';
                            if($group_result["group_admin"] == $_SESSION["user_data"]["id"]){
                                echo '<form action="php/removeFromGroup.php" method="post">
                                <input name="input" value="'. $invite_this_username .'" type="hidden"</input>
                                <button type="submit" class="material-symbols-outlined remove-button">
                                    person_remove
                                </button> 
                            </form>';
                        }
                        echo '</li>';
                }
            ?>
    </ul>
    <?php if($group_result["group_admin"] == $_SESSION["user_data"]["id"]){ ?>
        <form id="deleteGroup" action="php/deleteGroup.php" method="post">
            <button type="submit" class="btn btn-danger">Gruppe Löschen</button>
        </form>
    <?php } ?>
    <?php }else { ?>
        <form action="php/createGroup.php" method="post" class="searchbar" id="groupAdd">
            <div>
                <label for="groupInput" class="visually-hidden">Name</label>
                <input name="input" type="text" class="form-control" id="groupInput" placeholder="name">
            </div>
            <div>
                <button type="submit" class="btn btn-secondary">Gruppe erstellen</button>
            </div>
        </form>

    <?php if($_SESSION["user_data"]["group_invite"] != null){ ?>
        <div class="invite">
            <p>Einladung: <?php echo htmlspecialchars($_SESSION["user_data"]["group_invite"]) ?></p>
            <div style="display:flex">
                <form action="php/accept_invite.php" method="post">
                    <button type="submit" class="btn btn-success" name="submit">annehmen</button>
                </form>
                <form action="php/decline_invite.php" method="post">
                    <button type="submit" class="btn btn-danger" name="submit">ablehnen</button>
                </form>
            </div>
        </div>
    <?php } ?> 
    <?php } ?>

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



        function setEdit(edit){
            let input = document.getElementById("editGroupname")
            if(edit){
                input.style.display = "";
                input.focus(); 
                var val = document.getElementById("groupName").innerText; 
                input.value = ''; 
                input.value = val;
                document.getElementById("groupName").style.display = "none";
                document.getElementById("editButton").style.display = "none";
            }else{
                input.style.display = "none";
                document.getElementById("groupName").style.display = "";
                document.getElementById("groupName").innerText = input.value;
                document.getElementById("editButton").style.display = "";   
            }
        }

        function copyToClipboard(groupName){
            let link = window.location.href.replace("gruppe","registrieren");
            navigator.clipboard.writeText(link + "?invite=" + groupName)
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