const urlBase = 'http://poos-team-20.xyz/LAMPAPI';
const extension = 'php';

let loginSessionID = 0;
let userId = 0;
let firstName = "";
let lastName = "";

function doLogin() {
	userId = 0;
	firstName = "";
	lastName = "";

	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	//	var hash = md5( password );

	document.getElementById("loginResult").innerHTML = "";

	let tmp = { login: login, password: password };
	//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.id;
				console.log(typeof(jsonObject.id))
				if (userId < 1) {
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;
				loginSessionID = jsonObject.id;

				saveCookie();
				
				window.location.href = "landing.html";
			}
		};
		xhr.send(jsonPayload);

	}
	catch (err) {
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function togglePasswordVisibility(passwordFieldId) {
	const passwordField = document.getElementById(passwordFieldId);
	const passwordToggle = document.querySelector('.password-toggle');

	if (passwordField.type === 'password') {
		passwordField.type = 'text';
		passwordToggle.textContent = 'Hide';
	} else {
		passwordField.type = 'password';
		passwordToggle.textContent = 'Show';
	}
}

function togglePasswordToggle() {
	const passwordField = document.getElementById('loginPassword');
	const passwordToggle = document.querySelector('.password-toggle');

	if (passwordField.value.length > 0) {
		passwordToggle.style.display = 'block';
	} else {
		passwordToggle.style.display = 'none';
	}
}

const loginNameElement = document.getElementById('loginName');
const loginPasswordElement = document.getElementById('loginPassword');

if (loginNameElement) {
	loginNameElement.addEventListener('focus', function () {
		lightenPlaceholderColor('loginName');
	});

	loginNameElement.addEventListener('blur', function () {
		restorePlaceholderColor('loginName');
	});
}

if (loginPasswordElement) {
	loginPasswordElement.addEventListener('focus', function () {
		lightenPlaceholderColor('loginPassword');
	});

	loginPasswordElement.addEventListener('blur', function () {
		restorePlaceholderColor('loginPassword');
	});
}

const firstNameElement = document.getElementById('firstName');
const lastNameElement = document.getElementById('lastName');

if (firstNameElement) {
	firstNameElement.addEventListener('focus', function () {
		lightenPlaceholderColor('firstName');
	});

	firstNameElement.addEventListener('blur', function () {
		restorePlaceholderColor('firstName');
	});
}

if (lastNameElement) {
	lastNameElement.addEventListener('focus', function () {
		lightenPlaceholderColor('lastName');
	});

	lastNameElement.addEventListener('blur', function () {
		restorePlaceholderColor('lastName');
	});
}

function lightenPlaceholderColor(inputId) {
	const inputElement = document.getElementById(inputId);
	inputElement.style.color = 'rgba(255, 255, 255, 0.5)'; // Set lighter color
}

function restorePlaceholderColor(inputId) {
	const inputElement = document.getElementById(inputId);
	if (!inputElement.value) {
		inputElement.style.color = 'rgba(255, 255, 255, 0.5)'; // Restore text color if no input
	}
}

function doRegister() {
	// Initialize variables for user information
	userId = 0;
	firstName = "";
	lastName = "";

	// Retrieve values from input fields in the HTML form
	let firstNameValue = document.getElementById("firstName").value;
	let lastNameValue = document.getElementById("lastName").value;
	let loginValue = document.getElementById("loginName").value;
	let passwordValue = document.getElementById("loginPassword").value;

	// Clear any previous registration result message
	document.getElementById("signupResult").innerHTML = "";

	// Create a JavaScript object containing user data
	let userData = {
		firstName: firstNameValue,
		lastName: lastNameValue,
		login: loginValue,
		password: passwordValue
	};

	// Convert the user data object to a JSON string
	let jsonPayload = JSON.stringify(userData);

	// Define the URL for the registration endpoint on the server
	let url = urlBase + '/Register.' + extension;

	// Create a new XMLHttpRequest object
	let xhr = new XMLHttpRequest();

	// Configure the request as a POST request to the specified URL
	xhr.open("POST", url, true);

	// Set the request header to indicate that the data being sent is JSON
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	// Define a callback function to handle the response from the server
	try {
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					// Parse the JSON response from the server
					let jsonObject = JSON.parse(xhr.responseText);

					// Extract user ID from the response
					userId = jsonObject.id;

					// Check if registration was successful
					if (userId < 1) {
						document.getElementById("signupResult").innerHTML = "Registration failed. Please check your details.";
					} else {
						// Registration successful
						firstName = jsonObject.firstName;
						lastName = jsonObject.lastName;

						// Save user information in a cookie (not shown in the provided code)
						saveCookie();

						// Redirect the user to the "index.html" page
						window.location.href = "index.html";
					}
				} else {
					// Handle errors during registration
					document.getElementById("signupResult").innerHTML = "Error during registration. Please try again later.";
				}
			}
		};
		// Send the JSON payload to the server
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("signupResult").innerHTML = err.message;
	}
}

function saveCookie() {
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime() + (minutes * 60 * 1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() {
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for (var i = 0; i < splits.length; i++) {
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if (tokens[0] == "firstName") {
			firstName = tokens[1];
		}
		else if (tokens[0] == "lastName") {
			lastName = tokens[1];
		}
		else if (tokens[0] == "userId") {
			userId = parseInt(tokens[1].trim());
		}
	}

	if (userId < 0) {
		window.location.href = "index.html";
	}
	else {
		//will crash the system occasionally
		//document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout() {
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function showAddContactForm() {
	document.getElementById("addContactForm").style.display = "block";
}

function hideAddContactForm() {
	document.getElementById("addContactForm").style.display = "none";
}

function addContactInfo() {
	let tmpFirstName = document.getElementById("firstNameInput").value;
	let tmpLastName = document.getElementById("lastNameInput").value;
	let tmpEmail = document.getElementById("emailInput").value;
	let tmpPhone = document.getElementById("phoneInput").value;
	addContact();
	console.log(tmpFirstName, tmpLastName, tmpPhone, tmpEmail);
	//tempAddRow(tmpFirstName, tmpLastName, tmpEmail, tmpPhone);
	hideAddContactForm();
	readContacts();
}

function addContactRow(tmpFirstName, tmpLastName, tmpPhone, tmpEmail) {
	let table = document.getElementById("tableBody");
	let rowCount = table.rows.length;
	let row = table.insertRow(rowCount);
	let cell1 = row.insertCell(0);
	let cell2 = row.insertCell(1);
	let cell3 = row.insertCell(2);
	let cell4 = row.insertCell(3);
	let cell5 = row.insertCell(4);
	cell1.innerHTML = tmpFirstName;
	cell2.innerHTML = tmpLastName;
	cell3.innerHTML = tmpPhone;
	cell4.innerHTML = tmpEmail;
	cell5.innerHTML =  "<td>" + "test" + "</td>";
	hideAddContactForm();
}

//cell5.innerHTML =  "<td>" + "<button type='button' onclick='deleteContact("+ i +")' " + Delete + "</button>" + "</td>";

function addContact(){
	let firstName = document.getElementById("firstNameInput").value;
	let lastName = document.getElementById("lastNameInput").value;
	let phone = document.getElementById("phoneInput").value;
	let email = document.getElementById("emailInput").value;

	// Create a JavaScript object containing user data
	let userData = {
		firstName: firstName,
		lastName: lastName,
		phone: phone,
		email: email,
		userId: userId
	};

	//console.log(userData);
	// Convert the user data object to a JSON string
	let jsonPayload = JSON.stringify(userData);
	let url = urlBase + '/Create.' + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8")
	try{
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					// something
				} else {
					// error handling
				}
			}
		};
	xhr.send(jsonPayload);
	addContactRow(firstName, lastName, phone, email);
	}
	catch (err) {
		// error message
	}
}

function deleteContact(row){
	let userData = {
		firstName: firstName,
		lastName: lastName,
	};
	let jsonPayload = JSON.stringify(userData);
	let url = urlBase + '/Delete.' + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8")
	try{
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					// something
				} else {
					// error handling
				}
			}
		};
	xhr.send(jsonPayload);
	}
	catch (err) {
		// error message
	}
}

function readContacts(){
	//alert("Page Loaded! Getting Contacts!");
	let url = urlBase + '/Read.' + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8")
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
      // The request has been completed successfully
      //console.log(xhr.responseText);
	  //alert("ready!");
	  let jsonData = JSON.parse(xhr.responseText);
	  //console.log(jsonData);
	  //console.log(jsonData.length);
	  console.log("Login Session ID: " + loginSessionID)
	  for(i=0; i<jsonData.length; i++){
		console.log(jsonData[i]);
		console.log(typeof(jsonData[i].UserID));
		let jsonUserIDstr = jsonData[i].UserID;
		let jsonUserIDint = parseInt(jsonUserIDstr, 10);
		console.log(jsonUserIDint);
		console.log(typeof(jsonUserIDint));
		if(loginSessionID == jsonUserIDint)
		{
			addContactRow(jsonData[i].FirstName, jsonData[i].LastName, jsonData[i].Phone, jsonData[i].Email);
		}
	  }
    } else {
      // Oh no! There has been an error with the request!
    }
  }
};
xhr.send();
}