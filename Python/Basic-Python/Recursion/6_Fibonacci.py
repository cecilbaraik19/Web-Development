def fibonacci_series(a,b,n):
    if n>=1:
        c=a+b
        print(c,end=" ")
        a=b
        b=c
        fibonacci_series(a,b,n-1)
print("Enter Term")
n=int(input())
fibonacci_series(-1,1,n)