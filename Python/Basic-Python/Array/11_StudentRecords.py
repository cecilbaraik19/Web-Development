from array import*
roll = array('i',[])
marks = array('i',[])
c = 0
print('Enter How many Records......',end='')
s = int(input())
for i in range(0,s):
    print('Enter Roll Number')
    r = int(input())
    roll.append(r)
    print('Enter Marks')
    m = int(input())
    marks.append(m)
    print('----------------------------------')
print('\t Student Details')
print('-------------------------------')
print('Roll No.         Marks')
for i in range(0,s):
    print(roll[i],'\t\t',marks[i])
print('-------------------------------')
print('Enter the Roll No. want to be Search......',end='')
rn = int(input())
for i in range(0,s):
    if roll[i] == rn:
        c=c+1
        print('Marks            :',marks[i])
if c==0:
    print('Given Roll No. NOT Found')