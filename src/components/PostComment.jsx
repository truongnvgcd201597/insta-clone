import { db } from "@/app/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { IoIosSend } from "react-icons/io";

export default function PostComment({ postId }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState([]);
  const [userComment, setUserComment] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const postDoc = await getDoc(doc(db, "posts", postId));
        if (postDoc.exists()) {
          setComments(postDoc.data().comments || []);
        }
      } catch (error) {
        console.error("Error fetching comments: ", error);
      }
    };
    fetchComments();
  }, [postId]);

  const handleCommentSubmit = async () => {
    if (!userComment.trim()) return;

    const newComment = {
      id: Date.now().toString(),
      avatar: session.user.image,
      username: session.user.name,
      comment: userComment,
    };

    try {
      const postDocRef = doc(db, "posts", postId);
      await updateDoc(postDocRef, {
        comments: arrayUnion(newComment),
      });
      setComments((prevComments) => [...prevComments, newComment]);
      setUserComment("");
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  return (
    <div className="p-4">
      {session && (
        <div className="flex items-center mb-4">
          <Image
            src={session.user.image || "/default-avatar.png"}
            alt={session.user.name}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="ml-3 w-full">
            <h1 className="font-semibold">{session.user.name}</h1>
            <div className="flex items-center justify-between space-x-2">
              <input
                type="text"
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                placeholder="Add a comment"
                className="w-full bg-gray-100 border-gray-300 border rounded-lg p-2"
              />
              <button
                onClick={handleCommentSubmit}
                className="bg-blue-500 text-white rounded-lg p-2"
              >
                <IoIosSend className="text-white text-2xl" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Display Comments */}
      <div className="mt-2">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-center space-x-2 mb-2">
            <Image
              src={comment.avatar || "/default-avatar.png"}
              alt={comment.username}
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="font-semibold text-gray-500">
              {comment.username}
            </span>
            <span>{comment.comment}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
