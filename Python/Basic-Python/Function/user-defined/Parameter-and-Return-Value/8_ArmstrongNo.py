
def armstrong_no(n, d, s):
    while n > 0:
        d = n % 10
        s = s + d * d * d
        n = n // 10
    return s

s = 0
d = 0

print("Enter any three digit number")
num = int(input())

result = armstrong_no(num, d, s)

if result == num:
    print("Given number is an Armstrong number")
else:
    print("Given number is NOT an Armstrong number")
