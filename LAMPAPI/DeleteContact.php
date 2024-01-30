
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
        // Checking if the person already exists in Contacts before continuing.
        $stmt = $conn->prepare("DELETE FROM Contacts WHERE FirstName = ? AND LastName = ?");
        $stmt->bind_param("ss", $inData["firstName"], $inData["lastName"]);
        $stmt->execute();
        $result = $stmt->get_result();
    
        if($result->num_rows > 0)
        {
            returnWithError("Contact Deleted");
        }
        else
        {
            returnWithError("No Contact Found");
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

    function returnCompleted($msg)
    {
        $retValue = 'Contact Deleted';
		sendResultInfoAsJson( $retValue );
    }
?>
