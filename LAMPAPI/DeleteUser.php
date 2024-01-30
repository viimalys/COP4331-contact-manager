<?php

	$inData = getRequestInfo();

	$UserId = $inData["UserId"];

	echo "UserId: " . $UserId;

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
	{
		// Delete user's contacts
		$deleteContactsQuery = "DELETE FROM Contacts WHERE UserID = ?";
		$stmt = $conn->prepare($deleteContactsQuery);
		$stmt->bind_param("s", $UserId);
		$stmt->execute();
		$stmt->close();

		// Delete user
		$deleteUserQuery = "DELETE FROM Users WHERE ID = ?";
		$stmt = $conn->prepare($deleteUserQuery);
		$stmt->bind_param("s", $UserId);
		$stmt->execute();
		$stmt->close();

		$conn->close();
		returnCompleted("User and associated contacts deleted successfully.");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
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

	function returnWithError($err)
	{
		$retValue = array("error" => $err);
		sendResultInfoAsJson($retValue);
	}

?>
