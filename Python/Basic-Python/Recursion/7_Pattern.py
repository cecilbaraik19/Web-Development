def disp(i,j):
    if i<=5:
        if j<=i:
            print("*",end="")
            disp(i,j+1)
        else:
            print()
            disp(i+1,1)
disp(1,1)