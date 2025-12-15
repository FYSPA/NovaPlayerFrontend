"use client";
import useUser from "@/hooks/useUser";

export default function HeaderLibrary() {
    const { user, loading: userLoading } = useUser();
    if (userLoading) return null;

    return (
        <div className="p-4 border-b border-gray-700">
            <h1 className="text-4xl font-bold">Your playlist {user?.name}</h1>
        </div>
    );
}