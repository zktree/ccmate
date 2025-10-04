import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStores, useCreateStore } from "../lib/query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ConfigEditorDialog() {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const { data: stores } = useStores();
  const createStoreMutation = useCreateStore();
  const [jsonContent, setJsonContent] = useState<string>("");
  const [isExisting, setIsExisting] = useState(false);

  useEffect(() => {
    if (stores && storeId) {
      const existingStore = stores.find((s) => s.name === storeId);
      if (existingStore) {
        setIsExisting(true);
        setJsonContent(JSON.stringify(existingStore.settings, null, 2));
      } else {
        setJsonContent(JSON.stringify({
          model: "claude-sonnet-4-5-20250929",
          includeCoAuthoredBy: true,
          cleanupPeriodDays: 30,
        }, null, 2));
      }
    }
  }, [stores, storeId]);

  const handleClose = () => {
    navigate("/");
  };

  const handleSave = () => {
    if (!storeId) return;

    try {
      const parsedContent = JSON.parse(jsonContent);
      createStoreMutation.mutate(
        {
          name: storeId,
          settings: parsedContent,
        },
        {
          onSuccess: () => {
            setTimeout(() => {
              handleClose();
            }, 1000);
          },
        }
      );
    } catch (error) {
      alert("Invalid JSON format. Please fix the errors and try again.");
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {isExisting ? `Edit Store: ${storeId}` : `Create Store: ${storeId}`}
          </DialogTitle>
          <DialogDescription>
            Configure Claude Code settings for this store in JSON format
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          <Textarea
            value={jsonContent}
            onChange={(e) => setJsonContent(e.target.value)}
            className="min-h-[500px] font-mono text-sm resize-none border-0 bg-muted/50"
            placeholder="Configuration content in JSON format..."
            spellCheck={false}
          />
        </div>

        {createStoreMutation.error && (
          <Alert variant="destructive" className="text-sm">
            <AlertDescription>
              {createStoreMutation.error.message}
            </AlertDescription>
          </Alert>
        )}

        {createStoreMutation.isSuccess && (
          <Alert className="text-sm">
            <AlertDescription>
              Store {isExisting ? "updated" : "created"} successfully!
            </AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={createStoreMutation.isPending}>
            {createStoreMutation.isPending
              ? "Saving..."
              : isExisting
              ? "Update"
              : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

