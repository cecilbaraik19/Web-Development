from array import*
arr = array('i',[])
on = 0
en = 0
print('Enter 10 number')
for i in range(0,10):
    print('arr[',i,']=',end='')
    n=int(input())
    arr.append(n)
    print('Array Element')
    for i in range(0,10):
        print(arr[i])
        
        if arr[i]%2==2:
            en+=1
        else:
            on+=1
    print('Total Even Number.:',en)
    print('Total Odd Number.:',on)