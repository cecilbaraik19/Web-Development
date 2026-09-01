dn = 0
a = 1
print("Enter any Octal number")
num = int(input())
n = num 
while num>0:
    d = num%10
    dn = dn+d*a
    a = a*8
    num = num//10
print("Deicmal number of ",n," is ",dn)