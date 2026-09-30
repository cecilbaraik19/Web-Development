def disp():
    rev=0
    print("Enter any number")
    n=int(input())
    while n>0:
        d=n%10
        rev=rev*10+d
        n=n//10
    print('Reverse number   :',rev)
disp()