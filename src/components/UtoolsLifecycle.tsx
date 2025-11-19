/**
 * utools 生命周期管理组件
 */

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { router } from "../router";

export function UtoolsLifecycle({ children }: { children: React.ReactNode }) {
	const queryClient = useQueryClient();
	const { t } = useTranslation();

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

		// 搜索框推送配置列表
		window.utools.onMainPush(
			({ code, payload }) => {
				console.log("🔍 Main push triggered:", code, payload);
				// 获取所有配置
				const stores = window.services?.getStores() || [];

				// 获取搜索关键词（用户输入的文本）
				const keyword = (payload || "").toString().toLowerCase().trim();

				// 过滤配置列表
				const filteredStores = keyword
					? stores.filter((store) =>
							store.title.toLowerCase().includes(keyword)
					  )
					: stores;

				// 返回搜索结果
				return filteredStores.map((store) => {
					const actionText = store.using
						? t("configQuickSwitch.currentUsing")
						: t("configQuickSwitch.clickToSwitch");

					return {
						text: `${actionText} → ${store.title}`,
						title: store.title,
						icon: "logo.png",
						data: {
							storeId: store.id,
							using: store.using,
						},
					};
				});
			},
			(select: any) => {
                console.log(select);
                var item = select.option;
				// 用户选择配置时的回调
				console.log("✅ Config selected:", item);

				// 如果选择的不是当前配置，执行切换
				if (item.data?.storeId && !item.data?.using) {
					try {
						// setUsingConfig 现在会返回配置信息并在内部显示通知
						const store = window.services?.setUsingConfig(item.data.storeId);

						// 显示成功通知（使用返回的配置信息）
						if (window.utools && store) {
							window.utools.showNotification(
								t("configQuickSwitch.switchSuccess", { title: store.title })
							);
						}
					} catch (error) {
						console.error("Failed to switch config:", error);

						// 显示错误通知
						if (window.utools) {
							window.utools.showNotification(t("configQuickSwitch.switchError"));
						}
					}
				}

				// 退出插件
				if (window.utools) {
					window.utools.outPlugin();
				}
			}
		);

		// 清理函数（组件卸载时执行，但在 utools 中通常不会卸载）
		return () => {
			console.log("🔄 Lifecycle component unmounting");
		};
	}, [queryClient, t]);

	return <>{children}</>;
}
