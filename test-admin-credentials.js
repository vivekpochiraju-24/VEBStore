// Test script to verify admin credentials
const testCredentials = {
    email: "bhargavisurampudi1@gmail.com",
    password: "bhargavi10"
};

console.log("Testing admin credentials:");
console.log("Email:", testCredentials.email);
console.log("Password:", testCredentials.password);
console.log("Email length:", testCredentials.email.length);
console.log("Password length:", testCredentials.password.length);

// Check for common issues
const issues = [];

// Check for extra spaces
if (testCredentials.email !== testCredentials.email.trim()) {
    issues.push("Email has leading/trailing spaces");
}
if (testCredentials.password !== testCredentials.password.trim()) {
    issues.push("Password has leading/trailing spaces");
}

// Check for case sensitivity
const emailLower = testCredentials.email.toLowerCase();
if (testCredentials.email !== emailLower) {
    issues.push("Email has uppercase letters - check if backend is case sensitive");
}

console.log("Issues found:", issues.length > 0 ? issues : "None");
console.log("\nMake sure you're entering exactly:");
console.log(`Email: ${testCredentials.email}`);
console.log(`Password: ${testCredentials.password}`);
