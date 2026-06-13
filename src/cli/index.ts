import { cli } from './cli/cli';
import { saveDocument } from '../services/documentService';

/**
 * 主 CLI 入口
 */
export async function mainCli() {
  console.log('\\n🚀 Spec-Driven - 交互式开发文档生成工具\\n');

  try {
    // TODO: 这个部分将在后续阶段完成
    // 目前只是占位，等待依赖安装后可以实现完整功能
    
    console.log('⚠️  当前为基础版本，完整功能待后续开发...');
    console.log('\\n请先运行：');
    console.log('  npm install');
    console.log('  npm run build');
  } catch (error) {
    console.error('\\n❌ 发生错误：', error);
    process.exit(1);
  }
}

if (require.main === module) {
  mainCli();
}
