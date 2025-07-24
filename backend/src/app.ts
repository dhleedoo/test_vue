import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase, closePool } from './config/database';
import boardRoutes from './routes/boardRoutes';

// 환경변수 로드
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors()); // CORS 허용
app.use(express.json()); // JSON 파싱
app.use(express.urlencoded({ extended: true })); // URL 인코딩된 데이터 파싱

// 라우트 설정
app.use('/api/board', boardRoutes);

// 기본 라우트
app.get('/', (req, res) => {
  res.json({
    message: 'Board API Server가 정상적으로 실행중입니다.',
    endpoints: {
      'GET /api/board': '전체 게시글 조회',
      'GET /api/board/:id': '특정 게시글 조회',
      'POST /api/board': '새 게시글 작성',
      'PUT /api/board/:id': '게시글 수정',
      'DELETE /api/board/:id': '게시글 삭제'
    }
  });
});

// 404 에러 처리
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '요청하신 경로를 찾을 수 없습니다.'
  });
});

// 서버 시작
const startServer = async () => {
  try {
    // 데이터베이스 초기화
    await initializeDatabase();
    
    // 서버 시작
    app.listen(PORT, () => {
      console.log(`서버가 포트 ${PORT}에서 실행중입니다.`);
      console.log(`http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('서버 시작 실패:', error);
    process.exit(1);
  }
};

// 애플리케이션 종료 시 정리 작업
process.on('SIGINT', async () => {
  console.log('\n서버를 종료합니다...');
  await closePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n서버를 종료합니다...');
  await closePool();
  process.exit(0);
});

// 서버 시작
startServer();