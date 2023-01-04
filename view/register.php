<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
    <link rel="stylesheet" href="../css/style.css">
</head>

<body class="container text-center">
    <div>
        <h1>Register Student</h1>
    </div>
    <form action="register_control.php" class="" method="POST">
        <div class="row">
            <div class="col-md4 mb-3">
                <label class="d-inline">
                    <input type="radio" name="genre" value="F">
                    <img src="https://thumbs.dreamstime.com/b/%C3%ADcone-f%C3%AAmea-da-imagem-do-perfil-do-avatar-do-defeito-placeholder-cinzento-da-foto-da-mulher-88413637.jpg" alt="M" width="25%"></a>
                </label>
                <label class="d-inline">
                    <input type="radio" name="genre" value="H">
                    <img src="https://thumbs.dreamstime.com/b/%C3%ADcone-masculino-da-imagem-do-perfil-do-avatar-do-defeito-placeholder-cinzento-da-foto-do-homem-88414414.jpg" alt="H" width="25%"></a>
                </label>
            </div>
            <div class="col">
                <div class="d-flex justify-content-center mb-4">
                    <div class="m-3">
                        <label for="fname">Primeiro Nome</label>
                        <input type="text" name="fname" class="form-control">
                    </div>
                    <div class="m-3">
                        <label for="fname">Ultimo Nome</label>
                        <input type="text" name="lname" class="form-control">
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md4 mb-4">
            <input type="submit">
        </div>
    </form>

    <div class="mt-3">
        <button class="btn fs-2 px-5 btn-primary" onclick="newPage('../index.html')">Voltar</button>
    </div>
</body>

</html>

<script src="../js/nextPage.js"></script>