from array import*

arr = array('i',[12,32,56,45,28,98,54,34,65,78])
print("Array Element    :",arr)
l = len(arr)
print("Length of Array      :",l)
print("Array Element")
for i in range(0,1):
    print(arr[i])
print("Array Element")
for i in arr:
    print(i)
print("Max Element      :",max(arr))
print("Min Element      :",min(arr))
print("Total Element    :",sum(arr))
