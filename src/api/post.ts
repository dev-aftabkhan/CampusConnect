import axios from 'axios';

export async function createPostWithImage({
  message,
  mediaType,
  postType,
  mentions,
  media,
}: {
  message: string;
  mediaType: string;
  postType: string;
  mentions: string[];
  media: File[];
}) {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('message', message);
  formData.append('mediaType', mediaType);
  formData.append('postType', postType);
  mentions.forEach((mention) => formData.append('mentions[]', mention));
  media.forEach((file) => formData.append('media', file));

  return axios.post(`${import.meta.env.VITE_API_BASE_URL}/posts`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function createPostWithVideo({
  message,
  mediaType,
  postType,
  media,
  onProgress,
}: {
  message: string;
  mediaType: string;
  postType: string;
  media: File[];
  onProgress?: (percent: number) => void;
}) {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('message', message);
  formData.append('mediaType', mediaType);
  formData.append('postType', postType);
  formData.append('media', media[0]);

  return axios.post(`${import.meta.env.VITE_API_BASE_URL}/posts`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        if (onProgress) onProgress(percent);
        console.log(`Upload Progress: ${percent}%`);
      }
    },
  });
}

export async function editPost(
  postId: string,
  { message, postType }: { message: string; postType: string }
) {
  const token = localStorage.getItem('token');
  return axios.put(
    `${import.meta.env.VITE_API_BASE_URL}/posts/${postId}`,
    { message, postType },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export async function deletePost(postId: string) {
  const token = localStorage.getItem('token');
  return axios.delete(`${import.meta.env.VITE_API_BASE_URL}/posts/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function likePost(postId: string) {
  const token = localStorage.getItem('token');
  return axios.post(`${import.meta.env.VITE_API_BASE_URL}/posts/${postId}/like`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function unlikePost(postId: string) {
  const token = localStorage.getItem('token');
  return axios.post(`${import.meta.env.VITE_API_BASE_URL}/posts/${postId}/unlike`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function addComment(
  postId: string,
  { text, mentions }: { text: string; mentions: string[] }
) {
  const token = localStorage.getItem('token');
  return axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/posts/${postId}/comment`,
    { text, mentions },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export async function deleteComment(postId: string, commentId: string) {
  const token = localStorage.getItem('token');
  return axios.delete(
    `${import.meta.env.VITE_API_BASE_URL}/posts/${postId}/comment/${commentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

// ✅ Added popular post fetch
export async function getPopularPosts() {
  const token = localStorage.getItem('token');
  return axios.get(`${import.meta.env.VITE_API_BASE_URL}/posts/popular`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// ✅ Added recent post fetch
export async function getRecentPosts() {
  const token = localStorage.getItem('token');
  return axios.get(`${import.meta.env.VITE_API_BASE_URL}/posts/recentposts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
