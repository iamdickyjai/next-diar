import os

cwd = os.getcwd()

print(cwd)

f = open("{0}/data.json".format(cwd), "w")
f.write('{"name": "Hello there"}')
f.close()
