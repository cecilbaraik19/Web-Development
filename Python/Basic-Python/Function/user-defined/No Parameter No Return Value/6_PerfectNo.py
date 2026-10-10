def is_perfect(n):
    if n < 2:
        return False
    s = 1                      # 1 divides every n >= 2
    i = 2
    while i * i <= n:
        if n % i == 0:
            s += i
            if i != n // i:    # avoid counting a square root twice
                s += n // i
        i += 1
    return s == n


def main():
    n = int(input("Enter any number: "))
    if is_perfect(n):
        print("This is a Perfect Number")
    else:
        print("This is NOT a perfect number")


main()