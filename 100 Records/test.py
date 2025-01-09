import pandas as pd

def clean_id_column(df, column):
    """
    清理指定列中的数据，去除前后空白、统一转换为小写字符串，并处理缺失值。
    """
    df[column] = df[column].astype(str).str.strip().str.lower()
    df[column] = df[column].replace(r'^\s*$', 'nan', regex=True)  # 将空字符串替换为'nan'
    df[column] = df[column].replace('nan', pd.NA)                 # 使用pd.NA表示缺失值
    return df

def find_extra_rows(df_large, df_small, merge_column):
    """
    查找df_large中有但df_small中没有的记录。
    """
    # 清洗合并键的数据
    for df in [df_large, df_small]:
        df = clean_id_column(df, merge_column)

    # 找出df_large中有但df_small中没有的记录
    extra_rows = df_large[~df_large[merge_column].isin(df_small[merge_column])]
    
    return extra_rows

def check_duplicates(df, merge_column):
    """
    检查并报告给定DataFrame中基于merge_column的重复记录。
    """
    duplicate_keys = df[df.duplicated(subset=[merge_column], keep=False)]
    if not duplicate_keys.empty:
        print("Duplicate records based on '{}':".format(merge_column))
        print(duplicate_keys)
        duplicate_keys.to_excel('duplicate_records.xlsx', index=False)
    else:
        print("No duplicate records found based on '{}'.".format(merge_column))

# 主程序开始
if __name__ == "__main__":
    # 读取Excel文件
    client_text_path = 'multi_language3.xlsx'
    overseas_template_path = '海外_查询导入模板.xlsx'

    try:
        client_df = pd.read_excel(client_text_path)
        template_df = pd.read_excel(overseas_template_path)

        # 根据实际情况选择正确的列名作为合并键
        merge_column = 'Key'  # 如果使用'随机ID'，请相应更改

        # 检查并报告重复记录
        print("\nChecking duplicates in ClientText:")
        check_duplicates(client_df, merge_column)

        print("\nChecking duplicates in Template:")
        check_duplicates(template_df, merge_column)

        # 查找额外的记录
        extra_rows = find_extra_rows(client_df, template_df, merge_column)

        # 验证是否正好多了100行
        print(f"\n注意：找到的额外行数不是100，而是 {len(extra_rows)}")

        # 输出额外的行到新的 Excel 文件或打印出来
        if not extra_rows.empty:
            extra_rows.to_excel('extra_100_rows.xlsx', index=False)
            print("Extra rows found and saved to 'extra_100_rows.xlsx'.")
            print(extra_rows.head())
        else:
            print("No extra rows found after cleaning data.")

        # 打印用于对比的列的唯一值数量和前几个值
        print("\nChecking unique values and first few values:")
        print("Unique values count in ClientText '{}': {}".format(merge_column, client_df[merge_column].nunique()))
        print("First few values in ClientText '{}':\n{}".format(merge_column, client_df[merge_column].head()))

        print("Unique values count in Template '{}': {}".format(merge_column, template_df[merge_column].nunique()))
        print("First few values in Template '{}':\n{}".format(merge_column, template_df[merge_column].head()))

    except KeyError as e:
        print(e)
        print("请检查您的Excel文件和列名是否匹配。")
    except Exception as e:
        print(f"发生了一个错误: {e}")