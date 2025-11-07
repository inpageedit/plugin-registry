# @inpageedit/plugin-registry

InPageEdit 官方插件注册表

<https://registry.ipe.wiki/>

## 📦 项目简介

这个项目是 InPageEdit 的官方插件注册中心，用于托管和分发各种 InPageEdit 插件。项目会自动构建插件并生成插件注册表，供 InPageEdit 主程序使用。

## 🗂️ 项目结构

```
.
├── packages/          # 插件源代码目录
│   ├── _boilerplate/  # 插件模板（用于创建新插件）
│   └── */             # 插件源代码目录
├── scripts/           # 构建脚本
│   ├── build.ts       # 主构建脚本
│   └── new.ts         # 创建新插件脚本
├── public/            # 静态资源
│   └── index.html     # 插件中心页面
├── dist/              # 构建输出目录
└── registry-templates/ # 注册表模板
```

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 创建新插件

```bash
pnpm run new
```

根据提示输入插件信息即可创建一个新的插件。

### 构建项目

```bash
pnpm run build
```

此命令会：

1. 构建所有插件
2. 生成插件注册表 (`dist/registry.v1.json`)
3. 复制静态资源到 `dist` 目录

### 清理构建产物

```bash
pnpm run clean
```

## 📝 开发指南

### 插件开发

1. 使用 `pnpm run new` 创建新插件
2. 在 `packages/[plugin-name]/src/` 中编写插件代码
3. 在 `packages/[plugin-name]/package.json` 中配置插件信息
4. 运行 `pnpm run build` 构建插件

### 插件配置

每个插件的 `package.json` 需要包含以下字段：

```json
{
  "name": "@inpageedit/plugin-name",
  "version": "1.0.0",
  "description": "插件描述",
  "author": "作者名称",
  "license": "MIT",
  "inpageedit": {
    "loader": {
      "kind": "module",
      "entry": "dist/index.mjs"
    }
  }
}
```

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

## 🔗 相关链接

- [InPageEdit 主项目](https://github.com/inpageedit/inpageedit-next)
- [插件开发文档](https://www.ipe.wiki/)
