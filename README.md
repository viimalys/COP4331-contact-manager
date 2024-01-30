# COP4331-contact-manager
Contact Manager for our small project for COP 4331 (Process Object Oriented Software) 

## Register.php
Adds a new user into the Users database. If the user already exists nothing is done.

JSON Input:
{
    "firstName":"Test",
    "lastName":"Test",
    "login":"Tester",
    "password" : "test"
}


## Search.php
Searches for a contact in the Contacts database. If the contact does not exist nothing is done.

JSON Input:
{
    "search": "sea"
}


## Read.php
Reads all of the information from the Contacts database. No JSON Input needed.


## CreateContact.php
Creates a contact from the json input file and adds the contact to the Contacts database.

JSON Input:
{
    "firstName": "John",
    "lastName" : "SeaweedInspector",
    "phone": "954-908-9976",
    "email": "johnTheSeaInspector@gmail.com",
    "userId": "1"
}


## DeleteContact.php
Removes a contact from the Contacts database if they exist.

JSON Input:
{
    "firstName":"Test",
    "lastName":"User"
}


## DeleteUser.php
First deletes the user's contacts then deletes the user from the databases.

JSON Input:
{
    "userId" : "1"
}


## Login.php
Logs in the given user into the system.

JSON Input:
{
    "firstName":"Rick",
    "lastName":"Leinecker",
    "login":"RickL",
    "password" : "COPISCOOL"
}