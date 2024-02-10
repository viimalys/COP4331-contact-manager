<?php

	$inData = getRequestInfo();

	$UserId = $inData["UserId"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
	{
		$sql = "SELECT * FROM Contacts WHERE UserID = ?";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("s", $UserId);
		$stmt->execute();
		$result = $stmt->get_result();

		if ($result->num_rows > 0)
		{
			$contacts = array();
			while ($row = $result->fetch_assoc())
			{
				$contacts[] = $row;
			}
			sendResultInfoAsJson($contacts);
		}
		else
		{
			returnWithError("No contacts found for that UserID");
		}

		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
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
