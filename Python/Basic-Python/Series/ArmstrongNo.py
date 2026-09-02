# Armstrong number between 101 to 999
d = 0
r = 0
print("Armstrong number between 101 to 999")
for i in range(101,1000):
    n=i
    while n>0:
        d=n%10
        r=r+d*d*d
        n=n//10
    if r==i:
        print(i,end=' ')
    r=0