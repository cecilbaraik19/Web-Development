print("Enter Marks")
marks = int(input())
if marks >= 65 and marks <= 100:
    if marks >= 85:
        print("Eligible for Sc. Comm. ,& Arts")
    elif marks >= 75:
        print("Eligible for Comm. , & Arts")
    else:
        print("Eligible for Arts")
else:
    if marks >= 55 and marks < 65:
        print("Wait for 2nd Round")
    else:
        print("Try Again")