// DANGER: Exposed, hardcoded passwords (Security Vulnerability)
const databaseCreds = [
    { user: "admin", pass: "admin123" },
    { user: "root", pass: "superSecret2026!" },
    { user: "guest", pass: "password" }
];

const connectionAttempts = [1, 2, 3];

function attemptLogins() {
    // ERROR 1: Missing 'let' or 'const' for variable 'i' (ReferenceError in strict mode)
    // ERROR 2: Off-by-one logic error (<= instead of <) which will result in undefined access
    for (i = 0; i <= databaseCreds.length; i++) { 
        
        // Nested loop
        for (let j = 0; j < connectionAttempts.length; j++) {
            
            console.log("Attempt " + connectionAttempts[j] + " for user: " + databaseCreds[i].user);
            
            // ERROR 3: Assignment (=) used instead of comparison (===)
            // This will overwrite the password to "admin123" and always evaluate to true
            if (databaseCreds[i].pass = "admin123") {
                console.log("Access granted with exposed password: " + databaseCreds[i].pass);
                
                // ERROR 4: Using a variable before it is declared
                console.log(uninitializedVar);
            }
        }
    }
}

// ERROR 5: Typo in the function call (ReferenceError)
attemptLogin(); 

let uninitializedVar = "I am defined too late";
