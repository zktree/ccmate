/**
 * utools 对话框适配器
 * 替换 @tauri-apps/plugin-dialog 的功能
 */

/**
 * 显示确认对话框
 * @param message 消息内容
 * @param _options 选项（保留用于 API 兼容性，当前未使用）
 * @returns 用户是否确认
 */
export async function ask(
  message: string,
  _options?: {
    title?: string;
    kind?: "info" | "warning" | "error";
    okLabel?: string;
    cancelLabel?: string;
  }
): Promise<boolean> {
  // 在 utools 环境中使用原生 confirm
  // 注意：confirm 不支持自定义标题和按钮文本
  const result = window.confirm(message);
  return result;
}

/**
 * 显示消息对话框
 * @param message 消息内容
 * @param _options 选项（保留用于 API 兼容性，当前未使用）
 */
export async function message(
  message: string,
  _options?: {
    title?: string;
    kind?: "info" | "warning" | "error";
    okLabel?: string;
  }
): Promise<void> {
  // 在 utools 环境中使用 showNotification 或 alert
  if (window.utools?.showNotification) {
    window.utools.showNotification(message);
  } else {
    window.alert(message);
  }
}

/**
 * 打开外部 URL
 * @param url URL 地址
 */
export async function openUrl(url: string): Promise<void> {
  if (window.utools?.shellOpenExternal) {
    window.utools.shellOpenExternal(url);
  } else {
    // 开发环境或浏览器环境
    window.open(url, "_blank");
  }
}
