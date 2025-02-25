import React, { useState, useEffect } from "react";
import axios from "axios";
import Menu from "../utils/menu";
import { Dispatch, SetStateAction } from "react";
import { EditedNote } from "./edited";
import { AnimatePresence, motion } from "motion/react";

type Note = {
  _id?: string;
  title: string;
  content: string;
  isPinned?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

function Notes({
  notes,
  setNotes,
  newNote,
  setNewNote,
  isPinned,
  setIsPinned,
}: {
  notes: Note[];
  setNotes: Dispatch<SetStateAction<Note[]>>;
  setNewNote: Dispatch<SetStateAction<Note>>;
  newNote: Note;
  setIsPinned: Dispatch<SetStateAction<boolean>>;
  isPinned: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get(
          `https://note-be-ql9a.onrender.com/api/notes`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const fetchedNotes = Array.isArray(response.data) ? response.data : [];
        setNotes(fetchedNotes.reverse());
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };
    fetchNotes();
  }, [newNote, setNotes, setNewNote]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleOpenDialog = (id: string) => {
    setSelectedNoteId(id);
    setOpen(true);
  };

  // Separate pinned and unpinned notes
  const pinnedNotes = notes.filter((note) => note.isPinned);
  const unpinnedNotes = notes.filter((note) => !note.isPinned);

  return (
    <div>
      {/* Pinned Notes Section */}
      {pinnedNotes.length > 0 && (
        <div>
          <span className="text-[10px] font-bold m-2 text-gray-500">
            PINNED{" "}
          </span>
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
            <AnimatePresence>
              {pinnedNotes
                .filter((note) => note.title && note.content)
                .map((note, index) => (
                  <motion.div
                    key={note._id ?? index}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="category w-full cursor-pointer mb-4 break-inside-avoid animate-in">
                    <div className="flex flex-col justify-between border border-gray-200 rounded-md p-2">
                      <div
                        className="h-[85%] p-2"
                        onClick={() => handleOpenDialog(note._id ?? "")}>
                        <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                          {note.title}
                        </h3>
                        <p className="line-clamp-[10]">{note.content}</p>
                      </div>
                      <div className="h-[15%] mt-4 flex justify-between items-center">
                        <span className="text-[10px] flex items-center justify-center h-full">
                          {formatDate(note.createdAt ?? "")}
                        </span>
                        <Menu
                          noteId={note._id ?? ""}
                          setNotes={setNotes}
                          setOpen={setOpen}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Unpinned Notes Section */}
      {unpinnedNotes.length > 0 && (
        <div className="mt-6">
          <span className="text-[10px] font-bold m-2 text-gray-500">
            OTHERS
          </span>
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
            <AnimatePresence>
              {unpinnedNotes
                .filter((note) => note.title && note.content)
                .map((note, index) => (
                  <motion.div
                    key={note._id ?? index}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="category w-full cursor-pointer mb-4 break-inside-avoid animate-in">
                    <div className="flex flex-col justify-between border border-gray-200 rounded-md p-2">
                      <div
                        className="h-[85%] p-2"
                        onClick={() => handleOpenDialog(note._id ?? "")}>
                        <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                          {note.title}
                        </h3>
                        <p className="line-clamp-[10]">{note.content}</p>
                      </div>
                      <div className="h-[15%] mt-4 flex justify-between items-center">
                        <span className="text-[10px] flex items-center justify-center h-full">
                          {formatDate(
                            note.updatedAt && note.updatedAt !== note.createdAt
                              ? note.updatedAt
                              : note.createdAt || ""
                          )}
                        </span>
                        <Menu
                          noteId={note._id ?? ""}
                          setNotes={setNotes}
                          setOpen={setOpen}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {selectedNoteId && (
        <EditedNote
          newNote={newNote}
          noteId={selectedNoteId}
          onNoteUpdated={setNewNote}
          notes={notes}
          setNotes={setNotes}
          open={open}
          setOpen={setOpen}
          isPinned={isPinned}
          setIsPinned={setIsPinned}
        />
      )}
    </div>
  );
}

export default Notes;
