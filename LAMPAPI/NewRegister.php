<?php

    $inData = getRequestInfo();

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
		// $hashedPassword = password_hash($inData["password"], PASSWORD_DEFAULT);
		$hashedPassword = md5($inData["password"]);

		///////////// for debugging, delete echo line when done //////////
		echo "plaintext: " . $inData["password"] . " hashtext: " . $hashedPassword;
		//////////////////////////////////////////////////////////////////

        $stmt = $conn->prepare("INSERT INTO Users (firstName, lastName, Login, Password) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $inData["firstName"], $inData["lastName"], $inData["login"], $hashedPassword);
        
        if ($stmt->execute())
        {
            $last_id = $stmt->insert_id;
            returnWithInfo($inData["firstName"], $inData["lastName"], $last_id);
        }
        else
        {
            returnWithError("Error creating user");
        }

        $stmt->close();
        $conn->close();
    }

    function getRequestInfo() {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj) {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError($err) {
        $retValue = '{"id":0, "firstName":"", "lastName":"", "error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    function returnWithInfo($firstName, $lastName, $id) {
        $retValue = '{"id":' . $id . ', "firstName":"' . $firstName . '", "lastName":"' . $lastName . '", "error":""}';
        sendResultInfoAsJson($retValue);
    }

?>
