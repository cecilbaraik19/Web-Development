# Prime number from 1 to 100

print("Prime numbers between 1 to 100:")

for n in range(1, 101):
    c = 0

    for i in range(1, n + 1):
        if n % i == 0:
            c = c + 1

    if c == 2:
        print(n, end=' ')