async (postData) => {
  // 确保 postData.Sheet1 存在并且是一个数组
  if (!Array.isArray(postData.Sheet1)) {
    console.error("Expected postData.Sheet1 to be an array, but got:", typeof postData.Sheet1);
    throw new Error("Invalid input data type for Sheet1");
  }

  // 定义表头与字段名的映射关系
  const headers = [
    "ID", "审核备注", "TextChangeTag", "SubKey", "PO", "InGameKey",
    "Origin", "MsKey", "MsSource", "Used", "MsStatus", "Version",
    "Region", "Platform", "Context", "Style", "Note", "KeyAttributes", "Branch"
  ];

  // 将二维数组转换为对象列表
  const records = postData.Sheet1.slice(1).map(row => {
    let record = {};
    row.forEach((value, index) => {
      record[headers[index]] = value;
    });
    return record;
  });

  // 定义需要选取的所有字段，确保它们对应于数据库表中的字段
  const fieldsToInclude = [
    'ID', 'TextChangeTag', 'SubKey', 'PO', 'InGameKey',
    'Origin', 'MsKey', 'MsSource', 'Used', 'MsStatus',
    'Version', 'Region', 'Platform', 'Context',
    'Style', 'Note', 'KeyAttributes', 'Branch'
  ];

  const createPromises = records.map(async (item) => {
    // 使用$utils.pick选择特定字段，确保只包含指定的字段
    const filteredData = $utils.pick(item, fieldsToInclude);

    // 调用create接口
    const { body } = await source.$requests.create({
      body: filteredData,
    });

    // 处理接口的返回结果
    if (body.code === 0 && typeof body.data === 'object') {
      // 假设返回的数据中包含ID作为唯一标识符
      const index = source.listData.findIndex(existingItem => existingItem.ID === item.ID);

      if (index !== -1) {
        // 更新已有的数据
        source.listData.splice(index, 1, body.data);
      } else {
        // 添加新的数据
        source.listData.push(body.data);
      }

      // 成功提示信息，显示具体的ID和其他关键信息
      $tips.success({
        content: `创建成功: ID=${item.ID}, TextChangeTag=${item.TextChangeTag}, SubKey=${item.SubKey}`,
      });
    } else {
      // 错误提示信息，如果创建失败
      $tips.error({
        content: body.message || `创建失败，请检查输入的数据: ID=${item.ID}`,
      });
    }

    return body;
  });

  // 等待所有创建请求完成
  const results = await Promise.all(createPromises);

  return results;
}