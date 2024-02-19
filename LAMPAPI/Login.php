<?php

	$inData = getRequestInfo();
	
	$id = 0;
	$firstName = "";
	$lastName = "";

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("SELECT ID, firstName, lastName, Password FROM Users WHERE Login=?");
		$stmt->bind_param("s", $inData["login"]);
		$stmt->execute();
		$result = $stmt->get_result();

		if( $row = $result->fetch_assoc()  )
		{
			if(md5($inData["password"]) === $row['Password'])
			{
				//returnWithInfo($inData["firstName"], $inData["lastName"], $inData["login"], $last_id);
				returnWithInfo($row['firstName'], $row['lastName'], $inData["login"], $row['ID']);
			}
			else
			{
				returnWithError("Incorrect Password");
			}
		}
		else
		{
			returnWithError("No Records Found");
		}

		$stmt->close();
		$conn->close();
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
    function returnWithInfo($firstName, $lastName, $login, $id)
	{
        $retValue = '{"id":"' . $id . '", "firstName":"' . $firstName . '", "lastName":"' . $lastName . '", "login":"' . $login . '", "error":""}';
        sendResultInfoAsJson($retValue);
    }
	
?>
