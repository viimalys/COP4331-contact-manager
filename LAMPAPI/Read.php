<?php

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
	{
		$sql = "SELECT * FROM Contacts";
		$result = $conn->query($sql);

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
			returnWithError("No contacts found");
		}

		$conn->close();
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
