/**
 * CCMate utools Plugin - Preload Services
 *
 * This file provides Node.js services to the renderer process.
 * All functions are exposed via window.services
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// ============================================
// 工具函数
// ============================================

/**
 * 获取用户主目录
 */
function getHomeDir() {
  return os.homedir();
}

/**
 * 获取应用配置目录 (~/.ccconfig)
 */
function getAppConfigDir() {
  return path.join(getHomeDir(), '.ccconfig');
}

/**
 * 确保目录存在
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * 读取 JSON 文件
 */
function readJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to read JSON file ${filePath}: ${error.message}`);
  }
}

/**
 * 写入 JSON 文件
 */
function writeJSON(filePath, data) {
  try {
    const content = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, content, 'utf-8');
  } catch (error) {
    throw new Error(`Failed to write JSON file ${filePath}: ${error.message}`);
  }
}

/**
 * 生成简短的 ID
 */
function generateId(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 获取 stores.json 数据
 */
function getStoresData() {
  const appConfigDir = getAppConfigDir();
  const storesFile = path.join(appConfigDir, 'stores.json');

  if (!fs.existsSync(storesFile)) {
    return {
      configs: [],
      distinct_id: null,
      notification: {
        enable: true,
        enabled_hooks: ['Notification']
      }
    };
  }

  return readJSON(storesFile);
}

/**
 * 保存 stores.json 数据
 */
function saveStoresData(storesData) {
  const appConfigDir = getAppConfigDir();
  ensureDir(appConfigDir);
  const storesFile = path.join(appConfigDir, 'stores.json');
  writeJSON(storesFile, storesData);
}

// ============================================
// 配置文件管理 (Phase 2.1)
// ============================================

/**
 * 读取配置文件
 */
exports.readConfigFile = (configType) => {
  const homeDir = getHomeDir();
  let filePath;

  switch (configType) {
    case 'user':
      filePath = path.join(homeDir, '.claude/settings.json');
      break;
    case 'enterprise_macos':
      filePath = '/Library/Application Support/ClaudeCode/managed-settings.json';
      break;
    case 'enterprise_linux':
      filePath = '/etc/claude-code/managed-settings.json';
      break;
    case 'enterprise_windows':
      filePath = 'C:\\ProgramData\\ClaudeCode\\managed-settings.json';
      break;
    case 'mcp_macos':
      filePath = '/Library/Application Support/ClaudeCode/managed-mcp.json';
      break;
    case 'mcp_linux':
      filePath = '/etc/claude-code/managed-mcp.json';
      break;
    case 'mcp_windows':
      filePath = 'C:\\ProgramData\\ClaudeCode\\managed-mcp.json';
      break;
    default:
      throw new Error(`Invalid configuration type: ${configType}`);
  }

  if (fs.existsSync(filePath)) {
    const content = readJSON(filePath);
    return {
      path: filePath,
      content: content,
      exists: true
    };
  } else {
    return {
      path: filePath,
      content: {},
      exists: false
    };
  }
};

/**
 * 写入配置文件
 */
exports.writeConfigFile = (configType, content) => {
  if (configType !== 'user') {
    throw new Error('Cannot write to enterprise configuration files');
  }

  const homeDir = getHomeDir();
  const filePath = path.join(homeDir, '.claude/settings.json');
  const claudeDir = path.join(homeDir, '.claude');

  ensureDir(claudeDir);
  writeJSON(filePath, content);
};

/**
 * 列出所有可用的配置文件
 */
exports.listConfigFiles = () => {
  const configs = [];
  const homeDir = getHomeDir();

  // User settings
  const userSettings = path.join(homeDir, '.claude/settings.json');
  if (fs.existsSync(userSettings)) {
    configs.push('user');
  }

  // Enterprise settings (platform specific)
  const platform = os.platform();
  if (platform === 'darwin') {
    if (fs.existsSync('/Library/Application Support/ClaudeCode/managed-settings.json')) {
      configs.push('enterprise_macos');
    }
    if (fs.existsSync('/Library/Application Support/ClaudeCode/managed-mcp.json')) {
      configs.push('mcp_macos');
    }
  } else if (platform === 'linux') {
    if (fs.existsSync('/etc/claude-code/managed-settings.json')) {
      configs.push('enterprise_linux');
    }
    if (fs.existsSync('/etc/claude-code/managed-mcp.json')) {
      configs.push('mcp_linux');
    }
  } else if (platform === 'win32') {
    if (fs.existsSync('C:\\ProgramData\\ClaudeCode\\managed-settings.json')) {
      configs.push('enterprise_windows');
    }
    if (fs.existsSync('C:\\ProgramData\\ClaudeCode\\managed-mcp.json')) {
      configs.push('mcp_windows');
    }
  }

  return configs;
};

// ============================================
// 配置存储管理 (Phase 2.2)
// ============================================

/**
 * 获取所有配置方案
 */
exports.getStores = () => {
  const storesData = getStoresData();
  let configs = storesData.configs || [];

  // Sort by createdAt in ascending order
  configs.sort((a, b) => a.createdAt - b.createdAt);

  return configs;
};

/**
 * 创建新配置
 */
exports.createConfig = (id, title, settings) => {
  const homeDir = getHomeDir();
  const storesData = getStoresData();

  // Determine if this should be the active store
  const shouldBeActive = storesData.configs.length === 0;

  // If first config and existing settings.json exists, create Original Config
  if (shouldBeActive) {
    const claudeSettingsPath = path.join(homeDir, '.claude/settings.json');
    if (fs.existsSync(claudeSettingsPath)) {
      const existingSettings = readJSON(claudeSettingsPath);

      const originalStore = {
        id: generateId(6),
        title: 'Original Config',
        createdAt: Math.floor(Date.now() / 1000),
        settings: existingSettings,
        using: false
      };

      storesData.configs.push(originalStore);
      console.log('Created Original Config store from existing settings.json');
    }
  }

  // If first store and active, write settings to user's settings.json
  if (shouldBeActive) {
    const userSettingsPath = path.join(homeDir, '.claude/settings.json');
    const claudeDir = path.join(homeDir, '.claude');
    ensureDir(claudeDir);

    // Read existing settings or start with empty object
    let existingSettings = {};
    if (fs.existsSync(userSettingsPath)) {
      existingSettings = readJSON(userSettingsPath);
    }

    // Merge new settings into existing (partial update)
    if (typeof settings === 'object' && settings !== null) {
      Object.assign(existingSettings, settings);
    }

    writeJSON(userSettingsPath, existingSettings);
  }

  // Create new store
  const newStore = {
    id: id,
    title: title,
    createdAt: Math.floor(Date.now() / 1000),
    settings: settings,
    using: shouldBeActive
  };

  storesData.configs.push(newStore);
  saveStoresData(storesData);

  // Unlock CC extension
  try {
    exports.unlockCcExt();
  } catch (e) {
    console.warn('Failed to unlock CC extension:', e.message);
  }

  return newStore;
};

/**
 * 更新配置
 */
exports.updateConfig = (storeId, title, settings) => {
  const homeDir = getHomeDir();
  const storesData = getStoresData();

  // Find the store
  const storeIndex = storesData.configs.findIndex(s => s.id === storeId);
  if (storeIndex === -1) {
    throw new Error(`Store with id '${storeId}' not found`);
  }

  // Update the store
  const store = storesData.configs[storeIndex];
  store.title = title;
  store.settings = settings;

  // If this store is currently in use, update user's settings.json
  if (store.using) {
    const userSettingsPath = path.join(homeDir, '.claude/settings.json');
    const claudeDir = path.join(homeDir, '.claude');
    ensureDir(claudeDir);

    let existingSettings = {};
    if (fs.existsSync(userSettingsPath)) {
      existingSettings = readJSON(userSettingsPath);
    }

    // Merge settings (partial update)
    if (typeof settings === 'object' && settings !== null) {
      Object.assign(existingSettings, settings);
    }

    writeJSON(userSettingsPath, existingSettings);
  }

  saveStoresData(storesData);

  // Unlock CC extension
  try {
    exports.unlockCcExt();
  } catch (e) {
    console.warn('Failed to unlock CC extension:', e.message);
  }

  return store;
};

/**
 * 删除配置
 */
exports.deleteConfig = (storeId) => {
  const storesData = getStoresData();

  const originalLen = storesData.configs.length;
  storesData.configs = storesData.configs.filter(s => s.id !== storeId);

  if (storesData.configs.length === originalLen) {
    throw new Error('Store not found');
  }

  saveStoresData(storesData);
};

/**
 * 切换当前使用的配置
 */
exports.setUsingConfig = (storeId) => {
  const homeDir = getHomeDir();
  const storesData = getStoresData();

  // Find the store
  const storeExists = storesData.configs.some(s => s.id === storeId);
  if (!storeExists) {
    throw new Error('Store not found');
  }

  // Set all stores to not using, then set selected one to using
  let selectedSettings = null;
  for (const store of storesData.configs) {
    if (store.id === storeId) {
      store.using = true;
      selectedSettings = store.settings;
    } else {
      store.using = false;
    }
  }

  // Write selected store's settings to user's settings.json
  if (selectedSettings) {
    const userSettingsPath = path.join(homeDir, '.claude/settings.json');
    const claudeDir = path.join(homeDir, '.claude');
    ensureDir(claudeDir);

    let existingSettings = {};
    if (fs.existsSync(userSettingsPath)) {
      existingSettings = readJSON(userSettingsPath);
    }

    // Merge settings (partial update)
    if (typeof selectedSettings === 'object' && selectedSettings !== null) {
      Object.assign(existingSettings, selectedSettings);
    }

    writeJSON(userSettingsPath, existingSettings);
  }

  saveStoresData(storesData);
};

/**
 * 获取当前配置
 */
exports.getCurrentStore = () => {
  const stores = exports.getStores();
  return stores.find(store => store.using) || null;
};

/**
 * 获取指定配置
 */
exports.getStore = (storeId) => {
  const stores = exports.getStores();
  const store = stores.find(s => s.id === storeId);
  if (!store) {
    throw new Error(`Store with id '${storeId}' not found`);
  }
  return store;
};

/**
 * 重置为原始配置
 */
exports.resetToOriginalConfig = () => {
  const homeDir = getHomeDir();
  const storesData = getStoresData();

  // Set all stores to not using
  for (const store of storesData.configs) {
    store.using = false;
  }

  saveStoresData(storesData);

  // Clear env field in settings.json
  const userSettingsPath = path.join(homeDir, '.claude/settings.json');
  const claudeDir = path.join(homeDir, '.claude');
  ensureDir(claudeDir);

  let existingSettings = {};
  if (fs.existsSync(userSettingsPath)) {
    existingSettings = readJSON(userSettingsPath);
  }

  existingSettings.env = {};
  writeJSON(userSettingsPath, existingSettings);
};

// ============================================
// MCP 服务器管理 (Phase 2.3)
// ============================================

/**
 * 获取全局 MCP 服务器列表
 */
exports.getGlobalMcpServers = () => {
  const homeDir = getHomeDir();
  const claudeJsonPath = path.join(homeDir, '.claude.json');

  if (!fs.existsSync(claudeJsonPath)) {
    return {};
  }

  const jsonValue = readJSON(claudeJsonPath);
  const mcpServers = jsonValue.mcpServers || {};

  // Transform to McpServer format
  const result = {};
  for (const [name, config] of Object.entries(mcpServers)) {
    result[name] = { config };
  }

  return result;
};

/**
 * 更新全局 MCP 服务器
 */
exports.updateGlobalMcpServer = (serverName, serverConfig) => {
  const homeDir = getHomeDir();
  const claudeJsonPath = path.join(homeDir, '.claude.json');

  let jsonValue = {};
  if (fs.existsSync(claudeJsonPath)) {
    jsonValue = readJSON(claudeJsonPath);
  }

  if (!jsonValue.mcpServers) {
    jsonValue.mcpServers = {};
  }

  jsonValue.mcpServers[serverName] = serverConfig;
  writeJSON(claudeJsonPath, jsonValue);
};

/**
 * 删除全局 MCP 服务器
 */
exports.deleteGlobalMcpServer = (serverName) => {
  const homeDir = getHomeDir();
  const claudeJsonPath = path.join(homeDir, '.claude.json');

  if (!fs.existsSync(claudeJsonPath)) {
    throw new Error('Claude configuration file does not exist');
  }

  const jsonValue = readJSON(claudeJsonPath);

  if (!jsonValue.mcpServers || !jsonValue.mcpServers[serverName]) {
    throw new Error(`MCP server '${serverName}' not found`);
  }

  delete jsonValue.mcpServers[serverName];

  // Remove mcpServers if empty
  if (Object.keys(jsonValue.mcpServers).length === 0) {
    delete jsonValue.mcpServers;
  }

  writeJSON(claudeJsonPath, jsonValue);
};

/**
 * 检查 MCP 服务器是否存在
 */
exports.checkMcpServerExists = (serverName) => {
  const mcpServers = exports.getGlobalMcpServers();
  return serverName in mcpServers;
};

// ============================================
// Commands 管理 (Phase 2.4)
// ============================================

/**
 * 读取所有 commands
 */
exports.readClaudeCommands = () => {
  const homeDir = getHomeDir();
  const commandsDir = path.join(homeDir, '.claude/commands');

  if (!fs.existsSync(commandsDir)) {
    return [];
  }

  const commandFiles = [];
  const entries = fs.readdirSync(commandsDir);

  for (const entry of entries) {
    const filePath = path.join(commandsDir, entry);
    if (fs.statSync(filePath).isFile() && entry.endsWith('.md')) {
      const fileName = entry.replace('.md', '');
      const content = fs.readFileSync(filePath, 'utf-8');

      commandFiles.push({
        name: fileName,
        content: content,
        exists: true
      });
    }
  }

  // Sort alphabetically
  commandFiles.sort((a, b) => a.name.localeCompare(b.name));

  return commandFiles;
};

/**
 * 写入 command
 */
exports.writeClaudeCommand = (commandName, content) => {
  const homeDir = getHomeDir();
  const commandsDir = path.join(homeDir, '.claude/commands');
  ensureDir(commandsDir);

  const commandFilePath = path.join(commandsDir, `${commandName}.md`);
  fs.writeFileSync(commandFilePath, content, 'utf-8');
};

/**
 * 删除 command
 */
exports.deleteClaudeCommand = (commandName) => {
  const homeDir = getHomeDir();
  const commandsDir = path.join(homeDir, '.claude/commands');
  const commandFilePath = path.join(commandsDir, `${commandName}.md`);

  if (fs.existsSync(commandFilePath)) {
    fs.unlinkSync(commandFilePath);
  }
};

// ============================================
// Agents 管理 (Phase 2.5)
// ============================================

/**
 * 读取所有 agents
 */
exports.readClaudeAgents = () => {
  const homeDir = getHomeDir();
  const agentsDir = path.join(homeDir, '.claude/agents');

  if (!fs.existsSync(agentsDir)) {
    return [];
  }

  const agentFiles = [];
  const entries = fs.readdirSync(agentsDir);

  for (const entry of entries) {
    const filePath = path.join(agentsDir, entry);
    if (fs.statSync(filePath).isFile() && entry.endsWith('.md')) {
      const fileName = entry.replace('.md', '');
      const content = fs.readFileSync(filePath, 'utf-8');

      agentFiles.push({
        name: fileName,
        content: content,
        exists: true
      });
    }
  }

  // Sort alphabetically
  agentFiles.sort((a, b) => a.name.localeCompare(b.name));

  return agentFiles;
};

/**
 * 写入 agent
 */
exports.writeClaudeAgent = (agentName, content) => {
  const homeDir = getHomeDir();
  const agentsDir = path.join(homeDir, '.claude/agents');
  ensureDir(agentsDir);

  const agentFilePath = path.join(agentsDir, `${agentName}.md`);
  fs.writeFileSync(agentFilePath, content, 'utf-8');
};

/**
 * 删除 agent
 */
exports.deleteClaudeAgent = (agentName) => {
  const homeDir = getHomeDir();
  const agentsDir = path.join(homeDir, '.claude/agents');
  const agentFilePath = path.join(agentsDir, `${agentName}.md`);

  if (fs.existsSync(agentFilePath)) {
    fs.unlinkSync(agentFilePath);
  }
};

// ============================================
// 使用量统计 (Phase 2.6)
// ============================================

/**
 * 递归查找所有 .jsonl 文件
 */
function findJsonlFiles(dir, files = []) {
  if (!fs.existsSync(dir)) {
    return files;
  }

  const entries = fs.readdirSync(dir);

  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    try {
      const stat = fs.statSync(fullPath);

      if (stat.isFile() && entry.endsWith('.jsonl')) {
        files.push(fullPath);
      } else if (stat.isDirectory()) {
        findJsonlFiles(fullPath, files);
      }
    } catch (e) {
      console.warn(`Warning: ${e.message}`);
    }
  }

  return files;
}

/**
 * 读取项目使用量数据
 */
exports.readProjectUsageFiles = () => {
  const homeDir = getHomeDir();
  const projectsDir = path.join(homeDir, '.claude/projects');

  if (!fs.existsSync(projectsDir)) {
    return [];
  }

  const allRecords = [];
  const jsonlFiles = findJsonlFiles(projectsDir);

  for (const filePath of jsonlFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');

      for (const line of lines) {
        if (!line.trim()) continue;

        try {
          const jsonValue = JSON.parse(line);

          const uuid = jsonValue.uuid || '';
          const timestamp = jsonValue.timestamp || '';

          // Extract model (check top-level and nested in message)
          let model = jsonValue.model;
          if (!model && jsonValue.message) {
            model = jsonValue.message.model;
          }

          // Extract usage data
          let usage = null;
          const usageObj = jsonValue.usage || (jsonValue.message && jsonValue.message.usage);

          if (usageObj) {
            usage = {
              input_tokens: usageObj.input_tokens,
              cache_read_input_tokens: usageObj.cache_read_input_tokens,
              output_tokens: usageObj.output_tokens
            };
          }

          // Only include records with valid data
          if (uuid && timestamp && usage) {
            const inputTokens = usage.input_tokens || 0;
            const outputTokens = usage.output_tokens || 0;

            if (inputTokens + outputTokens > 0) {
              allRecords.push({
                uuid,
                timestamp,
                model: model || null,
                usage
              });
            }
          }
        } catch (e) {
          // Skip invalid JSON lines
        }
      }
    } catch (e) {
      console.warn(`Failed to read file ${filePath}: ${e.message}`);
    }
  }

  return allRecords;
};

// ============================================
// Memory 管理 (Phase 2.7)
// ============================================

/**
 * 读取 CLAUDE.md
 */
exports.readClaudeMemory = () => {
  const homeDir = getHomeDir();
  const claudeMdPath = path.join(homeDir, '.claude/CLAUDE.md');

  if (fs.existsSync(claudeMdPath)) {
    const content = fs.readFileSync(claudeMdPath, 'utf-8');
    return {
      path: claudeMdPath,
      content: content,
      exists: true
    };
  } else {
    return {
      path: claudeMdPath,
      content: '',
      exists: false
    };
  }
};

/**
 * 写入 CLAUDE.md
 */
exports.writeClaudeMemory = (content) => {
  const homeDir = getHomeDir();
  const claudeMdPath = path.join(homeDir, '.claude/CLAUDE.md');
  const claudeDir = path.join(homeDir, '.claude');

  ensureDir(claudeDir);
  fs.writeFileSync(claudeMdPath, content, 'utf-8');
};

// ============================================
// Projects 管理 (Phase 2.8)
// ============================================

/**
 * 读取项目配置
 */
exports.readClaudeProjects = () => {
  const homeDir = getHomeDir();
  const claudeJsonPath = path.join(homeDir, '.claude.json');

  if (!fs.existsSync(claudeJsonPath)) {
    return [];
  }

  const jsonValue = readJSON(claudeJsonPath);
  const projects = jsonValue.projects || {};

  const result = [];
  for (const [projectPath, config] of Object.entries(projects)) {
    result.push({
      path: projectPath,
      config: config
    });
  }

  return result;
};

/**
 * 读取 .claude.json
 */
exports.readClaudeConfigFile = () => {
  const homeDir = getHomeDir();
  const claudeJsonPath = path.join(homeDir, '.claude.json');

  if (fs.existsSync(claudeJsonPath)) {
    const content = readJSON(claudeJsonPath);
    return {
      path: claudeJsonPath,
      content: content,
      exists: true
    };
  } else {
    return {
      path: claudeJsonPath,
      content: {},
      exists: false
    };
  }
};

/**
 * 写入 .claude.json
 */
exports.writeClaudeConfigFile = (content) => {
  const homeDir = getHomeDir();
  const claudeJsonPath = path.join(homeDir, '.claude.json');
  writeJSON(claudeJsonPath, content);
};

// ============================================
// 辅助功能 (Phase 2.9)
// ============================================

/**
 * 初始化应用配置
 */
exports.initializeAppConfig = () => {
  const homeDir = getHomeDir();
  const appConfigPath = getAppConfigDir();

  ensureDir(appConfigPath);

  // Check if we need to backup Claude configs
  const claudeDir = path.join(homeDir, '.claude');
  if (fs.existsSync(claudeDir)) {
    const backupDir = path.join(appConfigPath, 'claude_backup');
    if (!fs.existsSync(backupDir)) {
      exports.backupClaudeConfigs();
    }
  }
};

/**
 * 备份 Claude 配置
 */
exports.backupClaudeConfigs = () => {
  const homeDir = getHomeDir();
  const claudeDir = path.join(homeDir, '.claude');
  const appConfigPath = getAppConfigDir();

  if (!fs.existsSync(claudeDir)) {
    throw new Error('Claude configuration directory does not exist');
  }

  ensureDir(appConfigPath);

  const backupDir = path.join(appConfigPath, 'claude_backup');
  ensureDir(backupDir);

  // Copy all files from .claude to backup
  const entries = fs.readdirSync(claudeDir);
  for (const entry of entries) {
    const sourcePath = path.join(claudeDir, entry);
    const destPath = path.join(backupDir, entry);

    if (fs.statSync(sourcePath).isFile()) {
      fs.copyFileSync(sourcePath, destPath);
    }
  }
};

/**
 * 打开配置目录
 */
exports.openConfigPath = () => {
  const appConfigDir = getAppConfigDir();
  ensureDir(appConfigDir);

  // Open in file manager using utools API
  if (window.utools) {
    window.utools.shellOpenPath(appConfigDir);
  } else {
    // Fallback for development
    const { exec } = require('child_process');
    const platform = os.platform();

    if (platform === 'darwin') {
      exec(`open "${appConfigDir}"`);
    } else if (platform === 'win32') {
      exec(`explorer "${appConfigDir}"`);
    } else if (platform === 'linux') {
      exec(`xdg-open "${appConfigDir}"`);
    }
  }
};

/**
 * 检查应用配置是否存在
 */
exports.checkAppConfigExists = () => {
  const appConfigPath = getAppConfigDir();
  return fs.existsSync(appConfigPath);
};

/**
 * 创建应用配置目录
 */
exports.createAppConfigDir = () => {
  const appConfigPath = getAppConfigDir();
  ensureDir(appConfigPath);
};

/**
 * 解锁 CC 扩展
 */
exports.unlockCcExt = () => {
  const homeDir = getHomeDir();
  const claudeConfigPath = path.join(homeDir, '.claude/config.json');
  const claudeDir = path.join(homeDir, '.claude');

  ensureDir(claudeDir);

  if (fs.existsSync(claudeConfigPath)) {
    const config = readJSON(claudeConfigPath);

    if (!config.primaryApiKey) {
      config.primaryApiKey = 'xxx';
      writeJSON(claudeConfigPath, config);
      console.log('Added primaryApiKey to existing config.json');
    }
  } else {
    const config = { primaryApiKey: 'xxx' };
    writeJSON(claudeConfigPath, config);
    console.log('Created new config.json with primaryApiKey');
  }
};

// ============================================
// Hook 功能（简化版，不启动 HTTP 服务）(Phase 2.10)
// ============================================

/**
 * 获取通知设置
 */
exports.getNotificationSettings = () => {
  const storesData = getStoresData();
  return storesData.notification || null;
};

/**
 * 更新通知设置
 */
exports.updateNotificationSettings = (settings) => {
  const storesData = getStoresData();
  storesData.notification = settings;
  saveStoresData(storesData);
};

// ============================================
// 更新功能（简化版）
// ============================================

/**
 * 检查更新（简化版，返回当前版本信息）
 */
exports.checkForUpdates = () => {
  // 在 utools 中，更新由插件市场处理
  return {
    available: false,
    version: null,
    body: null,
    date: null
  };
};

// ============================================
// Analytics（简化版）
// ============================================

/**
 * 跟踪事件（简化版，仅记录日志）
 */
exports.track = (event, properties) => {
  console.log(`📊 Track event: ${event}`, properties);
  // 在 utools 版本中，我们可以选择禁用或使用本地存储
};

// ============================================
// 重建托盘菜单（空实现，utools 不支持托盘）
// ============================================

exports.rebuildTrayMenuCommand = () => {
  // utools 不支持系统托盘，空实现
};

// ============================================
// 暴露给渲染进程
// ============================================

window.services = exports;

console.log('✅ CCMate services loaded successfully');
