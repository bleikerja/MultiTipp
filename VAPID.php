<?php
require_once("vendor\autoload.php");

use Minishlink\WebPush\VAPID;

print_r(value: VAPID::createVapidKeys());
