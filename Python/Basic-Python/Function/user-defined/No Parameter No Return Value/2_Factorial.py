def disp():
    f=1
    print("Enter any number")
    n=int(input())
    i=n
    while n>0:
        f=f*n
        n=n-1
    print('Factorial of ',i,' is ',f)
disp()