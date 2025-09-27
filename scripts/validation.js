export function validateUsername (
	username,
	errors,
) {
	let valid = true;

	if (username.length < 5 || username.length > 15) {
		errors.username = "Username must be between 5 & 15 characters in length";
		valid = false;
	} else {
		if (!/^[A-Za-z0-9._-]+$/.test(username)) {
			errors.username = "Username can only contain letters, numbers, periods, underscores, and hyphens";
			valid = false;
		}
	}
	
	return valid;
}

export function validatePassword (
	password,
	confirmPassword,
	errors,
) {
	let valid = true;
	
	if (password.length < 8) {
		errors.password = "Password must be longer than 8 characters";
		valid = false;
	} else {
		if (confirmPassword !== password) {
			errors.confirmPassword = "Passwords must match";
			valid = false;
		}
	}
	
	return valid;
}