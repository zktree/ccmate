/**
 * utools API 类型定义
 */

// Window services 接口
interface UtoolsServices {
  // 配置文件管理
  readConfigFile(configType: string): ConfigFile;
  writeConfigFile(configType: string, content: any): void;
  listConfigFiles(): string[];

  // 配置存储管理
  getStores(): ConfigStore[];
  createConfig(id: string, title: string, settings: any): ConfigStore;
  updateConfig(storeId: string, title: string, settings: any): ConfigStore;
  deleteConfig(storeId: string): void;
  setUsingConfig(storeId: string): ConfigStore;
  getCurrentStore(): ConfigStore | null;
  getStore(storeId: string): ConfigStore;
  resetToOriginalConfig(): void;

  // MCP 服务器管理
  getGlobalMcpServers(): Record<string, McpServer>;
  updateGlobalMcpServer(serverName: string, serverConfig: any): void;
  deleteGlobalMcpServer(serverName: string): void;
  checkMcpServerExists(serverName: string): boolean;

  // Commands 管理
  readClaudeCommands(): CommandFile[];
  writeClaudeCommand(commandName: string, content: string): void;
  deleteClaudeCommand(commandName: string): void;

  // Agents 管理
  readClaudeAgents(): AgentFile[];
  writeClaudeAgent(agentName: string, content: string): void;
  deleteClaudeAgent(agentName: string): void;

  // 使用量统计
  readProjectUsageFiles(): ProjectUsageRecord[];

  // Memory 管理
  readClaudeMemory(): MemoryFile;
  writeClaudeMemory(content: string): void;

  // Projects 管理
  readClaudeProjects(): ProjectConfig[];
  readClaudeConfigFile(): ClaudeConfigFile;
  writeClaudeConfigFile(content: any): void;

  // 辅助功能
  initializeAppConfig(): void;
  backupClaudeConfigs(): void;
  openConfigPath(): void;
  checkAppConfigExists(): boolean;
  createAppConfigDir(): void;
  unlockCcExt(): void;

  // Hook 功能
  getNotificationSettings(): NotificationSettings | null;
  updateNotificationSettings(settings: NotificationSettings): void;

  // 更新功能
  checkForUpdates(): UpdateInfo;

  // Analytics
  track(event: string, properties: any): void;

  // 托盘菜单（空实现）
  rebuildTrayMenuCommand(): void;
}

// 数据类型定义
export interface ConfigFile {
  path: string;
  content: any;
  exists: boolean;
}

export interface ConfigStore {
  id: string;
  title: string;
  createdAt: number;
  settings: any;
  using: boolean;
}

export interface McpServer {
  config: any;
}

export interface CommandFile {
  name: string;
  content: string;
  exists: boolean;
}

export interface AgentFile {
  name: string;
  content: string;
  exists: boolean;
}

export interface ProjectUsageRecord {
  uuid: string;
  timestamp: string;
  model: string | null;
  usage: UsageData | null;
}

export interface UsageData {
  input_tokens?: number;
  cache_read_input_tokens?: number;
  output_tokens?: number;
}

export interface MemoryFile {
  path: string;
  content: string;
  exists: boolean;
}

export interface ProjectConfig {
  path: string;
  config: any;
}

export interface ClaudeConfigFile {
  path: string;
  content: any;
  exists: boolean;
}

export interface NotificationSettings {
  enable: boolean;
  enabled_hooks: string[];
}

export interface UpdateInfo {
  available: boolean;
  version: string | null;
  body: string | null;
  date: string | null;
}

// utools API 类型定义
interface Utools {
  onPluginEnter(callback: (action: PluginEnterAction) => void): void;
  onPluginOut(callback: (isKill: boolean) => void): void;
  onMainPush(
    callback: (action: PluginEnterAction, callbackSetList: CallbackSetList) => void,
    onSelect?: (item: MainPushResult) => void
  ): void;
  showNotification(text: string, clickFeatureCode?: string): void;
  shellOpenPath(fullPath: string): void;
  shellOpenExternal?(url: string): void;
  setExpendHeight(height: number): void;
  hideMainWindow(): void;
  showMainWindow(): void;
  outPlugin(): void;

  // 平台检测
  isMacOs(): boolean;
  isWindows(): boolean;
  isLinux(): boolean;

  // 更多 utools API...
}

interface PluginEnterAction {
  code: string;
  type: string;
  payload: any;
  option?: any;
}

interface MainPushResult {
  text: string;
  title?: string;
  description?: string;
  icon?: string;
  data?: any;
}

type CallbackSetList = (items: MainPushResult[]) => void;

// 全局声明
declare global {
  interface Window {
    services: UtoolsServices;
    utools: Utools;
  }
}

export {};
