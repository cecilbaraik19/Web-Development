def prime_no(n, i, c):
    while i <= n:
        if n % i == 0:
            c = c + 1
        i = i + 1
    return c


print("Enter any number")
n = int(input())

if n > 1:
    c = prime_no(n, 1, 0)
else:
    c = 0

if c == 2:
    print("This is a Prime Number")
else:
    print("This is NOT a Prime Number")