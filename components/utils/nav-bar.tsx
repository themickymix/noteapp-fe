import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { LogoutModal } from "./logout-modal";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

function Navbar() {
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState("Loading...");

  useEffect(() => {
    // ✅ Ensure this only runs on the client
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    (async () => {
      try {
        const { data } = await axios.get(
          `/api/user/${userId}`,
          {
            withCredentials: true,
          }
        );

        setUsername(data.name || "Guest");
      } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>; // Define response type

        const errorMessage =
          axiosError.response?.data?.message || "Something went wrong";

        console.error(errorMessage);
        setUsername("Guest");
      }
    })();
  }, [userId]);

  return (
    <div className="h-14 px-4 md:px-10 bg-white shadow-md flex justify-between items-center">
      <div className="text-lg font-semibold">NoteAPP</div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">{username}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full">
          <LogoutModal />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default Navbar;
