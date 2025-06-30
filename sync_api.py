# sync_api.py
import os
import joblib
import pandas as pd
import numpy as np
import re
import requests
from datetime import datetime, date
import traceback
import uuid
from typing import Dict, List, Tuple
from model import DBManager
import warnings
import json

warnings.filterwarnings('ignore', category=UserWarning, module='sklearn.utils.validation')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")

RF_MODEL_PATH = os.path.join(MODELS_DIR, "rf_model.pkl")
KEYWORD_SCORES_PATH = os.path.join(MODELS_DIR, "keyword_scores_diff.pkl")

print(f"현재 작업 디렉토리: {os.getcwd()}")
print(f"BASE_DIR 설정: {BASE_DIR}")
print(f"MODELS_DIR 설정: {MODELS_DIR}")
print(f"RF 모델 예상 경로: {RF_MODEL_PATH}")
print(f"키워드 점수 예상 경로: {KEYWORD_SCORES_PATH}")

if os.path.exists(RF_MODEL_PATH):
    print(f"[디버그] RF 모델 파일이 '{RF_MODEL_PATH}' 경로에 존재합니다.")
else:
    print(f"[디버그] !!! 경고: RF 모델 파일이 '{RF_MODEL_PATH}' 경로에 존재하지 않습니다. !!!")

if os.path.exists(KEYWORD_SCORES_PATH):
    print(f"[디버그] 키워드 점수 파일이 '{KEYWORD_SCORES_PATH}' 경로에 존재합니다.")
else:
    print(f"[디버그] !!! 경고: 키워드 점수 파일이 '{KEYWORD_SCORES_PATH}' 경로에 존재하지 않습니다. !!!")

try:
    keyword_scores = joblib.load(KEYWORD_SCORES_PATH)
    print(f"[모델 로드] {KEYWORD_SCORES_PATH} 로드 성공.")
except Exception as e:
    print(f"[경고] '{KEYWORD_SCORES_PATH}' 로드 실패: {e}. 임시 기본 키워드 점수를 사용합니다.")
    keyword_scores = {
        '치매': 0.4, '기억력 저하': 0.4, '이름 되묻기': 0.4,
        '지적장애': 0.37, '정신질환': 0.38, '시각장장애': 0.32,
        '청각장애': 0.3, '보행장애': 0.34, '우울감': 0.22,
        '알츠하이머': 0.4, '파킨슨': 0.35, '뇌경색': 0.3,
        '자폐': 0.35, '발달장애': 0.35, '건망증': 0.2,
        '불안': 0.2, '공황': 0.25, '조현병': 0.38,
        '양극성': 0.3, '우울증': 0.22
    }

writng_code_info = {
    '060': {'desc': '치매', 'score': 0.0},
    '061': {'desc': '지적장애', 'score': 0.0},
    '062': {'desc': '정신질환', 'score': 0.0},
    '063': {'desc': '만성질환', 'score': 0.0},
    '070': {'desc': '고령자', 'score': 0.0},
    '071': {'desc': '아동', 'score': 0.0},
    '072': {'desc': '일반', 'score': 0.0},
}

for code, info in writng_code_info.items():
    keyword = info["desc"]
    if keyword in keyword_scores:
        writng_code_info[code]["score"] = keyword_scores[keyword]

def normalize_text(text: str) -> str:
    if pd.isna(text) or text == '':
        return ''
    text = str(text).strip()
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'[\n\r\t]', ' ', text)
    text = re.sub(r'[^\w\s가-힣.,!?()-]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def extract_keyword_scores(text: str, keyword_dict: Dict[str, float], top_n: int = 2) -> Tuple[List[str], float]:
    if pd.isna(text) or text == '':
        return [], 0.0

    normalized_text = normalize_text(text)
    keyword_matches = []
    sorted_keywords = sorted(keyword_dict.keys(), key=len, reverse=True)

    for keyword in sorted_keywords:
        patterns = [
            r'(?:^|[\s.,!?()[\]{}"-])' + re.escape(keyword) + r'(?=[\s.,!?()[\]{}"-]|$)',
            r'(?:^|[^가-힣])' + re.escape(keyword) + r'(?=[^가-힣]|$)',
            re.escape(keyword)
        ]

        matched = False
        for pattern in patterns:
            try:
                if re.search(pattern, normalized_text):
                    keyword_matches.append(keyword)
                    matched = True
                    break
            except re.error:
                continue

        if matched:
            continue

    unique_keywords = list(set(keyword_matches))
    keyword_scores_found = [keyword_dict[kw] for kw in unique_keywords]
    top_scores = sorted(keyword_scores_found, reverse=True)[:top_n]
    total_score = sum(top_scores)

    return unique_keywords, total_score

def get_age_score(age: int) -> float:
    if pd.isna(age):
        return 0.0
    if age <= 6:
        return 0.25
    elif age <= 18:
        return 0.2
    elif age >= 80:
        return 0.25
    elif age >= 65:
        return 0.2
    else:
        return 0.0

def get_gender_score(gender_encoded: int) -> float:
    if pd.isna(gender_encoded):
        return 0.0
    if gender_encoded == 1:
        return 0.05
    elif gender_encoded == 0:
        return 0.0
    return 0.0

def get_code_score_with_complement(code: str, text_keywords: List[str], code_info_dict: Dict) -> Tuple[float, str, str]:
    code = str(code).strip()
    if code not in code_info_dict:
        return 0.0, '기타', 'unknown_code'
    info = code_info_dict[code]
    code_desc = info['desc'].strip()
    code_score = info['score']
    text_keywords_clean = [kw.strip() for kw in text_keywords]
    if code_desc in text_keywords_clean:
        return 0.0, code_desc, 'duplicate_from_text'
    else:
        if code_score > 0:
            return code_score, code_desc, 'complement_from_code'
        else:
            return 0.0, code_desc, 'no_score'

def infer_writng_trget_dscd(age: int, features_text: str, code_info_dict: Dict) -> str:
    features_text = normalize_text(features_text)

    sorted_code_descs = sorted(
        [info['desc'] for info in code_info_dict.values() if info['desc'] != '일반'],
        key=len, reverse=True
    )

    for desc in sorted_code_descs:
        if desc in features_text:
            for code, info in code_info_dict.items():
                if info['desc'] == desc:
                    return code

    if age is not None:
        if age <= 18:
            return '071'
        elif age >= 65:
            return '070'

    return '072'

def calculate_all_scores(data: Dict) -> Dict:
    total_score = 0.0
    details = {}

    age = data.get('age')
    gender_raw = data.get('gender')
    features = data.get('keywords', '')

    gender_encoded = None
    if isinstance(gender_raw, str):
        if gender_raw.upper() == '남' or gender_raw.upper() == 'MALE':
            gender_encoded = 1
        elif gender_raw.upper() == '여' or gender_raw.upper() == 'FEMALE':
            gender_encoded = 0

    gender_score = get_gender_score(gender_encoded)
    total_score += gender_score
    details['gender_score'] = gender_score

    age_score = get_age_score(age)
    total_score += age_score
    details['age_score'] = age_score

    matched_keywords, keyword_score = extract_keyword_scores(features, keyword_scores, top_n=2)
    total_score += keyword_score
    details['keyword_score'] = keyword_score
    details['matched_keywords'] = matched_keywords

    inferred_code = infer_writng_trget_dscd(age, features, writng_code_info)

    code_score, code_desc, process_type = get_code_score_with_complement(
        inferred_code, matched_keywords, writng_code_info
    )
    total_score += code_score
    details['code_score'] = code_score
    details['code_desc'] = code_desc
    details['code_process_type'] = process_type

    final_score = round(min(total_score, 1.0), 3)
    details['total_score'] = final_score

    return details

model_rf = None
try:
    model_rf = joblib.load(RF_MODEL_PATH)
    print(f"[모델 로드] {RF_MODEL_PATH} 로드 성공.")
except Exception as e:
    print(f"[오류] '{RF_MODEL_PATH}' 로드 실패: {e}")
    print("[경고] Random Forest 모델 로드에 실패했지만, 애플리케이션은 계속 실행됩니다. 위험도 예측 기능은 제한됩니다.")
    model_rf = None

def predict_danger_level(data_list: List[Dict]) -> List[str]:
    if model_rf is None:
        print("[경고] Random Forest 모델이 로드되지 않았습니다. 기본값을 반환합니다.")
        return ["보통"] * len(data_list)

    predictions = []

    try:
        features_for_prediction = []
        for data in data_list:
            age = data.get('age')
            gender_raw = data.get('gender')
            keywords_text = data.get('keywords', '')

            gender_encoded = None
            if isinstance(gender_raw, str):
                if gender_raw.upper() == '남' or gender_raw.upper() == 'MALE':
                    gender_encoded = 1
                elif gender_raw.upper() == '여' or gender_raw.upper() == 'FEMALE':
                    gender_encoded = 0

            if gender_encoded is None: 
                gender_encoded = 2 

            _, keyword_score_sum = extract_keyword_scores(keywords_text, keyword_scores, top_n=2)

            model_feature_names = ['age', 'gender_encoded', 'keyword_score_sum']

            features_for_prediction.append([age if age is not None else 0, gender_encoded, keyword_score_sum])

        features_df = pd.DataFrame(features_for_prediction, columns=model_feature_names)

        batch_predictions = model_rf.predict(features_df)

        class_mapping = {
            0: '보통',
            1: '위험'
        }

        for pred_val in batch_predictions:
            predictions.append(class_mapping.get(pred_val, '알 수 없음'))

    except Exception as e:
        print(f"[오류] predict_danger_level 함수에서 예측 실패: {e}")
        traceback.print_exc()
        return ["예측 실패 (내부 오류)"] * len(data_list)

    return predictions

def calculate_age(birth_date_str):
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
    if not date_str:
        return None
    try:
        return datetime.strptime(date_str, "%Y%m%d").date()
    except ValueError:
        print(f"경고: 날짜 '{date_str}'을(를) 파싱할 수 없습니다.")
    return None

db = DBManager()
try:
    db.connect()
    print("[DB] sync_api.py: 데이터베이스 연결 성공.")
except Exception as e:
    print(f"[오류] sync_api.py: 데이터베이스 연결 실패: {e}")
    traceback.print_exc()
    print("[경고] 데이터베이스 연결에 실패했지만, 애플리케이션은 계속 실행됩니다.")
    db = None

def sync_missing_api_data():
    if db is None:
        print("[오류] 데이터베이스 연결이 없어 동기화를 수행할 수 없습니다.")
        return
        
    API_URL = "https://www.safetydata.go.kr/V2/api/DSSP-IF-20597"
    params = {
        "serviceKey": "3FQG91W954658S1F",
        "returnType": "json",
        "pageNo": "1",
        "numOfRows": "500"
    }

    BATCH_SIZE = 20
    current_external_ids_from_api = []
    batch_items = []

    try:
        print(f"[동기화] {API_URL}에서 데이터 동기화를 시도합니다...")
        response = requests.get(API_URL, params=params, verify=False, timeout=30)
        response.raise_for_status()
        data = response.json()

        with open("api_response_full.json", "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        print("[DEBUG] API 응답 전체가 'api_response_full.json' 파일로 저장되었습니다.")

        header = data.get('header', {})
        result_code = header.get('resultCode', '00')
        result_msg = header.get('resultMsg', 'OK')
        
        if result_code != '00':
            print(f"[API 오류] 코드: {result_code}, 메시지: {result_msg}")
            if result_code == '32':
                print("❌ 등록되지 않은 IP 오류 - 기존 데이터 유지")
            return

        items = data.get('body', [])

        if not items or not isinstance(items, list):
            print(f"[경고] API 응답의 body가 비어있거나 올바르지 않습니다. body: {items}")
            print("[동기화] 빈 데이터로 처리합니다.")
            items = []

        for i, item in enumerate(items):
            external_id = item.get("SENU")
            if not external_id:
                external_id = f"gen-{uuid.uuid4()}"
            current_external_ids_from_api.append(external_id)

            raw_gender_from_api = item.get("GNDR_SE", "필드_없음_또는_None")
            print(f"[DEBUG_GENDER] external_id: {external_id}, Raw Gender from API: '{raw_gender_from_api}'")

            processed_item_data = {
                'external_id': external_id,
                'name': item.get("FLNM", "이름없음"),
                'age': int(item.get("NOW_AGE")) if item.get("NOW_AGE") and str(item.get("NOW_AGE")).isdigit() else None,
                'gender': item.get("GNDR_SE", None),
                'missing_date': parse_date(item.get("OCRN_DT")),
                'missing_location': item.get("OCRN_PLC", "미상"),
                'keywords': item.get("PHBB_SPFE", "정보 없음"),
                'image_url': "/static/images/placeholder.jpg"
            }
            batch_items.append(processed_item_data)

            if (i + 1) % BATCH_SIZE == 0 or (i + 1) == len(items):
                print(f"[동기화 진행] {i + 1} / {len(items)} 항목 처리 중...")

                danger_levels = predict_danger_level([
                    {'age': d['age'], 'gender': d['gender'], 'keywords': d['keywords']}
                    for d in batch_items
                ])

                for j, processed_data in enumerate(batch_items):
                    external_id_to_use = processed_data['external_id']
                    name = processed_data['name']
                    age_to_store = processed_data['age']
                    gender_api = processed_data['gender']

                    gender_to_store = None
                    if gender_api is not None:
                        cleaned_gender = str(gender_api).strip().upper() 
                        
                        if cleaned_gender == '남' or cleaned_gender == 'MALE' or cleaned_gender == '남자':
                            gender_to_store = 1
                        elif cleaned_gender == '여' or cleaned_gender == 'FEMALE' or cleaned_gender == '여자':
                            gender_to_store = 0
                        else:
                            gender_to_store = 2
                            print(f"[경고] 알 수 없는 성별 값: '{gender_api}'. 2으로 처리합니다.")
                    else:
                        gender_to_store = 2
                        print(f"[경고] 성별 정보가 None입니다. 2으로 처리합니다.")

                    missing_date = processed_data['missing_date']
                    missing_location = processed_data['missing_location']
                    features = processed_data['keywords']
                    image_url = processed_data['image_url']
                    danger_level = danger_levels[j]

                    print(f"\n--- 현재 처리 중인 API 데이터 ---")
                    print(f"  external_id: {external_id_to_use}")
                    print(f"  검색 키: name='{name}', age={age_to_store}, gender={gender_to_store}, missing_date={missing_date}")
                    print(f"--- DB에서 기존 레코드 검색 시도 중 ---")

                    existing_record = db.execute(f"""
                        SELECT id, external_id FROM api_missing_data
                        WHERE name = %s AND age = %s AND gender = %s AND missing_date = %s
                    """, (name, age_to_store, gender_to_store, missing_date)).fetchone()

                    if existing_record:
                        print(f"  [FOUND] 기존 레코드 발견: id={existing_record['id']}, external_id={existing_record['external_id']}")
                        print(f"  [스킵] 중복 레코드를 발견했습니다. (ID: {existing_record['id']}). 업데이트하지 않고 다음으로 넘어갑니다.")
                        continue
                    else:
                        print(f"  [NOT FOUND] 기존 레코드 없음. 새 레코드 삽입 예정.")

                    db.execute("""
                        INSERT INTO api_missing_data (
                            external_id, name, age, gender, missing_date,
                            missing_location, features, image_url, danger_level,
                            status, registered_at
                        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, 'active', NOW())
                    """, (
                        external_id_to_use, name, age_to_store, gender_to_store, missing_date,
                        missing_location, features, image_url, danger_level
                    ), commit=True)
                    print(f"  [삽입] 새로운 레코드 삽입 완료 (external_id: {external_id_to_use}).")

                batch_items = []

        if current_external_ids_from_api:
            placeholders = ",".join(["%s"] * len(current_external_ids_from_api))
            db.execute(f"""
                UPDATE api_missing_data
                SET status = 'hidden', updated_at = NOW()
                WHERE external_id NOT IN ({placeholders}) AND status = 'active'
            """, tuple(current_external_ids_from_api), commit=True)
            print(f"[동기화] API에서 {len(items)}개의 항목을 처리했습니다. 현재 응답에 없는 external_id를 가진 레코드는 숨김 처리되었습니다.")
        else:
            db.execute("UPDATE api_missing_data SET status = 'hidden', updated_at = NOW() WHERE status = 'active'", commit=True)
            print("[동기화] API에서 항목을 수신하지 못했습니다. 모든 기존 활성 레코드는 숨김 처리되었습니다.")

        print(f"[✓] 동기화 완료 - {len(items)}건 처리됨 at {datetime.now()}")

    except requests.exceptions.RequestException as req_e:
        print(f"[오류] 동기화 중 API 요청 실패: {req_e}")
        traceback.print_exc()
    except Exception as e:
        print(f"[오류] 동기화 실패: {e}")
        traceback.print_exc()
    finally:
        if db:
            db.disconnect()

if __name__ == "__main__":
    sync_missing_api_data()