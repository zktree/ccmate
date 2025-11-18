/**
 * utools Adapter - Tauri to utools API Bridge
 *
 * This module provides a compatibility layer between Tauri's invoke API
 * and utools' window.services API.
 */

/**
 * Convert snake_case command names to camelCase method names
 * Example: read_config_file -> readConfigFile
 */
function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Invoke a service method (compatible with Tauri's invoke API)
 *
 * @param command - The command name in snake_case (Tauri style)
 * @param args - Arguments object for the command
 * @returns Promise resolving to the command result
 */
export async function invoke<T = any>(command: string, args?: any): Promise<T> {
  // Convert command to camelCase method name
  const methodName = snakeToCamel(command);

  // Get the service method
  const services = window.services;
  if (!services) {
    throw new Error('utools services not loaded. Make sure preload script is running.');
  }

  const method = (services as any)[methodName];
  if (typeof method !== 'function') {
    throw new Error(`Service method '${methodName}' not found (from command '${command}')`);
  }

  try {
    // Call the method with arguments
    // Handle both single argument and multiple arguments patterns
    let result;
    if (args === undefined || args === null) {
      result = method();
    } else if (typeof args === 'object' && !Array.isArray(args)) {
      // Extract arguments from object (Tauri style)
      const argValues = Object.values(args);
      if (argValues.length === 0) {
        result = method();
      } else if (argValues.length === 1) {
        result = method(argValues[0]);
      } else {
        result = method(...argValues);
      }
    } else {
      result = method(args);
    }

    // Wrap synchronous results in Promise for consistency
    return Promise.resolve(result);
  } catch (error: any) {
    // Convert errors to match Tauri error format
    return Promise.reject(new Error(error.message || String(error)));
  }
}

/**
 * Check if running in utools environment
 */
export function isUtools(): boolean {
  return typeof window !== 'undefined' &&
         typeof window.utools !== 'undefined' &&
         typeof window.services !== 'undefined';
}

/**
 * Check if running in development mode (Vite dev server)
 */
export function isDevelopment(): boolean {
  return typeof window !== 'undefined' &&
         !window.services;
}

/**
 * Get utools API (if available)
 */
export function getUtools() {
  if (typeof window !== 'undefined' && window.utools) {
    return window.utools;
  }
  return null;
}

/**
 * Show notification using utools API
 */
export function showNotification(text: string, clickFeatureCode?: string): void {
  const utools = getUtools();
  if (utools) {
    utools.showNotification(text, clickFeatureCode);
  } else {
    // Fallback for development
    console.log('📢 Notification:', text);
  }
}

/**
 * Open path in system file manager
 */
export function shellOpenPath(fullPath: string): void {
  const utools = getUtools();
  if (utools) {
    utools.shellOpenPath(fullPath);
  } else {
    console.log('📂 Open path:', fullPath);
  }
}

/**
 * Hide main window
 */
export function hideMainWindow(): void {
  const utools = getUtools();
  if (utools) {
    utools.hideMainWindow();
  }
}

/**
 * Show main window
 */
export function showMainWindow(): void {
  const utools = getUtools();
  if (utools) {
    utools.showMainWindow();
  }
}

/**
 * Exit plugin
 */
export function outPlugin(): void {
  const utools = getUtools();
  if (utools) {
    utools.outPlugin();
  }
}

/**
 * Set window height
 */
export function setExpendHeight(height: number): void {
  const utools = getUtools();
  if (utools) {
    utools.setExpendHeight(height);
  }
}

// Export commonly used types
export type {
  ConfigFile,
  ConfigStore,
  McpServer,
  CommandFile,
  AgentFile,
  ProjectUsageRecord,
  MemoryFile,
  ProjectConfig,
  NotificationSettings
} from '../types/utools';
