
<?php

	$inData = getRequestInfo();
	
	$id = 0;
	$firstName = "";
	$lastName = "";
    $phone = "";
    $email = "";
    $userId = "";

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
        // Checking if the person already exists in Contacts before continuing.
        $stmt = $conn->prepare("SELECT ID FROM Contacts WHERE FirstName = ? AND LastName = ?");
        $stmt->bind_param("ss", $inData["firstName"], $inData["lastName"]);
        $stmt->execute();
        $result = $stmt->get_result();
    
        if($result->num_rows > 0)
        {
            returnWithError("This Person Already Exists in Contacts");
        }
        else
        {
            $stmt = $conn->prepare("INSERT into Contacts (FirstName, LastName, Phone, Email, UserID) VALUES (?, ?, ?, ?, ?)");
		    $stmt->bind_param("sssss", $inData["firstName"], $inData["lastName"], $inData["phone"], $inData["email"], $inData["userId"]);
            $stmt->execute();
		    $result = $stmt->get_result();
		    $stmt->close();
		    $conn->close();
            returnCompleted("");
        }
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

	function returnWithError($err)
	{
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }
	
	function returnCompleted( $err )
	{
		$retValue = 'User Added';
		sendResultInfoAsJson( $retValue );
	}
?>
