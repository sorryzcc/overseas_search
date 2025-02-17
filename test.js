const fs = require('fs');
const path = require('path');

// 构建文件路径
const filePath = path.join(__dirname, 'test.json');

async function readJsonFile() {
  try {
    // 异步读取文件内容
    const data = await fs.promises.readFile(filePath, 'utf8');
    
    // 解析JSON数据
    const jsonData = JSON.parse(data);
    
    console.log(jsonData.map(item => 
        item.id)
    );
  } catch (err) {
    console.error('Error reading or parsing the JSON file:', err);
  }
}

// 调用函数
readJsonFile();