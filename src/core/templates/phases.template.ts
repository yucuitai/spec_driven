import { ProductSpec } from '../../types';

/**
 * 根据产品 Spec 生成开发 Phase 拆解（模板保底版本）
 * 原则：先骨架后细节，每个 Phase 结束时产品可运行
 */
export function generatePhasesContent(spec: ProductSpec): string {
  const featurePhases = spec.features
    .map(
      (f, i) => `### Phase ${i + 2}: ${f.name}

**目标**：${f.description}

**交付物**：
- [ ] 实现 ${f.name} 的核心路径
- [ ] 编写关键测试或手测用例
- [ ] 更新相关文档

**验收标准**：
- ${f.name} 主流程可正常完成
- 不破坏前序 Phase 已通过的功能`
    )
    .join('\n\n---\n\n');

  return `# ${spec.name} - Phase 拆解

> 拆解原则：每个 Phase 结束时产品可运行，先骨架后细节。

---

### Phase 1: 项目骨架

**目标**：搭建技术栈骨架，跑通空白主页

**交付物**：
- [ ] 初始化项目结构与依赖
- [ ] 配置开发环境（lint / format / 类型检查）
- [ ] 跑通最小可运行页面

**验收标准**：
- \`npm run dev\` 可见空白首页
- \`npm run build\` 通过

---

${featurePhases}

---

### Phase ${spec.features.length + 2}: 收尾与上线

**目标**：性能打磨、UI 收尾、部署

**交付物**：
- [ ] 响应式 + 暗色模式（可选）
- [ ] 部署到生产环境
- [ ] 完整 README 与使用说明

**验收标准**：
- 主流程在桌面与移动端均流畅
- 公网可访问
`;
}
