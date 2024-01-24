<?php

    $inData = getRequestInfo();

    $searchTerm = "";

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        // Prepare the SQL statement to search the contact
        $stmt = $conn->prepare("SELECT FirstName, LastName, Phone, Email, UserID FROM Contacts WHERE FirstName LIKE ? OR LastName LIKE ?");
        $searchTerm = "%" . $inData["search"] . "%";
        $stmt->bind_param("ss", $searchTerm, $searchTerm);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0)
        {
            $searchResults = [];
            while($row = $result->fetch_assoc())
            {
                $searchResults[] = $row;
            }
            returnWithInfo($searchResults);
        }
        else
        {
            returnWithError("No Contacts Found");
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
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    function returnWithInfo($searchResults)
    {
        $retValue = ['results' => $searchResults];
        sendResultInfoAsJson($retValue);
    }
?>