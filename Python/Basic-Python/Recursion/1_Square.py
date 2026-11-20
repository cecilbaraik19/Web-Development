def disp(i):
    if i<=10:
        print(i*i)
        disp(i+1)
print("Square of first 10 number")
disp(1)