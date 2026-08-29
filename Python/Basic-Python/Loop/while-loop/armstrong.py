sum = 0
print("Enter any three digit number")
num = int(input())
n = num
while n>0:
    d = n%10
    sum = sum + d*d*d
    n = n//10
if sum == num:
    print("This is a Armstrong number")
else:
    print("This is NOT a Armstrong number")