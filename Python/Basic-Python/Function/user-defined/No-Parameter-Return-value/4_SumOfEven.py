def sum_of_even_no():
    s=0
    for i in range(100,70,-2):
        print(i)
        s=s+i
    return s
r = sum_of_even_no()
print("Sum of EVEN numbers from 100 to 70 is : ",r)