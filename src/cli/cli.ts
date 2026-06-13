import { ProductPrompter, IProductSpec } from './prompters/productPrompter';
import { loadConfig } from '../config';
import { ConfigGenerator } from '../config/generator';

/**
 * 主 CLI 入口
 */
export async function cli() {
  console.log('\\n🚀 Spec-Driven - 交互式开发文档生成工具\\n');

  try {
    // 调用产品提示器收集信息
    const product = await new ProductPrompter().run();

    // 加载配置
    const config = loadConfig('src/config/default.json');

    console.log('\\n📋 产品信息：');
    console.log(`  名称：${product.name}`);
    console.log(`  描述：${product.description}`);
    console.log(`  目标用户：${product.targetUser}`);
    console.log(`  核心功能：${product.features.join('、')}`);
    console.log(`  技术栈偏好：${product.techStackPreference}`);
    console.log(`  代码风格偏好：${product.codeStylePreference}`);

    console.log('\\n✨ 工具已准备好，等待后续开发阶段实现文档生成功能...');
  } catch (error) {
    console.error('\\n❌ 发生错误：', error);
    process.exit(1);
  }
}

// 直接运行 CLI
if (require.main === module) {
  cli();
}
import { ProductPrompter, IProductSpec } from './prompters/productPrompter';
import { loadConfig } from '../config';
import { ConfigGenerator } from '../config/generator';
import { generateProductContent } from '../templates/product';

/**
 * 主 CLI 入口
 */
export async function cli() {
  console.log('\\n🚀 Spec-Driven - 交互式开发文档生成工具\\n');

  try {
    const { productName, productDescription, features } = await new ProductPrompter().runProductInfo();
    const techStackPreference = await new ProductPrompter().askTechStack();
    const codeStylePreference = await new ProductPrompter().askCodeStyle();
    
    const product = {
      name: productName,
      description: productDescription,
      targetUser: '开发者和工程师',
      features: features.map(f => ({
        name: f,
        description: '未详细说明',
        difficulty: 3,
        estimateTime: '15分钟'
      })),
      techStackPreference,
      codeStylePreference
    };

    // 加载配置
    const config = loadConfig('src/config/default.json');

    console.log('\\n📋 产品信息：');
    console.log(\`  名称：\${product.name}\`);
    console.log(\`  描述：\${product.description}\`);
    console.log(\`  目标用户：\${product.targetUser}\`);
    console.log(\`  核心功能：\${product.features.map(f => f.name).join('、')}\`);
    console.log(\`  技术栈偏好：\${product.techStackPreference}\`);
    console.log(\`  代码风格偏好：\${product.codeStylePreference}\`);

    const content = generateProductContent(product);
    console.log('\\n📄 生成的文档内容：');
    console.log(content.slice(0, 200) + '...');

    console.log('\\n✨ 工具已准备就绪！');
  } catch (error) {
    console.error('\\n❌ 发生错误：', error);
    process.exit(1);
  }
}
