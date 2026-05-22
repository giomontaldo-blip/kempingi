import urllib.request
import urllib.parse
import json

# Bounding boxes approssimative per voivodato
VOIVODATO_BOUNDS = [
    ("zachodniopomorskie", 53.0, 53.9, 14.0, 16.5),
    ("pomorskie", 53.5, 54.6, 16.5, 19.5),
    ("warminsko-mazurskie", 53.2, 54.5, 19.5, 23.0),
    ("podlaskie", 52.5, 54.4, 22.5, 24.2),
    ("lubuskie", 51.2, 52.8, 14.5, 16.2),
    ("wielkopolskie", 51.5, 53.3, 16.2, 18.8),
    ("kujawsko-pomorskie", 52.5, 53.6, 17.5, 19.5),
    ("mazowieckie", 51.5, 53.0, 19.5, 22.8),
    ("dolnoslaskie", 50.2, 51.8, 14.8, 17.5),
    ("opolskie", 50.2, 51.2, 17.0, 18.5),
    ("slaskie", 49.5, 50.8, 17.8, 20.0),
    ("lodzkie", 51.0, 52.5, 18.5, 20.5),
    ("swietokrzyskie", 50.2, 51.5, 19.8, 21.5),
    ("lubelskie", 50.2, 52.5, 21.5, 24.2),
    ("malopolskie", 49.2, 50.5, 19.0, 22.0),
    ("podkarpackie", 49.0, 50.5, 21.5, 24.2),
]

def get_voivodato(lat, lng):
    lat, lng = float(lat), float(lng)
    for slug, lat_min, lat_max, lng_min, lng_max in VOIVODATO_BOUNDS:
        if lat_min <= lat <= lat_max and lng_min <= lng <= lng_max:
            return slug
    return "mazowieckie"

VOIVODATO_NAMES = {
    "zachodniopomorskie": "Zachodniopomorskie",
    "pomorskie": "Pomorskie",
    "warminsko-mazurskie": "Warmińsko-Mazurskie",
    "podlaskie": "Podlaskie",
    "lubuskie": "Lubuskie",
    "wielkopolskie": "Wielkopolskie",
    "kujawsko-pomorskie": "Kujawsko-Pomorskie",
    "mazowieckie": "Mazowieckie",
    "dolnoslaskie": "Dolnośląskie",
    "opolskie": "Opolskie",
    "slaskie": "Śląskie",
    "lodzkie": "Łódzkie",
    "swietokrzyskie": "Świętokrzyskie",
    "lubelskie": "Lubelskie",
    "malopolskie": "Małopolskie",
    "podkarpackie": "Podkarpackie",
}

# Fetch all locations
API_TOKEN = open('/home/codespace/.config/.wrangler/logs/token.txt').read().strip() if False else None
import os
API_TOKEN = os.environ.get('CLOUDFLARE_API_TOKEN', '')
ACCOUNT_ID = "7019d9b7642b868ea652cb832301b701"
DB_ID = "39ab8dd1-9201-4933-93ef-0ca5b22f9efa"

def d1_query(sql, params=None):
    data = json.dumps({"sql": sql, "params": params or []}).encode()
    req = urllib.request.Request(
        f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/d1/database/{DB_ID}/query",
        data=data,
        headers={"Authorization": f"Bearer {API_TOKEN}", "Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())['result'][0]['results']

locs = d1_query("SELECT id, lat, lng FROM locations")
print(f"Trovate {len(locs)} location")

updates = []
for loc in locs:
    voiv = get_voivodato(loc['lat'], loc['lng'])
    name = VOIVODATO_NAMES[voiv]
    updates.append(f"UPDATE locations SET voivodato_slug='{voiv}', voivodato='{name}' WHERE id='{loc['id']}';")

with open('fix_voivodati.sql', 'w') as f:
    f.write('\n'.join(updates))

print(f"✓ Generati {len(updates)} update")
