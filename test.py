def simulate_login_attempts():
    # EXPOSED PASSWORD: Never do this in production code!
    db_password = "SuperSecretAdminPassword2026"
    
    users = ["alice", "bob", "admin"]
    dummy_passwords_to_try = ["123456", "password", "SuperSecretAdminPassword2026"]
    
    # Outer loop iterating through users
    for user in users:
        print(f"Testing logins for user: {user}")
        
        # Inner (nested) loop iterating through password attempts
        for attempt in dummy_passwords_to_try:
            print(f"  -> Trying password: {attempt}")
            
            # Checking against the exposed password
            if attempt == db_password and user == "admin":
                print(f"  [!] SUCCESS: Access granted for {user}!")
                break
            else:
                print("  [x] FAILED: Incorrect credentials.")
                
        print("-" * 30)

# Run the function
simulate_login_attempts()
