<?php
$content = file_get_contents('http://www.notaparana.pr.gov.br/');
$matches = [];
preg_match('/creditoCounter[^:]*:([^,]*)/s', $content, $matches);
die(json_encode((float)(count($matches>0)?$matches[1]:0)));
