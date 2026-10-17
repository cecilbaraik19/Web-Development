def countPrime():
    p=0
    c=0
    for n in range(1,101):
        for i in range(1,n+1):
            if n%i==0:
                c=c+1
        if c==2:
            p=p+1
            print(n,end=" ")
        c=0
    return p
print("\n Prime Number between 1 to 100:",countPrime())
            