def sum_of_odd_no():
    s=0
    for i in range(1,30,2):
        print(i)
        s=s+i
    return s
r = sum_of_odd_no()
print("Sum of ODD numbers from 1 to 30 is : ",r)