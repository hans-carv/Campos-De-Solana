// Datos de vinos
import arteEncuentro from "../assets/wines/Tinto/ElArtedelEncuentro.png";
import estherOrtiz from "../assets/wines/Tinto/EstherOrtiz.png";
import innovanteCabernetSauvignon from "../assets/wines/Tinto/InnovanteCabernetSauvignon.png";
import innovanteMalbec from "../assets/wines/Tinto/InnovanteMalbec.png";
import innovanteMalbecCabernet from "../assets/wines/Tinto/InnovanteMalbecCaberneSauvignon.png";
import innovanteMarselan from "../assets/wines/Tinto/InnovanteMarselan.png";
import innovanteReservaMalbecCabernet from "../assets/wines/Tinto/InnovanteReservaMalbecCabernetSauvignon.png";
import innovanteReservaTannatMarselan from "../assets/wines/Tinto/InnovanteReservaTannatMarselan.png";
import innovanteTannat from "../assets/wines/Tinto/InnovanteTannat.png";
import tintoClasico from "../assets/wines/Tinto/TintoClasico.png";
import triGranReserva from "../assets/wines/Tinto/TriGranReserva.png";
import unicoDarkTannat from "../assets/wines/Tinto/ÚnicoDarkTannat.png";

import innovanteRose from "../assets/wines/Rose/InnovanteRosé.png";

import innovanteRiesling from "../assets/wines/Blanco/InnovanteRiesling.png";
import vinoBlanco from "../assets/wines/Blanco/BlancoClasico.png";
import triBlancoReserva from "../assets/wines/Blanco/TriBlancoReserva.png";

import oporto from "../assets/wines/Dulce/Oporto.png";

const wines = [
  {
    id: 1,
    name: "EL ARTE DEL ENCUENTRO",
    year: 2023,
    line: "Colección Especial",
    category: "Tinto",
    region: "Tarija, Bolivia",
    presentation: "750 ml",
    price: 60,
    stock: 100,
    description:
      "Vino fresco y afrutado, de cuerpo medio y agradable en boca. Es un coupage elegante de Tannat y Malbec adaptados a la región.",
    image: arteEncuentro,
    tags: ["Coupage", "Fresco", "Frutal"],
    featured: false,
  },
  {
    id: 2,
    name: "ESTHER ORTIZ",
    year: 2023,
    line: "Esther Ortiz",
    category: "Tinto",
    region: "Tarija, Bolivia",
    presentation: "750 ml",
    price: 180,
    stock: 20,
    description:
      "Gran Reserva de Familia elaborado con Petit Verdot. Un vino elegante, intenso y de carácter premium.",
    image: estherOrtiz,
    tags: ["Gran Reserva", "Premium", "Roble"],
    featured: true,
  },
  {
    id: 3,
    name: "INNOVANTE CABERNET SAUVIGNON",
    year: 2024,
    line: "Innovante",
    category: "Tinto",
    region: "Tarija, Bolivia",
    presentation: "750 ml",
    price: 95,
    stock: 100,
    description:
      "Vino tinto elaborado con Cabernet Sauvignon, de buena estructura, intensidad aromática y carácter varietal.",
    image: innovanteCabernetSauvignon,
    tags: ["Elegante", "Intenso"],
    featured: false,
  },
  {
    id: 4,
    name: "INNOVANTE MALBEC",
    year: 2024,
    line: "Innovante",
    category: "Tinto",
    region: "Tarija, Bolivia",
    presentation: "750 ml",
    price: 95,
    stock: 100,
    description:
      "Vino tinto de Malbec con expresión frutal, cuerpo equilibrado y perfil moderno.",
    image: innovanteMalbec,
    tags: ["Frutal", "Equilibrado"],
    featured: false,
  },
  {
    id: 5,
    name: "MALBEC CABERNET SAUVIGNON",
    year: 2021,
    line: "Los Cipreses",
    category: "Tinto",
    region: "Los Cipreses, Tarija",
    presentation: "750 ml",
    price: 80,
    stock: 100,
    description:
      "Vino elaborado con uvas Malbec y Cabernet Sauvignon de los viñedos más antiguos de la finca Los Cipreses, con crianza de 9 meses en barricas de roble.",
    image: innovanteMalbecCabernet,
    tags: ["Roble", "Estructurado"],
    featured: false,
  },
  {
    id: 6,
    name: "INNOVANTE MARSELAN",
    year: 2024,
    line: "Innovante",
    category: "Tinto",
    region: "Tarija, Bolivia",
    presentation: "750 ml",
    price: 106,
    stock: 100,
    description:
      "Marselan es una cepa de origen francés con mucho potencial en nuestras fincas de gran altura en Tarija. Destaca por su color morado oscuro, violeta y aromas frutales.",
    image: innovanteMarselan,
    tags: ["Frutal", "Intenso"],
    featured: true,
  },
  {
    id: 7,
    name: "INNOVANTE RESERVA MALBEC CABERNET SAUVIGNON",
    year: 2023,
    line: "Innovante Reserva",
    category: "Tinto",
    region: "Tarija, Bolivia",
    presentation: "750 ml",
    price: 120,
    stock: 100,
    description:
      "Reserva elaborado con Malbec y Cabernet Sauvignon, con carácter elegante, estructura firme y notas de crianza.",
    image: innovanteReservaMalbecCabernet,
    tags: ["Reserva", "Roble"],
    featured: true,
  },
  {
    id: 8,
    name: "INNOVANTE RESERVA TANNAT MARSELAN",
    year: 2023,
    line: "Innovante Reserva",
    category: "Tinto",
    region: "Tarija, Bolivia",
    presentation: "750 ml",
    price: 120,
    stock: 100,
    description:
      "Reserva de Tannat y Marselan, de color profundo, buena estructura y expresión frutal intensa.",
    image: innovanteReservaTannatMarselan,
    tags: ["Reserva", "Intenso"],
    featured: true,
  },
  {
    id: 9,
    name: "INNOVANTE TANNAT",
    year: 2022,
    line: "Innovante",
    category: "Tinto",
    region: "Tarija, Bolivia",
    presentation: "750 ml",
    price: 100,
    stock: 35,
    description:
      "La expansión de los viñedos de Tannat permite producir un vino de estilo joven, con fruta disponible y gran carácter varietal.",
    image: innovanteTannat,
    tags: ["Joven", "Frutal"],
    featured: true,
  },
  {
    id: 10,
    name: "TINTO CLÁSICO",
    year: 2023,
    line: "Clásicos",
    category: "Tinto",
    region: "Tarija, Bolivia",
    presentation: "750 ml",
    price: 35,
    stock: 100,
    description:
      "Vino tinto clásico de perfil amable, ideal para acompañar comidas cotidianas y momentos casuales.",
    image: tintoClasico,
    tags: ["Clásico", "Ligero"],
    featured: false,
  },
  {
    id: 11,
    name: "TRI GRAN RESERVA",
    year: 2023,
    line: "TRI",
    category: "Tinto",
    region: "Tarija, Bolivia",
    presentation: "750 ml",
    price: 150,
    stock: 50,
    description:
      "Gran Reserva de alta expresión, elaborado con uvas seleccionadas y pensado para una experiencia premium.",
    image: triGranReserva,
    tags: ["Gran Reserva", "Premium"],
    featured: true,
  },
  {
    id: 12,
    name: "ÚNICO DARK TANNAT",
    year: 2023,
    line: "Único",
    category: "Tinto",
    region: "Tarija, Bolivia",
    presentation: "750 ml",
    price: 110,
    stock: 0,
    description:
      "Fermentación maloláctica en barricas de tercer uso y posterior crianza en barricas ex bourbon traídas desde Kentucky durante 1 año.",
    image: unicoDarkTannat,
    tags: ["Premium", "Bourbon Barrel"],
    featured: true,
  },
  {
    id: 13,
    name: "INNOVANTE ROSÉ",
    year: 2023,
    line: "Innovante",
    category: "Rosé",
    region: "Tarija, Bolivia",
    presentation: "750 ml",
    price: 120,
    stock: 100,
    description:
      "Elaborado con uvas Malbec y Marselan, integra el carácter frutal de las primeras con la frescura y expresión de las segundas, obteniendo un vino muy agradable.",
    image: innovanteRose,
    tags: ["Fresco", "Frutal"],
    featured: true,
  },
  {
    id: 14,
    name: "INNOVANTE RIESLING",
    year: 2023,
    line: "Innovante",
    category: "Blanco",
    region: "Santa Ana, Tarija",
    presentation: "750 ml",
    price: 77,
    stock: 100,
    description:
      "Variedad alemana adaptada a los valles tarijeños de Santa Ana. La amplitud térmica favorece una uva que produce vinos muy frescos.",
    image: innovanteRiesling,
    tags: ["Fresco", "Ligero"],
    featured: false,
  },
  {
    id: 15,
    name: "BLANCO CLÁSICO",
    year: 2023,
    line: "Clásicos",
    category: "Blanco",
    region: "Tarija, Bolivia",
    presentation: "750 ml",
    price: 19,
    stock: 100,
    description:
      "Vino elaborado a partir de uvas provenientes de los valles centrales de Tarija, una zona de alta luminosidad y pureza de ambiente.",
    image: vinoBlanco,
    tags: ["Clásico", "Ligero"],
    featured: false,
  },
  {
    id: 16,
    name: "TRI BLANCO RESERVA",
    year: 2024,
    line: "TRI",
    category: "Blanco",
    region: "Tarija, Bolivia",
    presentation: "750 ml",
    price: 80,
    stock: 32,
    description:
      "TRI, el primer Reserva blanco de Bolivia. Fruto de la investigación e innovación que son el ADN de Campos de Solana. Nombrado el mejor blanco de Bolivia por la guía especializada.",
    image: triBlancoReserva,
    tags: ["Reserva", "Premium"],
    featured: true,
  },
  {
    id: 17,
    name: "OPORTO",
    year: 2025,
    line: "Colección Dulce",
    category: "Dulce",
    region: "Tarija, Bolivia",
    presentation: "750 ml",
    price: 30,
    stock: 40,
    description:
      "Vino dulce de corte tipo Oporto, obtenido de la sobremaduración de uvas seleccionadas de los valles tarijeños.",
    image: oporto,
    tags: ["Dulce", "Premium"],
    featured: true,
  },
];

export default wines;