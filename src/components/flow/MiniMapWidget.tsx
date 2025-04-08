import { MiniMap } from "reactflow";

export function MiniMapWidget() {
  return (
    <MiniMap
      className="!bg-white/60 dark:!bg-slate-800/90 backdrop-blur-sm !border-slate-200 dark:!border-slate-600"
      nodeColor={(node) => {
        if (node.type === "input") return "#64748b";
        return "#94a3b8";
      }}
      maskColor="rgba(0, 0, 0, 0.1)"
      style={{
        width: 180,
        height: 180,
        position: "absolute",
        right: 16,
        top: 16,
        borderRadius: "10px",
        border: "1px solid var(--border)",
        backgroundColor: "var(--background)",
        overflow: "hidden",
        padding: 0,
        margin: 0,
        boxShadow:
          "0 8px 12px -2px rgb(0 0 0 / 0.15), 0 4px 8px -4px rgb(0 0 0 / 0.25)",
      }}
      zoomable
      pannable
    />
  );
}
