# Maximum number from ten number
i = 2
print("Enter Ten Numbers")
num = int(input())
max = num
for i in range(1,11):
    num = int(input())
    
    if num > max:
        max = num
print("Maximum no. from ten numbers is :",max)