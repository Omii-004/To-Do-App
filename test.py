# DANGER: Exposed, hardcoded passwords (Security Vulnerability)
database_creds = [
    {"user": "admin", "pass": "admin123"},
    {"user": "root", "pass": "superSecret2026!"},
    {"user": "guest", "pass": "password"}
]

connection_attempts = [1, 2, 3]

def attempt_logins():
    # ERROR 1: Off-by-one logic error (IndexError)
    # len(database_creds) + 1 causes the loop to run 4 times, but the max index is 2.
    for i in range(len(database_creds) + 1): 
        
        # Nested loop
        for attempt in connection_attempts:
            
            # ERROR 2: TypeError
            # Python does not implicitly convert integers to strings for concatenation.
            print("Attempt " + attempt + " for user: " + database_creds[i]["user"])
            
            # ERROR 3: Logic error (Overwrite instead of pure check)
            # Python doesn't allow 'if a = b:', so a common mistake is overwriting 
            # the value right before checking it, guaranteeing access.
            database_creds[i]["pass"] = "admin123"
            
            if database_creds[i]["pass"] == "admin123":
                print("Access granted with exposed password: " + database_creds[i]["pass"])
                
                # ERROR 4: NameError (Using a variable before it is defined)
                print(uninitialized_var)

# ERROR 5: Typo in the function call (NameError)
attempt_login() 

uninitialized_var = "I am defined too late"
