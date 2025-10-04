import { useStores, useSetCurrentStore } from "../lib/query";
import { cn } from "@/lib/utils";

export function ConfigSwitcherPage() {
  return (
    <div className="p-3">
      <section>
        <ConfigStores />
      </section>
    </div>
  );
}

function ConfigStores() {
  const { data: stores } = useStores();
  const setCurrentStoreMutation = useSetCurrentStore();
  
  const handleStoreClick = (storeName: string, isCurrentStore: boolean) => {
    if (!isCurrentStore) {
      setCurrentStoreMutation.mutate(storeName);
    }
  };

  return (
    <div className="grid grid-cols-4 gap-3">
      {stores.map((store) => {
        const isCurrentStore = store.using
        return (
          <div
            role="button"
            key={store.name}
            onClick={() => handleStoreClick(store.name, isCurrentStore)}
            className={cn("border rounded-xl p-3 h-[100px] text-left transition-colors disabled:opacity-50", {
              "bg-primary/10 border-primary border-2": isCurrentStore,
            })}
          >
            {store.name}
          </div>
        )
      })}
    </div>
  )
}