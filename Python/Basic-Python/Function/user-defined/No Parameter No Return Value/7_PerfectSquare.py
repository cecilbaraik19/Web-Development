def disp():
    i = 1
    s = 0
    print("Enter any number")
    n = int(input())
    while i * i <= n:
        if i * i == n:
            s = 1
            break
        i = i + 1
    if s == 1:
        print("This is Perfect Square Number")
    else:
        print("This is NOT a perfect Square Number")

disp()