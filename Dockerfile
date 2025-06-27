# /home/livon/projects/[프로젝트명]/Dockerfile

FROM python:3.11.9-slim

# 작업 디렉터리 설정
WORKDIR /app

# 시스템 패키지 업데이트 및 필요한 패키지 설치
RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Python 의존성 복사 및 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 코드 복사
COPY . .

# 권한 설정
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# 포트 노출 (각 프로젝트별로 조정)
# Portfolio: 5002, Songil: 5004, Tutu: 5005
EXPOSE 5004

# 환경변수 설정
ENV FLASK_APP=app.py
ENV FLASK_ENV=production

# 헬스체크 추가 (각 프로젝트별로 포트 조정)
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:5002/health || exit 1

# 시작 명령
CMD ["python", "app.py"]