c = 0

print("Enter any Number")
num = int(input())

for i in range(1, num + 1):
    if num % i == 0:
        c = c + 1

if c == 2:
    print("This number is Prime number")
else:
    print("This number is NOT a prime number")