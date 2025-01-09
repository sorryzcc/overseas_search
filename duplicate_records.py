import pandas as pd

def clean_id_column(df, column):
    # 清理指定列中的数据，去除前后空白并统一转换为小写字符串
    df[column] = df[column].astype(str).str.strip().str.lower()
    return df

def find_missing_records(client_df, template_df, merge_columns):
    # 确保所有需要的列都在两个DataFrame中存在，并且转换为相同的列名
    for col in merge_columns:
        if f"{col}({col})" in client_df.columns:
            client_df.rename(columns={f"{col}({col})": col}, inplace=True)
        if col not in template_df.columns:
            raise KeyError(f"Column '{col}' is missing in the template DataFrame.")

    # 清理合并键列的数据
    for col in merge_columns:
        client_df = clean_id_column(client_df, col)
        template_df = clean_id_column(template_df, col)

    # 打印用于对比的列的唯一值数量和前几个值
    print("Unique values count in ClientText 'ID2':", client_df[merge_columns[0]].nunique())
    print("First few values in ClientText 'ID2':\n", client_df[merge_columns[0]].head())

    print("Unique values count in Template 'ID2':", template_df[merge_columns[0]].nunique())
    print("First few values in Template 'ID2':\n", template_df[merge_columns[0]].head())

    # 检查 ID2 的重复情况
    print("Duplicate counts in ClientText 'ID2':")
    print(client_df[merge_columns[0]].duplicated().value_counts())
    
    print("Duplicate counts in Template 'ID2':")
    print(template_df[merge_columns[0]].duplicated().value_counts())

    # 找出在模板中但不在ClientText中的记录
    missing_records = template_df[~template_df[merge_columns[0]].isin(client_df[merge_columns[0]])]

    # 查找模板中重复的记录
    duplicate_records = template_df[template_df[merge_columns[0]].duplicated(keep=False)]

    return missing_records, duplicate_records

# 读取Excel文件
client_text_path = 'ClientText.xlsx'
overseas_template_path = '海外_文本申请表导入模板.xlsx'

client_df = pd.read_excel(client_text_path)
template_df = pd.read_excel(overseas_template_path)

# 打印表格的行数
print(f"ClientText rows: {len(client_df)}")
print(f"Overseas Template rows: {len(template_df)}")

# 打印DataFrame的列名，检查是否存在'_id'或'ID2'列
print("ClientText columns:", client_df.columns.tolist())
print("Overseas Template columns:", template_df.columns.tolist())

# 根据打印出来的列名，确定用于比较的列名
merge_columns = ['ID2']  # 使用 ID2 作为唯一标识符

try:
    # 查找缺少的数据和重复的记录
    missing_records, duplicate_records = find_missing_records(client_df, template_df, merge_columns)

    # 输出缺少的前三条记录
    if not missing_records.empty:
        print("Missing records in ClientText compared to Overseas Template:")
        print(missing_records.head(3))
    else:
        print("No missing records found after cleaning data and checking duplicates.")

    # 输出模板中的重复记录
    if not duplicate_records.empty:
        print("Duplicate records in Overseas Template:")
        print(duplicate_records.head(3))

    # 如果需要保存结果到新的Excel文件中，可以使用以下代码
    if not missing_records.empty:
        missing_records.to_excel('missing_records.xlsx', index=False)
    if not duplicate_records.empty:
        duplicate_records.to_excel('duplicate_records.xlsx', index=False)

except KeyError as e:
    print(e)
    print("请检查您的Excel文件和列名是否匹配。")