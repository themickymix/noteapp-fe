import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
  useRef,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Menu from "../utils/menu";
import { Pin } from "lucide-react";

type Note = {
  _id?: string;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  isPinned?: boolean;
};

export function EditedNote({
  noteId,
  setNotes,
  onNoteUpdated,
  open,
  setOpen,
  setIsPinned,
  newNote,
}: {
  newNote: Note;
  noteId: string;
  notes: Note[];
  onNoteUpdated: (updatedNote: Note) => void;
  setNotes: Dispatch<SetStateAction<Note[]>>;
  open: boolean;
  setOpen: (open: boolean) => void;
  setIsPinned: Dispatch<SetStateAction<boolean>>;
  isPinned: boolean;
}) {
  const [localNote, setLocalNote] = useState<Note>({
    title: "",
    content: "",
    isPinned: false,
  });
  const [, setTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [contentHeight, setContentHeight] = useState<string>("auto");

  // Auto-grow function that saves the height with max height limit
  const autoGrow = (element: HTMLTextAreaElement) => {
    if (!element) return;
    element.style.height = "auto";
    // Set max height to 60vh (60% of viewport height)
    const maxHeight = Math.floor(window.innerHeight * 0.8);
    const newHeight = Math.min(element.scrollHeight, maxHeight);
    element.style.height = `${newHeight}px`;
    setContentHeight(`${newHeight}px`);
  };

  useEffect(() => {
    if (!noteId) return;

    const fetchNote = async () => {
      try {
        const response = await fetch(`/api/note/${noteId}`, {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        setLocalNote(data);
      } catch (error) {
        console.error("Error fetching the note:", error);
      }
    };

    fetchNote();
  }, [noteId]);

  const updateNote = useCallback(
    async (updatedNote: Note) => {
      if (!updatedNote) return;

      try {
        const response = await fetch(`/api/note/${noteId}`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedNote),
        });

        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        onNoteUpdated(data);
      } catch (error) {
        console.error("Error updating the note:", error);
      }
    },
    [noteId, onNoteUpdated]
  );
  const handleDialogClose = async (open: boolean) => {
    if (!open) {
      // Ensure that we only save if the note has actually changed
      if (
        localNote.title === newNote.title &&
        localNote.content === newNote.content &&
        localNote.isPinned === newNote.isPinned
      ) {
        return setOpen(open);
      }

      await updateNote(localNote);
    }
    setOpen(open);
  };

  // Initial height adjustment when content loads
  useEffect(() => {
    if (textareaRef.current) {
      autoGrow(textareaRef.current);
    }
  }, [localNote.content]);

  // Maintain height when modal opens
  useEffect(() => {
    if (open && textareaRef.current) {
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          autoGrow(textareaRef.current);
        }
      });
    }
  }, [open]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <button onClick={() => setOpen(true)}></button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] md:w-[90%] h-auto rounded-lg">
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <div className="flex flex-col">
          <textarea
            value={localNote.title}
            placeholder="Title"
            className="border-none outline-none p-0 m-0 bg-transparent font-bold text-lg md:min-h-[24px] resize-none overflow-hidden"
            spellCheck={false}
            onChange={(e) => {
              setTyping(true);
              setLocalNote((prev) => ({ ...prev, title: e.target.value }));
            }}
            rows={1}
          />
          <textarea
            ref={textareaRef}
            placeholder="Take a note"
            value={localNote.content}
            style={{ height: contentHeight }}
            className="border-none outline-none p-0 m-0 w-full bg-transparent h-full md:min-h-[24px] resize-none overflow-y-auto"
            spellCheck={false}
            onChange={(e) => {
              setTyping(true);
              setLocalNote((prev) => ({ ...prev, content: e.target.value }));
              autoGrow(e.target);
            }}
            onFocus={() => {
              if (textareaRef.current) {
                autoGrow(textareaRef.current);
              }
            }}
          />
        </div>
        <DialogFooter>
          <div className="flex justify-between gap-2 w-full">
            <div className="text-[10px] flex items-center">
        
              {formatDate(localNote.createdAt || "")}
            </div>
            <div className="flex items-center gap-2 justify-self-end">
            
              <div
                onClick={() => {
                  const newPinnedState = !localNote.isPinned;
                  setLocalNote((prev) => ({
                    ...prev,
                    isPinned: newPinnedState,
                  }));
                  setIsPinned(newPinnedState);
                }}
                className="cursor-pointer">
                {localNote.isPinned ? (
                  <Pin
                    fill="currentColor"
                    strokeWidth={1.5}
                    className="w-5 h-5"
                  />
                ) : (
                  <Pin className="w-5 h-5" />
                )}
              </div>
              <Menu noteId={noteId} setNotes={setNotes} setOpen={setOpen} />
            </div>
          </div>
          {/*    <div className="h-[15%] mt-4 flex justify-between items-center">
           
            <div className="fixed text-[10px] flex items-center left-8">
              {formatDate(localNote.createdAt || "")}
            </div>

          
            <div className="flex items-center gap-2 justify-self-end">
              <div
                onClick={() => {
                  const newPinnedState = !localNote.isPinned;
                  setLocalNote((prev) => ({
                    ...prev,
                    isPinned: newPinnedState,
                  }));
                  setIsPinned(newPinnedState);
                }}
                className="cursor-pointer">
                {localNote.isPinned ? (
                  <Pin
                    fill="currentColor"
                    strokeWidth={1.5}
                    className="w-5 h-5"
                  />
                ) : (
                  <Pin className="w-5 h-5" />
                )}
              </div>

              <Menu noteId={noteId} setNotes={setNotes} setOpen={setOpen} />
            </div>
          </div> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
