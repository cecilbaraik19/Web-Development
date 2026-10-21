def sum_of_three_digits(a,b,c):
    d=a+b+c
    return d
print("Enter any three digits number")
n=int(input())
a=n%10
n=n//10
b=n%10
n=n//10
c=n%10
d=a+b+c
print("Sum of three digit number is ",c,'+',b,'+',a,'=',d)