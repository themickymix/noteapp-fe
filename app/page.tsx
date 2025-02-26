"use client"; // Mark this as a Client Component

import React, { useState } from "react";
import Notes from "./note/notes";
import { AddNote } from "./note/add-note";
import Navbar from "@/components/utils/nav-bar";

type Note = {
  _id?: string;
  title: string;
  content: string;
  createdAt?: string;
  isPinned?: boolean;
};

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]); // ✅ Array of Notes
  const [newNote, setNewNote] = useState<Note>({
    title: "",
    content: "",
    isPinned: false,
  }); // ✅ Single Note object
  const [isPinned, setIsPinned] = useState<boolean>(false); // ✅ Boolean state

  return (
    <div className="min-h-screen relative">
      <Navbar />
      <div className="p-4 md:p-10">
        {/* Login & Logout */}
        <div>
    
        </div>
        <AddNote
          setNotes={setNotes}
          setNewNote={setNewNote}
          newNote={newNote}
          setIsPinned={setIsPinned}
          isPinned={isPinned}
        />
        {/* Notes List */}
        <Notes
          setNotes={setNotes}
          notes={notes}
          newNote={newNote}
          setNewNote={setNewNote}
          setIsPinned={setIsPinned}
          isPinned={isPinned}
        />
      </div>
    </div>
  );
}
