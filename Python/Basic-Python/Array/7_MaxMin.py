from array import*
arr = array('i',[])
on = 0
en = 0
print("Enter Ten Array Number")
for i in range(0,10):
    print('arr[',i,']=',end='')
    n=int(input())
    arr.append(n)
max = arr[0]
min = arr[0]
print('Array Element')
for i in range(0,10):
    print(arr[i])
    if arr[i]>max:
        max=arr[i]
    if arr[i]<min:
        min=arr[i]
print('Maximum Number   :',max)
print('Minimum Number   :',min)
