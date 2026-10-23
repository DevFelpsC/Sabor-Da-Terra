/**
 * EMPÓRIO SABOR DA TERRA — CATÁLOGO OFICIAL DE PRODUTOS
 * Lista oficial de itens, pesos e preços em Real Brasileiro (R$).
 */

const PRODUCT_CATALOG = {
  especiarias: {
    categoryName: 'Especiarias',
    categoryTitle: 'Pote 01 • Especiarias Puras',
    categorySubtitle: 'Moagem a Frio & Ervas Nobres Selecionadas',
    categoryBadge: 'Pureza 100% • Moagem Fresca',
    themeColor: '#B8482A',
    themeBg: 'bg-[#B8482A]/15',
    themeText: 'text-[#B8482A]',
    btnBg: 'bg-[#B8482A] hover:bg-[#9E391F]',
    icon: 'solar:leaf-bold-duotone',
    description: 'Temperos artesanais puros, sem conservantes sintéticos ou amido. Moagem cuidadosa para preservar os óleos essenciais e o aroma vivo dos alimentos.',
    items: [
      {
        id: 'esp-tempero-feijao',
        name: 'Tempero para Feijão',
        weight: '80g',
        price: 6.00,
        description: 'Blend especial com louro, alho, cebola e ervas nobres para feijões e caldos ricos e encorpados.',
        badge: 'Especial Feijão',
        icon: 'solar:leaf-bold-duotone'
      },
      {
        id: 'esp-ana-maria',
        name: 'Tempero Ana Maria',
        weight: '100g',
        price: 6.00,
        description: 'Mistura aromática tradicional para frangos, ensopados, legumes, refogados e arroz soltinho.',
        badge: 'Tradicional',
        icon: 'solar:chef-hat-bold-duotone'
      },
      {
        id: 'esp-edu-guedes',
        name: 'Tempero Edu Guedes',
        weight: '100g',
        price: 6.00,
        description: 'Combinação clássica com flocos de vegetais desidratados para carnes, molhos e tortas.',
        badge: 'Muito Vendido',
        icon: 'solar:star-bold-duotone'
      },
      {
        id: 'esp-tempero-carnes',
        name: 'Tempero para Carnes',
        weight: '130g',
        price: 4.00,
        description: 'Equilíbrio ideal de especiarias nobres para bifes, assados, grelhados e carnes de panela.',
        badge: 'Carnes & Assados',
        icon: 'solar:fire-bold-duotone'
      },
      {
        id: 'esp-tempero-frango',
        name: 'Tempero para Frango',
        weight: '130g',
        price: 4.00,
        description: 'Ervas finas aromáticas combinadas para realçar o sabor de aves assadas, grelhadas ou ensopadas.',
        badge: 'Aves & Grelhados',
        icon: 'solar:sun-2-bold-duotone'
      },
      {
        id: 'esp-tempero-peixe',
        name: 'Tempero para Peixe',
        weight: '130g',
        price: 4.00,
        description: 'Harmonização botânica suave e refrescante para peixes de rio, mar e frutos do mar.',
        badge: 'Pescados & Frutos do Mar',
        icon: 'solar:cup-star-bold-duotone'
      },
      {
        id: 'esp-fumaca-po',
        name: 'Fumaça em Pó',
        weight: '130g',
        price: 6.00,
        description: 'Aroma defumado natural e intenso para hambúrgueres artesanais, carnes e molhos barbecue.',
        badge: 'Aroma Defumado',
        icon: 'solar:flame-bold-duotone'
      },
      {
        id: 'esp-paprica-picante-defumada',
        name: 'Páprica Picante Defumada',
        weight: '100g',
        price: 4.00,
        description: 'Picância marcante harmonizada com o aroma defumado da lenha nobre. Cor rubi vibrante.',
        badge: 'Picante & Defumada',
        icon: 'solar:fire-square-bold-duotone'
      },
      {
        id: 'esp-paprica-defumada',
        name: 'Páprica Defumada',
        weight: '100g',
        price: 4.00,
        description: 'Moagem nobre de pimentões com defumação lenta artesanal. Sabor profundo sem ardor.',
        badge: 'Mais Vendida',
        icon: 'solar:cup-star-bold-duotone'
      },
      {
        id: 'esp-paprica-doce',
        name: 'Páprica Doce',
        weight: '100g',
        price: 4.00,
        description: 'Suave, adocicada e perfumada. Proporciona cor viva e sabor aconchegante a qualquer receita.',
        badge: 'Sabor Suave',
        icon: 'solar:heart-bold-duotone'
      },
      {
        id: 'esp-pimenta-reino',
        name: 'Pimenta do Reino',
        weight: '100g',
        price: 4.50,
        description: 'Pimenta do reino pura moída na hora. Pungência autêntica e óleos essenciais preservados.',
        badge: 'Moagem Fresca',
        icon: 'solar:star-fall-bold-duotone'
      }
    ]
  },

  doces: {
    categoryName: 'Doces de Fazenda',
    categoryTitle: 'Pote 02 • Doces de Fazenda',
    categorySubtitle: 'Receitas Tradicionais em Calda, Cremosos & Cristalizados',
    categoryBadge: 'Receita de Fazenda • Feito no Tacho',
    themeColor: '#DFA437',
    themeBg: 'bg-[#DFA437]/20',
    themeText: 'text-[#DFA437]',
    btnBg: 'bg-[#DFA437] hover:bg-[#C89028] text-[#1E130D]',
    icon: 'solar:cup-star-bold-duotone',
    description: 'Doces caseiros preparados pacientemente no tacho com frutas frescas e leite puro da fazenda. Doces cristalizados crocantes, cremosos e compotas em calda.',
    items: [
      {
        id: 'doc-abobora-cristalizada',
        name: 'Doce de Abóbora Cristalizada',
        weight: '350g',
        price: 10.00,
        description: 'Crocante por fora com casquinha de açúcar cristal e macio por dentro. Receita secular de fazenda.',
        badge: 'Cristalizado',
        icon: 'solar:cup-star-bold-duotone'
      },
      {
        id: 'doc-abobora-coco',
        name: 'Doce de Abóbora com Coco Cremoso',
        weight: '250ml',
        price: 10.00,
        description: 'Cremoso e aveludado, cozido lentamente com lascas frescas de coco ralado da fazenda.',
        badge: 'Cremoso & Coco',
        icon: 'solar:heart-bold-duotone'
      },
      {
        id: 'doc-mamao-cristalizado',
        name: 'Doce de Mamão Cristalizado',
        weight: '350g',
        price: 10.00,
        description: 'Pedaços nobres de mamão verde cristalizados artesanalmente com equilíbrio perfeito de doçura.',
        badge: 'Receita da Roça',
        icon: 'solar:stars-minimalistic-bold-duotone'
      },
      {
        id: 'doc-mamao-ralado-calda',
        name: 'Doce de Mamão Ralado em Calda',
        weight: '250ml',
        price: 10.00,
        description: 'Fios delicados de mamão ralado cozidos em calda aromática leve com cravos-da-índia e canela.',
        badge: 'Em Calda',
        icon: 'solar:sun-2-bold-duotone'
      },
      {
        id: 'doc-doce-leite-cremoso',
        name: 'Doce de Leite Cremoso',
        weight: '250ml',
        price: 12.00,
        description: 'Cozimento lento em tacho de cobre com leite puro da fazenda. Textura sedosa e brilho natural.',
        badge: 'Tradicional de Tacho',
        icon: 'solar:cup-star-bold-duotone'
      },
      {
        id: 'doc-doce-leite-pedacos',
        name: 'Doce de Leite em Pedaços',
        weight: '250ml',
        price: 12.00,
        description: 'Pedaços macios de corte com textura clássica caipira e sabor encorpado de leite da fazenda.',
        badge: 'De Corte / Pedaços',
        icon: 'solar:star-bold-duotone'
      },
      {
        id: 'doc-abacaxi-cristalizado',
        name: 'Doce de Abacaxi Cristalizado',
        weight: '350ml',
        price: 12.00,
        description: 'Pedaços suculentos de abacaxi com casquinha cristalizada e toque cítrico refrescante único.',
        badge: 'Cítrico & Doce',
        icon: 'solar:crown-star-bold-duotone'
      }
    ]
  },

  conservas: {
    categoryName: 'Conservas Nobres',
    categoryTitle: 'Pote 03 • Conservas Nobres',
    categorySubtitle: 'Aperitivos Artesanais Curados com Ervas Finas & Azeite',
    categoryBadge: 'Receita da Casa • Maturação Natural',
    themeColor: '#25D366',
    themeBg: 'bg-[#25D366]/15',
    themeText: 'text-[#25D366]',
    btnBg: 'bg-[#25D366] hover:bg-[#1EBE5D] text-white',
    icon: 'fa6-solid:jar',
    description: 'Conservas artesanais preparadas com legumes frescos selecionados da horta, ovos de codorna e pimentas curadas em azeite e vinagre botânico.',
    items: [
      {
        id: 'con-abobrinha-verde',
        name: 'Conserva de Abobrinha Verde',
        weight: '600g',
        price: 20.00,
        description: 'Abobrinha verde crocante fatiada artesanalmente, curada com ervas nobres e azeite temperado.',
        badge: 'Destaque da Casa',
        icon: 'fa6-solid:jar'
      },
      {
        id: 'con-ovos-codorna',
        name: 'Conserva de Ovos de Codorna',
        weight: '600g',
        price: 25.00,
        description: 'Ovos de codorna selecionados curados em vinagrete botânico suave com especiarias aromáticas.',
        badge: 'Campeão de Pedidos',
        icon: 'solar:egg-bold-duotone'
      },
      {
        id: 'con-batatinha',
        name: 'Conserva de Batatinha',
        weight: '600g',
        price: 20.00,
        description: 'Mini batatinhas cozidas no ponto certo e curadas em salmoura com ervas aromáticas da horta.',
        badge: 'Aperitivo Clássico',
        icon: 'solar:plate-bold-duotone'
      },
      {
        id: 'con-legumes',
        name: 'Conserva de Legumes (Abobrinha, Cenoura, Pimentão e Cebola)',
        weight: '600g',
        price: 20.00,
        description: 'Mix colorido e crocante da horta com corte artesanal e infusão aromática equilibrada.',
        badge: 'Mix Crocante',
        icon: 'solar:tuning-square-2-bold-duotone'
      },
      {
        id: 'con-cebolinha',
        name: 'Conserva de Cebolinha',
        weight: '600g',
        price: 20.00,
        description: 'Mini cebolas inteiras crocantes, curadas em vinagre aromatizado com louro e mostarda em grãos.',
        badge: 'Super Crocante',
        icon: 'solar:star-circle-bold-duotone'
      },
      {
        id: 'con-pimenta-dedo-moca',
        name: 'Conserva de Pimenta Dedo de Moça',
        weight: '600g',
        price: 20.00,
        description: 'Pimentas dedo de moça selecionadas com picância viva e cor vermelha intensa no azeite.',
        badge: 'Picância Viva',
        icon: 'solar:fire-bold-duotone'
      }
    ]
  },

  combos: {
    categoryName: 'Combos & Kits Econômicos',
    categoryTitle: 'Kits Prontos com Desconto Especial',
    categorySubtitle: 'Combinações campeãs de vendas para presentear ou abastecer sua cozinha com economia',
    categoryBadge: 'Desconto no Kit • Mais Vendidos',
    themeColor: '#B8482A',
    themeBg: 'bg-[#B8482A]/15',
    themeText: 'text-[#B8482A]',
    btnBg: 'bg-[#B8482A] hover:bg-[#9E391F] text-white',
    icon: 'solar:box-minimalistic-bold-duotone',
    description: 'Kits especiais com preços reduzidos combinando nossas melhores especiarias, doces no tacho e conservas tradicionais.',
    items: [
      {
        id: 'combo-chefe-essencial',
        name: 'Kit Essencial do Chefe (4 Temperos Mais Vendidos)',
        weight: '410g total',
        price: 18.00,
        originalPrice: 20.00,
        description: 'Páprica Defumada (100g) + Pimenta do Reino Pura (100g) + Tempero Feijão (80g) + Tempero Carnes (130g). A base indispensável para caldos, bifes e refeições do dia a dia.',
        badge: 'Campeão de Vendas',
        icon: 'solar:star-bold-duotone'
      },
      {
        id: 'combo-trio-papricas',
        name: 'Trio Degustação de Pápricas Artesanais',
        weight: '300g total',
        price: 11.00,
        originalPrice: 12.00,
        description: 'Páprica Doce Suave (100g) + Páprica Defumada em Lenha Nobre (100g) + Páprica Picante Defumada (100g). Cor rubi pura e sabor vivo para molhos, grelhados e marinadas.',
        badge: 'Trio Nobre',
        icon: 'solar:flame-bold-duotone'
      },
      {
        id: 'combo-tradicao-fazenda',
        name: 'Combo Raízes da Fazenda (Salgado & Doce)',
        weight: '1.2kg total',
        price: 38.00,
        originalPrice: 42.00,
        description: '1 Pote Grande de Doce de Leite Cremoso de Tacho (250ml) + 1 Doce de Abóbora Cristalizada (350g) + 1 Conserva Nobre de Batatinha (600g). A verdadeira tradição caipira.',
        badge: 'Tradição Caipira',
        icon: 'solar:cup-star-bold-duotone'
      }
    ]
  }
};

// Helper function to find a product by ID across all categories
function getProductById(productId) {
  for (const catKey in PRODUCT_CATALOG) {
    const found = PRODUCT_CATALOG[catKey].items.find(item => item.id === productId);
    if (found) {
      return { ...found, categoryKey: catKey, categoryName: PRODUCT_CATALOG[catKey].categoryName };
    }
  }
  return null;
}

// Rich Culinary Pairings, Purity Seals & Chef Tips Dictionary
const CULINARY_DETAILS = {
  'esp-tempero-feijao': {
    pairing: 'Feijão preto, carioca, feijão tropeiro, caldos encorpados, lentilhas e sopas caipiras.',
    intensity: 'Aroma Intenso • Pungência Suave (sem ardência)',
    purity: '100% Pura moagem botânica de louro, alho, cebola e ervas finas. Zero amido, zero fubá.',
    tip: 'Adicione meia colher de café no momento do refogado com azeite ou banha para liberar os óleos essenciais.'
  },
  'esp-fumaca-po': {
    pairing: 'Hambúrgueres artesanais, carnes de churrasco, molhos barbecue, costelinhas suínas e feijoadas.',
    intensity: 'Defumado Marcante em Lenha Nobre',
    purity: 'Puro extrato seco de fumaça natural. Sem corantes químicos ou realçadores sintéticos.',
    tip: 'Use com moderação: 1 pontinha de colher é suficiente para defumar 500g de carne moída.'
  },
  'esp-paprica-defumada': {
    pairing: 'Legumes assados, batatas rústicas, ovos mexidos, carnes grelhadas, peixes e maioneses artesanais.',
    intensity: 'Sabor Rico e Amadeirado • Sem Picância',
    purity: 'Pimentões vermelhos selecionados, desidratados e defumados lentamente. Cor rubi 100% natural.',
    tip: 'Não queime a páprica: junte ao prato com fogo brando ou direto nos alimentos antes de assar.'
  },
  'esp-paprica-picante-defumada': {
    pairing: 'Asinhas de frango (buffalo wings), carnes suínas, molhos picantes, feijão e caldos fortes.',
    intensity: 'Picância Média-Alta (3/5) • Defumado Vivo',
    purity: 'Pimenta e pimentão moídos a frio em moinho de pedra. 100% livre de farinhas de volume.',
    tip: 'Dá aquela cor vermelha viva aos assados combinada com um toque ardente delicioso.'
  },
  'esp-paprica-doce': {
    pairing: 'Frango ensopado, risotos, arroz de forno, molhos de tomate caseiros e tortas salgadas.',
    intensity: 'Doce, Aveludada e Aromática • Zero Picância',
    purity: 'Pimentão doce puro moído fino. Fonte natural de antioxidantes e carotenoides.',
    tip: 'Ideal para dar cor avermelhada apetitosa sem alterar o nível de pimenta para crianças.'
  },
  'esp-pimenta-reino': {
    pairing: 'Carnes de todos os cortes, massas, molhos brancos e de queijo, ovos e saladas nobres.',
    intensity: 'Pungência Clássica Fresca (2/5)',
    purity: 'Grãos de pimenta-do-reino preta rigorosamente selecionados e moídos a frio.',
    tip: 'A pimenta moída a frio mantém os óleos voláteis que o calor da indústria queima.'
  },
  'esp-ana-maria': {
    pairing: 'Frangos de panela, ensopados, legumes refogados, polentas e arroz soltinho do dia a dia.',
    intensity: 'Aroma de Cozinha de Mãe • Suave e Equilibrado',
    purity: 'Mix artesanal de cebola, alho, salsa, cebolinha e cúrcuma pura.',
    tip: 'Excelente para marinar frangos e peitos de peru 30 minutos antes do preparo.'
  },
  'esp-edu-guedes': {
    pairing: 'Tortas salgadas, carnes moídas, recheios de empadas, molhos de carne e refogados.',
    intensity: 'Vegetais Frescos Desidratados em Pedaços',
    purity: 'Cenoura, pimentão, cebola, alho e especiarias em flocos visíveis. Zero amido.',
    tip: 'Os pedacinhos de vegetais hidratam no caldo liberando sabor caseiro incomparável.'
  },
  'esp-tempero-carnes': {
    pairing: 'Picanha, alcatra, costela, cupim, bifes de panela e hambúrgueres.',
    intensity: 'Equilíbrio Nobre para Carnes Vermelhas',
    purity: 'Ervas nobres selecionadas para harmonizar com a gordura natural das carnes.',
    tip: 'Salpique 15 minutos antes de colocar a carne na frigideira quente ou grelha.'
  },
  'esp-tempero-frango': {
    pairing: 'Frango assado de domingo, peito grelhado, sobrecoxas na cerveja e tenders.',
    intensity: 'Aromático e Dourador Natural',
    purity: 'Ervas finas, alho granulado e especiarias que deixam a pele do frango dourada e crocante.',
    tip: 'Misture com um fio de azeite e pincele sobre as aves antes de levar ao forno.'
  },
  'esp-tempero-peixe': {
    pairing: 'Salmão, tilápia, pintado, moquecas, camarões e mariscos.',
    intensity: 'Refrescante, Cítrico e Suave',
    purity: 'Ervas frescas desidratadas que não mascaram o sabor delicado dos pescados.',
    tip: 'Adicione raspas de limão e o tempero na finalização do grelhado.'
  },
  'doc-abobora-cristalizada': {
    pairing: 'Café coado da tarde, queijo canastra, queijo minas frescal e sobremesas caipiras.',
    intensity: 'Doçura Equilibrada com Casquinha Crocante',
    purity: 'Abóbora de horta e açúcar cristal. Cozimento lento em tacho de cobre tradicional.',
    tip: 'Sirva com uma fatia generosa de queijo branco curado para o contraste perfeito.'
  },
  'doc-leite-cremoso': {
    pairing: 'Torradas de fermentação natural, queijo coalho na brasa, bolos caseiros e frutas.',
    intensity: 'Cremosidade Aveludada de Fazenda',
    purity: 'Leite fresco da ordenha da fazenda reduzido pacientemente no fogo a lenha.',
    tip: 'Pode ser levemente aquecido antes de cobrir sorvetes artesanais.'
  },
  'con-batatinha': {
    pairing: 'Churrascos de domingo, aperitivos com cerveja gelada, tábuas de frios e antepastos.',
    intensity: 'Acidez Equilibrada no Azeite Aromatizado',
    purity: 'Mini batatas selecionadas uma a uma, curadas com ervas nobres e azeite.',
    tip: 'Sirva fria com pão italiano fresco regado com o próprio azeite da conserva.'
  }
};

function getProductCulinaryDetails(productId) {
  if (CULINARY_DETAILS[productId]) return CULINARY_DETAILS[productId];
  const prod = getProductById(productId);
  if (!prod) return null;
  if (prod.categoryKey === 'especiarias') {
    return {
      pairing: 'Caldos caseiros, carnes grelhadas, legumes refogados e marinadas de sabor vivo.',
      intensity: 'Aromático • Moagem Pura a Frio',
      purity: '100% Botânica pura sem adição de amido, fubá ou corantes artificiais.',
      tip: 'Armazene em recipiente hermético ao abrigo da luz solar direta para manter o perfume vivo.'
    };
  } else if (prod.categoryKey === 'doces') {
    return {
      pairing: 'Café fresco passado na hora, queijo minas artesanal e sobremesas tradicionais de fazenda.',
      intensity: 'Sabor Afetivo de Tacho de Cobre',
      purity: 'Receita tradicional caipira com frutas selecionadas e cozimento lento.',
      tip: 'Após aberto, conserve na geladeira para manter a consistência e o frescor.'
    };
  } else {
    return {
      pairing: 'Tábuas de frios, aperitivos antes do churrasco, sanduíches artesanais e saladas.',
      intensity: 'Crocância Perfeita e Cura Equilibrada',
      purity: 'Ingredientes nobres selecionados e curados em infusão aromática.',
      tip: 'Aproveite o azeite aromático da conserva para finalizar torradas e saladas.'
    };
  }
}

// Format numbers as Brazilian Real currency (R$ XX,XX)
function formatBRL(value) {
  return Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

