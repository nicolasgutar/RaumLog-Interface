import { db, spacesTable } from "../index";

async function seed() {
  console.log("Seeding spaces with numeric prices...");

  const spaces = [
    {
      ownerName: "RaumHost Demo",
      ownerEmail: "demo@raumlog.com",
      ownerPhone: "+57 300 000 0000",
      spaceType: "Garaje",
      city: "Medellín",
      address: "El Poblado, Calle 10",
      description: "Garaje amplio con portón eléctrico, buena iluminación y acceso seguro las 24 horas. Ideal para almacenar vehículos, muebles o mercancía.",
      priceDaily: "$35.000 COP",
      priceMonthly: "$650.000 COP",
      priceAnnual: "$6.500.000 COP",
      priceDailyNum: 35000,
      priceMonthlyNum: 650000,
      published: true,
      status: "approved" as const,
      category: "Vehículos" as const,
      accessType: "24/7" as const,
      images: [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
        "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
        "https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=800&q=80"
      ]
    },
    {
      ownerName: "RaumHost Demo",
      ownerEmail: "demo@raumlog.com",
      ownerPhone: "+57 300 111 2222",
      spaceType: "Cuarto Útil",
      city: "Medellín",
      address: "Laureles, Circular 4",
      description: "Cuarto útil limpio y seco, con buena ventilación. Perfecto para guardar cajas, electrodomésticos o artículos del hogar.",
      priceDaily: "$18.000 COP",
      priceMonthly: "$320.000 COP",
      priceAnnual: "$3.200.000 COP",
      priceDailyNum: 18000,
      priceMonthlyNum: 320000,
      published: true,
      status: "approved" as const,
      category: "Cajas" as const,
      accessType: "Con cita" as const,
      images: [
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
        "https://images.unsplash.com/photo-1558618047-3d9b42c24b5d?w=800&q=80"
      ]
    },
    {
      ownerName: "RaumHost Demo",
      ownerEmail: "demo@raumlog.com",
      ownerPhone: "+57 300 333 4444",
      spaceType: "Bodega",
      city: "Itagüí",
      address: "Zona Industrial",
      description: "Bodega en zona industrial con fácil acceso vehicular, piso en concreto y techado completo. Ideal para negocios y archivo.",
      priceDaily: "$75.000 COP",
      priceMonthly: "$1.400.000 COP",
      priceAnnual: "$14.000.000 COP",
      priceDailyNum: 75000,
      priceMonthlyNum: 1400000,
      published: true,
      status: "approved" as const,
      category: "General" as const,
      accessType: "Solo entrega" as const,
      images: [
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
        "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80",
        "https://images.unsplash.com/photo-1620801113793-1e8de77a1a2f?w=800&q=80"
      ]
    },
    {
      ownerName: "RaumHost Demo",
      ownerEmail: "demo@raumlog.com",
      ownerPhone: "+57 300 555 6666",
      spaceType: "Depósito",
      city: "Envigado",
      address: "Conjunto Residencial",
      description: "Depósito en conjunto residencial cerrado, con vigilancia y cámaras de seguridad. Acceso con código personal.",
      priceDaily: "$25.000 COP",
      priceMonthly: "$480.000 COP",
      priceAnnual: "$4.800.000 COP",
      priceDailyNum: 25000,
      priceMonthlyNum: 480000,
      published: true,
      status: "approved" as const,
      category: "Muebles" as const,
      accessType: "Con cita" as const,
      images: [
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80"
      ]
    },
    {
      ownerName: "RaumHost Demo",
      ownerEmail: "demo@raumlog.com",
      ownerPhone: "+57 300 777 8888",
      spaceType: "Garaje",
      city: "Bello",
      address: "Zona Norte",
      description: "Garaje doble con espacio para dos vehículos o gran capacidad de almacenamiento. Rejas de seguridad, iluminación LED.",
      priceDaily: "$55.000 COP",
      priceMonthly: "$1.000.000 COP",
      priceAnnual: "$10.000.000 COP",
      priceDailyNum: 55000,
      priceMonthlyNum: 1000000,
      published: true,
      status: "approved" as const,
      category: "Vehículos" as const,
      accessType: "24/7" as const,
      images: [
        "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
        "https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=800&q=80",
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80"
      ]
    },
    {
      ownerName: "RaumHost Demo",
      ownerEmail: "demo@raumlog.com",
      ownerPhone: "+57 300 999 0000",
      spaceType: "Bodega",
      city: "Sabaneta",
      address: "Zona Comercial",
      description: "Mini bodega en zona comercial, seca y segura. Contrato flexible por días, meses o año.",
      priceDaily: "$22.000 COP",
      priceMonthly: "$400.000 COP",
      priceAnnual: "$4.000.000 COP",
      priceDailyNum: 22000,
      priceMonthlyNum: 400000,
      published: true,
      status: "approved" as const,
      category: "Electrodomésticos" as const,
      accessType: "Solo entrega" as const,
      images: [
        "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
        "https://images.unsplash.com/photo-1620801113793-1e8de77a1a2f?w=800&q=80"
      ]
    }
  ];

  for (const space of spaces) {
    try {
      await db.insert(spacesTable).values(space);
      console.log(`Inserted space: ${space.spaceType} in ${space.city}`);
    } catch (err) {
      console.warn(`Could not insert space: ${space.spaceType}. Error: ${err}`);
    }
  }

  console.log("Seeding complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
