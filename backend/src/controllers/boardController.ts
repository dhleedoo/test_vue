import { Request, Response } from 'express';
import { getConnection } from '../config/database';
import oracledb from 'oracledb';

// 게시글 인터페이스
interface Board {
  BOARD_ID: number;
  TITLE: string;
  CONTENT: string;
  EXCEL_DATA?: any;
  CREATED_AT: Date;
  UPDATED_AT: Date;
}

// 전체 게시글 조회
export const getAllBoards = async (req: Request, res: Response): Promise<void> => {
  let connection;
  
  try {
    connection = await getConnection();
    
    const result = await connection.execute(
      'SELECT BOARD_ID, TITLE, CONTENT, EXCEL_DATA, CREATED_AT, UPDATED_AT FROM BOARD ORDER BY CREATED_AT DESC',
      [],
      { 
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        fetchInfo: {
          CONTENT: { type: oracledb.DB_TYPE_VARCHAR }  // CLOB을 문자열로 변환
        }
      }
    );
    
    // Oracle JSON 타입은 자동으로 객체로 변환됨
    const processedRows = result.rows;
    
    res.json({
      success: true,
      data: processedRows
    });
  } catch (error) {
    // console.error('게시글 조회 오류:', error);
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
      'SELECT BOARD_ID, TITLE, CONTENT, EXCEL_DATA, CREATED_AT, UPDATED_AT FROM BOARD WHERE BOARD_ID = :id',
      [id],
      { 
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        fetchInfo: {
          CONTENT: { type: oracledb.STRING }  // CLOB을 문자열로 변환
        }
      }
    );
    
    if (result.rows && result.rows.length > 0) {
      // Oracle JSON 타입은 자동으로 객체로 변환됨
      const boardData = result.rows[0] as any;
      
      res.json({
        success: true,
        data: boardData
      });
    } else {
      res.status(404).json({
        success: false,
        message: '게시글을 찾을 수 없습니다.'
      });
    }
  } catch (error) {
    // console.error('게시글 조회 오류:', error);
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
  const { title, content, excelData } = req.body;
  
  if (!title || !content) {
    res.status(400).json({
      success: false,
      message: '제목과 내용을 입력해주세요.'
    });
    return;
  }
  
  // JSON 데이터 유효성 검사
  if (excelData && typeof excelData !== 'object') {
    res.status(400).json({
      success: false,
      message: '유효하지 않은 Excel 데이터 형식입니다.'
    });
    return;
  }
  
  try {
    connection = await getConnection();
    
    const result = await connection.execute(
      'INSERT INTO BOARD (TITLE, CONTENT, EXCEL_DATA) VALUES (:title, :content, :excelData)',
      {
        title: title,
        content: content,
        excelData: {
          val: excelData || null,
          type: oracledb.DB_TYPE_JSON
        }
      },
      { autoCommit: true }
    );
    
    res.status(201).json({
      success: true,
      message: '게시글이 성공적으로 작성되었습니다.'
    });
  } catch (error) {
    // console.error('게시글 작성 오류:', error);
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
  const { title, content, excelData } = req.body;
  
  if (!title || !content) {
    res.status(400).json({
      success: false,
      message: '제목과 내용을 입력해주세요.'
    });
    return;
  }
  
  // JSON 데이터 유효성 검사
  if (excelData && typeof excelData !== 'object') {
    res.status(400).json({
      success: false,
      message: '유효하지 않은 Excel 데이터 형식입니다.'
    });
    return;
  }
  
  try {
    connection = await getConnection();
    
    const result = await connection.execute(
      'UPDATE BOARD SET TITLE = :title, CONTENT = :content, EXCEL_DATA = :excelData, UPDATED_AT = CURRENT_TIMESTAMP WHERE BOARD_ID = :id',
      {
        title: title,
        content: content,
        excelData: {
          val: excelData || null,
          type: oracledb.DB_TYPE_JSON
        },
        id: id
      },
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
    // console.error('게시글 수정 오류:', error);
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
    // console.error('게시글 삭제 오류:', error);
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
export const getBoardsByPage = async (req: Request, res: Response): Promise<void> => {
  let connection;
  const page = Number(req.query.page) || 1;
  const keyword = (req.query.keyword as string) || '';
  const itemsPerPage = 10;

  try {
    connection = await getConnection();

    let whereClause = '';
    const bindParams: any = { offset: (page - 1) * itemsPerPage, maxRow: page * itemsPerPage };

    if (keyword.trim()) {
      whereClause = 'WHERE TITLE LIKE :keyword';
      bindParams.keyword = `%${keyword.trim()}%`;
    }

    const query = `
      SELECT * FROM (
        SELECT 
          BOARD_ID, TITLE, CONTENT, EXCEL_DATA, CREATED_AT, UPDATED_AT,
          ROW_NUMBER() OVER (ORDER BY BOARD_ID DESC) AS RN
        FROM BOARD
        ${whereClause}
      ) WHERE RN > :offset AND RN <= :maxRow
      ORDER BY BOARD_ID DESC
    `;

    // 게시글 페이징 조회
    const result = await connection.execute(
      query,
      bindParams,
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        fetchInfo: {
          CONTENT: { type: oracledb.STRING }
        }
      }
    );

    // 전체 게시글 수 조회 (count)
    const countBindParams: any = {};
    if (keyword.trim()) {
      countBindParams.keyword = `%${keyword.trim()}%`;
    }

    const countQuery = `
      SELECT COUNT(*) AS TOTAL_COUNT FROM BOARD
      ${whereClause}
    `;

    const countResult = await connection.execute(
      countQuery,
      countBindParams,
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT // 이 부분이 꼭 필요합니다!
      }
    );

    const totalCount = Number((countResult.rows?.[0] as { TOTAL_COUNT: number })?.TOTAL_COUNT ?? 0);
    const totalPages = Math.ceil(totalCount / itemsPerPage);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page,
        totalPages,
        totalCount,
        itemsPerPage
      }
    });
  } catch (error) {
    console.error('[getBoardsByPage] 오류 발생:', error);
    res.status(500).json({
      success: false,
      message: '게시글을 가져오는데 실패했습니다.'
    });
  } finally {
    if (connection) await connection.close();
  }
};