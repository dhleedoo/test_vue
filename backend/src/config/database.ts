import oracledb from 'oracledb';
import dotenv from 'dotenv';

// 환경변수 로드
dotenv.config();

// Oracle DB 연결 설정
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECTION_STRING,
  poolMin: 1,
  poolMax: 10,
  poolIncrement: 1
};

// 커넥션 풀 생성
let pool: oracledb.Pool;

export const initializeDatabase = async (): Promise<void> => {
  try {
    // Oracle 클라이언트 초기화 (Windows 환경)
    oracledb.initOracleClient({ libDir: 'C:\\util\\oracle\\instantclient_21_18' });
    
    // 커넥션 풀 생성
    pool = await oracledb.createPool(dbConfig);
    console.log('Oracle Database 연결 성공');
  } catch (error) {
    console.error('Database 연결 실패:', error);
    process.exit(1);
  }
};

// 데이터베이스 연결 가져오기
export const getConnection = async (): Promise<oracledb.Connection> => {
  try {
    return await pool.getConnection();
  } catch (error) {
    console.error('Connection 가져오기 실패:', error);
    throw error;
  }
};

// 애플리케이션 종료 시 풀 닫기
export const closePool = async (): Promise<void> => {
  try {
    await pool.close();
    console.log('Database pool 종료');
  } catch (error) {
    console.error('Pool 종료 실패:', error);
  }
};