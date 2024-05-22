"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import { MdAddAPhoto } from "react-icons/md";
import Modal from "react-modal";

export default function Headers() {
  const { data: session } = useSession();
  const [modalIsOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "40%",
      padding: "0",
      borderRadius: "8px",
    },
  };

  return (
    <div className="flex justify-between items-center p-5 mx-auto border border-gray-300">
      <div>
        <Image
          src="/insta-icon.png"
          width={50}
          height={50}
          className="block lg:hidden"
          alt="Insta Icon"
        />
        <Image
          src="/insta-text.png"
          width={100}
          height={50}
          className="hidden lg:block"
          alt="Insta Text"
        />
      </div>
      <div>
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
          <button onClick={openModal}>
            <CiCirclePlus size={30} className="text-blue-500" />
          </button>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Upload Modal"
          >
            <div className="relative bg-white py-8 flex flex-col justify-center items-center rounded-md">
              <button onClick={closeModal} className="absolute top-5 right-5">
                <IoClose className="text-2xl cursor-pointer" />
              </button>
              <MdAddAPhoto className="text-5xl" />
              <input
                type="text"
                className="border-2 border-gray-300 p-1 px-2 w-80 rounded-lg focus:outline-none mt-4"
                placeholder="Add caption..."
              />
              <button className="bg-blue-500 text-white w-1/2 p-1 px-2 rounded-lg mt-2">
                Upload
              </button>
            </div>
          </Modal>
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
