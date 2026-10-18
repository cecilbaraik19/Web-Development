def Palimdrome_No():
    d=0
    r=0
    p=0
    for i in range(101,200):
        n=i
        while n>0:
            d=n%10
            r=r*10+d
            n=n//10
        if r==i:
            print(i)
            p=p+i
        r=0
    return p
p= Palimdrome_No()
print("Palindrome number from 101 to 200:",p)