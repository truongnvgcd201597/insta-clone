"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import { MdAddAPhoto } from "react-icons/md";
import Modal from "react-modal";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/app/firebase";
import { addDoc, collection } from "firebase/firestore";

export default function Headers() {
  const { data: session } = useSession();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setPreviewImage(null);
    setSelectedFile(null);
    setCaption("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handlePhotoUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      console.error("No file selected");
      return;
    }

    setUploading(true);

    try {
      const fileRef = ref(storage, `images/${selectedFile.name}`);
      await uploadBytes(fileRef, selectedFile);
      const downloadURL = await getDownloadURL(fileRef);

      const docRef = await addDoc(collection(db, "posts"), {
        username: session.user.name,
        email: session.user.email,
        image: downloadURL,
        caption: caption,
        timestamp: new Date(),
      });

      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
      closeModal();
    }
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
                type="file"
                accept="image/*"
                name="file"
                id="file"
                className="w-1/2"
                onChange={handleFileChange}
              />
              {previewImage && (
                <div className="mb-2 w-1/2 p-1 rounded-lg mt-2 border">
                  <Image
                    src={previewImage}
                    className="rounded-lg transition duration-200 ease-in-out hover:scale-105 cursor-pointer"
                    alt="Selected Image Preview"
                    width={200}
                    height={200}
                  />
                </div>
              )}
              <input
                type="text"
                name="caption"
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption..."
                className="w-1/2 p-1 px-2 rounded-lg mt-2 border border-gray-300 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handlePhotoUpload}
                className="bg-blue-500 text-white w-1/2 p-1 px-2 rounded-lg mt-2"
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload"}
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
