from array import*
arr = array('i',[])
c=0
print("Enter Array Size")
s = int(input())
print("Enter Array Element")
for i in range(0,s):
    n = int(input())
    arr.append(n)
print("Array Element")
for i in range(0,s):
    print(arr[i])
print("Enter the number want to search....",end='')
num = int(input())
for i in range(0,s):
    if arr[i]==num:
        print("Position     :",(i+1))
        c=c+1
if c>0:
    print("Given number found ",c, " time")
else:
    print("Given number NOT found")