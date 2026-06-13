# Spec-Driven - 交互式开发文档生成工具（开发中）

从想法到完整项目文档，一站式搞定 Spec-Driven 全流程。

## 特性

- 交互式 4 步向导（产品信息 → 核心功能 → 技术偏好 → 确认生成）
- 自动生成 Spec 文档、Phase 计划、AGENTS.md
- Markdown 渲染 + 实时编辑
- AI 增强（接入 OpenAI 兼容 API，支持流式输出）
- 文档导出（单文件下载 / ZIP 打包）

## 技术栈

Next.js 15 + React 19 + Tailwind CSS 4 + shadcn/ui + Zustand + react-markdown

## 快速开始

```bash
npm install
npm run dev
```

访问 http://localhost:3000

## 开发进度

- [x] 项目初始化与基础架构
- [x] 向导流程（4 步表单）
- [x] Spec / Phase / Agents 文档生成与预览
- [x] AI 增强功能
- [x] 文档导出
- [ ] 多项目管理（项目列表、切换、删除）
- [ ] UI 布局重构（工作流步骤移到侧边栏）
- [ ] 详细 README 与使用文档

## 设计文档

详见 [docs/OPEN_DESIGN_BRIEF.md](docs/OPEN_DESIGN_BRIEF.md)
