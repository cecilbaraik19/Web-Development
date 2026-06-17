// Function to display error message
function printError(elemId, hintMsg) {
    document.getElementById(elemId).innerHTML = hintMsg;
}

// Function to validate form
function validateForm() {

    // Retrieving form values
    let name = document.contactForm.name.value.trim();
    let email = document.contactForm.email.value.trim();
    let mobile = document.contactForm.mobile.value.trim();
    let country = document.contactForm.country.value;
    let gender = document.contactForm.gender.value;

    // Hobbies
    let hobbies = [];
    let checkboxes = document.getElementsByName("hobbies[]");

    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            hobbies.push(checkboxes[i].value);
        }
    }

    // Error flags
    let nameErr = true;
    let emailErr = true;
    let mobileErr = true;
    let countryErr = true;
    let genderErr = true;

    // Validate Name
    if (name === "") {
        printError("nameError", "Please Enter Your Name");
    } else {
        let regex = /^[a-zA-Z\s]+$/;

        if (regex.test(name) === false) {
            printError("nameError", "Please Enter a Valid Name");
        } else {
            printError("nameError", "");
            nameErr = false;
        }
    }

    // Validate Email
    if (email === "") {
        printError("emailError", "Please Enter Your Email Address");
    } else {
        let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (regex.test(email) === false) {
            printError("emailError", "Please Enter a Valid Email Address");
        } else {
            printError("emailError", "");
            emailErr = false;
        }
    }

    // Validate Mobile Number
    if (mobile === "") {
        printError("mobileError", "Please Enter Your Mobile Number");
    } else {
        let regex = /^[0-9]{10}$/;

        if (regex.test(mobile) === false) {
            printError("mobileError", "Please Enter a Valid 10-Digit Mobile Number");
        } else {
            printError("mobileError", "");
            mobileErr = false;
        }
    }

    // Validate Country
    if (country === "") {
        printError("countryError", "Please Select a Country");
    } else {
        printError("countryError", "");
        countryErr = false;
    }

    // Validate Gender
    if (gender === "") {
        printError("genderError", "Please Select Your Gender");
    } else {
        printError("genderError", "");
        genderErr = false;
    }

    // Prevent form submission if there are errors
    if (nameErr || emailErr || mobileErr || countryErr || genderErr) {
        return false;
    }

    // Data Preview
    let dataPreview =
        "You have entered the following details:\n\n" +
        "Full Name: " + name + "\n" +
        "Email Address: " + email + "\n" +
        "Mobile Number: " + mobile + "\n" +
        "Country: " + country + "\n" +
        "Gender: " + gender + "\n";

    if (hobbies.length > 0) {
        dataPreview += "Hobbies: " + hobbies.join(", ");
    }

    // Display Preview
    alert(dataPreview);

    return true;
}