
def temp(c):
    f = c * 9/5 + 32
    return f

print("Enter the temperature in Celsius:")
c = float(input())

f = temp(c)

print("Temperature in Fahrenheit:", f)
