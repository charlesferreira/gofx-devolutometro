<?php
$value = 0.0;
if ($content = @file_get_contents('http://www.notaparana.pr.gov.br/')) {
    preg_match('/creditoCounter[^:]*:([^,]*)/s', $content, $matches);
    $value = (float)(count($matches > 0) ? $matches[1] : 0);
}
die(json_encode($value));
