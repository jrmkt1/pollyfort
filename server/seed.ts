import { getDB } from "./db";
import { products, cmsUsers, cmsPosts, cmsCategories, cmsTags, cmsMenus, cmsSettings, type InsertProduct } from "@shared/schema";

export async function seedDatabase() {
  const db = await getDB();
  if (!db) {
    console.log("Database not available, skipping seed");
    return;
  }

  // Check if products already exist
  const existingProducts = await db.select().from(products).limit(1);
  if (existingProducts.length > 0) {
    console.log("Database already seeded with products");
    return;
  }

  const sampleProducts: InsertProduct[] = [
    {
      name: "Roda Poliuretano 200x50mm - Yale",
      code: "POL-200-50-YA",
      description: "Roda de poliuretano para empilhadeira elétrica Yale. Alta durabilidade e resistência.",
      category: "Rodas Elétricas",
      diameter: "200mm",
      width: "50mm",
      material: "Poliuretano",
      hardness: "95 Shore A",
      maxLoad: "2500kg",
      application: "Yale ERP",
      imageUrl: "/attached_assets/servico-de-revestimento-de-roda-de-tracao-da-transpaleteira-eletrica-mpe-060-com-poliuretano-o-245mm-reweflon_1221_1749244270513.jpg",
      rating: 48,
      reviewCount: 23,
      featured: true,
      status: "active"
    },
    {
      name: "Roda de Tração 230x70mm - Linde",
      code: "TRA-230-70-LI",
      description: "Roda de tração em borracha maciça para empilhadeira Linde. Máxima aderência.",
      category: "Rodas de Tração",
      diameter: "230mm",
      width: "70mm",
      material: "Borracha",
      hardness: "85 Shore A",
      maxLoad: "3000kg",
      application: "Linde E20",
      imageUrl: "/attached_assets/servico-de-revestimento-de-roda-de-tracao-da-empilhadeira-fmx-ng-com-poliuretano-o-360mm-reweflon_1215_1749244270513.jpg",
      rating: 46,
      reviewCount: 18,
      featured: false,
      status: "active"
    },
    {
      name: "Roda de Apoio 180x60mm - Toyota",
      code: "APO-180-60-TO",
      description: "Roda de apoio em nylon para empilhadeira Toyota. Baixo ruído e alta resistência.",
      category: "Rodas de Apoio",
      diameter: "180mm",
      width: "60mm",
      material: "Nylon",
      hardness: "90 Shore D",
      maxLoad: "1800kg",
      application: "Toyota 8FB",
      imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      rating: 49,
      reviewCount: 31,
      featured: false,
      status: "active"
    },
    {
      name: "Roda Dupla 250x80mm - Hyster",
      code: "DUP-250-80-HY",
      description: "Conjunto de rodas duplas em poliuretano para empilhadeira Hyster. Carga pesada.",
      category: "Rodas Elétricas",
      diameter: "250mm",
      width: "80mm",
      material: "Poliuretano",
      hardness: "98 Shore A",
      maxLoad: "4000kg",
      application: "Hyster J2.5XN",
      imageUrl: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      rating: 47,
      reviewCount: 15,
      featured: false,
      status: "active"
    },
    {
      name: "Roda Pneumática 200x50mm - Crown",
      code: "PNE-200-50-CR",
      description: "Roda pneumática para empilhadeira Crown. Absorção de impactos e conforto.",
      category: "Rodas Elétricas",
      diameter: "200mm",
      width: "50mm",
      material: "Borracha Pneumática",
      hardness: "75 Shore A",
      maxLoad: "2200kg",
      application: "Crown RC5500",
      imageUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      rating: 45,
      reviewCount: 27,
      featured: false,
      status: "active"
    },
    {
      name: "Roda Borracha 220x65mm - Caterpillar",
      code: "BOR-220-65-CA",
      description: "Roda em borracha maciça para empilhadeira Caterpillar. Extrema durabilidade.",
      category: "Rodas de Tração",
      diameter: "220mm",
      width: "65mm",
      material: "Borracha",
      hardness: "88 Shore A",
      maxLoad: "3500kg",
      application: "Caterpillar EP20K",
      imageUrl: "https://images.unsplash.com/photo-1542744173-05336fcc7ad4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      rating: 48,
      reviewCount: 42,
      featured: true,
      status: "active"
    }
  ];

  console.log("Seeding database with products...");
  
  for (const product of sampleProducts) {
    await db.insert(products).values(product);
  }

  console.log(`Successfully seeded ${sampleProducts.length} products`);
}