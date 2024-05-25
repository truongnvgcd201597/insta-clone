import { db } from "@/app/firebase";
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useSession } from "next-auth/react"; // Assuming you're using next-auth for session management

export default function PostLike({ postId }) {
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const { data: session } = useSession(); // Get the current user session

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const postDoc = await getDoc(doc(db, "posts", postId));
        console.log(postDoc.data().likes);
        if (postDoc.exists()) {
          setLikes(postDoc.data().likes || []);
          if (session) {
            setHasLiked(postDoc.data().likes.includes(session.user.email));
          }
        }
      } catch (error) {
        console.error("Error fetching likes: ", error);
      }
    };

    fetchLikes();
  }, [postId, session]);

  const handleLike = async () => {
    if (!session) return; // If user is not logged in, do nothing

    const postDocRef = doc(db, "posts", postId);
    try {
      if (hasLiked) {
        await updateDoc(postDocRef, {
          likes: arrayRemove(session.user.email),
        });
        setLikes((prevLikes) =>
          prevLikes.filter((email) => email !== session.user.email)
        );
        setHasLiked(false);
      } else {
        await updateDoc(postDocRef, {
          likes: arrayUnion(session.user.email),
        });
        setLikes((prevLikes) => [...prevLikes, session.user.email]);
        setHasLiked(true);
      }
    } catch (error) {
      console.error("Error updating likes: ", error);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {hasLiked ? (
        <FaHeart
          className="text-red-500 text-2xl cursor-pointer"
          onClick={handleLike}
        />
      ) : (
        <FaRegHeart
          className="text-red-500 text-2xl cursor-pointer"
          onClick={handleLike}
        />
      )}
      <p className="text-gray-500 font-bold text-md">{likes.length} Likes</p>
    </div>
  );
}
