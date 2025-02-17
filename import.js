async (postData) => {
    const createPromises = postData.Sheet1.map(async (item) => {
      // 这里假设只需要提交某些字段，例如只提交'key1', 'key2'
      // 如果需要提交所有字段，则可以直接使用item
      const filteredData = $utils.pick(item, ['key1', 'key2']); // 根据实际需要选择字段
  
      // 调用create接口
      const { body } = await source.$requests.create({
        body: filteredData,
      });
  
      // 处理接口的返回结果
      if (body.code === 0) {
        // 如果接口有返回数据就进行回写
        if (typeof body.data === 'object') {
          const index = source.listData.findIndex(existingItem => existingItem.ID2 === item.ID2); // 假设ID2是唯一标识符
          if (index !== -1) {
            source.listData.splice(index, 1, body.data);
          } else {async (postData) => {
            const createPromises = postData.Sheet1.map(async (item) => {
              // 这里假设只需要提交某些字段，例如只提交'key1', 'key2'
              // 如果需要提交所有字段，则可以直接使用item
              const filteredData = $utils.pick(item, ['key1', 'key2']); // 根据实际需要选择字段
          
              // 调用create接口
              const { body } = await source.$requests.create({
                body: filteredData,
              });
          
              // 处理接口的返回结果
              if (body.code === 0) {
                // 如果接口有返回数据就进行回写
                if (typeof body.data === 'object') {
                  const index = source.listData.findIndex(existingItem => existingItem.ID2 === item.ID2); // 假设ID2是唯一标识符
                  if (index !== -1) {
                    source.listData.splice(index, 1, body.data);
                  } else {
                    // 如果找不到匹配项，则添加新的数据到列表
                    source.listData.push(body.data);
                  }
                }
                $tips.success({
                  content: `创建成功: ${item.ID2}`,
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
            // 如果找不到匹配项，则添加新的数据到列表
            source.listData.push(body.data);
          }
        }
        $tips.success({
          content: `创建成功: ${item.ID2}`,
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