<?php
include_once 'conection.php';

$img;

$sql = $con->query("SELECT name, lastname, genre FROM aluno");
while ($row = $sql->fetch(PDO::FETCH_ASSOC)) {
    if ($row['genre'] == "H") {
        $img = "https://thumbs.dreamstime.com/b/%C3%ADcone-masculino-da-imagem-do-perfil-do-avatar-do-defeito-placeholder-cinzento-da-foto-do-homem-88414414.jpg";
    } else {
        $img = "https://thumbs.dreamstime.com/b/%C3%ADcone-f%C3%AAmea-da-imagem-do-perfil-do-avatar-do-defeito-placeholder-cinzento-da-foto-da-mulher-88413637.jpg";
    }
    echo "<div class='grid_item'>
        <div class='card'>
            <img src='{$img}'width='100%' alt='genre'>
            <div class='card_container'>
                <h4><b>{$row['name']}</b></h4> 
                <p>{$row['lastname']}</p>
            </div>
        </div>
    </div>";
}
