const xlsx = require('xlsx');
const mysql = require('mysql');

// 创建数据库连接
const connection = mysql.createConnection({
  host: '9.134.107.151',
  user: 'root',
  password: 'xuMwn*6829pBfx',
  port: '3306',
  database: 'test'
});

connection.connect(err => {
  if (err) {
    console.error('数据库连接失败:', err.stack);
    return;
  }
  console.log('成功连接到数据库，ID:', connection.threadId);

  // 读取Excel文件
  const workbook = xlsx.readFile('蓝盾读写导入模板.xlsx');
  const sheetName = workbook.SheetNames[0]; // 获取第一个工作表的名字
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = xlsx.utils.sheet_to_json(worksheet); // 将工作表转换为JSON格式

  // 准备插入语句
  const insertDataQuery = `INSERT INTO test (name) VALUES ?`;
  
  // 提取数据准备插入
  const dataToInsert = jsonData.map(row => [row.name]);
  
  // 执行插入操作
  connection.query(insertDataQuery, [dataToInsert], (error, results, fields) => {
    if (error) {
      console.error('数据插入失败:', error.stack);
      return;
    }

    console.log('数据插入成功');
    connection.end(() => {
      console.log('数据库连接已关闭');
    });
  });
});