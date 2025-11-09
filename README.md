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

### 全局开发服务器

启动全局开发服务器，实时预览插件列表和调试插件：

```bash
pnpm dev
```

开发服务器启动后，你可以：

1. **访问 <http://localhost:1029/> 查看插件浏览器**  
   实时查看所有插件的信息，包括名称、版本、描述、入口文件等
2. **将本地注册表添加到 InPageEdit**  
   在 InPageEdit 的插件设置中，添加以下注册表地址：

   ```
   http://localhost:1029/registry.v1.json
   ```

   这样你就可以直接在 InPageEdit 中加载和测试本地开发的插件，获得更好的开发体验。

3. **实时更新**
   - 修改插件代码后，刷新页面即可看到最新的插件列表
   - 添加新插件或修改 `package.json` 后，注册表会自动更新
   - 无需重启开发服务器

> **提示**：
>
> - 开发服务器会直接使用 `src/` 目录下的源文件，而不是 `dist/` 目录下的构建产物，方便实时调试。
> - 建议在 `package.json` 的 `$ipe.dev_loader` 中明确指定开发环境的入口文件和样式文件，避免路径猜测可能产生的问题。详见下方的[插件配置](#插件配置)。

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

#### 路径别名

在插件开发中，尽量**不要使用路径别名**，否则全局开发服务器可能会无法正确解析插件路径。

目前模板项目和开发服务器都预设了以下别名：

- `~~`: `common/` 目录
- `@`: `packages/[plugin-name]/src/` 目录

如果你想使用其他别名，可能需要自行配置打包器选项，**这些别名在全局开发服务器不可用**。

### 插件配置

每个插件的 `package.json` 需要包含以下字段：

```json
{
  "name": "@inpageedit/plugin-name",
  "version": "1.0.0",
  "description": "插件描述",
  "author": "作者名称",
  "license": "MIT",
  "$ipe": {
    "name": "插件显示名称",
    "description": "插件详细描述",
    "categories": ["category1", "category2"],
    "loader": {
      "kind": "module",
      "entry": "dist/index.mjs",
      "styles": ["dist/style.css"],
      "main_export": "default"
    },
    "dev_loader": {
      "entry": "src/index.ts",
      "styles": ["src/style.scss"]
    }
  }
}
```

> **提示**：项目已在 `.vscode/settings.json` 中配置了 JSON Schema，在 VS Code 中编辑 `packages/*/package.json` 时会自动启用 `$ipe` 字段的智能提示和验证功能。Schema 定义位于 `registry-templates/v1/ipe-package.schema.v1.json`。

#### 配置字段说明

- **`loader`**：生产环境的加载器配置（必需）

  - `kind`: 加载器类型，可选值：`'module'`、`'umd'`、`'autoload'`、`'styles'`
  - `entry`: 入口文件路径（相对于插件根目录）
  - `styles`: 样式文件路径数组（可选）
  - `main_export`: 主导出名称（可选，默认 `'default'`）

- **`dev_loader`**：开发环境的加载器配置（可选）
  - `entry`: 开发环境的入口文件路径（通常是 `src/index.ts`）
  - `styles`: 开发环境的样式文件路径数组（通常是 `src/style.scss`）

> **提示**：配置 `dev_loader` 可以避免开发服务器猜测入口文件，提供更准确的路径解析。如果不配置 `dev_loader`，开发服务器会尝试：
>
> 1. 从 `loader` 配置推断源文件路径（如 `dist/index.js` → `src/index.ts`）
> 2. 自动检测 `src/` 目录下符合命名规则的文件（如 `index.ts`、`main.ts`、`style.scss` 等）

### 注册表字段说明

生成的 `registry.v1.json` 关键字段：

| 字段               | 说明                                            |
| ------------------ | ----------------------------------------------- |
| `manifest_version` | 模板/协议版本，目前为 1                         |
| `name`             | 注册表名称                                      |
| `base_url`         | 资源基础路径（相对或绝对）                      |
| `last_modified`    | 最后构建时间（ISO 8601），替代旧的 `updated_at` |
| `packages`         | 插件数组                                        |

`last_modified` 在构建时由脚本自动写入，无需手动维护。旧字段 `updated_at` 已弃用。

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

## 🔗 相关链接

- [InPageEdit 主项目](https://github.com/inpageedit/inpageedit-next)
- [插件开发文档](https://www.ipe.wiki/)
