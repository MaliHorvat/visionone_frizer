# Portal za frizerja – Salon

Spletna aplikacija za naročanje terminov v frizerskem salonu. Stranke se naročajo brez prijave, osebje pa ima admin panel za pregled terminov in upravljanje uporabnikov.

## Funkcionalnosti

- **Javno naročanje** – stranke izberejo frizerja, storitev, datum in uro
- **Več frizerjev** – vsak frizer ima svoje storitve in delovni čas
- **Admin panel** – pregled in upravljanje naročenih terminov
- **Upravljanje uporabnikov** – administrator dodaja osebje
- **Vloge** – ADMIN (poln dostop) in STAFF (pregled terminov)

## Tehnologije

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM + MySQL (Neoserv)
- JWT avtentikacija

## Lokalni zagon

### 1. Namestitev

```bash
npm install
```

### 2. Okoljske spremenljivke

Kopirajte `.env.example` v `.env` in nastavite:

```env
DATABASE_URL="mysql://uporabnik:geslo@host.neoserv.si:3306/ime_baze"
JWT_SECRET="nakljucen-dolg-niz-minimalno-32-znakov"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
ADMIN_EMAIL="admin@salon.si"
ADMIN_PASSWORD="SpremeniGeslo123!"
ADMIN_NAME="Administrator"
```

### 3. Baza podatkov

Na Neoserv ustvarite MySQL bazo in omogočite oddaljen dostop (Remote MySQL) za IP naslove Vercela.

```bash
npx prisma db push
npm run db:seed
```

### 4. Zagon

```bash
npm run dev
```

Aplikacija je na `http://localhost:3000`.

## Deploy na Vercel + Neoserv

### GitHub

1. Ustvarite repozitorij na GitHubu
2. Pushajte kodo:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: frizer portal"
   git remote add origin https://github.com/VAS_UPORABNIK/frizer-portal.git
   git push -u origin main
   ```

### Vercel

1. Pojdite na [vercel.com](https://vercel.com) in uvozite GitHub repozitorij
2. V **Settings → Environment Variables** dodajte:
   - `DATABASE_URL` – connection string do Neoserv MySQL
   - `JWT_SECRET` – naključen niz (min. 32 znakov)
   - `NEXT_PUBLIC_APP_URL` – `https://vasa-domena.si`
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` – za seed
3. Deploy

### Neoserv – baza

1. V nadzorni plošči Neoserv ustvarite MySQL bazo
2. Omogočite **Remote MySQL** in dodajte IP naslove Vercela (ali `%` za vse – manj varno)
3. Connection string: `mysql://user:pass@mysql.neoserv.si:3306/dbname`

### Po prvem deployu

V Vercel terminalu ali lokalno z produkcijsko bazo:

```bash
npx prisma db push
npm run db:seed
```

### Domena

1. V Vercel: **Settings → Domains** → dodajte svojo domeno
2. Pri Neoserv DNS nastavite CNAME zapis na `cname.vercel-dns.com`
3. Posodobite `NEXT_PUBLIC_APP_URL` na produkcijsko domeno

## Privzeti administrator

Po seed ukazu se ustvari administrator z podatki iz `.env`:
- E-pošta: `ADMIN_EMAIL`
- Geslo: `ADMIN_PASSWORD`

**Takoj po prvi prijavi spremenite geslo** (dodajte novega admina in izbrišite starega ali ročno posodobite v bazi).

## Struktura

```
src/
├── app/
│   ├── page.tsx              # Javna stran za naročanje
│   ├── admin/                # Admin panel
│   └── api/                  # API endpoints
├── components/               # React komponente
└── lib/                      # Pomožne funkcije
prisma/
├── schema.prisma             # Shema baze
└── seed.ts                   # Začetni podatki
```

## API

| Endpoint | Opis |
|----------|------|
| `GET /api/stylists` | Seznam frizerjev (javno) |
| `GET/POST /api/bookings` | Prosti termini / naročilo |
| `POST /api/auth/login` | Prijava osebja |
| `GET /api/admin/appointments` | Termini (osebje) |
| `GET/POST /api/admin/users` | Upravljanje uporabnikov (admin) |
