"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function Headers() {
  const { data: session, status } = useSession();

  return (
    <div className="flex justify-between items-center p-5 mx-auto border border-gray-300">
      <div className="">
        <Image
          src="/insta-icon.png"
          width={50}
          height={50}
          className="block lg:hidden"
        />
        <Image
          src="/insta-text.png"
          width={100}
          height={50}
          className="hidden lg:block"
        />
      </div>
      <div className="">
        <input
          type="text"
          placeholder="Search..."
          className="border-2 border-blue-500 focus:border-blue-700 text-black p-1 px-2 w-80 rounded-lg focus:outline-none"
        />
      </div>
      {session ? (
        <div className="flex items-center space-x-4">
          <Image
            src={session.user.image}
            alt="user image"
            width={50}
            height={50}
            className="rounded-full"
          />
          <p className="text-gray-600 font-semibold">{session.user.name}</p>
          <button
            onClick={() => signOut()}
            className="text-blue-500 font-semibold hover:underline"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <button
          onClick={() => signIn()}
          className="text-blue-500 font-semibold"
        >
          Sign In
        </button>
      )}
    </div>
  );
}
