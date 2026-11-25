def fact(n):
    if n==1:
        return 1
    else:
        return n*fact(n-1)
print("Enter any number:")
n = int(input())
f = fact(n)
print("Factorial of ",n, " is ",f)