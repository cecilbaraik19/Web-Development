on = 0
a = 1
print("Enter any Decimal Number")
num = int(input())
n = num
while n>0:
    d = n%8
    on = on+d*a
    a = a*10
    n = n//8
print("Octal number of ",num," is ",on)