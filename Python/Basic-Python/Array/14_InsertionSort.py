from array import*
arr = array('i',[])
print('Enter Array Size')
s = int(input())
print('Enter Array Element')
for i in range(0,s):
    n = int(input())
    arr.append(n)
print('Array Element')
for i in range(0,s):
    print(arr[i])
for i in range(1,s):
    temp = arr[i]
    j=i-1
    while temp<arr[j] and j>=0:
        arr[j+1]=arr[j]
        j=j-1
    arr[j+1]=temp
print("Data after sorting")
for i in range(0,s):
    print(arr[i])