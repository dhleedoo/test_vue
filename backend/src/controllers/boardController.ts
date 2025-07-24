import { Request, Response } from 'express';
import { getConnection } from '../config/database';
import oracledb from 'oracledb';

// 게시글 인터페이스
interface Board {
  BOARD_ID: number;
  TITLE: string;
  CONTENT: string;
  CREATED_AT: Date;
  UPDATED_AT: Date;
}

// 전체 게시글 조회
export const getAllBoards = async (req: Request, res: Response): Promise<void> => {
  let connection;
  
  try {
    connection = await getConnection();
    
    const result = await connection.execute(
      'SELECT BOARD_ID, TITLE, CONTENT, CREATED_AT, UPDATED_AT FROM BOARD ORDER BY CREATED_AT DESC',
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('게시글 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '게시글을 가져오는데 실패했습니다.'
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

// 특정 게시글 조회
export const getBoardById = async (req: Request, res: Response): Promise<void> => {
  let connection;
  const { id } = req.params;
  
  try {
    connection = await getConnection();
    
    const result = await connection.execute(
      'SELECT BOARD_ID, TITLE, CONTENT, CREATED_AT, UPDATED_AT FROM BOARD WHERE BOARD_ID = :id',
      [id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    
    if (result.rows && result.rows.length > 0) {
      res.json({
        success: true,
        data: result.rows[0]
      });
    } else {
      res.status(404).json({
        success: false,
        message: '게시글을 찾을 수 없습니다.'
      });
    }
  } catch (error) {
    console.error('게시글 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '게시글을 가져오는데 실패했습니다.'
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

// 새 게시글 작성
export const createBoard = async (req: Request, res: Response): Promise<void> => {
  let connection;
  const { title, content } = req.body;
  
  if (!title || !content) {
    res.status(400).json({
      success: false,
      message: '제목과 내용을 입력해주세요.'
    });
    return;
  }
  
  try {
    connection = await getConnection();
    
    const result = await connection.execute(
      'INSERT INTO BOARD (TITLE, CONTENT) VALUES (:title, :content)',
      [title, content],
      { autoCommit: true }
    );
    
    res.status(201).json({
      success: true,
      message: '게시글이 성공적으로 작성되었습니다.'
    });
  } catch (error) {
    console.error('게시글 작성 오류:', error);
    res.status(500).json({
      success: false,
      message: '게시글 작성에 실패했습니다.'
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

// 게시글 수정
export const updateBoard = async (req: Request, res: Response): Promise<void> => {
  let connection;
  const { id } = req.params;
  const { title, content } = req.body;
  
  if (!title || !content) {
    res.status(400).json({
      success: false,
      message: '제목과 내용을 입력해주세요.'
    });
    return;
  }
  
  try {
    connection = await getConnection();
    
    const result = await connection.execute(
      'UPDATE BOARD SET TITLE = :title, CONTENT = :content, UPDATED_AT = CURRENT_TIMESTAMP WHERE BOARD_ID = :id',
      [title, content, id],
      { autoCommit: true }
    );
    
    if (result.rowsAffected && result.rowsAffected > 0) {
      res.json({
        success: true,
        message: '게시글이 성공적으로 수정되었습니다.'
      });
    } else {
      res.status(404).json({
        success: false,
        message: '수정할 게시글을 찾을 수 없습니다.'
      });
    }
  } catch (error) {
    console.error('게시글 수정 오류:', error);
    res.status(500).json({
      success: false,
      message: '게시글 수정에 실패했습니다.'
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

// 게시글 삭제
export const deleteBoard = async (req: Request, res: Response): Promise<void> => {
  let connection;
  const { id } = req.params;
  
  try {
    connection = await getConnection();
    
    const result = await connection.execute(
      'DELETE FROM BOARD WHERE BOARD_ID = :id',
      [id],
      { autoCommit: true }
    );
    
    if (result.rowsAffected && result.rowsAffected > 0) {
      res.json({
        success: true,
        message: '게시글이 성공적으로 삭제되었습니다.'
      });
    } else {
      res.status(404).json({
        success: false,
        message: '삭제할 게시글을 찾을 수 없습니다.'
      });
    }
  } catch (error) {
    console.error('게시글 삭제 오류:', error);
    res.status(500).json({
      success: false,
      message: '게시글 삭제에 실패했습니다.'
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};