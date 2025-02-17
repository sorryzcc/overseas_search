import requests
import json  # 确保导入json模块

# 确保使用了完整的URL
url = 'https://devops.apigw.o.woa.com/prod/v4/apigw-user/projects/pmgame/build_detail'
params = {
    'buildId': 'b-70ffa6a28bd143c589e99367cc48e40e',
    'pipelineId': 'p-d23f990367e64c5e8069d7634fe17175'
}
headers = {
    'Content-Type': 'application/json',
    'X-Bkapi-Authorization': '{"access_token":"EVgipDAoFliOrzP2ZSefGX03MEzPjX"}'
}

response = requests.get(url, headers=headers, params=params)

if response.status_code == 200:
    data = response.json()
    # 打印整个响应内容以供检查
    print(json.dumps(data, indent=4))  # 使用json.dumps格式化输出
    
    # 假设latestBuildNum在data键下
    latest_build_num = data.get('data', {}).get('latestBuildNum')
    
    if latest_build_num is not None:
        print(f"Latest Build Number: {latest_build_num}")
        # 可以将latest_build_num保存到文件、数据库等
        with open("latest_build_num.txt", "w") as file:
            file.write(str(latest_build_num))
    else:
        print("latestBuildNum not found in the response.")
else:
    print(f"Failed to retrieve data: {response.status_code} - {response.text}")