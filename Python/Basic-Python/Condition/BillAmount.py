mr = 100
print("Enter No. of Call")
nc = int(input())
if nc >= 1 and nc <= 200: bill = mr
elif nc >= 201 and nc <= 300:
    bill = (nc-200)*.50+mr
elif nc >= 301 and nc <= 400:
    bill = (nc-200-100)*.75+50+mr
elif nc >= 401 and nc <= 500:
    bill = (nc-200-100-100)*.1+75+50+mr
elif nc > 500:
    bill = (nc-200-100-100-100)*1.50+100+75+50+mr

print("----------------------------------")
print("Bill Amount          :",bill)
print("----------------------------------")