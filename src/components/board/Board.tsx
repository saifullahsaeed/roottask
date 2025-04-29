// import {
//   DragDropContext,
//   Droppable,
//   Draggable,
//   DroppableProvided,
//   DraggableProvided,
//   DropResult,
// } from "@hello-pangea/dnd";
// import {
//   Plus,
//   Filter,
//   Settings,
//   ArrowRight,
//   Check,
//   X,
//   GripVertical,
// } from "lucide-react";
// import { Tooltip, Button, Input } from "@/components/ui";
// import { useBoard } from "@/hooks";
// import { useCreateStatus, useUpdateStatus } from "@/hooks/useStatuses";
// import { useStatusSort } from "@/hooks/useStatusSort";
// import { Project } from "@/types";
// import { useState } from "react";
// import { ellipsisText } from "@/utils/string/ellipsis";
// import { useProjectStore } from "@/stores/useProjectStore";
// import { NoStatusExist } from "@/components/board/NoStatusExist";
// import CreateTask from "@/components/task_card/CreateTask";
// import { useCreateTask } from "@/hooks/useTasks";
// import TaskCard from "@/components/task_card/TaskCard";
// /**
//  * Board Component
//  *
//  * This component renders a Kanban-style board with draggable status columns.
//  * Each status column can contain tasks that can be dragged between columns.
//  * The board supports creating, editing, and reordering status columns.
//  */
// interface BoardProps {
//   selectedProject: Project;
// }

// export function Board({ selectedProject }: BoardProps) {
//   // Hook for handling task drag and drop operations
//   const { handleDragEnd: handleTaskDragEnd } = useBoard(selectedProject.id);
//   const {
//     statuses,
//     setStatuses: setStatusesInStore,
//     tasks,
//   } = useProjectStore();

//   // State for editing status name
//   const [editingStatusId, setEditingStatusId] = useState<string | null>(null);
//   const [editingStatusName, setEditingStatusName] = useState("");
//   const [showCreateTask, setShowCreateTask] = useState<string | null>(null);
//   // Hook for creating a single status
//   const { mutate: createStatus, isPending: isCreatingStatus } = useCreateStatus(
//     selectedProject?.id
//   );
//   const { mutate: createTask, isPending: isCreatingTask } = useCreateTask(
//     selectedProject?.id
//   );
//   // Hook for creating multiple statuses at once (used for default setup)

//   // Hook for updating a status (name, position, etc.)
//   const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateStatus(
//     selectedProject?.id
//   );

//   // Hook for sorting statuses (reordering)
//   const { sortStatuses } = useStatusSort(selectedProject?.id);

//   /**
//    * Start editing a status name
//    * @param statusId - The ID of the status to edit
//    * @param currentName - The current name of the status
//    */
//   const handleStartEditing = (statusId: string, currentName: string) => {
//     setEditingStatusId(statusId);
//     setEditingStatusName(currentName);
//   };

//   /**
//    * Save the edited status name
//    * @param statusId - The ID of the status being edited
//    * @param index - The current position of the status
//    */
//   const handleSaveEdit = (statusId: string, index: number) => {
//     if (
//       editingStatusName.trim() &&
//       editingStatusName !== statuses?.find((s) => s.id === statusId)?.name
//     ) {
//       updateStatus({
//         statusId,
//         data: { name: editingStatusName.trim(), position: index },
//       });
//     } else {
//       // If the name is empty or unchanged, just exit editing mode
//       setEditingStatusId(null);
//     }
//   };

//   /**
//    * Cancel the status name editing
//    */
//   const handleCancelEdit = () => {
//     setEditingStatusId(null);
//   };

//   /**
//    * Handle keyboard events during status name editing
//    * @param e - The keyboard event
//    * @param statusId - The ID of the status being edited
//    * @param index - The current position of the status
//    */
//   const handleKeyDown = (
//     e: React.KeyboardEvent,
//     statusId: string,
//     index: number
//   ) => {
//     if (e.key === "Enter") {
//       handleSaveEdit(statusId, index);
//     } else if (e.key === "Escape") {
//       handleCancelEdit();
//     }
//   };

//   /**
//    * Handle drag end events for both tasks and status columns
//    * This function determines what happens when a draggable item is dropped
//    * @param result - The result of the drag operation
//    */
//   const handleDragEnd = (result: DropResult) => {
//     if (!result.destination) return;

//     const { source, destination, type } = result;

//     // Handle status column reordering
//     if (type === "status") {
//       if (!statuses) return;

//       // Create a new array with the same references to avoid React re-renders
//       const reorderedStatuses = Array.from(statuses);
//       const [removed] = reorderedStatuses.splice(source.index, 1);
//       reorderedStatuses.splice(destination.index, 0, removed);

//       setStatusesInStore(reorderedStatuses);

//       // Update positions in the database without refetching
//       sortStatuses({
//         statusIds: reorderedStatuses.map((status) => status.id),
//       });

//       return;
//     }

//     // Handle task reordering between status columns
//     handleTaskDragEnd(result);
//   };
//   /**
//    * Create a new status column
//    * The new status will be added at the end of the list
//    */
//   const handleAddStatus = () => {
//     createStatus({
//       name: "New Status",
//       description: "Description for the new status",
//       position: statuses?.length,
//     });
//   };

//   const handleAddTask = (statusId: string) => {
//     setShowCreateTask(statusId);
//   };

//   const handleSubmitTask = (data: {
//     title: string;
//     startDate?: Date;
//     dueDate?: Date;
//     statusId: string;
//   }) => {
//     createTask({
//       title: data.title,
//       statusId: data.statusId,
//       startDate: data.startDate?.toISOString() || null,
//       dueDate: data.dueDate?.toISOString() || null,
//     });
//     setShowCreateTask(null);
//   };
//   // Show empty state if no statuses exist
//   if (!statuses?.length) {
//     return (
//       <NoStatusExist
//         selectedProject={selectedProject}
//         handleAddStatus={handleAddStatus}
//       />
//     );
//   }

//   return (
//     <div className="h-full flex flex-col">
//       {/* Top Control Bar */}
//       <div className="border-b border-border p-3 flex items-center justify-between bg-card/50 backdrop-blur-sm sticky top-0 z-10">
//         <h2 className="font-semibold text-lg">Task Board</h2>
//         <div className="flex items-center gap-2">
//           <Tooltip content="Filter tasks" variant="dark" delayDuration={500}>
//             <button className="p-2 hover:bg-muted rounded-lg transition-colors">
//               <Filter className="w-4 h-4 text-muted-foreground" />
//             </button>
//           </Tooltip>
//           <Tooltip content="Board settings" variant="dark" delayDuration={500}>
//             <button className="p-2 hover:bg-muted rounded-lg transition-colors">
//               <Settings className="w-4 h-4 text-muted-foreground" />
//             </button>
//           </Tooltip>
//         </div>
//       </div>

//       {/* Board Content */}
//       <div className="flex-1 px-6 py-4 overflow-hidden">
//         {/* DragDropContext - Wrapper for drag and drop functionality */}
//         <DragDropContext onDragEnd={handleDragEnd}>
//           <div className="h-full overflow-x-auto pb-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted [&::-webkit-scrollbar-thumb]:rounded-full">
//             {/* Droppable container for status columns */}
//             <Droppable
//               droppableId="statuses"
//               direction="horizontal"
//               type="status"
//             >
//               {(provided: DroppableProvided) => (
//                 <div
//                   ref={provided.innerRef}
//                   {...provided.droppableProps}
//                   className="flex gap-6 min-w-max h-full"
//                 >
//                   {/* Map through statuses and create draggable columns */}
//                   {statuses?.map((status, index) => (
//                     <Draggable
//                       key={status.id}
//                       draggableId={status.id}
//                       index={index}
//                     >
//                       {(provided: DraggableProvided) => (
//                         <div
//                           ref={provided.innerRef}
//                           {...provided.draggableProps}
//                           className="flex flex-col w-80 h-full"
//                         >
//                           {/* Status Column Header */}
//                           <div className="flex items-center justify-between mb-3 px-1 group">
//                             <div className="flex items-center gap-2">
//                               {/* Status Name - Editable when in edit mode */}
//                               {editingStatusId === status.id ? (
//                                 <div className="flex items-center gap-1">
//                                   <Input
//                                     type="text"
//                                     value={editingStatusName}
//                                     onChange={(e) =>
//                                       setEditingStatusName(e.target.value)
//                                     }
//                                     onKeyDown={(e) =>
//                                       handleKeyDown(e, status.id, index)
//                                     }
//                                     className="font-medium text-sm h-7 w-32"
//                                     autoFocus
//                                   />
//                                   <button
//                                     onClick={() =>
//                                       handleSaveEdit(status.id, index)
//                                     }
//                                     className="p-1 hover:bg-muted rounded transition-colors"
//                                     disabled={isUpdatingStatus}
//                                   >
//                                     <Check className="w-3 h-3 text-green-500" />
//                                   </button>
//                                   <button
//                                     onClick={handleCancelEdit}
//                                     className="p-1 hover:bg-muted rounded transition-colors"
//                                     disabled={isUpdatingStatus}
//                                   >
//                                     <X className="w-3 h-3 text-red-500" />
//                                   </button>
//                                 </div>
//                               ) : (
//                                 <h3
//                                   className="font-medium text-sm text-foreground cursor-pointer hover:bg-muted/50 px-1.5 py-0.5 rounded transition-colors"
//                                   onClick={() =>
//                                     handleStartEditing(status.id, status.name)
//                                   }
//                                 >
//                                   {ellipsisText(status.name, 20)}
//                                 </h3>
//                               )}
//                               {/* Task Count Badge */}
//                               <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
//                                 {status.taskCount}
//                               </span>
//                             </div>
//                             {/* Status Column Actions */}
//                             <div className="flex items-center gap-1">
//                               {/* Actions that appear on hover */}
//                               <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                                 {/* Drag Handle */}
//                                 <Tooltip
//                                   content={`Move ${status.name}`}
//                                   variant="dark"
//                                   delayDuration={500}
//                                 >
//                                   <button
//                                     className="p-1.5 hover:bg-primary/10 rounded-lg transition-colors cursor-grab active:cursor-grabbing"
//                                     {...provided.dragHandleProps}
//                                   >
//                                     <GripVertical className="w-4 h-4 text-primary" />
//                                   </button>
//                                 </Tooltip>
//                                 {/* Delete Button */}
//                                 <Tooltip
//                                   content={`Delete ${status.name}`}
//                                   variant="dark"
//                                   delayDuration={500}
//                                 >
//                                   <button
//                                     className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors"
//                                     onClick={() =>
//                                       console.log("Delete status", status.id)
//                                     }
//                                   >
//                                     <X className="w-4 h-4 text-destructive" />
//                                   </button>
//                                 </Tooltip>
//                               </div>
//                               {/* Add Task Button */}
//                               <Tooltip
//                                 content={`Add task to ${status.name}`}
//                                 variant="dark"
//                                 delayDuration={500}
//                               >
//                                 <button
//                                   className="p-1.5 hover:bg-primary/10 rounded-lg transition-colors"
//                                   onClick={() => handleAddTask(status.id)}
//                                 >
//                                   <Plus className="w-4 h-4 text-primary" />
//                                 </button>
//                               </Tooltip>
//                             </div>
//                           </div>
//                           {/* Droppable area for tasks within this status */}
//                           <Droppable droppableId={status.id}>
//                             {(provided: DroppableProvided, snapshot) => (
//                               <div
//                                 ref={provided.innerRef}
//                                 {...provided.droppableProps}
//                                 className={`flex-1 rounded-lg p-2 h-[calc(100vh-12rem)] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted [&::-webkit-scrollbar-thumb]:rounded-full transition-all duration-200 ${
//                                   snapshot.isDraggingOver
//                                     ? "bg-primary/5 shadow-[0_0_0_2px_rgba(var(--primary),0.2)]"
//                                     : "bg-muted/30"
//                                 }`}
//                               >
//                                 {tasks
//                                   ?.filter(
//                                     (task) => task.statusId === status.id
//                                   )
//                                   .sort((a, b) => a.position - b.position)
//                                   .map((task, index: number) => (
//                                     <Draggable
//                                       key={task.id}
//                                       draggableId={task.id}
//                                       index={index}
//                                     >
//                                       {(provided: DraggableProvided) => (
//                                         <TaskCard
//                                           task={task}
//                                           draggableProps={provided}
//                                         />
//                                       )}
//                                     </Draggable>
//                                   ))}
//                                 {showCreateTask === status.id && (
//                                   <CreateTask
//                                     onSubmit={(data) =>
//                                       handleSubmitTask({
//                                         ...data,
//                                         statusId: status.id,
//                                       })
//                                     }
//                                     onCancel={() => setShowCreateTask(null)}
//                                     isLoading={isCreatingTask}
//                                   />
//                                 )}
//                                 {status.taskCount === 0 &&
//                                   showCreateTask !== status.id && (
//                                     <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-sm py-4 gap-2">
//                                       <p>No tasks in this status</p>
//                                       <Button
//                                         variant="ghost"
//                                         size="sm"
//                                         className="gap-1"
//                                         onClick={() => handleAddTask(status.id)}
//                                       >
//                                         <Plus className="w-3 h-3" />
//                                         <span>Add Task</span>
//                                       </Button>
//                                     </div>
//                                   )}
//                               </div>
//                             )}
//                           </Droppable>
//                         </div>
//                       )}
//                     </Draggable>
//                   ))}
//                   {/* Placeholder for drag and drop operations */}
//                   {provided.placeholder}

//                   {/* Add Status Column Placeholder - Now inside the Droppable component */}
//                   <div className="flex flex-col w-80 h-full">
//                     <div className="flex items-center justify-between mb-3 px-1">
//                       <div className="flex items-center gap-2">
//                         <h3 className="font-medium text-sm text-muted-foreground">
//                           Add Status
//                         </h3>
//                       </div>
//                       <Tooltip
//                         content="Create a new status"
//                         variant="dark"
//                         delayDuration={500}
//                       >
//                         <button
//                           className="p-1.5 hover:bg-muted rounded-lg transition-colors"
//                           onClick={handleAddStatus}
//                           disabled={isCreatingStatus}
//                         >
//                           <Plus className="w-4 h-4 text-muted-foreground" />
//                         </button>
//                       </Tooltip>
//                     </div>
//                     {/* Add Status Column Content */}
//                     <div className="flex-1 rounded-lg p-2 h-[calc(100vh-12rem)] border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-3">
//                       <div className="rounded-full bg-primary/10 p-3">
//                         <Plus className="w-5 h-5 text-primary" />
//                       </div>
//                       <p className="text-sm text-center text-muted-foreground">
//                         Add a new status column to organize your tasks
//                       </p>
//                       <Button
//                         variant="outline"
//                         className="gap-2 mt-2"
//                         onClick={handleAddStatus}
//                         disabled={isCreatingStatus}
//                       >
//                         <span>
//                           {isCreatingStatus ? "Creating..." : "Create Status"}
//                         </span>
//                         <ArrowRight className="w-4 h-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </Droppable>
//           </div>
//         </DragDropContext>
//       </div>
//     </div>
//   );
// }

//baisc componet for now

export function Board() {
  return <div>Board</div>;
}
