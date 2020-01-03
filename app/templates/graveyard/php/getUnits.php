<?php

function getDevices()
{
    $data = "[";

    $db = new SQLite3(loadConfig()->path_db_discovery);

    $sql = "SELECT * FROM units;";

    $results = $db->query($sql);
    while ($results  && $row = $results->fetchArray()) {
        $temp = json_decode($row['payload']);
        $temp->ip_address = $row['ip_address'];
        $payload = json_encode($temp);
        $data .= $payload . ",";
    }

    $data = substr($data, 0, -1);

    $data .= "]";

    return $data;

}



?>