const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// 文件夹路径和输出文件路径
const folderPath = path.join(__dirname, 'MsbtPlain'); // 存放txt文件的文件夹路径
const outputFilePath = path.join(__dirname, 'readDirectory.xlsx'); // 输出Excel文件路径

// 正则表达式用于匹配键值对，确保键以"Shop-"或类似的特定格式开头
const keyValuePairRegex = /^([A-Za-z_\-][A-Za-z0-9_\-\.]*)\s*=\s*(.*)/m;

// 最大允许的字符数
const MAX_CHARACTERS = 32767;

function parseKeyValuePairs(content) {
    let keyValuePairs = new Map();
    let lines = content.split('\n');
    let currentKey = null;
    let currentValue = '';

    for (let line of lines) {
        line = line.trim();

        if (!line || line.startsWith('#')) continue; // 忽略空行和注释行

        const match = keyValuePairRegex.exec(line);
        if (match) {
            if (currentKey !== null) {
                finalizeKeyValuePair(keyValuePairs, currentKey, currentValue);
            }
            [_, currentKey, currentValue] = match;
        } else if (currentKey !== null) {
            // 如果当前行不是以等号开头，则认为是上一行值的延续
            currentValue += '\n' + line.trim();
        } else {
            console.warn(`Unexpected line format: ${line}`);
        }
    }

    // 处理最后一个键值对
    if (currentKey !== null) {
        finalizeKeyValuePair(keyValuePairs, currentKey, currentValue);
    }

    return keyValuePairs;
}

function finalizeKeyValuePair(keyValuePairs, key, value) {
    // 检查并截断过长的值
    if (value.length > MAX_CHARACTERS) {
        console.warn(`Value for key ${key} is too long and will be truncated.`);
        value = value.slice(0, MAX_CHARACTERS);
    }

    keyValuePairs.set(key.trim(), value.trim());
}

function processFiles() {
    try {
        const files = fs.readdirSync(folderPath).filter(file => path.extname(file).toLowerCase() === '.txt');
        const fileContents = files.map(file => ({
            name: path.basename(file, '.txt'),
            pairs: parseKeyValuePairs(fs.readFileSync(path.join(folderPath, file), { encoding: 'utf8' }))
        }));

        // 获取所有唯一的键
        const allKeys = Array.from(new Set(fileContents.flatMap(({ pairs }) => [...pairs.keys()])));

        // 创建工作表数据
        const worksheetData = [['Key', ...files.map(file => path.basename(file, '.txt'))]];

        // 填充工作表数据
        allKeys.forEach(key => {
            const row = [key];
            fileContents.forEach(({ name, pairs }) => {
                row.push(pairs.has(key) ? pairs.get(key) : '');
            });
            worksheetData.push(row);
        });

        // 创建工作表
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

        // 创建工作簿并添加工作表
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Combined Data');

        // 写入文件
        try {
            XLSX.writeFile(workbook, outputFilePath);
            console.log(`Finished processing all files and saved to ${outputFilePath}.`);
        } catch (err) {
            console.error('Error writing Excel file:', err);
        }
    } catch (err) {
        console.error('Error reading directory or processing files:', err);
    }
}

processFiles();