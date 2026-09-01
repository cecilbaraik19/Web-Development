i = 1
sum = 0
print("Enter any number")
num = int(input())
while i<num:
    if num%i==0:
        sum = sum + i
    i = i+1
if sum == num:
    print("Given number is Perfect number")
else:
    print("Given number is NOT perfect number")