# sync_api.py
from model import DBManager # DBManager 임포트
import requests
from datetime import datetime, date
import traceback
import uuid # ID 생성에 필요


# --- 더미 함수 (실제 구현으로 교체 필요) ---
def predict_danger_level(data):

    age = data.get('age', 0)
    gender = data.get('gender', 'unknown')
    keywords = data.get('keywords', '')

    if isinstance(age, str) and age.isdigit():
        age = int(age)
    elif isinstance(age, int):
        pass
    else:
        age = 0

    if '정신지체' in keywords or '치매' in keywords or age > 65:
        return '위험'
    elif 0 < age < 10:
        return '보통'
    else:
        return '보통'

def calculate_age(birth_date_str):
    """
    생년월일 문자열(YYYYMMDD)로부터 나이를 계산합니다.
    유효하지 않거나 누락된 경우 None을 반환합니다.
    """
    if not birth_date_str:
        return None
    try:
        birth_date = datetime.strptime(birth_date_str, "%Y%m%d").date()
        today = date.today()
        age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
        return age
    except ValueError:
        print(f"경고: 생년월일 '{birth_date_str}'을(를) 파싱할 수 없습니다.")
        return None

def parse_date(date_str):
    """
    날짜 문자열(YYYYMMDD)을 datetime.date 객체로 파싱합니다.
    유효하지 않거나 비어있는 경우 None을 반환합니다.
    """
    if not date_str:
        return None
    try:
        return datetime.strptime(date_str, "%Y%m%d").date()
    except ValueError:
        print(f"경고: 날짜 '{date_str}'을(를) 파싱할 수 없습니다.")
        return None
# --- 더미 함수 끝 ---

# DBManager 인스턴스 생성 및 연결
db = DBManager()
try:
    db.connect()
    print("[DB] sync_api.py: 데이터베이스 연결 성공.")
except Exception as e:
    print(f"[오류] sync_api.py: 데이터베이스 연결 실패: {e}")
    traceback.print_exc()
    # 데이터베이스 연결 실패 시 스크립트 종료
    exit(1)


def sync_missing_api_data():
    """
    실종자 데이터를 외부 API에서 가져와 로컬 데이터베이스에 동기화합니다.
    이제 safetydata.go.kr V2/api/DSSP-IF-20597 API를 사용합니다.
    """
    API_URL = "https://www.safetydata.go.kr/V2/api/DSSP-IF-20597"
    params = {
        "serviceKey": "3FQG91W954658S1F",  # <<< 이미지에서 확인된 서비스 키입니다.
        "returnType": "json",
        "pageNo": "1",
        "numOfRows": "500"
    }

    try:
        print(f"[동기화] {API_URL}에서 데이터 동기화를 시도합니다...")
        response = requests.get(API_URL, params=params, verify=False)
        response.raise_for_status()
        data = response.json()
        # safetydata.go.kr API는 "body" 키 안에 데이터가 있습니다.
        items = data.get('body', [])

        current_external_ids = []

        for item in items:
            # safetydata.go.kr API의 고유 ID는 "SENU"로 보입니다.
            external_id = item.get("SENU")
            # 만약 SENU가 없다면 UUID를 생성하여 고유성을 확보합니다.
            if not external_id:
                external_id = f"gen-{uuid.uuid4()}"
                print(f"[동기화] 'SENU' (external_id)이(가) 없어 UUID를 생성했습니다: {external_id}, Item: {item}")
            current_external_ids.append(external_id)

            # safetydata.go.kr API의 필드 매핑
            name = item.get("FLNM", "이름없음")
            
            # NOW_AGE는 이미 나이이므로 calculate_age 호출 불필요. int로 변환 시도.
            age_raw = item.get("NOW_AGE")
            age_to_store = None
            if age_raw is not None:
                try:
                    age_to_store = int(age_raw)
                except ValueError:
                    age_to_store = None # 변환 실패 시 None


            gender = None 



            # 발생일시 (OCRN_DT)는 YYYYMMDD 형태이므로 parse_date 사용
            missing_date = parse_date(item.get("OCRN_DT"))
            missing_location = item.get("OCRN_PLC", "미상")
            features = item.get("PHBB_SPFE", "정보 없음") # 신체 특징 / 특이사항
            # image_url 필드는 이 API에서 직접 제공되지 않는 것으로 보입니다.
            # placeholder 이미지를 사용하거나, 별도 이미지 URL을 얻는 로직이 필요합니다.
            image_url = "/static/images/placeholder.jpg" # 기본 이미지 경로 사용

            danger_level = predict_danger_level({
                'age': age_to_store,
                'gender': gender,
                'keywords': features
            })

            db.execute("""
                INSERT INTO api_missing_data (
                    external_id, name, age, gender, missing_date,
                    missing_location, features, image_url, danger_level,
                    status, registered_at
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, 'active', NOW())
                ON DUPLICATE KEY UPDATE
                    name = VALUES(name),
                    age = VALUES(age),
                    gender = VALUES(gender),
                    missing_date = VALUES(missing_date),
                    missing_location = VALUES(missing_location),
                    features = VALUES(features),
                    image_url = VALUES(image_url),
                    danger_level = VALUES(danger_level),
                    status = 'active'
            """, (
                external_id, name, age_to_store, gender, missing_date,
                missing_location, features, image_url, danger_level
            ), commit=True)

        if current_external_ids:
            placeholders = ",".join(["%s"] * len(current_external_ids))
            db.execute(f"""
                UPDATE api_missing_data
                SET status = 'hidden'
                WHERE external_id NOT IN ({placeholders}) AND status = 'active'
            """, tuple(current_external_ids), commit=True)
            print(f"[동기화] API에서 {len(items)}개의 항목을 처리했습니다. 현재 응답에 없는 레코드는 숨김 처리되었습니다.")
        else:
            db.execute("UPDATE api_missing_data SET status = 'hidden' WHERE status = 'active'", commit=True)
            print("[동기화] API에서 항목을 수신하지 못했습니다. 모든 기존 활성 레코드는 숨김 처리되었습니다.")

        print(f"[✓] 동기화 완료 - {len(items)}건 처리됨 at {datetime.now()}")

    except requests.exceptions.RequestException as req_e:
        print(f"[오류] 동기화 중 API 요청 실패: {req_e}")
        traceback.print_exc()
    except Exception as e:
        print(f"[오류] 동기화 실패: {e}")
        traceback.print_exc()
    finally:
        db.disconnect()

