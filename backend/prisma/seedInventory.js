require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const items = [
  // Vaccines
  { name: "VANGUARD 5 IN 1", category: "Vaccines", price: 500 },
  { name: "VANGUARD 6 IN 1", category: "Vaccines", price: 650 },
  { name: "VANGUARD L4", category: "Vaccines", price: 700 },
  { name: "PUREVAC", category: "Vaccines", price: 1000 },
  { name: "ANTI RABIES 10DS", category: "Vaccines", price: 400 },
  { name: "SINGLE RABIES FOR CAT", category: "Vaccines", price: 400 },
  { name: "KENNEL KUPP KC (BRONCHICINE)", category: "Vaccines", price: 650 },
  { name: "HIPRA DP", category: "Vaccines", price: 500 },
  { name: "HIPRA DHLP", category: "Vaccines", price: 500 },
  {
    name: "PROHEART INJ.",
    category: "Vaccines",
    price: null,
    notes: "Price by kilos: 2,800-3,500",
  },
  { name: "FELOCILL 4 IN 1", category: "Vaccines", price: 1000 },
  { name: "BONDETELLA", category: "Vaccines", price: 650 },

  // Test Kits
  { name: "CDV TEST", category: "TestKits", price: 850 },
  { name: "CPV TEST", category: "TestKits", price: 850 },
  { name: "2 WAY TEST", category: "TestKits", price: 1850 },
  { name: "3 WAY TEST", category: "TestKits", price: 2050 },
  { name: "4 WAY TEST", category: "TestKits", price: 2450 },
  { name: "4 WAY TEST FOR CATS", category: "TestKits", price: 2450 },
  { name: "ROTOR", category: "TestKits", price: 2150 },

  // Antibiotics
  { name: "AZITHROMYCIN", category: "Antibiotics", price: 350 },
  { name: "BELDOX 120ml", category: "Antibiotics", price: 650 },
  { name: "BELDOX 60ml", category: "Antibiotics", price: 450 },
  { name: "SCOURVET", category: "Antibiotics", price: 450 },
  { name: "TRITOZINE", category: "Antibiotics", price: 450 },
  { name: "PET DOXY PLUS", category: "Antibiotics", price: 650 },
  { name: "CEFALEXINE (CEPLEZ)", category: "Antibiotics", price: 350 },
  { name: "TOLFENOL", category: "Antibiotics", price: 650 },
  { name: "MELOXICAM", category: "Antibiotics", price: 650 },
  { name: "MUCOTAN", category: "Antibiotics", price: 450 },
  { name: "DUMOPROL", category: "Antibiotics", price: 450 },
  { name: "EMERFLOX", category: "Antibiotics", price: 450 },
  { name: "DIACEL", category: "Antibiotics", price: 350 },
  { name: "DIALEX", category: "Antibiotics", price: 350 },
  { name: "CO-AMOXICLAV", category: "Antibiotics", price: 650 },
  { name: "CLINDAMYCINE", category: "Antibiotics", price: 650 },
  { name: "BETNOVATE CREAM", category: "Antibiotics", price: 650 },
  { name: "VIBRA PASTE", category: "Antibiotics", price: 850 },
  { name: "APOQUEL 16MG", category: "Antibiotics", price: 150 },
  { name: "APOQUEL 5.4MG", category: "Antibiotics", price: 250 },
  { name: "ITRAVET PLUS", category: "Antibiotics", price: 650 },
  { name: "URITRACT RELIEF", category: "Antibiotics", price: 650 },
  { name: "PETMEDIN 1.25", category: "Antibiotics", price: 100 },
  { name: "BECLOGIN", category: "Antibiotics", price: 650 },
  { name: "TINAZOL PLUS", category: "Antibiotics", price: 450 },
  { name: "BIOCURE", category: "Antibiotics", price: 350 },

  // Supplements
  { name: "NUTRIMAX FORTE", category: "Supplements", price: 650 },
  { name: "PLATEVET BOOST", category: "Supplements", price: 850 },
  { name: "MULTIVITAMINS APPE BOOST", category: "Supplements", price: 350 },
  { name: "PETSURE 120ML", category: "Supplements", price: 450 },
  { name: "PET FEVER GO", category: "Supplements", price: 500 },
  { name: "NEPHROFLUSH FORTE", category: "Supplements", price: 550 },
  { name: "NUTRI-TIER GEL", category: "Supplements", price: 500 },
  { name: "NUTRI GEL", category: "Supplements", price: 850 },
  { name: "L-IMMUNE GEL", category: "Supplements", price: 850 },
  { name: "EPITOX", category: "Supplements", price: 750 },
  { name: "B-COMPLEX", category: "Supplements", price: 450 },
  { name: "BELFOLIC CEE", category: "Supplements", price: 450 },
  { name: "KENNEL KUPP SYRUP", category: "Supplements", price: 650 },
  { name: "BELIAF", category: "Supplements", price: 850 },
  { name: "IRON AID", category: "Supplements", price: 450 },
  { name: "PREBICAN", category: "Supplements", price: 1200 },
  { name: "OB-SUPPLEMENTS", category: "Supplements", price: 450 },
  {
    name: "DEXTROLYTE POWDER",
    category: "Supplements",
    price: null,
    notes: "3 pcs for 50 pesos",
  },

  // Eye Drops
  { name: "TOBRAMYCIN", category: "EyeDrops", price: 350 },
  { name: "TOBRADEXA", category: "EyeDrops", price: 350 },
  { name: "K-9 EYE DROPS", category: "EyeDrops", price: 650 },

  // Ear Drops
  { name: "K-9 EAR DROPS", category: "EarDrops", price: 650 },
  { name: "POMISOL", category: "EarDrops", price: 550 },
  { name: "OTE FORTE", category: "EarDrops", price: 550 },

  // Anti Parasite
  { name: "REVOLUTION 240MG", category: "AntiParasite", price: 950 },
  { name: "ADVOCATE DOG", category: "AntiParasite", price: 750 },
  { name: "ADVOCATE CAT 4KG", category: "AntiParasite", price: 450 },
  { name: "NEXGARD SPECTRA 2.5 KG", category: "AntiParasite", price: 750 },
  { name: "NEXGARD SPECTRA 7.5KG", category: "AntiParasite", price: 950 },
  { name: "NEXGARD SPECTRA 7.5-15KG", category: "AntiParasite", price: 750 },
  { name: "NEXGARD SPECTRA 15-30KG", category: "AntiParasite", price: 850 },
  { name: "NEXGARD SPECTRA 30-60KG", category: "AntiParasite", price: 950 },
  { name: "NEXGARD COMBO CAT 2.5KG", category: "AntiParasite", price: 750 },
  { name: "NEXGARD COMBO CAT 7.5KG", category: "AntiParasite", price: 950 },
  { name: "SIMPARICA 2.5KG", category: "AntiParasite", price: 550 },
  { name: "SIMPARICA 5-10KG", category: "AntiParasite", price: 650 },
  { name: "SIMPARICA 10-20KG", category: "AntiParasite", price: 750 },
  { name: "SIMPARICA 20-40KG", category: "AntiParasite", price: 850 },
  { name: "HYCLENS SPRAY", category: "AntiParasite", price: 450 },
  { name: "TEGUTECT SPRAY", category: "AntiParasite", price: 450 },
  { name: "NOURISHING SKIN CARE GEL", category: "AntiParasite", price: 450 },
  { name: "DRONTAL PLUS TABLET", category: "AntiParasite", price: 350 },
  { name: "PRAZINATE SYRUP", category: "AntiParasite", price: 500 },
  { name: "VETHUB CLENS", category: "AntiParasite", price: 450 },

  // Anti Inflammatory
  { name: "PRED 10 SYRUP", category: "AntiInflammatory", price: 450 },
  { name: "PRED 10 TABLET", category: "AntiInflammatory", price: 450 },
  { name: "PRED 20 TABLET", category: "AntiInflammatory", price: 150 },
  {
    name: "ZOLETIL",
    category: "AntiInflammatory",
    price: 1800,
    notes: "Price: 1,800 per injection",
  },
  { name: "XYLAVET FORTE", category: "AntiInflammatory", price: 500 },
  { name: "AMOXICILLIN INJ.", category: "AntiInflammatory", price: 150 },
  { name: "AMILYTE C", category: "AntiInflammatory", price: 450 },
  { name: "OXYTOCIN", category: "AntiInflammatory", price: 150 },
  { name: "ATROSITE", category: "AntiInflammatory", price: 150 },
  { name: "DUPHALYTE", category: "AntiInflammatory", price: 500 },
  { name: "MARBOCYL", category: "AntiInflammatory", price: 150 },
  { name: "BIO D.O.C", category: "AntiInflammatory", price: 450 },
  { name: "SULFIRONE", category: "AntiInflammatory", price: 150 },
  { name: "ORMIPURAL", category: "AntiInflammatory", price: 150 },
  { name: "COFORTA", category: "AntiInflammatory", price: 150 },
  { name: "IVOMECTIN", category: "AntiInflammatory", price: 150 },
  { name: "IRON INJ.", category: "AntiInflammatory", price: 150 },
  { name: "METASAL INJ.", category: "AntiInflammatory", price: 150 },
  { name: "CERENIA", category: "AntiInflammatory", price: 750 },
  { name: "CONVENIA", category: "AntiInflammatory", price: 750 },
  { name: "DEXAMETHAZONE INJ", category: "AntiInflammatory", price: 150 },
  {
    name: "CYTOPOINT",
    category: "AntiInflammatory",
    price: 1800,
    notes: "Price: 1,800 per injection",
  },

  // Food Supplements
  { name: "DERMACOMFORT MINI 3KG", category: "FoodSupplements", price: 1850 },
  { name: "DERMACOMFORT 8KG", category: "FoodSupplements", price: 2850 },
  { name: "SKINCARE SMALL DOG 2KG", category: "FoodSupplements", price: 1950 },
  { name: "URINARY S/O DOG 1.5KG", category: "FoodSupplements", price: 1600 },
  { name: "URINARY S/O CAT 1.5KG", category: "FoodSupplements", price: 1600 },
  { name: "URINARY S/O CAT 2KG", category: "FoodSupplements", price: 1600 },
  { name: "RENAL DRY", category: "FoodSupplements", price: 1400 },
  { name: "URINARY S/O CAT POUCH", category: "FoodSupplements", price: 150 },
  {
    name: "GASTRO INTESTINAL CAT POUCH",
    category: "FoodSupplements",
    price: 150,
  },
  { name: "RENAL CAT POUCH", category: "FoodSupplements", price: 150 },
  { name: "KITTEN POUCH", category: "FoodSupplements", price: 150 },
  { name: "VET EXPERT RECOVERY CAN", category: "FoodSupplements", price: 300 },
  { name: "RENAL CAN", category: "FoodSupplements", price: 250 },
  { name: "STARTER MOUSSE", category: "FoodSupplements", price: 300 },
  { name: "AMETRAZ SOAP", category: "FoodSupplements", price: 250 },
  { name: "BAYOPET TICK & FLEA SOAP", category: "FoodSupplements", price: 250 },
  {
    name: "BAYOPET CONDITIONING SHAMPOO",
    category: "FoodSupplements",
    price: 500,
  },
  { name: "MYCOCIDE SHAMPOO", category: "FoodSupplements", price: 550 },
  { name: "TETOHEX SOAP", category: "FoodSupplements", price: 150 },
  { name: "MADRE DE CACAO SOAP", category: "FoodSupplements", price: 150 },
  { name: "FIPRONIL SHAMPOO", category: "FoodSupplements", price: 650 },

  // Others
  { name: "LACTULOSE 120 ml", category: "Others", price: 450 },
  { name: "PET LYSINE LIQUID", category: "Others", price: 650 },
  { name: "MOXIFLOXACIN", category: "Others", price: 350 },
];

async function main() {
  console.log("Seeding inventory...");
  let created = 0;
  let skipped = 0;

  for (const item of items) {
    const existing = await prisma.inventoryItem.findFirst({
      where: { name: item.name },
    });

    if (existing) {
      skipped++;
      continue;
    }

    await prisma.inventoryItem.create({
      data: {
        name: item.name,
        category: item.category,
        stock: 0,
        unit: "pcs",
        status: "OutOfStock",
        price: item.price !== undefined ? item.price : null,
        notes: item.notes || null,
      },
    });
    created++;
  }

  console.log(
    `Done. Created: ${created}, Skipped (already exists): ${skipped}`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
