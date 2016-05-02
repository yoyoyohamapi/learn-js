<?php
header('Content-Type: application/javascript');
sleep(1);
?>
function extraFunction(logthis) {
    console.log('loaded and executed');
    console.log(logthis);
}