import { api } from "@/api/axios";
import { Post, Proposal } from "@/types/post.types";

// ─── Client-facing post/proposal calls ─────────────────────────────────────────

export const getMyPosts = (page = 1, limit = 10) =>
  api.get<{ data: Post[]; total: number; page: number; limit: number; totalPages: number }>(
    "/posts/my",
    { params: { page, limit } }
  );

export const getPostById = (postId: string) =>
  api.get<{ data: Post } | Post>(`/posts/${postId}`);

export const getProposals = (postId: string) =>
  api.get<Proposal[] | { data: Proposal[] }>(`/posts/${postId}/proposals`);

export const acceptProposal = (postId: string, proposalId: string) =>
  api.patch(`/posts/${postId}/proposals/${proposalId}/accept`);

export const cancelPost = (postId: string) =>
  api.patch(`/posts/${postId}/cancel`);