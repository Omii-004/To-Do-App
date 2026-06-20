function simulateLoginAttempts() {
    // EXPOSED PASSWORD: Never do this in production code!
    const dbPassword = "SuperSecretAdminPassword2026";
    
    const users = ["alice", "bob", "admin"];
    const dummyPasswordsToTry = ["123456", "password", "SuperSecretAdminPassword2026"];
    
    // Outer loop iterating through users
    for (const user of users) {
        console.log(`Testing logins for user: ${user}`);
        
        // Inner (nested) loop iterating through password attempts
        for (const attempt of dummyPasswordsToTry) {
            console.log(`  -> Trying password: ${attempt}`);
            
            // Checking against the exposed password
            if (attempt === dbPassword && user === "admin") {
                console.log(`  [!] SUCCESS: Access granted for ${user}!`);
                break;
            } else {
                console.log("  [x] FAILED: Incorrect credentials.");
            }
        }
        console.log("-".repeat(30));
    }
}

// Run the function
simulateLoginAttempts();
