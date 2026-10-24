
def pal(n):
    r = 0

    while n > 0:
        d = n % 10
        r = r * 10 + d
        n = n // 10

    return r


print("Enter any number:")
num = int(input())

r = pal(num)

print("Reverse Number:", r)

if r == num:
    print("This is a Palindrome number")
else:
    print("This is NOT a Palindrome number")
