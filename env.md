## 환경변수 설정
backend/.env 파일 생성 필요

## .env 작성 내용
# Oracle Database 설정
DB_USER = test
DB_PASSWORD = 1111
DB_CONNECTION_STRING = 192.168.0.118:1521/XE

# Oracle Client 설정 -- Linux 필요
# ORACLE_CLIENT_LIB_DIR=C:\util\oracle\instantclient_21_18

# 서버 설정
PORT=3000

# code