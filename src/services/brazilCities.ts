import { useState, useEffect } from "react";

export interface BrazilState {
  uf: string;
  name: string;
}

export interface BrazilCity {
  name: string;
  uf: string;
  label: string;
}

export const BRAZIL_STATES: BrazilState[] = [
  { uf: "AC", name: "Acre" },
  { uf: "AL", name: "Alagoas" },
  { uf: "AP", name: "Amapá" },
  { uf: "AM", name: "Amazonas" },
  { uf: "BA", name: "Bahia" },
  { uf: "CE", name: "Ceará" },
  { uf: "DF", name: "Distrito Federal" },
  { uf: "ES", name: "Espírito Santo" },
  { uf: "GO", name: "Goiás" },
  { uf: "MA", name: "Maranhão" },
  { uf: "MT", name: "Mato Grosso" },
  { uf: "MS", name: "Mato Grosso do Sul" },
  { uf: "MG", name: "Minas Gerais" },
  { uf: "PA", name: "Pará" },
  { uf: "PB", name: "Paraíba" },
  { uf: "PR", name: "Paraná" },
  { uf: "PE", name: "Pernambuco" },
  { uf: "PI", name: "Piauí" },
  { uf: "RJ", name: "Rio de Janeiro" },
  { uf: "RN", name: "Rio Grande do Norte" },
  { uf: "RS", name: "Rio Grande do Sul" },
  { uf: "RO", name: "Rondônia" },
  { uf: "RR", name: "Roraima" },
  { uf: "SC", name: "Santa Catarina" },
  { uf: "SP", name: "São Paulo" },
  { uf: "SE", name: "Sergipe" },
  { uf: "TO", name: "Tocantins" },
];

export const SPECIAL_LOCALITIES: BrazilCity[] = [
  { name: "Remoto Nacional", uf: "BR", label: "Remoto Nacional (Brasil)" },
  { name: "Internacional", uf: "EX", label: "Internacional (Exterior)" },
];

// Base offline imediata cobrindo todas as 27 UFs (capitais e principais polos regionais)
// Enquanto sincroniza os 5.570 municípios oficiais da API do IBGE em cache local
const FALLBACK_CITIES_BY_UF: Record<string, string[]> = {
  AC: ["Rio Branco", "Cruzeiro do Sul", "Sena Madureira", "Tarauacá", "Feijó"],
  AL: ["Maceió", "Arapiraca", "Rio Largo", "Palmeira dos Índios", "Penedo", "Maragogi"],
  AP: ["Macapá", "Santana", "Laranjal do Jari", "Oiapoque"],
  AM: ["Manaus", "Parintins", "Itacoatiara", "Manacapuru", "Coari", "Tefé"],
  BA: [
    "Salvador",
    "Feira de Santana",
    "Vitória da Conquista",
    "Camaçari",
    "Juazeiro",
    "Itabuna",
    "Ilhéus",
    "Lauro de Freitas",
    "Barreiras",
    "Porto Seguro",
    "Teixeira de Freitas",
    "Alagoinhas",
  ],
  CE: [
    "Fortaleza",
    "Caucaia",
    "Juazeiro do Norte",
    "Maracanaú",
    "Sobral",
    "Crato",
    "Itapipoca",
    "Maranguape",
    "Iguatu",
    "Quixadá",
  ],
  DF: ["Brasília", "Taguatinga", "Águas Claras", "Ceilândia", "Gama", "Guará"],
  ES: [
    "Vitória",
    "Vila Velha",
    "Serra",
    "Cariacica",
    "Cachoeiro de Itapemirim",
    "Linhares",
    "São Mateus",
    "Colatina",
    "Guarapari",
  ],
  GO: [
    "Goiânia",
    "Aparecida de Goiânia",
    "Anápolis",
    "Rio Verde",
    "Luziânia",
    "Águas Lindas de Goiás",
    "Valparaíso de Goiás",
    "Trindade",
    "Formosa",
    "Catalão",
    "Itumbiara",
    "Jataí",
    "Caldas Novas",
  ],
  MA: [
    "São Luís",
    "Imperatriz",
    "São José de Ribamar",
    "Timon",
    "Caxias",
    "Codó",
    "Paço do Lumiar",
    "Açailândia",
    "Bacabal",
    "Balsas",
  ],
  MT: [
    "Cuiabá",
    "Várzea Grande",
    "Rondonópolis",
    "Sinop",
    "Tangará da Serra",
    "Cáceres",
    "Sorriso",
    "Lucas do Rio Verde",
    "Primavera do Leste",
    "Barra do Garças",
  ],
  MS: [
    "Campo Grande",
    "Dourados",
    "Três Lagoas",
    "Corumbá",
    "Ponta Porã",
    "Naviraí",
    "Nova Andradina",
    "Aquidauana",
    "Bonito",
  ],
  MG: [
    "Belo Horizonte",
    "Uberlândia",
    "Contagem",
    "Juiz de Fora",
    "Betim",
    "Montes Claros",
    "Ribeirão das Neves",
    "Uberaba",
    "Governador Valadares",
    "Ipatinga",
    "Sete Lagoas",
    "Divinópolis",
    "Santa Luzia",
    "Ibirité",
    "Poços de Caldas",
    "Patos de Minas",
    "Pouso Alegre",
    "Teófilo Otoni",
    "Barbacena",
    "Sabará",
    "Varginha",
    "Conselheiro Lafaiete",
    "Ouro Preto",
  ],
  PA: [
    "Belém",
    "Ananindeua",
    "Santarém",
    "Marabá",
    "Parauapebas",
    "Castanhal",
    "Abaetetuba",
    "Cametá",
    "Marituba",
    "Altamira",
    "Tucuruí",
  ],
  PB: [
    "João Pessoa",
    "Campina Grande",
    "Santa Rita",
    "Patos",
    "Bayeux",
    "Sousa",
    "Cabedelo",
    "Cajazeiras",
    "Guarabira",
  ],
  PR: [
    "Curitiba",
    "Londrina",
    "Maringá",
    "Ponta Grossa",
    "Cascavel",
    "São José dos Pinhais",
    "Foz do Iguaçu",
    "Colombo",
    "Guarapuava",
    "Paranaguá",
    "Araucária",
    "Toledo",
    "Apucarana",
    "Pinhais",
    "Campo Largo",
    "Umuarama",
  ],
  PE: [
    "Recife",
    "Jaboatão dos Guararapes",
    "Olinda",
    "Caruaru",
    "Petrolina",
    "Paulista",
    "Cabo de Santo Agostinho",
    "Camaragibe",
    "Garanhuns",
    "Vitória de Santo Antão",
    "Igarassu",
    "São Lourenço da Mata",
    "Santa Cruz do Capibaribe",
    "Serra Talhada",
    "Gravatá",
    "Arcoverde",
  ],
  PI: ["Teresina", "Parnaíba", "Picos", "Piripiri", "Floriano", "Campo Maior"],
  RJ: [
    "Rio de Janeiro",
    "São Gonçalo",
    "Duque de Caxias",
    "Nova Iguaçu",
    "Niterói",
    "Belford Roxo",
    "Campos dos Goytacazes",
    "São João de Meriti",
    "Petrópolis",
    "Volta Redonda",
    "Macaé",
    "Magé",
    "Itaboraí",
    "Cabo Frio",
    "Angra dos Reis",
    "Nova Friburgo",
    "Barra Mansa",
    "Teresópolis",
    "Mesquita",
    "Nilópolis",
    "Maricá",
    "Rio das Ostras",
    "Resende",
    "Búzios",
    "Paraty",
  ],
  RN: [
    "Natal",
    "Mossoró",
    "Parnamirim",
    "São Gonçalo do Amarante",
    "Macaíba",
    "Ceará-Mirim",
    "Caicó",
    "Currais Novos",
  ],
  RS: [
    "Porto Alegre",
    "Caxias do Sul",
    "Canoas",
    "Pelotas",
    "Santa Maria",
    "Gravataí",
    "Viamão",
    "Novo Hamburgo",
    "São Leopoldo",
    "Rio Grande",
    "Alvorada",
    "Passo Fundo",
    "Sapucaia do Sul",
    "Uruguaiana",
    "Santa Cruz do Sul",
    "Cachoeirinha",
    "Bagé",
    "Bento Gonçalves",
    "Erechim",
    "Guaíba",
    "Gramado",
    "Lajeado",
  ],
  RO: ["Porto Velho", "Ji-Paraná", "Ariquemes", "Vilhena", "Cacoal", "Rolim de Moura"],
  RR: ["Boa Vista", "Rorainópolis", "Caracaraí", "Pacaraima"],
  SC: [
    "Florianópolis",
    "Joinville",
    "Blumenau",
    "São José",
    "Chapecó",
    "Itajaí",
    "Criciúma",
    "Jaraguá do Sul",
    "Palhoça",
    "Lages",
    "Balneário Camboriú",
    "Brusque",
    "Tubarão",
    "São Bento do Sul",
    "Caçador",
    "Concórdia",
    "Navegantes",
  ],
  SP: [
    "São Paulo",
    "Guarulhos",
    "Campinas",
    "São Bernardo do Campo",
    "São José dos Campos",
    "Santo André",
    "Ribeirão Preto",
    "Osasco",
    "Sorocaba",
    "Mauá",
    "São José do Rio Preto",
    "Mogi das Cruzes",
    "Santos",
    "Diadema",
    "Jundiaí",
    "Piracicaba",
    "Carapicuíba",
    "Bauru",
    "Itaquaquecetuba",
    "São Vicente",
    "Franca",
    "Praia Grande",
    "Guarujá",
    "Taubaté",
    "Limeira",
    "Suzano",
    "Taboão da Serra",
    "Sumaré",
    "Barueri",
    "Embu das Artes",
    "Indaiatuba",
    "Cotia",
    "São Carlos",
    "Marília",
    "Itapevi",
    "Araraquara",
    "Jacareí",
    "Hortolândia",
    "Presidente Prudente",
    "Americana",
    "Rio Claro",
    "Araçatuba",
  ],
  SE: ["Aracaju", "Nossa Senhora do Socorro", "Lagarto", "Itabaiana", "São Cristóvão", "Estância"],
  TO: ["Palmas", "Araguaína", "Gurupi", "Porto Nacional", "Paraíso do Tocantins"],
};

const IBGE_CACHE_KEY = "soloist_ibge_cities_v1";

function buildFallbackCities(): BrazilCity[] {
  const list: BrazilCity[] = [];
  for (const [uf, names] of Object.entries(FALLBACK_CITIES_BY_UF)) {
    for (const name of names) {
      list.push({
        name,
        uf,
        label: `${name} - ${uf}`,
      });
    }
  }
  return list.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
}

const FALLBACK_CITIES_LIST = buildFallbackCities();

let memoryCitiesCache: BrazilCity[] | null = null;
let inflightPromise: Promise<BrazilCity[]> | null = null;

function readCachedIbgeCities(): BrazilCity[] | null {
  if (memoryCitiesCache && memoryCitiesCache.length > 0) {
    return memoryCitiesCache;
  }
  try {
    const raw = localStorage.getItem(IBGE_CACHE_KEY);
    if (!raw) return null;
    const compact = JSON.parse(raw) as [string, string][];
    if (!Array.isArray(compact) || compact.length < 500) return null;
    const parsed: BrazilCity[] = compact.map(([name, uf]) => ({
      name,
      uf,
      label: `${name} - ${uf}`,
    }));
    memoryCitiesCache = parsed;
    return parsed;
  } catch {
    return null;
  }
}

interface IbgeMunicipioResponse {
  nome: string;
  microrregiao?: {
    mesorregiao?: {
      UF?: {
        sigla?: string;
      };
    };
  };
  "regiao-imediata"?: {
    "regiao-intermediaria"?: {
      UF?: {
        sigla?: string;
      };
    };
  };
}

export async function fetchAllBrazilCities(): Promise<BrazilCity[]> {
  const cached = readCachedIbgeCities();
  if (cached) return cached;

  if (inflightPromise) return inflightPromise;

  inflightPromise = fetch(
    "https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome",
  )
    .then(async (res) => {
      if (!res.ok) throw new Error("Falha ao consultar API do IBGE");
      const data = (await res.json()) as IbgeMunicipioResponse[];
      const mapped: BrazilCity[] = [];
      const compactToStore: [string, string][] = [];

      for (const item of data) {
        const uf =
          item.microrregiao?.mesorregiao?.UF?.sigla ??
          item["regiao-imediata"]?.["regiao-intermediaria"]?.UF?.sigla ??
          "";
        if (item.nome && uf) {
          mapped.push({
            name: item.nome,
            uf,
            label: `${item.nome} - ${uf}`,
          });
          compactToStore.push([item.nome, uf]);
        }
      }

      if (mapped.length > 0) {
        memoryCitiesCache = mapped;
        try {
          localStorage.setItem(IBGE_CACHE_KEY, JSON.stringify(compactToStore));
        } catch {
          // Caso o storage esteja no limite, mantém em memória
        }
        return mapped;
      }
      return FALLBACK_CITIES_LIST;
    })
    .catch(() => FALLBACK_CITIES_LIST)
    .finally(() => {
      inflightPromise = null;
    });

  return inflightPromise;
}

export function useBrazilCities() {
  const [cities, setCities] = useState<BrazilCity[]>(
    () => readCachedIbgeCities() ?? FALLBACK_CITIES_LIST,
  );
  const [isLoading, setIsLoading] = useState<boolean>(
    () => readCachedIbgeCities() === null,
  );

  useEffect(() => {
    let active = true;
    if (readCachedIbgeCities() !== null) {
      setIsLoading(false);
      return;
    }

    fetchAllBrazilCities().then((loaded) => {
      if (active) {
        setCities(loaded);
        setIsLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  return {
    cities,
    specialLocalities: SPECIAL_LOCALITIES,
    states: BRAZIL_STATES,
    isLoading,
    isFullIbgeLoaded: cities.length > 5000,
  };
}
