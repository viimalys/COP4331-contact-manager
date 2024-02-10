<?php

	$inData = getRequestInfo();

	$userId = $inData["userId"];
	$newFirstName = $inData["newFirstName"];
	$newLastName = $inData["newLastName"];
	$newUsername = $inData["newUsername"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

	
	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
	{
		$stmt = $conn->prepare("UPDATE Users SET FirstName=?, LastName=?, Login=? WHERE ID=?");
		$stmt->bind_param("ssss", $newFirstName, $newLastName, $newUsername, $userId);
		$stmt->execute();
		

		if ($stmt->affected_rows > 0)
		{
			//returnCompleted("User information updated successfully.");
			returnWithInfo($newFirstName, $newLastName, $newUsername);
		}
		else
		{
			returnWithError("Failed to update user information.");
		}

		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function returnWithError($err)
	{
		$retValue = array("error" => $err);
		sendResultInfoAsJson($retValue);
	}

	function returnCompleted($message)
	{
		$retValue = array("message" => $message);
		sendResultInfoAsJson($retValue);
	}

	function sendResultInfoAsJson($obj)
	{
		header('Content-type: application/json');
		echo json_encode($obj);
	}

	function returnWithInfo($firstName, $lastName, $Username)
	{
		$retValue = array(
			"firstName" => $firstName,
			"lastName" => $lastName,
			"Username" => $Username,
			"error" => ""
		);
		sendResultInfoAsJson( $retValue );
	}

?>
