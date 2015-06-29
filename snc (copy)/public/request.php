<?php
require '../vendor/autoload.php';
$config = include('../config.php');



use GuzzleHttp\Client;

$client = new Client();
$req = $client->createRequest('GET', 'http://localhost:8000', ['future' => true]);
$client->send($req)->then(function ($response) {
    echo 'I completed! ' . $response;
});
exit;