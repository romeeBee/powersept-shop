import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

// Copy is written around real Slovenian search demand (Google autocomplete,
// hl=sl&gl=si): "sredstvo proti glivicam na nohtih", "razkužilo za površine",
// "razkužilo brez vonja", "razkužilo za igrače", "odstranjevanje plesni na
// steni / v kopalnici / iz fug", "sredstvo proti plesni brez vonja",
// "razkužilo za čevlje". Keywords are woven in naturally, never stuffed.

const categoriesData = [
  {
    name: "Izdelki proti glivicam",
    slug: "izdelki-proti-glivicam",
    description:
      "Učinkovito sredstvo proti glivicam na nohtih in stopalih — pršilo z aplikatorjem za nanos pod noht. Dezinficira nohte, kožo ter nogavice in obutev, da se glivice ne vračajo.",
    sortOrder: 1,
  },
  {
    name: "Dezinfekcija površin",
    slug: "dezinfekcija-povrsin",
    description:
      "Razkužilo za površine brez vonja za gospodinjstva, ordinacije in poslovne prostore. Odstranjuje bakterije, glive in plesni — brez izpiranja, 100 % biorazgradljivo.",
    sortOrder: 2,
  },
  {
    name: "Otroške površine",
    slug: "otroske-povrsine",
    description:
      "Nežno razkužilo za igrače, previjalne in igralne podloge ter vse površine, kjer so otroci — brez alkohola, brez barve in brez izpiranja.",
    sortOrder: 3,
  },
  {
    name: "Stop plesen",
    slug: "stop-plesen",
    description:
      "Sredstvo za odstranjevanje plesni na steni, v kopalnici, fugah in silikonu. Belo se zapeni, kjer deluje — brez vonja, že pripravljeno za uporabo.",
    sortOrder: 4,
  },
] as const;

const productsData = [
  {
    name: "Powersept proti glivicam 200 ml",
    slug: "powersept-proti-glivicam-200ml",
    categorySlug: "izdelki-proti-glivicam",
    shortDescription:
      "Pršilo proti glivicam na nohtih z aplikatorjem za nanos pod noht — vodikov peroksid in srebrov nitrat.",
    description:
      "Glivice na nohtih so vztrajna težava, ker se skrivajo tam, kjer običajna sredstva ne dosežejo — pod nohtom. Powersept proti glivicam je pršilo s edinstvenim aplikatorjem, ki omogoča natančen nanos tekočine pod noht in na nohtno ploščico. Formula na osnovi vodikovega peroksida in srebrovega nitrata dezinficira nohte, kožo stopal ter hkrati nogavice in obutev — celovit pristop, ki glivicam onemogoča vračanje. Uporabljajo ga odrasli, ki iščejo učinkovito sredstvo proti glivicam na nohtih in stopalih.",
    benefits: [
      "Pršilo proti glivicam na nohtih, stopalih in koži",
      "Edinstven aplikator za nanos pod nohtom",
      "Vsebuje vodikov peroksid in srebrov nitrat",
      "Dezinficira tudi nogavice in obutev — glivicam onemogoča vračanje",
    ],
    usage: [
      "Nanesite tekočino z aplikatorjem pod noht in na noht",
      "Ponovite dvakrat dnevno, zjutraj in zvečer",
      "Za trajen učinek dezinficirajte tudi nogavice in obutev",
    ],
    ingredients: "Vodikov peroksid, srebrov nitrat",
    volumeMl: 200,
    price: 29.9,
    isFeatured: true,
    inStock: true,
    sortOrder: 1,
  },
  {
    name: "Powersept dodatna doza 200 ml",
    slug: "powersept-dodatna-doza-200ml",
    categorySlug: "izdelki-proti-glivicam",
    shortDescription:
      "Nadomestna doza pršila proti glivicam na nohtih — enaka formula, brez pršila in aplikatorja.",
    description:
      "Powersept dodatna doza je nadomestni paket za vse, ki razpršilo in aplikator Powersept že imate. Enaka preizkušena formula na osnovi vodikovega peroksida in srebrovega nitrata za nego nohtov pri glivicah — brez dodatne embalaže, bolj ekonomično in okolju prijaznejše nadaljevanje zdravljenja.",
    benefits: [
      "Enaka učinkovita formula proti glivicam na nohtih",
      "Ekonomično nadaljevanje nege",
      "Manj odpadkov — ponovno uporabite obstoječe razpršilo",
      "Vsebuje vodikov peroksid in srebrov nitrat",
    ],
    usage: [
      "Vsebino prelijte v obstoječe razpršilo Powersept",
      "Uporabljajte enako kot izvirno pršilo",
    ],
    ingredients: "Vodikov peroksid, srebrov nitrat",
    volumeMl: 200,
    price: 19.9,
    isFeatured: false,
    inStock: true,
    sortOrder: 2,
  },
  {
    name: "Powersept proti glivicam + dodatna doza",
    slug: "powersept-proti-glivicam-paket",
    categorySlug: "izdelki-proti-glivicam",
    shortDescription:
      "Paket za glivice na nohtih: pršilo z aplikatorjem + nadomestna doza. Prihranite 2 €.",
    description:
      "Celovit paket proti glivicam na nohtih in stopalih: pršilo Powersept z edinstvenim aplikatorjem za nanos pod noht ter nadomestna doza za nadaljevanje zdravljenja. Skupaj pokrijeta celoten potek nege — od prve uporabe do trajnih rezultatov — po ugodnejši ceni kot pri ločenem nakupu.",
    benefits: [
      "Pršilo z aplikatorjem + nadomestna doza",
      "Prihranite 2 € glede na ločen nakup",
      "Pokrije celoten potek nege proti glivicam",
      "Vsebuje vodikov peroksid in srebrov nitrat",
    ],
    usage: [
      "Uporabljajte pršilo z aplikatorjem po navodilih",
      "Ko se pršilo izprazni, vanj prelijte dodatno dozo",
    ],
    ingredients: "Vodikov peroksid, srebrov nitrat",
    volumeMl: 400,
    price: 47.8,
    isFeatured: true,
    inStock: true,
    sortOrder: 3,
  },
  {
    name: "Powersept HOME 500 ml",
    slug: "powersept-home-500ml",
    categorySlug: "dezinfekcija-povrsin",
    shortDescription:
      "Razkužilo za površine brez vonja — odstranjuje bakterije, glive in plesni, brez izpiranja.",
    description:
      "Powersept HOME je razkužilo za površine, že pripravljeno za takojšnjo uporabo v kuhinji, kopalnici in vseh življenjskih prostorih. Učinkovito odstranjuje bakterije, glive in plesni, hkrati pa je popolnoma brez vonja — razkužilo brez dražečega vonja, ki ga lahko uporabljate tudi med bivanjem v prostoru. Ni potrebno izpirati ali brisati: poškropite in pustite, da se posuši. Zahvaljujoč srebrovim ionom ohranja moč dlje kot običajna sredstva na bazi vodikovega peroksida, po delovanju pa razpade na vodo in kisik.",
    benefits: [
      "Razkužilo za površine brez vonja in brez izpiranja",
      "Učinkovito odstranjuje bakterije, glive in plesni",
      "Že pripravljeno za uporabo — deluje takoj po nanosu",
      "100 % biorazgradljivo: razpade na vodo in kisik",
    ],
    usage: [
      "Poškropite na površino in pustite, da se posuši",
      "Ni potrebno izpirati ali brisati",
      "Primerno za kuhinjo, kopalnico in pogosto dotikane površine",
    ],
    ingredients: "Vodikov peroksid, srebrovi ioni",
    volumeMl: 500,
    price: 12.9,
    isFeatured: false,
    inStock: true,
    sortOrder: 4,
  },
  {
    name: "Powersept površine 1 L",
    slug: "powersept-povrsine-1l",
    categorySlug: "dezinfekcija-povrsin",
    shortDescription:
      "Razkužilo za površine 1 L — gospodarno pakiranje za redno dezinfekcijo prostorov.",
    description:
      "Večje pakiranje razkužila za površine, zasnovano za gospodinjstva in poslovne prostore z večjimi potrebami po redni dezinfekciji prostorov. Enaka učinkovita formula na osnovi vodikovega peroksida in srebrovih ionov, ugodnejša cena na liter — idealno za ordinacije, salone, pisarne in večja gospodinjstva.",
    benefits: [
      "Razkužilo za površine po ugodnejši ceni na liter",
      "Primerno za dezinfekcijo poslovnih prostorov",
      "Enaka učinkovita formula kot Powersept HOME",
      "Brez vonja in brez izpiranja",
    ],
    usage: [
      "Poškropite ali obrišite površino z raztopino",
      "Pustite, da se posuši — ni potrebno izpirati",
    ],
    ingredients: "Vodikov peroksid, srebrovi ioni",
    volumeMl: 1000,
    price: 19.9,
    isFeatured: false,
    inStock: true,
    sortOrder: 5,
  },
  {
    name: "Powersept SMART KIDS 200 ml",
    slug: "powersept-smart-kids-200ml",
    categorySlug: "otroske-povrsine",
    shortDescription:
      "Razkužilo za igrače in otroške površine — brez alkohola, brez barve, brez izpiranja.",
    description:
      "Powersept SMART KIDS je nežno razkužilo za igrače, previjalne in igralne podloge ter vse gladke površine, kjer se gibljejo otroci. Ni potrebno izpirati ali brisati — poškropite in pustite, da se posuši. Formula je brez barve in dražečega vonja ter ne vsebuje alkohola, zato je primerna tudi za uporabo nosečnic.",
    benefits: [
      "Razkužilo za igrače, podloge in otroške površine",
      "Ni potrebno izpirati ali brisati",
      "Brez barve, brez dražečega vonja in brez alkohola",
      "Primerno tudi za uporabo nosečnic",
    ],
    usage: [
      "Poškropite igrače, podloge in površine",
      "Pustite, da se posuši — ni potrebe po brisanju",
      "Uporabljajte po potrebi, vsakodnevno ali po igri",
    ],
    ingredients: "Vodikov peroksid, srebrov nitrat",
    volumeMl: 200,
    price: 19.9,
    isFeatured: true,
    inStock: true,
    sortOrder: 6,
  },
  {
    name: "Powersept stop-plesen 750 ml",
    slug: "powersept-stop-plesen-750ml",
    categorySlug: "stop-plesen",
    shortDescription:
      "Sredstvo za odstranjevanje plesni na steni, v kopalnici, fugah in silikonu — belo se zapeni, brez vonja.",
    description:
      "Sredstvo proti plesni, že pripravljeno za uporabo in deluje takoj — po nanosu lahko prostor takoj uporabljate. Odstranjuje plesni s sten, iz fug, silikona in vseh drugih materialov, ni ga potrebno redčiti z vodo, med nanosom prostora ni potrebno izolirati. Delovanje je vidno: ko pride v stik s plesnijo, se belo zapeni, tako da natančno vidite, kje deluje. Sredstvo proti plesni brez vonja — ne razžira dihal in pljuč.",
    benefits: [
      "Odstranjuje plesni s sten, fug in silikona",
      "Vidno delovanje — belo se zapeni na plesni",
      "Sredstvo proti plesni brez vonja",
      "Že pripravljeno za uporabo, deluje na vseh materialih",
    ],
    usage: [
      "Poškropite prizadeta mesta s plesnijo",
      "Pustite, da sredstvo deluje, nato obrišite",
      "Ponovite po potrebi pri trdovratni plesni",
    ],
    ingredients: "Vodikov peroksid, srebrovi ioni",
    volumeMl: 750,
    price: 24.9,
    isFeatured: true,
    inStock: true,
    sortOrder: 7,
  },
];

export const seedCatalog = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Idempotent content sync: insert missing rows, patch changed copy in
    // existing rows (keyed by slug), so keyword updates reach the live DB.
    let inserted = 0;
    let updated = 0;

    const categoryIds = new Map<string, Id<"categories">>();
    for (const category of categoriesData) {
      const existing = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", category.slug))
        .unique();
      if (existing === null) {
        const id = await ctx.db.insert("categories", { ...category });
        categoryIds.set(category.slug, id);
        inserted += 1;
      } else {
        categoryIds.set(category.slug, existing._id);
        const { slug: _slug, ...content } = category;
        const differs =
          existing.name !== content.name ||
          existing.description !== content.description ||
          existing.sortOrder !== content.sortOrder;
        if (differs) {
          await ctx.db.patch(existing._id, { ...content });
          updated += 1;
        }
      }
    }

    for (const product of productsData) {
      const { categorySlug, ...content } = product;
      const resolvedCategory = categoryIds.get(categorySlug);
      if (resolvedCategory === undefined) {
        throw new Error(`Neznana kategorija: ${categorySlug}`);
      }

      const existing = await ctx.db
        .query("products")
        .withIndex("by_slug", (q) => q.eq("slug", product.slug))
        .unique();
      if (existing === null) {
        await ctx.db.insert("products", {
          ...content,
          categoryId: resolvedCategory,
        });
        inserted += 1;
      } else {
        const differs =
          existing.name !== content.name ||
          existing.shortDescription !== content.shortDescription ||
          existing.description !== content.description ||
          existing.benefits.join("\n") !== content.benefits.join("\n") ||
          existing.usage.join("\n") !== content.usage.join("\n") ||
          existing.ingredients !== content.ingredients ||
          existing.price !== content.price ||
          existing.isFeatured !== content.isFeatured ||
          existing.inStock !== content.inStock ||
          existing.sortOrder !== content.sortOrder ||
          existing.categoryId !== resolvedCategory;
        if (differs) {
          await ctx.db.patch(existing._id, {
            ...content,
            categoryId: resolvedCategory,
          });
          updated += 1;
        }
      }
    }

    return {
      seeded: inserted > 0 || updated > 0,
      inserted,
      updated,
    };
  },
});
