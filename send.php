<?php
require_once "vendor/autoload.php";
use Minishlink\WebPush\Subscription;
use Minishlink\WebPush\WebPush;

require_once "./dbh.php";

$groupUrlBl = "https://api.openligadb.de/getcurrentgroup/bl1";
$groupResponseBl = json_decode(file_get_contents($groupUrlBl),true)["groupOrderID"];

$groupUrlCl = "https://api.openligadb.de/getcurrentgroup/ucl";
$groupResponseCl = json_decode(file_get_contents($groupUrlCl),true)["groupOrderID"];

$urlBl = "https://api.openligadb.de/getmatchdata/bl1/2025/{$groupResponseBl}";
$responseBl = json_decode(file_get_contents($urlBl),associative: true)[0]["matchDateTimeUTC"];

$urlCl = "https://api.openligadb.de/getmatchdata/ucl/2025/{$groupResponseCl}";
$responseCl = json_decode(file_get_contents($urlCl),associative: true)[0]["matchDateTimeUTC"];

$now = gmdate("U")+60*60*24*3;
$timeBl = strtotime($responseBl);
$timeCl = strtotime($responseCl);

$next_date = null;
$next_league = null;
if ($timeBl >= $now && ($timeCl < $now || $timeBl < $timeCl)) {
    $next_date = $timeBl;
    $next_league = "Bundesliga";
} elseif ($timeCl >= $now) {
    $next_date = $timeCl;
    $next_league = "Champions League";
}

// if($next_date == null || $next_date-60*60 > $now) return;

$query = "SELECT * FROM push_subscriptions u WHERE user_id = 1 AND last_active = (SELECT MAX(last_active) FROM push_subscriptions WHERE user_id = u.user_id);";

$stmt = $pdo->query($query);
$stmt->execute();
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($users as $user) {
    $pushSubscription = Subscription::create([
        'endpoint' => $user['endpoint'],
        'keys' => [
            'p256dh' => $user['p256dh'],
            'auth' => $user['auth'],
        ],
    ]);

    $auth = [
        'VAPID' => [
            'subject' => 'mailto:me@website.com', // can be a mailto: or your website address
            'publicKey' => 'BGraND_bLAZEjpeTMVQcOm4ggVmyIC4btqM6QoQZyQ8kiWjipzhRO0SlRbHa318rmN4PZhCPL1iijVCEEJoe-gE',
            'privateKey' => 'EaiR1e3Iy9MPbAK1cdfQ-_eyTwtTRSiVqfUxW7MrgZI',
        ],
    ];

    $webPush = new WebPush($auth);

    $webPush->queueNotification(
        $pushSubscription,
        json_encode([
            'title' => '⚽Schon getippt?',
            'body' => "Der nächste {$next_league} Spieltag startet bald!",
            'url' => "./tippen"
        ])
    );

    foreach ($webPush->flush() as $report) {
        if (!$report->isSuccess()) {
            echo "Failed to send notification: " . $report->getReason() . "\n";
        }else{
            echo "Successfully sent notification: " . json_encode($report) . "\n";
        }
    }
}