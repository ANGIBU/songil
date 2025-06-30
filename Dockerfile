# /home/livon/projects/songil/Dockerfile
FROM python:3.9-slim

# Python 최적화 환경변수
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app

# 필수 패키지 설치
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 비루트 사용자 생성
RUN groupadd -r appuser && useradd -r -g appuser appuser

WORKDIR /app

# requirements 먼저 복사하여 Docker 캐시 최적화
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 파일 복사
COPY . .

# 로그 디렉토리 생성 및 권한 설정
RUN mkdir -p logs && chown -R appuser:appuser /app

# 비루트 사용자로 전환
USER appuser

EXPOSE 5004

# 헬스체크 추가
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:5004/health || exit 1

CMD ["python", "app.py"]