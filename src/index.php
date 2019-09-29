<html>
<?php
require_once('./reusableElements.php');
echoElement('./html/header.html', ['%title%' => 'Home']);
?>

<body style="background-color:darkslategray">
    <?php echoElement('./html/navigation.html'); ?>
    <div class="pagesframe">

    </div>

    <script>
        let initpage = new ExampleNamespace.Index();
    </script>
</body>

</html>