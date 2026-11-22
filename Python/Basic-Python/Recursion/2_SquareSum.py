#Sum of First Ten Square Number
def sum_of_ten_square_no(i,s):
    if i<=10:
        print(i*i)
        s=s+i*i
        sum_of_ten_square_no(i+1,s)
    else:
        print("Square of first 10 number:",s)
sum_of_ten_square_no(1,0)