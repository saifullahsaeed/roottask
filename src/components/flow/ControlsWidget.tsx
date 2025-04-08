import { Controls, ControlButton } from "reactflow";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

export function ControlsWidget() {
  return (
    <Controls
      position="bottom-center"
      className="bg-white/90 dark:!bg-slate-800/90 backdrop-blur-sm !border-slate-200 dark:!border-slate-600 p-0 m-0"
    >
      <ControlButton className="bg-white dark:bg-slate-800">
        <MagnifyingGlassIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
      </ControlButton>
    </Controls>
  );
}
