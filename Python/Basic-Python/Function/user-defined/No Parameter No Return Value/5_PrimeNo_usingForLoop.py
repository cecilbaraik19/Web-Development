def disp():

    c = 0

    print("Enter any Number")
    n = int(input())

    for i in range(1, n + 1):
        if n % i == 0:
            c = c + 1

    if c == 2:
        print("This is a Prime Number")
    else:
        print("This is NOT a Prime Number")


disp()