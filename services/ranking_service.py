class RankingService:
    def __init__(self, db_manager):
        self.db = db_manager
    
    def get_rankings(self, limit=10, period='all'):
        """신고 많은 순 랭킹 조회"""
        try:
            query = """
                SELECT
                    id,
                    nickname AS name,
                    points,
                    alert_report_count AS reports
                FROM users
                ORDER BY alert_report_count DESC
                LIMIT %s
            """
            results = self.db.execute_query(query, (limit,))
            
            rankings = []
            for idx, row in enumerate(results):
                rankings.append({
                    'position': idx + 1,
                    'user_id': row['id'], 
                    'name': row['name'],         
                    'points': row['points'],     
                    'reports': row['reports'],   
                })
            
            return rankings

        except Exception as e:
            print(f"신고 랭킹 조회 오류: {str(e)}")
            return []
        
    def get_ranking_stats(self):
        """랭킹 통계 정보"""
        try:
            query = """
                SELECT 
                    COUNT(CASE WHEN alert_report_count > 0 THEN 1 END) AS total_users,
                    (
                        SELECT COUNT(*) FROM missing_reports WHERE approved = TRUE
                    ) + (
                        SELECT COUNT(*) FROM witness_reports WHERE is_approved = TRUE
                    ) AS total_reports
                FROM users
            """
            result = self.db.execute_query(query)

            if result:
                row = result[0]
                return {
                    'total_users': row['total_users'] or 0,
                    'total_reports': row['total_reports'] or 0
                }

            return { 'total_users': 0, 'total_reports': 0 }

        except Exception as e:
            print(f"랭킹 통계 조회 오류: {str(e)}")
            return { 'total_users': 0, 'total_reports': 0 }
    
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