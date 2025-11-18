/**
 * utools 生命周期管理组件
 */

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { router } from "../router";

export function UtoolsLifecycle({ children }: { children: React.ReactNode }) {
	const queryClient = useQueryClient();

	useEffect(() => {
		// 只在 utools 环境中执行
		if (!window.utools) {
			console.log("Not running in utools environment");
			return;
		}

		console.log("✅ utools lifecycle initialized");

		// 插件进入回调
		const handlePluginEnter = (action: any) => {
			console.log("🚀 Plugin entered with action:", action);

			// 根据不同的 feature code 跳转到不同页面
			switch (action.code) {
				case "ccmate":
					router.navigate("/");
					break;
				case "ccmate_configs":
					router.navigate("/");
					break;
				case "ccmate_mcp":
					router.navigate("/mcp");
					break;
				case "ccmate_usage":
					router.navigate("/usage");
					break;
				case "ccmate_memory":
					router.navigate("/memory");
					break;
				default:
					router.navigate("/");
			}

			// 初始化应用配置（如果需要）
			try {
				if (window.services?.initializeAppConfig) {
					window.services.initializeAppConfig();
				}
			} catch (error) {
				console.error("Failed to initialize app config:", error);
			}
		};

		// 插件退出回调
		const handlePluginOut = (isKill: boolean) => {
			console.log(`👋 Plugin exiting, isKill: ${isKill}`);

			if (isKill) {
				// 完全退出，清理状态
				queryClient.clear();
				console.log("🧹 Cleared all query cache");
			}
			// 如果只是隐藏（isKill=false），保留状态供下次使用
		};

		// 注册生命周期回调
		window.utools.onPluginEnter(handlePluginEnter);
		window.utools.onPluginOut(handlePluginOut);

		// 清理函数（组件卸载时执行，但在 utools 中通常不会卸载）
		return () => {
			console.log("🔄 Lifecycle component unmounting");
		};
	}, [queryClient]);

	return <>{children}</>;
}
