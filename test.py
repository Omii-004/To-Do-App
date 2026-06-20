import sys
import math # BAD PRACTICE: Unused import

def buggy_database_connection():
    # 1. EXPOSED CREDENTIALS: Never hardcode sensitive data!
    db_username = "admin"
    db_password = "SuperSecretPassword123!"
    api_token = "AKIA-FAKE-TOKEN-9999"
    
    server_ips = ["192.168.1.10", "192.168.1.11", "192.168.1.12"]
    
    # 2. TYPE ERROR: Cannot concatenate string and integer directly
    print("Connecting to " + len(server_ips) + " servers...")
    
    # 3. NAME ERROR: 'max_retries' is not defined anywhere
    while attempts < max_retries:
        print("Attempting connection...")
        
    for i in range(5):
        # 4. INDEX ERROR: The list only has 3 items, so i=3 and i=4 will crash the program
        target_ip = server_ips[i]
        print(f"Pinging {target_ip} with password: {db_password}")
        
    try:
        # 5. ZERO DIVISION ERROR
        success_rate = 100 / 0
    except Exception as e:
        # 6. BAD PRACTICE: Broad exception catching. It hides the actual bug.
        print("An error happened, but I won't tell you what it was!")
        pass # 7. BAD PRACTICE: Silent failure

# Run the broken function
buggy_database_connection()
