dn = 0
a = 1
print("Enter any Binary Number")
num = int(input())
n = num 
while n>0:
    d = n%10
    dn = dn + d*a
    a = a*2
    n = n//10
print("Decimal number of ",num, " is ",dn)