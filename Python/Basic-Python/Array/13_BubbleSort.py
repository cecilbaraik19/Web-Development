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
for i in range(0,s-1):
    for j in range(0,s-1-i):
        if arr[j]>arr[j+1]:
            temp = arr[j]
            arr[j] = arr[j+1]
            arr[j+1] = temp
print("Data after sorting")
for i in range(0,s):
    print(arr[i])