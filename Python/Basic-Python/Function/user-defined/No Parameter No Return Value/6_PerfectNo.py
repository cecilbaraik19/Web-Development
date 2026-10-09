def disp():
    i=1
    s=0
    print("Enter any number")
    n=int(input())
    while i<n:
        if n%i==0:
            s=s+i
        i=i+1
    if s==n:
        print("This is a Perfect Number")
    else:
        print("This is NOT a perfect number")