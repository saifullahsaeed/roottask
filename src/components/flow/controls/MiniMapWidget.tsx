import { MiniMap } from "reactflow";

export function MiniMapWidget() {
  return (
    <MiniMap
      className="!bg-white/60 dark:!bg-slate-800/90 backdrop-blur-sm !border-slate-200 dark:!border-slate-600"
      nodeColor={(node) => {
        if (node.data.status === "TODO") return "#64748b";
        if (node.data.status === "IN_PROGRESS") return "#6366F1";
        if (node.data.status === "COMPLETED") return "#22C55E";
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
