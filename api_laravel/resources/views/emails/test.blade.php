<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <h1>Bonjour {{ $request['firstnameclient'] }} {{ $request['lastnameclient'] }}</h1>

    <h2>Un rappel vaccinal de votre animal {{ $request['nameAnimal']}} vient d'être programmé.</h2>
    <p>Votre rendez-vous est prévu le {{ $request['date']}} avec votre vétérinaire {{ $request['firstnameveterinary']}} {{ $request['lastnameveterinary']}}</p>
    <p>Si vous n'êtes plus en mesure d'assister au rendez-vous, merci de nous contacter au plus vite.</p>

</body>

</html>
