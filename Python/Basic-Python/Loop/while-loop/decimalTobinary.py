bn = 0
a = 1
print("Enter any decimal number")
num = int(input())
n = num 
while n>0:
    d = n%2
    bn = bn+d*a
    a = a*10
    n = n//2
print("Binary number of ", num , " is ",bn)