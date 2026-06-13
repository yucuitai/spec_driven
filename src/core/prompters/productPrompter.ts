import inquirer from 'inquirer';

/**
 * 产品信息收集提问器
 */
export class ProductPrompter {
  private prompts: any[] = [];

  /**
   * 第一步：获取产品信息
   */
  async step1_productInfo(): Promise<{
    name: string;
    description: string;
    targetUser: string;
  }> {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: '请输入产品名称：',
        validate: input => input.trim().length > 0 || '产品名称不能为空'
      },
      {
        type: 'input',
        name: 'description',
        message: '请用一句话描述产品：',
        validate: input => input.trim().length > 0 || '描述不能为空'
      },
      {
        type: 'input',
        name: 'targetUser',
        message: '目标用户是谁？',
        default: '开发者和工程师'
      }
    ]);

    return answers;
  }

  /**
   * 第二步：获取核心功能
   */
  async step2_coreFeatures(): Promise<string[]> {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'features',
        message: '请输入核心功能（每输入一个功能后按 Enter，总共 3-5 个）：',
        validate: input => input.trim().length > 0 || '功能不能为空',
        filter: input => input.split('\n').filter(line => line.trim())
      }
    ]);

    return answers.features || [];
  }

  /**
   * 第三步：技术栈偏好
   */
  async step3_techStackPreference(): Promise<string> {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'techStackPreference',
        message: '技术栈偏好（可选，如：React + TypeScript + Node.js）：',
        default: '根据项目需求确定'
      }
    ]);

    return answers.techStackPreference || '根据项目需求确定';
  }

  /**
   * 第四步：代码风格偏好
   */
  async step4_codeStylePreference(): Promise<string> {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'codeStylePreference',
        message: '代码风格偏好（可选）：',
        default: '标准化'
      }
    ]);

    return answers.codeStylePreference || '标准化';
  }

  /**
   * 组合所有步骤
   */
  async run(): Promise<IProductSpec> {
    console.log('\n📦 开始收集产品信息...\n');

    const [productInfo, features, techStack, codeStyle] = await Promise.all([
      this.step1_productInfo(),
      this.step2_coreFeatures(),
      this.step3_techStackPreference(),
      this.step4_codeStylePreference()
    ]);

    if (features.length === 0) {
      throw new Error('必须至少输入一个核心功能');
    }

    console.log('\n✅ 产品信息收集完成！\n');

    return {
      name: productInfo.name,
      description: productInfo.description,
      targetUser: productInfo.targetUser,
      features,
      techStackPreference: techStack,
      codeStylePreference: codeStyle
    };
  }
}

export interface IProductSpec {
  name: string;
  description: string;
  targetUser: string;
  features: string[];
  techStackPreference: string;
  codeStylePreference: string;
}
