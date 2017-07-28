<?php
header('Content-Type: application/json');
$value = 999999900; $increment = 19.05;
if ($content = @file_get_contents('http://www.notaparana.pr.gov.br/')) {
    preg_match('/creditoCounter[^:]*value:([^,]*)[^:]*inc:([^,]*)/s', $content, $matches);
    $value = count($matches > 0) ? (float)$matches[1] : 0;
    $increment = count($matches > 1) ? (float)$matches[2] : 0;
}
die(json_encode(compact('value', 'increment')));
