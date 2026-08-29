rev = 0
print("Enter any number")
num = int(input())
n = num
while n>0:
    d = n%10
    rev = rev*10+d
    n = n//10
print("Reverse No. :",rev)
if num == rev:
    print("This is a Palindrome number")
else:
    print("This is NOT a Palindrome number")