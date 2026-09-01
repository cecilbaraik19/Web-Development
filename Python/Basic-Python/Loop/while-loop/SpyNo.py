s = 0
p = 1
print("Enter any number")
num = int(input())
while num > 0:
    d = num%10
    s = s+d
    p = p*d
    num = num//10
if s == p:
    print("This number is SPY number")
else:
    print("This number is NOT spy number")