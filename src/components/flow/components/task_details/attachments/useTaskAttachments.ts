import { useState } from "react";
import useSWR, { mutate } from "swr";
import { TaskAttachmentWithFile } from "@/types";

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

interface UseTaskAttachmentsProps {
  taskId: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useTaskAttachments({ taskId }: UseTaskAttachmentsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 5;

  // Fetch attachments with pagination using SWR
  const { data, isLoading: isFetching } = useSWR<
    PaginatedResponse<TaskAttachmentWithFile>
  >(`/api/task/${taskId}/attachments?page=${page}&limit=${limit}`, fetcher);

  const attachments = data?.data || [];
  const hasMore = data?.pagination ? page < data.pagination.totalPages : false;
  const totalAttachments = data?.pagination?.total || 0;

  // Create attachment
  const createAttachment = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const uploadResponse = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!uploadResponse.ok) {
      const error = await uploadResponse.json();
      throw new Error(error.message || "Failed to upload file");
    }

    const { id: fileId } = await uploadResponse.json();

    const attachmentResponse = await fetch(`/api/task/${taskId}/attachments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileId }),
    });

    if (!attachmentResponse.ok) {
      const error = await attachmentResponse.json();
      throw new Error(error.message || "Failed to create attachment");
    }

    const newAttachment = await attachmentResponse.json();

    // Optimistically update the UI
    mutate(
      `/api/task/${taskId}/attachments?page=${page}&limit=${limit}`,
      (currentData: PaginatedResponse<TaskAttachmentWithFile> | undefined) => {
        if (!currentData) return currentData;
        return {
          ...currentData,
          data: [newAttachment, ...currentData.data],
          pagination: {
            ...currentData.pagination,
            total: currentData.pagination.total + 1,
          },
        };
      },
      false
    );

    // Revalidate the data
    mutate(`/api/task/${taskId}/attachments?page=${page}&limit=${limit}`);
  };

  // Delete attachment
  const deleteAttachment = async (attachmentId: string) => {
    // Optimistically update the UI
    mutate(
      `/api/task/${taskId}/attachments?page=${page}&limit=${limit}`,
      (currentData: PaginatedResponse<TaskAttachmentWithFile> | undefined) => {
        if (!currentData) return currentData;
        return {
          ...currentData,
          data: currentData.data.filter((a) => a.id !== attachmentId),
          pagination: {
            ...currentData.pagination,
            total: currentData.pagination.total - 1,
          },
        };
      },
      false
    );

    const response = await fetch(
      `/api/task/${taskId}/attachments/${attachmentId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete attachment");
    }

    // Revalidate the data
    mutate(`/api/task/${taskId}/attachments?page=${page}&limit=${limit}`);
  };

  // Update cover
  const updateCover = async (attachmentId: string | null) => {
    const response = await fetch(`/api/task/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coverId: attachmentId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update cover");
    }

    // Revalidate the task data
    mutate(`/api/task/${taskId}`);
  };

  const handleDelete = (id: string) => {
    setShowDeleteDialog(id);
  };

  const handleConfirmDelete = async () => {
    if (showDeleteDialog) {
      await deleteAttachment(showDeleteDialog);
      setShowDeleteDialog(null);
    }
  };

  const handleSetCover = (id: string) => {
    updateCover(id);
  };

  const loadMore = () => {
    setPage((p) => p + 1);
  };

  return {
    attachments,
    isFetching,
    hasMore,
    totalAttachments,
    showDeleteDialog,
    setShowDeleteDialog,
    createAttachment,
    deleteAttachment,
    updateCover,
    handleDelete,
    handleConfirmDelete,
    handleSetCover,
    loadMore,
    page,
  };
}
