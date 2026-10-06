def disp():
    i=1
    c=0
    print("Enter any number")
    n=int(input())
    while i<=n:
        if n%i==0:
            c=c+1
        i=i+1
    if c==2:
        print("This is a Prime Number")
    else:
        print("This is NOT a Prime Number")
disp()