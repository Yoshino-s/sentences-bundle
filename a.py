import requests
l = set()
while True:
    r = requests.get("https://v1.alapi.cn/api/dog", params={"format":"text"}).text
    if not r in l:
        l.add(r)
        print(r)