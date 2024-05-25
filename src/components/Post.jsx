import Image from "next/image";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiMessageRounded } from "react-icons/bi";
import PostLike from "./PostLike";
import PostComment from "./PostComment";
export default function Post({ post }) {
  return (
    <div
      key={post.id}
      className="bg-white border border-gray-300 rounded-lg w-full md:w-1/2 lg:w-1/3"
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <Image
            src={post.avatar || "/default-avatar.png"}
            alt={post.username}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="ml-3">
            <h1 className="font-semibold">{post.username}</h1>
          </div>
        </div>
        <BsThreeDotsVertical className="text-gray-500 hover:text-gray-700" />
      </div>
      <div className="w-full bg-gray-100 border border-gray-300">
        <Image src={post.image} alt={post.username} width={500} height={500} />
      </div>
      {/* Post Actions */}
      <div className="p-4">
        <div className="flex space-x-4">
          <PostLike postId={post.id} />
          <div className="flex items-center space-x-1">
            <BiMessageRounded className="text-gray-500 text-2xl cursor-pointer" />
            <p className="text-gray-500 font-bold text-md">
              {post.comments ? post.comments.length : 0} Comments
            </p>
          </div>
        </div>
        {/* Post Caption */}
        {post.caption && (
          <div className="mt-2">
            <span className="font-semibold mr-2 text-gray-500">
              {post.username}
            </span>
            <span>{post.caption}</span>
          </div>
        )}
        {/* Post comment */}
        <PostComment postId={post.id} />
      </div>
    </div>
  );
}
