from array import*
arr = array('i',[])
print('Enter Array Size')
s = int(input())
print('Enter Array Element')
for i in range(0,s):
    print('arr[',i,']=',end=' ')
    n = int(input())
    arr.append(n)
print("Array Element")
for i in range(0,s):
    print(arr[i])