from array import*
arr = array('i',[])
print('Enter 10 Array number')
for i in range(0,10):
    print('arr[',i,']=',end='')
    n = int(input())
    arr.append(n)
print("Array Element")
for i in range(0,10):
    print(arr[i])
print("Array element in Reverse Order")
for i in range(9,-1,-1):
    print(arr[i])
    