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
    for j in range(i+1,s):
        if arr[i]>arr[j]:
            temp = arr[i]
            arr[i] = arr[j]
            arr[j] = temp
print("Data after sorting")
for i in range(0,s):
    print(arr[i])