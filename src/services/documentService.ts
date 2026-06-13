import * as fs from 'fs';
import * as path from 'path';
import { format, formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

/**
 * 文档管理服务
 */
export class DocumentService {
  private baseDir: string;

  constructor(outputDir: string = 'docs') {
    this.baseDir = outputDir;
    this.ensureOutputDir();
  }

  /**
   * 确保输出目录存在
   */
  private ensureOutputDir(): void {
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }

    const historyDir = path.join(this.baseDir, 'history');
    if (!fs.existsSync(historyDir)) {
      fs.mkdirSync(historyDir, { recursive: true });
    }
  }

  /**
   * 保存文档
   */
  saveDocument(filename: string, content: string): string {
    const filePath = path.join(this.baseDir, filename);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(\`📄 文档已保存：\${filename}\`);
    return filePath;
  }

  /**
   * 保存带有时间戳的历史版本
   */
  saveHistory(filename: string, content: string, producerKey?: string): void {
    const timestamp = format(new Date(), 'yyyyMMdd-HHmmss');
    const baseName = path.parse(filename).name;
    const ext = path.parse(filename).ext;
    
    // 生成历史文件名
    let historyFilename;
    if (producerKey) {
      // 如果有 producerKey，使用它来组织历史
      historyFilename = \`\${baseName}-\${producerKey}-\${timestamp}\${ext}\`;
    } else {
      historyFilename = \`\${filenameatescriptor}-${timestamp}\${ext}\`;
    }

    const historyPath = path.join(this.baseDir, 'history', historyFilename);
    fs.writeFileSync(historyPath, content, 'utf-8');
    console.log(\`📦 历史版本已保存：\${historyFilename}\`);
  }

  /**
   * 获取历史版本列表
   */
  getHistoryFiles(): string[] {
    const historyDir = path.join(this.baseDir, 'history');
    if (!fs.existsSync(historyDir)) {
      return [];
    }

    return fs.readdirSync(historyDir).map(file => ({
      file,
      path: path.join(historyDir, file),
      timestamp: fs.statSync(path.join(historyDir, file)).mtime,
      relativeTime: formatDistanceToNow(fs.statSync(path.join(historyDir, file)).mtime)
    })).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .map(item => item.file);
  }

  /**
   * 读取历史文件
   */
  async readHistoryFile(filename: string): Promise<string | null> {
    const historyDir = path.join(this.baseDir, 'history');
    const filePath = path.join(historyDir, filename);

    if (!fs.existsSync(filePath)) {
      console.error(\`❌ 历史文件不存在：\${filename}\`);
      return null;
    }

    return fs.readFileSync(filePath, 'utf-8');
  }

  /**
   * 删除历史文件
   */
  deleteHistoryFile(filename: string): void {
    const historyDir = path.join(this.baseDir, 'history');
    const filePath = path.join(historyDir, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(\`🗑️ 历史文件已删除：\${filename}\`);
    }
  }
}
