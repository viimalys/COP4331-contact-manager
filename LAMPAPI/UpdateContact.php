<?php

	$inData = getRequestInfo();

	$contactId = $inData["contactId"];
	$newData = $inData["newData"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
	{
		$stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Phone=?, Email=? WHERE ID=?");
		$stmt->bind_param("sssss", $newData["firstName"], $newData["lastName"], $newData["phone"], $newData["email"], $contactId);
		$stmt->execute();

		if ($stmt->affected_rows > 0)
		{
			returnCompleted("Contact updated successfully.");
		}
		else
		{
			returnWithError("Failed to update contact.");
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

?>
