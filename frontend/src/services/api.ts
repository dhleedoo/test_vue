import axios from 'axios';

// API 기본 설정
const API = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 게시글 인터페이스
export interface Board {
  BOARD_ID: number;
  TITLE: string;
  CONTENT: string;
  CREATED_AT: string;
  UPDATED_AT: string;
}

export interface CreateBoardData {
  title: string;
  content: string;
}

export interface UpdateBoardData {
  title: string;
  content: string;
}

// API 응답 인터페이스
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// 게시판 API 서비스
export const boardAPI = {
  // 전체 게시글 조회
  getAllBoards: async (): Promise<Board[]> => {
    const response = await API.get<ApiResponse<Board[]>>('/board');
    return response.data.data || [];
  },

  // 특정 게시글 조회
  getBoardById: async (id: number): Promise<Board> => {
    const response = await API.get<ApiResponse<Board>>(`/board/${id}`);
    if (!response.data.data) {
      throw new Error('게시글을 찾을 수 없습니다.');
    }
    return response.data.data;
  },

  // 새 게시글 작성
  createBoard: async (data: CreateBoardData): Promise<void> => {
    await API.post<ApiResponse<null>>('/board', data);
  },

  // 게시글 수정
  updateBoard: async (id: number, data: UpdateBoardData): Promise<void> => {
    await API.put<ApiResponse<null>>(`/board/${id}`, data);
  },

  // 게시글 삭제
  deleteBoard: async (id: number): Promise<void> => {
    await API.delete<ApiResponse<null>>(`/board/${id}`);
  },
};

export default API;