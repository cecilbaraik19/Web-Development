r=0
for i in range(101,1000):
    n=i
    while n>0:
        d=n%10
        r=r*10+d
        n=n//10
    if r==i:
        print(i,end=' ')
    r=0