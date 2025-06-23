FROM node:18-alpine

# 의존성 설치
RUN apk add --no-cache python3 python3-dev build-base

# python 경로 지정
ENV PYTHON=/usr/bin/python3

WORKDIR /app

# 패키지 설치
COPY package*.json ./
RUN npm install -g pm2 && npm install

# 소스 복사
COPY . .

# 컨테이너 실행
CMD ["npm", "start"]