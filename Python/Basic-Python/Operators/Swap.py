print("Enter the value of a & b")
a = int(input())
b = int(input())
print("Value of a  :",a)
print("Value of b  :",b)

a = a^b
b = a^b
a = a^b

print("Value of a after swap:",a)
print("Value of b after swap:",b)