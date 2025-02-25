import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { Dispatch, SetStateAction } from "react";
import { Note } from "../utils/types"; // Ensure this import is correct
import { Pin } from "lucide-react";

export function AddNote({
  setNotes,
  setNewNote,
  newNote,
  setIsPinned,
  isPinned,
}: {
  setNotes: Dispatch<SetStateAction<Note[]>>;
  setNewNote: Dispatch<SetStateAction<Note>>;
  newNote: Note;
  setIsPinned: Dispatch<SetStateAction<boolean>>;
  isPinned: boolean;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  const addNote = async () => {
    if (newNote.title === "" || newNote.content === "") {
      setNewNote({ title: "", content: "", isPinned: false });
    } else {
      const noteToSend: Partial<Note> = {
        ...(newNote.title?.trim() ? { title: newNote.title } : {}),
        ...(newNote.content?.trim() ? { content: newNote.content } : {}),
        isPinned: newNote.isPinned, // ✅ Use `newNote.isPinned` instead
      };

      try {
        const response = await fetch(
          "https://note-be-ql9a.onrender.com/api/notes",
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(noteToSend),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const createdNote: Note = await response.json();
        setNotes((prevNotes) => [createdNote, ...prevNotes]);
        setNewNote({ title: "", content: "", isPinned: false });
        setIsPinned(false);
      } catch (error) {
        console.error("Error adding note:", error);
      }
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (
      componentRef.current &&
      !componentRef.current.contains(event.relatedTarget as Node)
    ) {
      setIsFocused(false);
      addNote();
    }
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoGrow = (element: HTMLTextAreaElement) => {
    if (!element) return;
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  };

  useEffect(() => {
    if (textareaRef.current) {
      autoGrow(textareaRef.current);
    }
  }, [newNote.content]);

  return (
    <div
      ref={componentRef}
      className="w-[400px] justify-self-center mb-10"
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={-1}>
      <div className="border rounded-lg shadow-md w-full bg-white pl-3 mb-0 pb-0">
        <div className="flex">
          {isFocused && (
            <input
              type="text"
              required
              placeholder="Title"
              value={newNote.title || ""}
              className="w-full border-none outline-none text-2xl font-bold bg-transparent"
              spellCheck={false}
              onChange={(e) => {
                setNewNote((prev) => ({ ...prev, title: e.target.value }));
              }}
            />
          )}
          {isFocused && (
            <div className=" rounded-full hover:bg-gray-200 p-1 w-8 h-8 flex justify-center items-center">
              <div
                onClick={() => {
                  setIsPinned(!isPinned);
                  setNewNote((prev) => ({ ...prev, isPinned: !isPinned }));
                }}
                className="cursor-pointer">
                {isPinned ? (
                  <Pin
                    fill="currentColor"
                    strokeWidth={1.5}
                    className="w-5 h-5"
                  />
                ) : (
                  <Pin absoluteStrokeWidth className="w-5 h-5" />
                )}
              </div>
            </div>
          )}
        </div>

        <textarea
          ref={textareaRef}
          onFocus={() => setIsFocused(true)}
          placeholder="Take a note"
          value={newNote.content || ""}
          className="w-full border-none outline-none resize-none bg-transparent min-h-[24px] overflow-hidden"
          spellCheck={false}
          required
          onChange={(e) => {
            setNewNote((prev) => ({ ...prev, content: e.target.value }));
            autoGrow(e.target);
          }}
        />

        {isFocused && (
          <div className="flex justify-end mb-2">
            <Button
              onClick={() => {
                addNote();
                setIsFocused(false);
              }}
              className="bg-transparent text-gray-700 hover:bg-gray-100 h-6">
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
