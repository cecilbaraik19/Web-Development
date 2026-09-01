i = 1
sum = 0
print("Enter any number")
num = int(input())
while i<num:
    if i*i == num:
        sum = 1
        break
    i = i+1
if sum == 1:
    print("Given number is Perfect Square number")
else:
    print("Given number is NOT perfect square number")
        