<?php
require 'vendor/autoload.php';
$dotenv = new Dotenv\Dotenv(__DIR__);
$dotenv->load();
$isProduction = 'production' === getenv('APP_ENV');
?>

<!DOCTYPE html>
<html>
    <head>
        <title><%= _.capitalize(projectName) %></title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <link rel="shortcut icon" href="public/img/favicon/markdown.ico"/>
        <link rel="stylesheet" href="public/css/core.min.css" type="text/css"/>
        <script type="text/javascript" src="public/js/core.min.js"></script>

        <?php if (!$isProduction): ?>
            <link rel="stylesheet" href="build/css/style.css" type="text/css"/>
            <script type="text/javascript" src="app/js/script.js"></script>
            <script src="http://localhost:<?php echo getenv('LIVERELOAD_PORT'); ?>/livereload.js"></script>
        <?php endif; ?>
    </head>

    <body>
        <h1><%= _.capitalize(description) %></h1>
    </body>
</html>
