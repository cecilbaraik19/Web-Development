from array import*
arr = array('i',[])
c=0
first = 0
count = 0
print("Enter Array Size")
s = int(input())
print("Enter Array Element in order")
for i in range(0,s):
    n = int(input())
    arr.append(n)
print("Array Element")
for i in range(0,s):
    print(arr[i])
print("Enter the number want to be search...", end='')
num = int(input())
last = s-1
while first <= last and count == 0:
    mid = (first + last)//2
    if arr[mid]==num:
        count=mid+1
    elif arr[mid]<num:
        first=mid+1
    else:
        last=mid-1
if count > 0:
    print("Given number found ",count, " position")
else:
    print("Given number NOT found")