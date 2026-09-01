# Accept 10 numbers from user and display maximum numbers
i = 2
print("Enter 10 marks")
num = int(input())
max = num
while i <= 10:
    num = int(input())
    if num>max:
        max = num
    i = i+1
print("Maximum number from 10 marks is :",max)