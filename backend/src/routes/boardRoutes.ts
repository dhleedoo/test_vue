import { Router } from 'express';
import {
  getAllBoards,
  getBoardById,
  createBoard,
  updateBoard,
  deleteBoard
} from '../controllers/boardController';
import { getBoardsByPage } from '../controllers/boardController';

const router = Router();

// GET /api/board - 전체 게시글 조회
router.get('/', getAllBoards);

// GET /api/board/page - 게시글 페이지네이션
router.get('/page', getBoardsByPage);

// GET /api/board/:id - 특정 게시글 조회
router.get('/:id', getBoardById);

// POST /api/board - 새 게시글 작성
router.post('/', createBoard);


// PUT /api/board/:id - 게시글 수정
router.put('/:id', updateBoard);


// DELETE /api/board/:id - 게시글 삭제
router.delete('/:id', deleteBoard);


export default router;