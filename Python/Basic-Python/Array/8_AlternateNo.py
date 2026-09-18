from array import*
arr = array('i',[])
print('Enter 10 Array number')
for i in range(0,10):
    n = int(input())
    arr.append(n)
print("Alternate Element")
for i in range(0,10,2):
    print(arr[i])
    