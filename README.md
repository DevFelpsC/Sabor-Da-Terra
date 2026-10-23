# 🌿 Empório Sabor da Terra — Vitrine & Cardápio Digital

Website institucional e vitrine interativa de temperos puros, doces de compota e conservas nobres do **Empório Sabor da Terra**, com fluxo completo de pedidos via WhatsApp.

---

## 📁 Estrutura de Arquivos do Projeto

O projeto foi estruturado como uma aplicação web estática de alta performance, sem dependências de build obrigatórias, garantindo compatibilidade imediata com qualquer serviço de hospedagem moderna (Vercel, Netlify, Cloudflare Pages, GitHub Pages, cPanel/FTP).

```
sabordaterralanding/
├── 📄 index.html             # Landing Page principal com hero, história e destaques
├── 📄 prateleiras.html       # Vitrine imersiva fullscreen dos potes artesanais
├── 📄 carrinho.html          # Página dedicada para revisão e checkout do pedido
├── 🎨 css/                   # Folhas de estilo da aplicação
│   └── styles.css            # Sistema de design customizado, tipografia e animações
├── ⚙️ js/                    # Scripts lógicos da aplicação
│   ├── products-data.js      # Catálogo unificado de produtos, pesos e preços (R$)
│   ├── cart.js               # Motor universal do carrinho (LocalStorage e Drawer)
│   ├── script.js             # Interações e transições da Landing Page
│   ├── shelf.js              # Controlador interativo da prateleira e dos modais
│   └── cart-page.js          # Lógica de renderização da página de checkout
├── 🖼️ assets/                # Imagens em alta resolução, selos e mídia
│   ├── hero-spices.jpg       # Foto hero das especiarias
│   ├── shelf.jpg             # Foto central das prateleiras de madeira
│   ├── mortar-blend.jpg      # Foto de apoio da moagem artesanal
│   ├── logo-circular.png     # Selo oficial transparente da marca
│   ├── logo-animation.mp4    # Animação do logo em vídeo
│   └── ...                   # Imagens e recortes dos potes
├── 🌐 vercel.json            # Configuração de deploy, rotas e cache na Vercel
├── 🌐 netlify.toml           # Configuração de deploy e cabeçalhos no Netlify
├── 🤖 robots.txt             # Diretivas para motores de busca (Google, Bing)
├── 🗺️ sitemap.xml            # Mapa de páginas para indexação SEO
├── 📦 package.json           # Metadados do projeto e comando local 'npm start'
├── 🚫 .gitignore             # Arquivos ignorados pelo controle de versão
└── 📖 README.md              # Documentação oficial do projeto
```

---

## 🚀 Como Fazer o Deploy (Pronto para Produção)

### Opção 1: Vercel (Recomendado — 1 Clique)
1. Suba esta pasta para um repositório no **GitHub** ou arraste a pasta para o [Vercel Dashboard](https://vercel.com).
2. O arquivo `vercel.json` já está configurado na raiz com URLs limpas, compressão e cabeçalhos de segurança.
3. Clique em **Deploy**. Seu site estará online em segundos com certificado SSL gratuito.

### Opção 2: Netlify
1. Arraste a pasta inteira para [Netlify Drop](https://app.netlify.com/drop).
2. O arquivo `netlify.toml` cuidará automaticamente do diretório de publicação e das regras de cache.

### Opção 3: GitHub Pages
1. Crie um repositório no GitHub e faça o push dos arquivos.
2. Acesse **Settings > Pages**.
3. Selecione a branch `main` (ou `master`) e a pasta `/ (root)`.
4. Salve. Seu site estará disponível em `https://seu-usuario.github.io/sabordaterralanding/`.

### Opção 4: Hospedagem Tradicional (Hostinger, Locaweb, cPanel via FTP)
1. Conecte-se via FTP (FileZilla ou gerenciador do cPanel).
2. Envie todos os arquivos e a pasta `assets/` para a pasta pública raiz (`public_html` ou `www`).

---

## 💻 Como Rodar e Testar Localmente

### Método 1: Direto no Navegador
- Basta dar um duplo clique em [index.html](index.html) para abrir no Google Chrome, Microsoft Edge, Firefox ou Safari.

### Método 2: Via VS Code (Live Server)
- Com a extensão **Live Server** instalada, clique com o botão direito em `index.html` e selecione **"Open with Live Server"**.

### Método 3: Via Terminal (Node / npx)
```bash
# Executa servidor local na porta 3000
npm start
# ou
npx serve .
```

---

## 📱 Configuração do WhatsApp

Os pedidos e mensagens de contato são direcionados ao número do Empório:
- **WhatsApp:** `(18) 99162-1203`
- **Formato Internacional:** `5518991621203`

Caso precise alterar o número no futuro, os pontos de configuração são:
- `js/cart.js`: constante `WHATSAPP_NUMBER = '5518991621203'`
- `js/cart-page.js`: URL gerada no botão de checkout
- Links fixos no rodapé de `index.html` e `prateleiras.html`

---

## 🛡️ Tecnologias Utilizadas
- **HTML5 Semântico:** Estrutura acessível com metadados Open Graph e SEO.
- **Tailwind CSS (CDN):** Estilização utilitária responsiva e ágil.
- **Vanilla CSS ([css/styles.css](css/styles.css)):** Design system artesanal, efeitos de vidro (*glassmorphism*), sombras volumétricas e animações cinematográficas.
- **Vanilla JavaScript:** Sem dependências pesadas, garantindo carregamento instantâneo em conexões móveis.
- **LocalStorage API:** Persistência automática do carrinho entre abas e páginas.
- **Iconify:** Biblioteca vetorial sob demanda para ícones leves e nítidos.

---

© 2026 **Empório Sabor da Terra** — Todos os direitos reservados.
