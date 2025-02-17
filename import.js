async (postData) => {
  // 定义需要选取的字段（如果适用）
  const fieldsToPick = ['ID2', 'Simp_TIMI_Status', 'TextChangeTag']; // 示例，根据实际情况修改

  const createPromises = postData.Sheet1.map(async (item) => {
    // 使用$utils.pick选择特定字段（如果仅提交部分字段）
    const filteredData = $utils.pick(item, fieldsToPick); // 或者直接使用 item 如果提交所有字段
    
    // 调用create接口
    const { body } = await source.$requests.create({
      body: filteredData,
    });

    // 处理接口的返回结果
    if (body.code === 0) {
      if (typeof body.data === 'object') {
        // 假设返回的数据中包含ID2作为唯一标识符
        const index = source.listData.findIndex(existingItem => existingItem.ID2 === body.data.ID2);
        if (index !== -1) {
          // 更新已有的数据
          source.listData.splice(index, 1, body.data);
        } else {
          // 添加新的数据
          source.listData.push(body.data);
        }
      }
      $tips.success({
        content: `创建成功: ${body.data.ID2}`,
      });
    } else {
      $tips.error({
        content: body.message || `创建失败，请检查输入的数据: ${item.ID2}`,
      });
    }

    return body;
  });

  // 等待所有创建请求完成
  const results = await Promise.all(createPromises);

  return results;
}