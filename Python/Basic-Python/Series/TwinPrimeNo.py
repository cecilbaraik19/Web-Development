a = 2

print("Twin Prime Numbers between 1 to 100")

for n in range(2, 101):
    c = 0

    for i in range(1, n + 1):
        if n % i == 0:
            c = c + 1

    if c == 2:
        if n - a == 2:
            print('(', a, ',', n, ')', end=' ')

        a = n