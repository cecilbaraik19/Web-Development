
def temp(f):
    c = (f - 32) * 5 / 9
    return c

print("Enter the temperature in Fahrenheit:")
f = float(input())

c = temp(f)

print("Temperature in Celsius:", c)
