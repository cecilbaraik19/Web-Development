# Number divisible by 5 and 7

print("Enter any Number")
num = int(input())
if num%5 == 0 and num%7 == 0:
    print("Number is divisible by 5 and 7")
elif num%5 == 0:
    print("Number is divisible by 5 NOT 7")
elif num%7 == 0:
    print("Number is divisible by 7 NOT 5")
else:
    print("Number is NOT divisible by 5 and 7")