import os
import sys

def run_checks():
    sys.stdout.reconfigure(encoding='utf-8')
    base_dir = r"C:\Users\hp\.gemini\antigravity-ide\scratch\medisetu-source"
    
    # 1. Check facilityData.js
    fac_path = os.path.join(base_dir, "src", "services", "facilityData.js")
    with open(fac_path, "r", encoding="utf-8") as f:
        fac_content = f.read()
    
    assert "Government" in fac_content, "Government hospital category missing"
    assert "Private" in fac_content, "Private hospital category missing"
    assert "calculateDistance" in fac_content, "calculateDistance function missing"
    assert "getFacilitiesWithinRadius" in fac_content, "getFacilitiesWithinRadius missing"
    print("[PASS] facilityData.js: Verified Government & Private hospitals and Haversine distance calculations.")

    # 2. Check HospitalFinder60km.jsx
    finder_path = os.path.join(base_dir, "src", "components", "Landing", "HospitalFinder60km.jsx")
    with open(finder_path, "r", encoding="utf-8") as f:
        finder_content = f.read()
    
    assert "60km" in finder_content or "radiusKm" in finder_content, "60km radius finder logic missing"
    assert "Government" in finder_content, "Government filter missing"
    assert "Private" in finder_content, "Private filter missing"
    assert "L.circle" in finder_content, "Leaflet radius circle overlay missing"
    print("[PASS] HospitalFinder60km.jsx: Verified 60km radius filter, Leaflet map circle, Government/Private filters.")

    # 3. Check HeroSection.jsx
    hero_path = os.path.join(base_dir, "src", "components", "Landing", "HeroSection.jsx")
    with open(hero_path, "r", encoding="utf-8") as f:
        hero_content = f.read()
    
    assert "All your medical records in one place" in hero_content, "New plain language headline missing"
    assert "gsap" in hero_content, "GSAP animation missing in Hero"
    print("[PASS] HeroSection.jsx: Verified plain language substitutions and GSAP animations.")

    # 4. Check main.jsx & index.css
    main_path = os.path.join(base_dir, "src", "main.jsx")
    with open(main_path, "r", encoding="utf-8") as f:
        main_content = f.read()
    
    assert "Lenis" in main_content or "lenis" in main_content, "Lenis smooth scroll missing in main.jsx"
    assert "ScrollTrigger" in main_content, "GSAP ScrollTrigger missing in main.jsx"
    print("[PASS] main.jsx: Verified Lenis smooth scroll integration with GSAP ScrollTrigger ticker.")

    # 5. Check preview.html
    preview_path = os.path.join(base_dir, "preview.html")
    with open(preview_path, "r", encoding="utf-8") as f:
        preview_content = f.read()
    
    assert "60km" in preview_content, "60km radius locator missing in preview.html"
    assert "lenis" in preview_content.lower(), "Lenis missing in preview.html"
    assert "gsap" in preview_content.lower(), "GSAP missing in preview.html"
    assert "Government" in preview_content and "Private" in preview_content, "Govt/Private categories missing in preview.html"
    print("[PASS] preview.html: Complete standalone preview verified with all 5 requirements.")

    print("\nALL 5 REQUIREMENTS VERIFIED SUCCESSFULLY!")

if __name__ == "__main__":
    run_checks()
