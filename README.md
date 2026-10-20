# CJOVEM - Prof Neylor FM 🐍
### Guia Visual & Infográficos de Estudo para Prova de Python

Um carrossel moderno, interativo e responsivo desenvolvido sob medida para o estudo dos principais conceitos de Python no programa **CJOVEM** com o **Prof. Neylor FM**.

O projeto conta com controle avançado de toque (**movimento de pinça / pinch-to-zoom** no celular), navegação fluida por deslize (swipe), modo apresentação automática, atalhos de teclado e visualização em grade.

---

## 🚀 Como publicar no GitHub Pages

Este projeto foi construído para funcionar perfeitamente e sem configurações extras no **GitHub Pages**:

1. Suba todos os arquivos desta pasta para o seu repositório no GitHub:
   ```bash
   git add .
   git commit -m "feat: carrossel moderno de estudos Python com zoom de pinca"
   git push origin main
   ```
2. No repositório no GitHub:
   - Vá em **Settings** (Configurações)
   - Na barra lateral esquerda, clique em **Pages**
   - Em **Build and deployment** > **Source**, selecione `Deploy from a branch`
   - Em **Branch**, selecione `main` e a pasta `/(root)`
   - Clique em **Save**
3. Em poucos instantes, seu site estará publicado e acessível no endereço:
   👉 **https://neylorfm.github.io/cola.python/**

---

## 📱 Recursos de Toque & Celular (Mobile-First)

- 🤏 **Movimento de Pinça (Pinch-to-zoom):** Abra ou feche 2 dedos sobre a imagem para dar zoom fluido de até **5x** e ler qualquer detalhe ou código com nitidez total.
- 🖐️ **Arrastar quando ampliado:** Com o zoom ativo, arraste com 1 dedo para navegar em qualquer quadrante do infográfico.
- ⚡ **Duplo Toque (Double Tap):** Toque rápido 2 vezes para aproximar imediatamente a 2.5x naquele ponto exato ou retornar ao normal.
- 👉 **Deslize Lateral (Swipe):** Em tamanho padrão (1x), deslize para a esquerda ou direita para avançar e voltar de slide.

---

## 💻 Recursos no Computador (Teclado e Mouse)

- 🔍 **Roda do Mouse (Scroll Wheel):** Role a rodinha sobre o infográfico para aproximar ou afastar suavemente centrado no ponteiro do mouse.
- 🖱️ **Arrastar com Mouse:** Clique e arraste quando com zoom para mover a imagem, ou arraste para os lados para trocar de slide.
- ⌨️ **Atalhos de Teclado:**
  - `←` / `A` : Slide anterior
  - `→` / `D` : Próximo slide
  - `+` / `-` : Aumentar ou diminuir zoom
  - `0` / `Esc` : Resetar zoom / Fechar janelas
  - `F` : Alternar tela cheia (Fullscreen)
  - `Espaço` : Iniciar / Pausar apresentação automática
  - `G` : Abrir grade com todos os 8 infográficos
  - `?` : Abrir guia de ajuda

---

## 📚 Conteúdo dos Infográficos

1. **`imgs/1.jpg`** — **Input, Cast e Type em Python**  
   Lendo dados do usuário e entendendo tipos (`input()`, `int()`, `float()`, `type()`).
2. **`imgs/2.jpg`** — **Operadores de Atribuição Composta**  
   Mais praticidade e elegância: `+=`, `-=`, `*=`, `/=`, `%=`.
3. **`imgs/3.jpg`** — **Comandos Condicionais**  
   Tomada de decisão: `if`, `if-else`, `if-elif-else` e condicionais aninhadas (`nested if`).
4. **`imgs/4.jpg`** — **Python range() com step**  
   Geração de sequências numéricas (`start`, `stop`, `step`) com passos positivos e negativos.
5. **`imgs/5.jpg`** — **Laço FOR em Python**  
   Repetição definida com `range()` e controle de iteração com `continue`.
6. **`imgs/6.jpg`** — **Laço FOR com BREAK**  
   Interrupção antecipada de loops para otimizar execução.
7. **`imgs/7.jpg`** — **Python WHILE Loop**  
   Repetição condicional, inicialização, incremento e controle de laços.
8. **`imgs/8.jpg`** — **Python WHILE com BREAK**  
   Parada imediata de loops indefinidos com `break`.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5 Semântico & Moderno** com tags de acessibilidade (`aria-label`, `role`).
- **Vanilla CSS3** com CSS Custom Properties (variáveis de design), Glassmorphism, aceleração de GPU por `translate3d` e tipografia via Google Fonts (*Plus Jakarta Sans* e *JetBrains Mono*).
- **JavaScript Moderno (ES6+)** sem dependências externas, garantindo carregamento instantâneo no GitHub Pages.
