<?php 


$host = 'localhost';
$username = 'root';
$password = '';
$db_name = 'map_db';

$db = mysqli_connect($host, $username, $password, $db_name);
$result = mysqli_query($db, "SELECT * FROM `india_map` ORDER BY `india_map`.`state` ASC");


$json_array = array();
while($row = mysqli_fetch_assoc($result)){
    $json_array[] = $row;
}
print(json_encode($json_array))

?>