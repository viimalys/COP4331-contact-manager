const urlBase = 'http://poos-team-20.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let username = "";

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
				username = jsonObject.login;
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

// Function to get user initials
function getUserInitials() {
	readCookie();
	console.log("first name:", firstName);
	console.log("last name:", lastName);
	const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
	console.log("intials", initials);
	return initials;
}

// Function to update the user initials in the HTML
function updateUserInitials() {
	const userInitialsDiv = document.getElementById("userInitials");

	if (userInitialsDiv) {
		const initials = getUserInitials();
		userInitialsDiv.textContent = initials;
	}
}

function togglePasswordVisibility(passwordFieldId) {
	const passwordField = document.getElementById(passwordFieldId);
	const passwordToggle = document.querySelector('.password-toggle');

	if (passwordField.type === 'password') {
		passwordField.type = 'text';
		passwordToggle.innerHTML = "<i class='bx bx-hide' style='color:#ffffff'></i>"; // Set the HTML for the hide icon
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
	username = "";

	// Retrieve values from input fields in the HTML form
	let firstNameValue = document.getElementById("firstName").value;
	let lastNameValue = document.getElementById("lastName").value;
	let loginValue = document.getElementById("loginName").value;
	let passwordValue = document.getElementById("loginPassword").value;


	// Clear any previous registration result message
	document.getElementById("signupResult").innerHTML = "";

	// Regular expressions for validation
	let nameRegex = /^[A-Za-z]+$/;
	let usernameRegex = /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
	let passwordRequirements = confirmPasswordRequirements(passwordValue);


	// Check for empty fields
	if (!firstNameValue || !lastNameValue || !loginValue || !passwordValue || !passwordRequirements.metRequirements
		|| !nameRegex.test(firstNameValue) || !nameRegex.test(lastNameValue) || !usernameRegex.test(loginValue)) {
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
		} else if (!passwordRequirements.metRequirements) {
			highlightFieldError('loginPassword', 'Password does not meet requirements');
		}

		// Validate first name
		if (!nameRegex.test(firstNameValue)) {
			highlightFieldError('firstName', 'First Name can only contain letters');
		}

		// Validate last name
		if (!nameRegex.test(lastNameValue)) {
			highlightFieldError('lastName', 'Last Name can only contain letters');
		}

		// Validate login (username)
		if (!usernameRegex.test(loginValue)) {
			highlightFieldError('loginName', 'Username can only contain letters, numbers, and symbols');
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
						if (jsonObject.error) {
							document.getElementById("signupResult").innerHTML = jsonObject.error;
						} else {
							document.getElementById("signupResult").innerHTML = "Registration Failed. Check your Details!";
						}


					} else {
						// Registration successful
						firstName = jsonObject.firstName;
						lastName = jsonObject.lastName;
						username = jsonObject.login;

						// Save user information in a cookie (not shown in the provided code)
						saveCookie();


						// Redirect the user to the "login.html" page
						window.localStorage.setItem('registrationSuccessful', 'true');
						window.location.href = "login.html";
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

function checkRegistration() {
	// Check if registration was successful
	var registrationSuccessful = window.localStorage.getItem('registrationSuccessful');
	if (registrationSuccessful === 'true') {
		// Display the popup box
		document.getElementById("popupBox").classList.remove("hidden");

		// After 10 seconds, hide the popup box
		setTimeout(function () {
			document.getElementById("popupBox").classList.add("hidden");
		}, 5000);

		// Clear the flag from local storage
		window.localStorage.removeItem('registrationSuccessful');
	}
}


function saveCookie() {
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime() + (minutes * 60 * 1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ",username=" + username + ";expires=" + date.toGMTString();
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
		else if (tokens[0] == "username") {
			username = parseInt(tokens[1].trim());
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
	document.getElementById("addContactPopup").style.display = "block";
}

function hideAddContactForm() {
	document.getElementById("addContactPopup").style.display = "none";
}

function addContactRow(firstName, lastName, Phone, Email, contactID) {
	let tableBody = document.getElementById("tableBody");
	let text = tableBody.innerHTML;
	text += "<tr id='row" + contactID + "'>";
	text += "<td id='first_Name" + contactID + "'><span>" + firstName + "</span></td>";
	text += "<td id='last_Name" + contactID + "'><span>" + lastName + "</span></td>";
	text += "<td id='phone" + contactID + "'><span>" + Phone + "</span></td>";
	text += "<td id='email" + contactID + "'><span>" + Email + "</span></td>";
	text += "<td>" + "<button type='button' class='delBtn' onclick='deleteContact(" + contactID + ")'>" + "Delete Contact " + contactID + "</button>"
		+ "<button type='button' class='editBtn' onclick='updateContact(" + contactID + ")'>" + "Edit Contact " + contactID + "</button>" + "</td>";
	text += "</tr>"
	tableBody.innerHTML = text;
	hideAddContactForm();
}

function addContact() {
	readCookie();
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

	console.log(userData);

	// Convert the user data object to a JSON string
	let jsonPayload = JSON.stringify(userData);
	let url = urlBase + '/CreateContact.' + extension;
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
		let jsonData = JSON.parse(xhr.responseText);
		let contactID = jsonData.ID;
		addContactRow(firstName, lastName, phone, email, contactID);
	}
	catch (err) {
		console.log(err);
	}
}

function deleteContact(id) {
	let firstName = document.getElementById("first_Name" + id).innerText;
	let lastName = document.getElementById("last_Name" + id).innerText;
	if (confirm("Are you sure you want to delete contact " + firstName + " " + lastName + "?") == true) {
		let userData = {
			firstName: firstName,
			lastName: lastName
		};
		let jsonPayload = JSON.stringify(userData);
		let url = urlBase + '/DeleteContact.' + extension;
		let xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
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
		//let table = document.getElementById("tableBody");
		//table.deleteRow(row);
		refreshContacts();
	}
}

function readContacts() {
	readCookie();
	// Debugging: Log userId to the console
	console.log("User ID:", userId);
	let userData = {
		UserId: userId
	};
	let jsonPayload = JSON.stringify(userData);
	let url = urlBase + '/Read.' + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					// The request has been completed successfully
					console.log("test");
					console.log(xhr.responseText);
					let jsonData = JSON.parse(xhr.responseText);
					console.log(jsonData);
					for (i = 0; i < jsonData.length; i++) {
						addContactRow(jsonData[i].FirstName, jsonData[i].LastName, jsonData[i].Phone, jsonData[i].Email, jsonData[i].ID);
					}
				} else {
					// Oh no! There has been an error with the request!
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		console.log(err);
	}
}

function updateContact(id) {
	let tmpRow = document.getElementById("row" + id);
	let tmpFirst = document.getElementById("first_Name" + id).innerText;
	let tmpLast = document.getElementById("last_Name" + id).innerText;
	let tmpPhone = document.getElementById("phone" + id).innerText;
	let tmpEmail = document.getElementById("email" + id).innerText;
	console.log(tmpFirst);
	tmpRow.innerHTML = "";
	let text = "";
	text += "<td><input id='newFirstName" + id + "' value='" + tmpFirst + "'></input></td>";
	text += "<td><input id='newLastName" + id + "' value='" + tmpLast + "'></input></td>";
	text += "<td><input id='newPhone" + id + "' value='" + tmpPhone + "'></input></td>";
	text += "<td><input id='newEmail" + id + "' value='" + tmpEmail + "'></input></td>";
	text += "<td>" + "<button type='button' class='delBtn' onclick='deleteContact(" + id + ")'>" + "Delete Contact " + id + "</button>"
		+ "<button type='button' class='saveBtn' onclick='saveContact(" + id + ")'>" + "Save Contact " + id + "</button>" + "</td>";
	tmpRow.innerHTML = text;
}

function saveContact(id) {
	console.log("Saved: " + id);
	let savedRow = document.getElementById("row" + id);
	let savedFirst = document.getElementById("newFirstName" + id).value;
	let savedLast = document.getElementById("newLastName" + id).value;
	let savedPhone = document.getElementById("newPhone" + id).value;
	let savedEmail = document.getElementById("newEmail" + id).value;
	savedRow.innerHTML = "";
	let text = "";
	text += "<td id='first_Name" + id + "'><span>" + savedFirst + "</span></td>";
	text += "<td id='last_Name" + id + "'><span>" + savedLast + "</span></td>";
	text += "<td id='phone" + id + "'><span>" + savedPhone + "</span></td>";
	text += "<td id='email" + id + "'><span>" + savedEmail + "</span></td>";
	text += "<td>" + "<button type='button' class='delBtn' onclick='deleteContact(" + id + ")'>" + "Delete Contact " + id + "</button>"
		+ "<button type='button' class='editBtn' onclick='updateContact(" + id + ")'>" + "Edit Contact " + id + "</button>" + "</td>";
	savedRow.innerHTML = text;

	let userData = {
		contactId: id,
		newData: {
			firstName: savedFirst,
			lastName: savedLast,
			phone: savedPhone,
			email: savedEmail
		}
	};

	console.log(userData);
	let jsonPayload = JSON.stringify(userData);
	let url = urlBase + '/UpdateContact.' + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
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
		console.log(err);
	}
}

function searchContacts() {
	tableBody = document.getElementById("tableBody");
	tableBody.innerHTML = "";
	let searchTerm = document.getElementById("searchBar").value;
	let userData = {
		search: searchTerm,
	};
	console.log(searchTerm);
	let jsonPayload = JSON.stringify(userData);
	let url = urlBase + '/Search.' + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				console.log("Searching")
				console.log("UID: " + userId);
				let jsonData = JSON.parse(xhr.responseText);
				console.log(jsonData.results);
				console.log(xhr.responseText);
				for (i = 0; i < jsonData.results.length; i++) {
					console.log("loop entered");
					let jsonUserIDstr = jsonData.results[i].UserID;
					let jsonUserIDint = parseInt(jsonUserIDstr, 10);
					if (userId == jsonUserIDint) {
						addContactRow(jsonData.results[i].FirstName, jsonData.results[i].LastName, jsonData.results[i].Phone, jsonData.results[i].Email, jsonData.results[i].UserID);
					}
				}
			}
		}
	}
	xhr.send(jsonPayload);
}

function refreshContacts() {
	tableBody = document.getElementById("tableBody");
	tableBody.innerHTML = "";
	readContacts();
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
	}, 3680); //  duration of GIF in milliseconds (6.8 seconds)
}

function openProfilePopup() {
	readCookie();
	document.getElementById("profilePopup").style.display = "block";
	// Populate input fields with user information
	document.getElementById("newFirstName").value = firstName;
	document.getElementById("newLastName").value = lastName;
	document.getElementById("newUsername").value = username;
}

// Function to close the profile popup
function closeProfilePopup() {
	document.getElementById("profilePopup").style.display = "none";
}

// Function to update user profile
function updateProfile() {
	readCookie();
	let newFirstNameValue = document.getElementById("newFirstName").value;
	let newLastNameValue = document.getElementById("newLastName").value;
	let newUsernameValue = document.getElementById("newUsername").value;

	// Regular expressions for validation
	let nameRegex = /^[A-Za-z]+$/;
	let usernameRegex = /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;

	if (!newFirstNameValue || !newLastNameValue || !newUsernameValue
		|| !nameRegex.test(newFirstNameValue) || !nameRegex.test(newLastNameValue)
		|| !usernameRegex.test(newUsernameValue)) {

		// Check for empty fields
		if (!firstNameValue) {
			highlightFieldError('newFirstName', 'First Name is required');
		}

		// Check for empty fields
		if (!lastNameValue) {
			highlightFieldError('lastnewLastNameName', 'Last Name is required');
		}

		// Check for empty fields
		if (!newUsernameValue) {
			highlightFieldError('newUsername', 'Username is required');
		}

		// Validate first name
		if (!nameRegex.test(newFirstNameValue)) {
			highlightFieldError('newFirstName', 'First Name can only contain letters');
		}

		// Validate last name
		if (!nameRegex.test(newLastNameValue)) {
			highlightFieldError('newLastName', 'Last Name can only contain letters');
		}

		// Validate username
		if (!usernameRegex.test(newUsernameValue)) {
			highlightFieldError('newUsername', 'Username can only contain letters, numbers, and symbols');
		}
		return;
	}

	let updatedUserData = {
		userId: userId,
		newFirstName: newFirstNameValue,
		newLastName: newLastNameValue,
		newUsername: newUsernameValue
	};

	let jsonPayload = JSON.stringify(updatedUserData);

	let url = urlBase + '/UpdateUser.' + extension;

	let xhr = new XMLHttpRequest();

	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");


	try {
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				//console.log("jsonObject:", jsonObject);
				console.log("xhr.status:", xhr.status);
				if (xhr.status == 200) {
					let jsonObject = JSON.parse(xhr.responseText);
					if (jsonObject.error === "") {
						// Update successful
						firstName = jsonObject.firstName;
						lastName =  jsonObject.lastName;
						username = jsonObject.Username;
						saveCookie();
						updateUserInitials();
						closeProfilePopup();
						document.getElementById("landingPopupBox").innerHTML = "Updated Successfully!";
						document.getElementById("landingPopupBox").classList.remove("hidden");
						setTimeout(function () {
							document.getElementById("landingPopupBox").classList.add("hidden");
						}, 5000);
					} else {
						// Update failed
						document.getElementById("landingPopupBox").innerHTML = jsonObject.error;
						document.getElementById("landingPopupBox").classList.remove("hidden");
					}
				} else {
					// Handle errors during profile update
					document.getElementById("landingPopupBox").innerHTML = "Error during profile update. Please try again later.";
					document.getElementById("landingPopupBox").classList.remove("hidden");
				}
			}
		};
		// Send the JSON payload to the server
		xhr.send(jsonPayload);
	} catch (err) {
		// Handle exceptions
		alert(err.message);
	}
}
