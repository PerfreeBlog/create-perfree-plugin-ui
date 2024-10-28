#!/usr/bin/env node

import inquirer from 'inquirer';
import { renderFile } from 'ejs';
import fsExtra from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const { existsSync, mkdirSync, writeFileSync, ensureDirSync } = fsExtra;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templateDir = path.resolve(__dirname, 'templates');
const targetDir = path.resolve(process.cwd(), "ui");

// 提示用户输入项目名和作者
async function askQuestions() {
  const questions = [
    {
      name: 'projectName',
      type: 'input',
      message: 'Enter the plugin name:',
      default: 'perfree-plugin-demo'
    },
    {
      name: 'version',
      type: 'input',
      message: 'Enter the author name:',
      default: '1.0.0'
    }
  ];

  return inquirer.prompt(questions);
}

// 渲染模板并生成项目文件
async function createProject(projectName, version) {
  // 创建目标项目目录
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir);
  }

  // 定义模板渲染数据
  const data = { projectName, version };

  renderTpl('package.json.ejs', 'package.json', data);
  renderTpl('README.ejs', 'README.md', data);
  renderTpl('build.js.ejs', 'build.js', data);
  renderTpl('.gitignore.ejs', '.gitignore', data);
  renderTpl('index.html.ejs', 'index.html', data);
  renderTpl('jsconfig.json.ejs', 'jsconfig.json', data);
  renderTpl('vite.config.js.ejs', 'vite.config.js', data);
  renderTpl('vite.module.config.js.ejs', 'vite.module.config.js', data);
  renderTpl('src/main.js.ejs', 'src/main.js', data);
  renderTpl('src/App.vue.ejs', 'src/App.vue', data);
  renderTpl('src/router/index.js.ejs', 'src/router/index.js', data);
  renderTpl('src/core/utils/dictUtils.js.ejs', 'src/core/utils/dictUtils.js', data);
  renderTpl('src/core/utils/perfree.js.ejs', 'src/core/utils/perfree.js', data);
  renderTpl('src/modules/example/index.js.ejs', 'src/modules/example/index.js', data);
  renderTpl('src/modules/example/api/exampleApi.js.ejs', 'src/modules/example/api/exampleApi.js', data);
  renderTpl('src/modules/example/view/ExampleView.vue.ejs', 'src/modules/example/view/ExampleView.vue', data);

  

  // 创建 src 目录并创建 index.js 文件
//   const srcDir = path.join(targetDir, 'src');
//   mkdirSync(srcDir);
//   writeFileSync(path.join(srcDir, 'index.js'), 'console.log("Hello, World!");');
//   console.log('Created src/index.js');

  console.log(`Project ${projectName} has been created successfully!`);
}

async function renderTpl(tplName, targetName, data) {
     // 确保目标文件的目录存在
     const targetPath = path.join(targetDir, targetName);
     const targetDirPath = path.dirname(targetPath); // 获取文件的父目录
 
     // 确保目录存在（不存在则自动创建）
     ensureDirSync(targetDirPath);
 
     // 渲染 EJS 模板
     const templatePath = path.join(templateDir, tplName);
     const result = await renderFile(templatePath, data);
 
     // 写入渲染结果到目标文件
     writeFileSync(targetPath, result);
     console.log('Generated ' + targetName);
}

// 主函数
async function main() {
  try {
    const answers = await askQuestions();
    await createProject(answers.projectName, answers.version);
  } catch (err) {
    console.error('Error:', err);
  }
}

// 启动脚手架工具
main();
