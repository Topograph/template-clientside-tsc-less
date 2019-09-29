<?php

function echoElement($path, array $replacements = []) {
    $fileContent = file_get_contents($path);
    if (!empty($replacements)) {
        foreach($replacements as $search => $replace) {
            $fileContent = str_replace($search, $replace, $fileContent);
        }
    }
    echo $fileContent;
}

?>