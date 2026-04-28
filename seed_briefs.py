import urllib.request
import json
import sys

API_KEY = "AIzaSyCf3fL4to1od2B6khvZk48kY2Jui8powkc"
PROJECT = "clinintake"

def firebase_request(url, data):
    body = json.dumps(data).encode()
    req = urllib.request.Request(url, data=body, method="POST")
    req.add_header("Content-Type", "application/json")
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())

def firestore_patch(doc_id, fields, token):
    url = f"https://firestore.googleapis.com/v1/projects/{PROJECT}/databases/(default)/documents/briefs/{doc_id}"
    body = json.dumps({"fields": fields}).encode()
    req = urllib.request.Request(url, data=body, method="PATCH")
    req.add_header("Content-Type", "application/json")
    req.add_header("Authorization", f"Bearer {token}")
    try:
        with urllib.request.urlopen(req) as r:
            d = json.loads(r.read())
            print(f"  OK: {doc_id}")
    except Exception as e:
        print(f"  ERROR {doc_id}: {e}")

print("Authenticating...")
resp = firebase_request(
    f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={API_KEY}",
    {"email": "doctor@clinintake.com", "password": "doctor123456", "returnSecureToken": True}
)
token = resp.get("idToken")
if not token:
    print("Auth failed:", resp)
    sys.exit(1)
print("Auth OK\n")

def sv(v): return {"stringValue": str(v)}
def iv(v): return {"integerValue": int(v)}
def av(lst): return {"arrayValue": {"values": [{"stringValue": x} for x in lst]}}
def nv(): return {"nullValue": None}

CREATOR = "Wqgf67NuILSDy3LCSm6I381gq263"

patients = [
    {
        "id": "brief_amara_osei",
        "name": "Amara Osei", "age": 31, "sex": "female",
        "cc": "bad headache",
        "hpi": "Ms. Osei is a 31-year-old female who presents with sudden-onset thunderclap headache beginning yesterday afternoon while seated. She describes it as the worst headache of her life, rated 9/10, throbbing and constant for 20 hours without relief. Pain is diffuse with occipital predominance radiating into the posterior neck with severe stiffness. Ibuprofen 400mg was ineffective. Light, movement, and noise worsen symptoms. Associated with fever 38.8C, chills, nausea, and two episodes of vomiting. Denies focal neurological deficits.",
        "flags": ["Thunderclap headache — worst headache of life", "Fever + neck rigidity + photophobia = meningism triad", "Vomiting with severe headache — possible SAH or bacterial meningitis — URGENT"],
        "ros": {"rosConstitutional": "Fever 38.8C, chills", "rosCardiovascular": "No chest pain", "rosRespiratory": "No shortness of breath", "rosGastrointestinal": "Nausea, two episodes of vomiting", "rosNeurological": "Photophobia, phonophobia, neck rigidity", "rosMusculoskeletal": "Severe neck stiffness"},
        "pmh": "No chronic conditions", "meds": "Ibuprofen 400mg PRN", "allergies": "NKDA",
        "fh": "No significant family history", "sh": "Non-smoker, rare alcohol, teacher",
        "notes": "URGENT: CT head and lumbar puncture indicated immediately.",
        "date": "2026-04-28T09:00:00.000Z", "oldcarts": 8, "ros_count": 6, "turns": 19
    },
    {
        "id": "brief_dorothy_walsh",
        "name": "Dorothy Walsh", "age": 72, "sex": "female",
        "cc": "right knee pain and swelling",
        "hpi": "Mrs. Walsh is a 72-year-old female presenting with 3-month history of progressive right knee pain without precipitating injury. Pain is medial compartment, dull aching at rest (4-5/10) and sharp stabbing with stair descent (7-8/10). Morning stiffness lasts 30 minutes. Ibuprofen PRN partially effective. Crepitus noted with movement. Unintentional weight gain of 10 lbs over the past year. Bilateral ankle swelling worse in evenings.",
        "flags": ["Chronic NSAID use at age 72 — GI and renal risk", "Bilateral ankle edema — assess cardiac/renal etiology"],
        "ros": {"rosConstitutional": "Weight gain 10 lbs over past year", "rosCardiovascular": "Bilateral ankle swelling evenings", "rosRespiratory": "No dyspnea", "rosGastrointestinal": "No GI complaints", "rosNeurological": "No numbness or tingling", "rosMusculoskeletal": "Visible medial swelling right knee, crepitus"},
        "pmh": "Osteoarthritis bilateral hands (10 years), Hypertension, Osteoporosis",
        "meds": "Amlodipine 5mg daily, Calcium 600mg + Vitamin D3 1000IU daily, Ibuprofen PRN",
        "allergies": "Sulfonamides — GI upset",
        "fh": "Mother had severe rheumatoid arthritis", "sh": "Retired schoolteacher, non-smoker",
        "notes": "X-ray bilateral knees. Review NSAID use given age. Ankle edema warrants cardiac/renal workup.",
        "date": "2026-04-28T09:30:00.000Z", "oldcarts": 8, "ros_count": 5, "turns": 24
    },
    {
        "id": "brief_james_patel",
        "name": "James Patel", "age": 45, "sex": "male",
        "cc": "progressive shortness of breath and leg swelling",
        "hpi": "Mr. Patel is a 45-year-old male with h/o hypertension, type 2 diabetes, and prior MI 3 years ago presenting with 7-10 days of progressive dyspnea and bilateral leg swelling. Reports orthopnea (3 pillows) and two episodes of paroxysmal nocturnal dyspnea this week. Unable to climb one flight of stairs. Chest tightness rated 7/10, diffuse, described as breathing through a wet cloth. Weight gain of 4kg in 10 days. Sitting upright provides relief. Denies chest pain.",
        "flags": ["Orthopnea + PND + peripheral edema = classic decompensated heart failure", "Rapid 4kg weight gain in 10 days — fluid overload", "Prior MI + family history of cardiomyopathy", "ACE inhibitor allergy limits treatment options"],
        "ros": {"rosConstitutional": "Significant fatigue, 4kg weight gain in 10 days", "rosCardiovascular": "Bilateral pitting ankle edema, palpitations", "rosRespiratory": "Nocturnal dry cough, orthopnea, PND twice this week", "rosGastrointestinal": "Reduced appetite, mild RUQ discomfort", "rosNeurological": "No focal deficits", "rosMusculoskeletal": "Generalized weakness"},
        "pmh": "Hypertension (8 years), Type 2 Diabetes (5 years), prior MI 3 years ago",
        "meds": "Amlodipine 10mg, Metformin 500mg BD, Aspirin 75mg, Atorvastatin 40mg",
        "allergies": "ACE inhibitors — dry cough",
        "fh": "Father: Dilated cardiomyopathy. Brother: MI at 50.", "sh": "Non-smoker, accountant, sedentary",
        "notes": "Urgent echo and BNP. ACE inhibitor allergy documented — ARB may be considered.",
        "date": "2026-04-28T10:00:00.000Z", "oldcarts": 8, "ros_count": 6, "turns": 20
    },
    {
        "id": "brief_sofia_reyes",
        "name": "Sofia Reyes", "age": 28, "sex": "female",
        "cc": "bad stomach pain that keeps getting worse",
        "hpi": "Ms. Reyes is a 28-year-old female on OCP presenting with 12 hours of progressive abdominal pain, beginning periumbilically and migrating to the RLQ over 6 hours. Pain is sharp, constant, rated 8/10, unlike any prior pain. Movement, coughing, and palpation aggravate. Nothing relieves. Low-grade fever 38.1C, chills, anorexia, and one episode of vomiting. Last normal bowel movement yesterday. No radiation to back or shoulder.",
        "flags": ["Classic McBurney point migration — high suspicion appendicitis", "Fever with localized RLQ pain and anorexia", "OCP use — ectopic pregnancy not excluded without bHCG", "Escalating severity over 12 hours — surgical emergency must be ruled out"],
        "ros": {"rosConstitutional": "Fever 38.1C, chills, anorexia", "rosCardiovascular": "No chest pain", "rosRespiratory": "No respiratory symptoms", "rosGastrointestinal": "Nausea, one episode of vomiting, no diarrhea", "rosNeurological": "No neurological symptoms", "rosMusculoskeletal": "No MSK complaints"},
        "pmh": "No prior abdominal surgeries, no chronic conditions",
        "meds": "OCP — Microgynon 30", "allergies": "NKDA",
        "fh": "No relevant family history", "sh": "Non-smoker, university student, sexually active",
        "notes": "Surgical consult urgently required. bHCG to exclude ectopic. CT abdomen if USS inconclusive.",
        "date": "2026-04-28T10:30:00.000Z", "oldcarts": 8, "ros_count": 6, "turns": 18
    },
    {
        "id": "brief_harold_thompson",
        "name": "Harold Thompson", "age": 67, "sex": "male",
        "cc": "feeling tired and lost some weight, wife made me come",
        "hpi": "Mr. Thompson is a 67-year-old male ex-smoker (30 pack-year) presenting at wife's insistence with 3-4 months of progressive fatigue and 12 lbs unintentional weight loss. Reports profound fatigue limiting daily activities, drenching night sweats requiring shirt changes, and 6-week dry cough attributed to allergies. Mild early satiety noted. Morning symptoms worst; rest minimally restorative. Patient minimizes severity. Last colonoscopy 8 years ago. Hypothyroidism with last TFT 2 years ago.",
        "flags": ["B-symptoms: weight loss greater than 10% + night sweats + fatigue — lymphoma/malignancy workup required", "Family history: colon CA (brother) + lung CA (father)", "Overdue colonoscopy (8 years) + GI symptoms", "6-week cough + ex-smoker + weight loss — chest imaging indicated", "Hypothyroidism: last TFT 2 years ago — may be undertreated"],
        "ros": {"rosConstitutional": "12 lbs weight loss 3 months, drenching night sweats, anorexia", "rosCardiovascular": "Mild exertional dyspnea (new)", "rosRespiratory": "Dry cough 6 weeks", "rosGastrointestinal": "Reduced appetite, early satiety, no rectal bleeding", "rosNeurological": "Mild difficulty concentrating", "rosMusculoskeletal": "Generalized myalgia"},
        "pmh": "Hypothyroidism, Hypertension, Hyperlipidemia",
        "meds": "Levothyroxine 75mcg daily, Lisinopril 5mg daily, Atorvastatin 20mg daily",
        "allergies": "NKDA",
        "fh": "Brother: colon cancer at 61. Father: lung cancer.", "sh": "Ex-smoker, retired engineer",
        "notes": "Urgent malignancy workup: FBC, LDH, CXR, CT chest/abdomen/pelvis. Colonoscopy referral. Repeat TFTs.",
        "date": "2026-04-28T11:00:00.000Z", "oldcarts": 7, "ros_count": 6, "turns": 26
    }
]

for b in patients:
    ros_fields = {k: sv(v) for k, v in b["ros"].items()}
    fields = {
        "sessionId": sv(f"demo-{b['id']}"),
        "patientUid": nv(),
        "patientName": sv(b["name"]),
        "patientAge": iv(b["age"]),
        "patientSex": sv(b["sex"]),
        "chiefComplaint": sv(b["cc"]),
        "hpi": sv(b["hpi"]),
        "clinicalFlags": av(b["flags"]),
        "oldcartsCount": iv(b["oldcarts"]),
        "rosCount": iv(b["ros_count"]),
        "turnCount": iv(b["turns"]),
        "createdAt": sv(b["date"]),
        "createdBy": sv(CREATOR),
        "brief": {"mapValue": {"fields": {
            "chiefComplaint": sv(b["cc"]),
            "hpi": sv(b["hpi"]),
            "ros": {"mapValue": {"fields": ros_fields}},
            "pmh": sv(b["pmh"]),
            "medications": sv(b["meds"]),
            "allergies": sv(b["allergies"]),
            "familyHistory": sv(b["fh"]),
            "socialHistory": sv(b["sh"]),
            "clinicalFlags": av(b["flags"]),
            "dataQualityNotes": sv(b["notes"]),
            "generatedAt": sv(b["date"])
        }}}
    }
    firestore_patch(b["id"], fields, token)

print("\nDone — all 5 briefs seeded.")
