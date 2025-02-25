import React from "react";
import { Dispatch, SetStateAction } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVerticalIcon } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
type Note = {
  _id?: string;
  title: string;
  content: string;
  createdAt?: string;
};

function Menu({
  noteId,
  setNotes,
  setOpen,
}: {
  noteId: string;
  setNotes: Dispatch<SetStateAction<Note[]>>;
  setOpen: (open: boolean) => void;
}) {
  const deleteNote = async (id: string) => {
    try {
      await axios.delete(`/api/notes/${id}`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
      toast.success("Note deleted successfully");
    } catch (error) {
      console.error("Error deleting note:", error);
    }
    setOpen(false);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className=" ring-0 border-0 focus:ring-0 focus:outline-none hover:bg-gray-200 p-1 rounded-full">
        <EllipsisVerticalIcon className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => deleteNote(noteId)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Menu;
