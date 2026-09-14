from array import*
arr = array('i',[])
print('Enter Ten Array Number')
for i in range(0,10):
    print('arr[',i,']= ',end='')
    n = int(input())
    arr.append(n)
print('Odd number')
for i in range(0,10,2):
    print(arr[i])