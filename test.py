import requests

# 假设这是你的API请求信息
url = 'YOUR_API_URL'
headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
}

response = requests.get(url, headers=headers)

if response.status_code == 200:
    data = response.json()
    latest_build_num = data.get('latestBuildNum')
    
    if latest_build_num is not None:
        print(f"Latest Build Number: {latest_build_num}")
        # 可以将latest_build_num保存到文件、数据库等
        with open("latest_build_num.txt", "w") as file:
            file.write(str(latest_build_num))
    else:
        print("latestBuildNum not found in the response.")
else:
    print(f"Failed to retrieve data: {response.status_code} - {response.text}")