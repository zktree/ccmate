import { InfoIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useNotificationSettings } from "@/lib/query";

export function NotificationPage() {
	const { t } = useTranslation();
	const { isLoading } = useNotificationSettings();

	// 功能开发中 - 相关处理函数已移除，将来需要时可从 git 历史恢复

	if (isLoading) {
		return (
			<div className="">
				<div
					className="flex items-center p-3 border-b px-3 justify-between sticky top-0 bg-background z-10 mb-4"
					data-tauri-drag-region
				>
					<div data-tauri-drag-region>
						<Skeleton className="h-6 w-32 mb-1" />
						<Skeleton className="h-4 w-48" />
					</div>
				</div>
				<div className="px-4 flex flex-col bg-card mx-4 rounded-lg py-1 border space-y-4">
					<div className="border-b px-1 py-3">
						<div className="flex items-center justify-between">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-6 w-11" />
						</div>
						<Skeleton className="h-3 w-64 mt-2" />
					</div>
					<div className="border-b px-1 py-3">
						<div className="flex items-center justify-between">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-6 w-11" />
						</div>
						<Skeleton className="h-3 w-64 mt-2" />
					</div>
					<div className="px-1 py-3">
						<div className="flex items-center justify-between">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-6 w-11" />
						</div>
						<Skeleton className="h-3 w-64 mt-2" />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="">
			<div
				className="flex items-center p-3 border-b px-3 justify-between sticky top-0 bg-background z-10 mb-4"
			>
				<div>
					<h3 className="font-bold">
						{t("notifications.title")}
					</h3>
					<p className="text-sm text-muted-foreground">
						{t("notifications.description")}
					</p>
				</div>
			</div>

			{/* 功能开发中提示 */}
			<div className="px-4 mb-4">
				<Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
					<InfoIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
					<AlertTitle className="text-blue-800 dark:text-blue-300">功能开发中</AlertTitle>
					<AlertDescription className="text-blue-700 dark:text-blue-400">
						Hook 通知功能正在开发中，将在未来版本中推出。当前您可以查看配置，但无法启用该功能。
					</AlertDescription>
				</Alert>
			</div>

			<div className="px-4 flex flex-col bg-card mx-4 rounded-lg py-1 border">
				<div className="border-b px-1 py-3">
					<div className="flex items-center justify-between">
						<Label htmlFor="notification" className="">
							{t("notifications.general")}
						</Label>
						<Switch
							id="notification"
							checked={false}
							disabled={true}
						/>
					</div>
					<div className="text-muted-foreground text-sm">
						{t("notifications.generalDescription")}
					</div>
				</div>
				<div className="border-b px-1 py-3">
					<div className="flex items-center justify-between">
						<Label htmlFor="preToolUse" className="">
							{t("notifications.toolUse")}
						</Label>
						<Switch
							id="preToolUse"
							checked={false}
							disabled={true}
						/>
					</div>
					<div className="text-muted-foreground text-sm">
						{t("notifications.toolUseDescription")}
					</div>
				</div>
				<div className="px-1 py-3">
					<div className="flex items-center justify-between">
						<Label htmlFor="stop" className="">
							{t("notifications.completion")}
						</Label>
						<Switch
							id="stop"
							checked={false}
							disabled={true}
						/>
					</div>
					<div className="text-muted-foreground text-sm">
						{t("notifications.completionDescription")}
					</div>
				</div>
			</div>
		</div>
	);
}
