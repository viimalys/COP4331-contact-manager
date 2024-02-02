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


	if (login.trim() === '' || password.trim() === '') {
		// Check for empty username
		if (login.trim() === '') {
			highlightFieldError('loginName', 'Username cannot be empty');
		}

		// Check for empty password
		if (password.trim() === '') {
			highlightFieldError('loginPassword', 'Password cannot be empty');
		}
		return;
	}

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
				console.log(typeof (jsonObject.id))
				if (userId < 1) {
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;
				loginSessionID = jsonObject.id;
				saveCookie();
				// Debugging: Log userId to the console
				console.log("User ID:", userId);

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
		passwordToggle.innerHTML = "<i class='bx bx-hide'></i>"; // Set the HTML for the hide icon
	} else {
		passwordField.type = 'password';
		passwordToggle.innerHTML = "<i class='bx bx-show' style='color:#ffffff'></i>"; // Set the HTML for the show icon
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

function showPasswordRequirements() {
	const passwordRequirements = document.getElementById('passwordRequirements');
	passwordRequirements.style.display = 'block';
}

function hidePasswordRequirements() {
	const passwordRequirements = document.getElementById('passwordRequirements');
	passwordRequirements.style.display = 'none';
}


function checkPasswordRequirements() {
	const passwordInput = document.getElementById('loginPassword');
	const passwordRequirements = document.getElementById('passwordRequirements');

	const lengthRequirement = passwordInput.value.length >= 12;
	const uppercaseRequirement = /[A-Z]/.test(passwordInput.value);
	const lowercaseRequirement = /[a-z]/.test(passwordInput.value);
	const numberRequirement = /[0-9]/.test(passwordInput.value);
	const symbolRequirement = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(passwordInput.value);

	const metRequirements = lengthRequirement && uppercaseRequirement && lowercaseRequirement && numberRequirement && symbolRequirement;

	passwordRequirements.innerHTML = ''; // Clear previous content

	if (metRequirements) {
		passwordRequirements.innerHTML = "<span style='color: green;'>&#10004;</span> All password requirements met!";
	} else {
		passwordRequirements.innerHTML = "Password Requirements:";
		if (lengthRequirement) {
			passwordRequirements.innerHTML += "<br><span style='color: green;'>&#10004;</span> At least 12 characters long";
		} else if (!lengthRequirement) {
			passwordRequirements.innerHTML += "<br><span style='color: red;'>&#10008;</span> At least 12 characters long";
		}

		if (uppercaseRequirement) {
			passwordRequirements.innerHTML += "<br><span style='color: green;'>&#10004;</span> Contains uppercase letter(s)";
		} else if (!uppercaseRequirement) {
			passwordRequirements.innerHTML += "<br><span style='color: red;'>&#10008;</span> Contains uppercase letter(s)";
		}

		if (lowercaseRequirement) {
			passwordRequirements.innerHTML += "<br><span style='color: green;'>&#10004;</span> Contains lowercase letter(s)";
		} else if (!lowercaseRequirement) {
			passwordRequirements.innerHTML += "<br><span style='color: red;'>&#10008;</span> Contains lowercase letter(s)";
		}

		if (numberRequirement) {
			passwordRequirements.innerHTML += "<br><span style='color: green;'>&#10004;</span> Contains number(s)";
		} else if (!numberRequirement) {
			passwordRequirements.innerHTML += "<br><span style='color: red;'>&#10008;</span> Contains number(s)";
		}

		if (symbolRequirement) {
			passwordRequirements.innerHTML += "<br><span style='color: green;'>&#10004;</span> Contains symbol(s)";
		} else if (!symbolRequirement) {
			passwordRequirements.innerHTML += "<br><span style='color: red;'>&#10008;</span> Contains symbol(s)";
		}
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

function highlightFieldError(fieldName, errorMessage) {
	const inputElement = document.getElementById(fieldName);
	const errorIcon = `<i class='bx bx-error-circle' style='color:#ff0000; font-size: 17px;'>${errorMessage}</i>`;

	// Add shake animation class
	inputElement.classList.add('shake');
	setTimeout(() => {
		// Remove shake animation class after the animation duration
		inputElement.classList.remove('shake');
	}, 300);

	if (inputElement.value.trim() === '') {
		if (!inputElement.classList.contains('error')) {
			inputElement.classList.add('error');
			inputElement.insertAdjacentHTML('beforebegin', errorIcon);

		}
	} else {
		inputElement.classList.remove('error');
		const errorIconElement = inputElement.previousElementSibling;
		if (errorIconElement && errorIconElement.classList.contains('bx-error-circle')) {
			errorIconElement.parentNode.removeChild(errorIconElement);
		}
	}
}


function removeFieldError(fieldId) {
	const field = document.getElementById(fieldId);
	field.classList.remove('error');
	const errorIcon = field.previousElementSibling;
	if (errorIcon && errorIcon.classList.contains('bx-error-circle')) {
		errorIcon.remove();
	}
}

function confirmPasswordRequirements(password) {
	const lengthRequirement = password.length >= 12;
	const uppercaseRequirement = /[A-Z]/.test(password);
	const lowercaseRequirement = /[a-z]/.test(password);
	const numberRequirement = /\d/.test(password);
	const symbolRequirement = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password);

	const metRequirements = lengthRequirement && uppercaseRequirement && lowercaseRequirement && numberRequirement && symbolRequirement;

	return {
		metRequirements,
		lengthRequirement,
		uppercaseRequirement,
		lowercaseRequirement,
		numberRequirement,
		symbolRequirement
	};
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


	// Check for empty fields
	if (!firstNameValue || !lastNameValue || !loginValue || !passwordValue || !confirmPasswordRequirements(passwordValue).metRequirements) {
		if (!firstNameValue) {
			highlightFieldError('firstName', 'First Name is required');
		}

		if (!lastNameValue) {
			highlightFieldError('lastName', 'Last Name is required');
		}

		if (!loginValue) {
			highlightFieldError('loginName', 'Username is required');
		}

		if (!passwordValue) {
			highlightFieldError('loginPassword', 'Password is required');
		} else if (!confirmPasswordRequirements(passwordValue).metRequirements) {
			highlightFieldError('loginPassword', 'Password does not meet requirements');
		}

		return;
	}

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
	var tmpFirstName = document.getElementById("firstNameInput").value;
	var tmpLastName = document.getElementById("lastNameInput").value;
	var tmpEmail = document.getElementById("emailInput").value;
	var tmpPhone = document.getElementById("phoneInput").value;
	addContact();
	console.log(tmpFirstName, tmpLastName, tmpPhone, tmpEmail);
	//tempAddRow(tmpFirstName, tmpLastName, tmpEmail, tmpPhone);
	hideAddContactForm();
	readContacts();
}

function addContactRow(tmpFirstName, tmpLastName, tmpPhone, tmpEmail) {
	var table = document.getElementById("tableBody");
	var rowCount = table.rows.length;
	var row = table.insertRow(rowCount);
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);
	var cell4 = row.insertCell(3);
	var cell5 = row.insertCell(4);
	cell1.innerHTML = tmpFirstName;
	cell2.innerHTML = tmpLastName;
	cell3.innerHTML = tmpPhone;
	cell4.innerHTML = tmpEmail;
	//cell5.innerHTML =  "<td>" + "<button type='button' onclick='deleteContact("+ i +")' " + Delete + "</button>" + "</td>";
	hideAddContactForm();
}

function addContact() {
	readCookie();
	let firstName = document.getElementById("firstNameInput").value;
	let lastName = document.getElementById("lastNameInput").value;
	let phone = document.getElementById("phoneInput").value;
	let email = document.getElementById("emailInput").value;
	var table = document.getElementById("tableBody");

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
	try {
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

function deleteContact(row) {
	let userData = {
		firstName: firstName,
		lastName: lastName,
	};
	let jsonPayload = JSON.stringify(userData);
	let url = urlBase + '/Delete.' + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8")
	try {
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

function readContacts() {
	readCookie();
	// Debugging: Log userId to the console
	console.log("User ID:", userId);
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
				for (i = 0; i < jsonData.length; i++) {
					console.log(jsonData[i]);
					console.log(typeof (jsonData[i].UserID));
					let jsonUserIDstr = jsonData[i].UserID;
					let jsonUserIDint = parseInt(jsonUserIDstr, 10);
					console.log(jsonUserIDint);
					console.log(typeof (jsonUserIDint));
					if (userId == jsonUserIDint) {
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

// Function to play the GIF when double-clicked
function playGif() {
	// Change the source of the image to the corresponding GIF
	document.getElementById("staticImage").src = "/images/scubaPenguin.gif";

	// Disable further double-clicks to prevent restarting the GIF
	document.getElementById("staticImage").ondblclick = null;

	// Set a timeout to reset the image to the static one after the GIF duration
	setTimeout(function () {
		document.getElementById("staticImage").src = "/images/penguinImage.jpg";
		// Re-enable double-click after the GIF finishes playing
		document.getElementById("staticImage").ondblclick = playGif;
	}, 3500); //  duration of GIF in milliseconds (6.8 seconds)
}
