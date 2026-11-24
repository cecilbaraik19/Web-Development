def table(n,i):
    if i<=10:
        print(n,"x",i,"=",n*i)
        table(n,i+1)
print("Enter any number")
n=int(input())
table(n,1)