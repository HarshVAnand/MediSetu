"""
Drug Interaction Checker — checks pairwise + stack-level interactions.
(This file is the same logic as before, just returns dicts for MongoDB storage.)
"""
from itertools import combinations
import requests # type: ignore


# Well-known drug interactions (abbreviated — full version in previous message)
INTERACTION_RULES = [
    {'drugs': ['Warfarin', 'Aspirin'], 'severity': 'critical',
     'description': 'Combined use significantly increases bleeding risk.', 'risk_score': 9.0},
    {'drugs': ['Warfarin', 'Ibuprofen'], 'severity': 'critical',
     'description': 'NSAIDs increase anticoagulant effect and GI bleeding risk.', 'risk_score': 9.0},
    {'drugs': ['Warfarin', 'Clopidogrel'], 'severity': 'critical',
     'description': 'Dual antithrombotic therapy greatly increases hemorrhage risk.', 'risk_score': 9.5},
    {'drugs': ['Warfarin', 'Amiodarone'], 'severity': 'critical',
     'description': 'Amiodarone inhibits warfarin metabolism, dramatically increasing INR.', 'risk_score': 9.5},
    {'drugs': ['Warfarin', 'Fluoxetine'], 'severity': 'serious',
     'description': 'SSRIs increase bleeding risk with anticoagulants.', 'risk_score': 7.0},
    {'drugs': ['Warfarin', 'Ciprofloxacin'], 'severity': 'serious',
     'description': 'Ciprofloxacin increases warfarin levels and bleeding risk.', 'risk_score': 7.5},
    {'drugs': ['Aspirin', 'Ibuprofen'], 'severity': 'serious',
     'description': 'Ibuprofen reduces cardioprotective aspirin effect and increases GI bleeding.', 'risk_score': 7.0},
    {'drugs': ['Lisinopril', 'Losartan'], 'severity': 'serious',
     'description': 'Dual RAAS blockade: hypotension, hyperkalemia, renal impairment.', 'risk_score': 8.0},
    {'drugs': ['Lisinopril', 'Spironolactone'], 'severity': 'serious',
     'description': 'ACE inhibitor + potassium-sparing diuretic: hyperkalemia risk.', 'risk_score': 7.5},
    {'drugs': ['Spironolactone', 'Potassium Chloride'], 'severity': 'critical',
     'description': 'Life-threatening hyperkalemia risk.', 'risk_score': 9.5},
    {'drugs': ['Tramadol', 'Alprazolam'], 'severity': 'critical',
     'description': 'Opioid + benzodiazepine: FDA black box warning for respiratory depression.', 'risk_score': 9.5},
    {'drugs': ['Tramadol', 'Fluoxetine'], 'severity': 'critical',
     'description': 'Serotonin syndrome risk.', 'risk_score': 8.5},
    {'drugs': ['Tramadol', 'Sertraline'], 'severity': 'critical',
     'description': 'Serotonin syndrome risk.', 'risk_score': 8.5},
    {'drugs': ['Digoxin', 'Amiodarone'], 'severity': 'critical',
     'description': 'Amiodarone increases digoxin levels 70-100%, toxicity risk.', 'risk_score': 9.5},
    {'drugs': ['Lithium', 'Ibuprofen'], 'severity': 'critical',
     'description': 'NSAIDs reduce lithium clearance, causing toxicity.', 'risk_score': 9.0},
    {'drugs': ['Methotrexate', 'Ibuprofen'], 'severity': 'critical',
     'description': 'NSAIDs reduce methotrexate clearance; potentially fatal.', 'risk_score': 9.5},
    {'drugs': ['Amiodarone', 'Citalopram'], 'severity': 'critical',
     'description': 'Both prolong QT; fatal arrhythmia risk.', 'risk_score': 9.5},
    {'drugs': ['Omeprazole', 'Clopidogrel'], 'severity': 'serious',
     'description': 'Omeprazole reduces clopidogrel activation.', 'risk_score': 7.5},
    {'drugs': ['Metoprolol', 'Diltiazem'], 'severity': 'serious',
     'description': 'Severe bradycardia and heart block risk.', 'risk_score': 8.0},
    {'drugs': ['Lisinopril', 'Ibuprofen'], 'severity': 'serious',
     'description': 'NSAIDs reduce ACE inhibitor efficacy and increase renal risk.', 'risk_score': 7.0},
    # Add more rules as needed (see previous message for full list)
]

CLASS_RULES = [
    {'class1': 'NSAID', 'class2': 'Anticoagulant', 'severity': 'serious',
     'description': 'NSAIDs + anticoagulants increase bleeding risk.', 'risk_score': 7.5},
    {'class1': 'ACE Inhibitor', 'class2': 'ARB', 'severity': 'serious',
     'description': 'Dual RAAS blockade.', 'risk_score': 8.0},
    {'class1': 'Opioid Analgesic', 'class2': 'Benzodiazepine', 'severity': 'critical',
     'description': 'FDA black box: respiratory depression and death.', 'risk_score': 9.5},
    {'class1': 'Opioid', 'class2': 'Benzodiazepine', 'severity': 'critical',
     'description': 'FDA black box: respiratory depression and death.', 'risk_score': 9.5},
]


def check_pairwise(drug1_name, drug1_class, drug2_name, drug2_class):
    """Check one pair of drugs."""
    for rule in INTERACTION_RULES:
        if set(d.lower() for d in rule['drugs']) == {drug1_name.lower(), drug2_name.lower()}:
            return {
                'drug1': drug1_name, 'drug2': drug2_name,
                'severity': rule['severity'],
                'description': rule['description'],
                'risk_score': rule['risk_score'],
                'source': 'local_specific'
            }

    for rule in CLASS_RULES:
        if {rule['class1'].lower(), rule['class2'].lower()} == {drug1_class.lower(), drug2_class.lower()}:
            return {
                'drug1': drug1_name, 'drug2': drug2_name,
                'severity': rule['severity'],
                'description': rule['description'],
                'risk_score': rule['risk_score'],
                'source': 'local_class'
            }
    return None


def run_full_check(active_drugs, use_rxnav=False):
    """
    Run complete interaction check.
    active_drugs: list of dicts with medicine_name, drug_class, rxcui
    """
    interactions = []
    seen = set()

    for d1, d2 in combinations(active_drugs, 2):
        result = check_pairwise(
            d1['medicine_name'], d1['drug_class'],
            d2['medicine_name'], d2['drug_class']
        )
        if result:
            key = tuple(sorted([d1['medicine_name'].lower(), d2['medicine_name'].lower()]))
            if key not in seen:
                seen.add(key)
                interactions.append(result)

    # Calculate risk
    if not active_drugs:
        risk = {'overall_score': 0, 'risk_level': 'none', 'risk_color': '#28a745'}
    elif not interactions:
        score = min(len(active_drugs) * 0.5, 3.0)
        risk = {
            'overall_score': round(score, 1),
            'risk_level': 'low' if score < 3 else 'moderate',
            'risk_color': '#28a745' if score < 3 else '#ffc107'
        }
    else:
        scores = sorted([i['risk_score'] for i in interactions], reverse=True)
        raw = scores[0] + sum(s * (0.3 ** i) for i, s in enumerate(scores[1:], 1))
        score = round(min(raw * (1 + (len(active_drugs) - 2) * 0.05), 10.0), 1)
        critical = sum(1 for i in interactions if i['severity'] == 'critical')
        serious = sum(1 for i in interactions if i['severity'] == 'serious')

        if score >= 8 or critical > 0:
            level, color = 'critical', '#dc3545'
        elif score >= 6 or serious > 0:
            level, color = 'high', '#fd7e14'
        elif score >= 4:
            level, color = 'moderate', '#ffc107'
        else:
            level, color = 'low', '#28a745'

        risk = {
            'overall_score': score, 'risk_level': level, 'risk_color': color,
            'critical_count': critical, 'serious_count': serious,
            'moderate_count': sum(1 for i in interactions if i['severity'] == 'moderate')
        }

    return {
        'total_drugs': len(active_drugs),
        'drug_names': [d['medicine_name'] for d in active_drugs],
        'pairwise_interactions': interactions,
        'total_interactions': len(interactions),
        'risk_assessment': risk
    }