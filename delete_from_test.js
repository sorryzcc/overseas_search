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

  // 执行删除操作
  connection.query('DELETE FROM test', (deleteErr, deleteResult) => {
    if (deleteErr) {
      console.error('删除操作失败:', deleteErr.stack);
    } else {
      console.log('删除成功:', deleteResult.affectedRows, '行受到影响');
    }

    // 关闭数据库连接
    connection.end(() => {
      console.log('数据库连接已关闭');
    });
  });
});