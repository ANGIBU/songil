class RankingService:
    def __init__(self, db_manager):
        self.db = db_manager
    
    def get_rankings(self, limit=10, period='all'):
        """순위 데이터 조회"""
        try:
            # 기간 필터링을 위한 SQL 조건
            date_condition = ""
            if period == 'week':
                date_condition = "AND r.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)"
            elif period == 'month':
                date_condition = "AND r.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)"
            
            # MySQL 쿼리
            query = f"""
                SELECT 
                    u.id,
                    u.nickname as name,
                    u.points,
                    COALESCE(report_count.count, 0) as reports,
                    COALESCE(recent_reports.count, 0) as recent_activity
                FROM users u
                LEFT JOIN (
                    SELECT 
                        user_id, 
                        COUNT(*) as count
                    FROM reports 
                    WHERE is_approved = 1 {date_condition}
                    GROUP BY user_id
                ) report_count ON u.id = report_count.user_id
                LEFT JOIN (
                    SELECT 
                        user_id, 
                        COUNT(*) as count
                    FROM reports 
                    WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                        AND is_approved = 1
                    GROUP BY user_id
                ) recent_reports ON u.id = recent_reports.user_id
                WHERE u.points > 0
                ORDER BY u.points DESC, recent_reports.count DESC
                LIMIT %s
            """
            
            # DB 쿼리 실행 (기존 DBManager 방식 사용)
            results = self.db.execute_query(query, (limit,))
            
            # 결과 포맷팅
            rankings = []
            for idx, row in enumerate(results):
                rankings.append({
                    'position': idx + 1,
                    'user_id': row[0],
                    'name': row[1],
                    'points': int(row[2]) if row[2] else 0,
                    'reports': int(row[3]) if row[3] else 0,
                    'witnesses': int(row[4]) if row[4] else 0
                })
            
            return rankings
            
        except Exception as e:
            print(f"랭킹 조회 오류: {str(e)}")
            return []
    
    def get_user_ranking(self, user_id):
        """특정 사용자의 순위 정보"""
        try:
            query = """
                SELECT 
                    user_rank.rank,
                    user_rank.points,
                    user_rank.reports,
                    user_rank.nickname
                FROM (
                    SELECT 
                        u.id,
                        u.nickname,
                        u.points,
                        COALESCE(r.report_count, 0) as reports,
                        ROW_NUMBER() OVER (ORDER BY u.points DESC) as rank
                    FROM users u
                    LEFT JOIN (
                        SELECT user_id, COUNT(*) as report_count
                        FROM reports 
                        WHERE is_approved = 1
                        GROUP BY user_id
                    ) r ON u.id = r.user_id
                    WHERE u.points > 0
                ) user_rank
                WHERE user_rank.id = %s
            """
            
            result = self.db.execute_query(query, (user_id,))
            
            if result:
                row = result[0]
                return {
                    'user_id': user_id,
                    'rank': row[0],
                    'points': row[1],
                    'reports': row[2],
                    'nickname': row[3]
                }
            
            return None
            
        except Exception as e:
            print(f"사용자 랭킹 조회 오류: {str(e)}")
            return None
    
    def get_ranking_stats(self):
        """랭킹 통계 정보"""
        try:
            query = """
                SELECT 
                    (SELECT COUNT(*) FROM users) as total_users,
                    (SELECT SUM(points) FROM users) as total_points,
                    (SELECT COUNT(*) FROM reports WHERE is_approved = 1) as total_reports,
                    (SELECT COUNT(*) FROM missing_persons WHERE is_approved = 1) as total_missing_cases,
                    (SELECT AVG(points) FROM users WHERE points > 0) as average_points
            """
            
            result = self.db.execute_query(query)
            
            if result:
                row = result[0]
                return {
                    'total_users': row[0],
                    'total_points': int(row[1]) if row[1] else 0,
                    'total_reports': row[2],
                    'total_missing_cases': row[3],
                    'average_points': round(float(row[4]), 2) if row[4] else 0
                }
            
            return {}
            
        except Exception as e:
            print(f"랭킹 통계 조회 오류: {str(e)}")
            return {}
    
    def award_points_for_report(self, user_id, points=100):
        """제보 승인 시 포인트 지급"""
        try:
            # 트랜잭션 시작
            self.db.begin_transaction()
            
            # 사용자 포인트 업데이트
            update_query = """
                UPDATE users 
                SET points = points + %s 
                WHERE id = %s
            """
            self.db.execute_query(update_query, (points, user_id))
            
            # 포인트 히스토리 기록 (테이블이 있다면)
            history_query = """
                INSERT INTO points_history (user_id, change_amount, reason, created_at)
                VALUES (%s, %s, %s, NOW())
            """
            self.db.execute_query(history_query, (user_id, points, '제보 승인 보상'))
            
            # 트랜잭션 커밋
            self.db.commit_transaction()
            return True
            
        except Exception as e:
            # 트랜잭션 롤백
            self.db.rollback_transaction()
            print(f"포인트 지급 오류: {str(e)}")
            return False