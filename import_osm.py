import urllib.request
import urllib.parse
import json
import uuid
import re

def slugify(text):
    text = text.lower()
    for a, b in [('ą','a'),('ć','c'),('ę','e'),('ł','l'),('ń','n'),('ó','o'),('ś','s'),('ź','z'),('ż','z'),('à','a'),('è','e'),('ö','o')]:
        text = text.replace(a, b)
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')[:60]

print("Scaricando campeggi da OpenStreetMap...")
query = '[out:json][timeout:60];area["ISO3166-1"="PL"]->.p;(node["tourism"="camp_site"](area.p);way["tourism"="camp_site"](area.p););out center 500;'

data = urllib.parse.urlencode({'data': query}).encode('utf-8')
req = urllib.request.Request(
    "https://overpass-api.de/api/interpreter",
    data=data,
    headers={'User-Agent': 'kempingi.com/1.0'}
)

with urllib.request.urlopen(req, timeout=90) as resp:
    result = json.loads(resp.read().decode('utf-8'))

elements = result.get('elements', [])
print(f"Trovati {len(elements)} campeggi")

VOIVODATO_MAP = {
    "dolnośląskie":"dolnoslaskie","kujawsko-pomorskie":"kujawsko-pomorskie",
    "lubelskie":"lubelskie","lubuskie":"lubuskie","łódzkie":"lodzkie",
    "małopolskie":"malopolskie","mazowieckie":"mazowieckie","opolskie":"opolskie",
    "podkarpackie":"podkarpackie","podlaskie":"podlaskie","pomorskie":"pomorskie",
    "śląskie":"slaskie","świętokrzyskie":"swietokrzyskie",
    "warmińsko-mazurskie":"warminsko-mazurskie","wielkopolskie":"wielkopolskie",
    "zachodniopomorskie":"zachodniopomorskie",
}

locations_sql = []
campings_sql = []
location_ids = {}
slug_counts = {}

for el in elements:
    tags = el.get('tags', {})
    name = tags.get('name', '').strip()
    if not name:
        continue
    lat = el.get('lat') or el.get('center', {}).get('lat', 0)
    lng = el.get('lon') or el.get('center', {}).get('lon', 0)
    if not lat or not lng:
        continue

    city = tags.get('addr:city', tags.get('addr:place', 'Polska'))
    voiv_raw = tags.get('addr:state', '').lower().strip()
    voiv_slug = VOIVODATO_MAP.get(voiv_raw, 'mazowieckie')
    loc_key = f"{voiv_slug}_{slugify(city)}"

    if loc_key not in location_ids:
        loc_id = str(uuid.uuid4())
        location_ids[loc_key] = loc_id
        voiv_names = {v: k.title() for k, v in VOIVODATO_MAP.items()}
        voiv_name = voiv_names.get(voiv_slug, voiv_slug).replace("'","''")
        city_s = city.replace("'","''")
        locations_sql.append(f"INSERT OR IGNORE INTO locations (id,country,voivodato,voivodato_slug,city,lat,lng) VALUES ('{loc_id}','PL','{voiv_name}','{voiv_slug}','{city_s}',{lat},{lng});")

    loc_id = location_ids[loc_key]
    base_slug = slugify(name) or "kemping"
    slug_key = f"{voiv_slug}_{base_slug}"
    slug_counts[slug_key] = slug_counts.get(slug_key, 0) + 1
    final_slug = base_slug if slug_counts[slug_key] == 1 else f"{base_slug}-{slug_counts[slug_key]}"

    name_s = name.replace("'","''")
    desc = f"Kemping {name_s} w Polsce."
    camp_id = str(uuid.uuid4())
    has_pool = 1 if tags.get('swimming_pool') == 'yes' else 0
    pets = 1 if tags.get('dog') in ('yes','leashed') else 0
    wifi = 1 if tags.get('internet_access') in ('wlan','wifi','yes') else 0
    near_lake = 1 if 'water' in tags.get('natural','') else 0
    near_sea = 1 if float(lat) > 53.5 and 14 < float(lng) < 19 else 0

    campings_sql.append(f"INSERT OR IGNORE INTO campings (id,name,slug,location_id,lat,lng,description_pl,has_pool,pets_allowed,has_wifi,near_lake,near_sea,updated_at) VALUES ('{camp_id}','{name_s}','{final_slug}','{loc_id}',{lat},{lng},'{desc}',{has_pool},{pets},{wifi},{near_lake},{near_sea},'2026-01-01');")

with open('import_locations.sql','w',encoding='utf-8') as f:
    f.write('\n'.join(locations_sql))
with open('import_campings.sql','w',encoding='utf-8') as f:
    f.write('\n'.join(campings_sql))

print(f"Locations: {len(locations_sql)}")
print(f"Campings: {len(campings_sql)}")
print("✓ File SQL generati!")
