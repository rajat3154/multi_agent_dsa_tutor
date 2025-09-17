// theme.js
const theme = {
      colors: {
            primary: "#FF8100",
            background: "black",
            text: "white",
            code: {
                  comment: "#6a9955",
                  string: "#ce9178",
                  keyword: "#c586c0",
                  number: "#b5cea8",
                  builtin: "#dcdcaa",
            },
      },
      font: {
            main: '"Inter", sans-serif',
      },
};

export const applyTheme = () => {
      const root = document.documentElement;
      root.style.setProperty("--color-primary", theme.colors.primary);
      root.style.setProperty("--color-bg", theme.colors.background);
      root.style.setProperty("--color-text", theme.colors.text);
      root.style.setProperty("--font-main", theme.font.main);

      // code colors
      root.style.setProperty("--code-comment", theme.colors.code.comment);
      root.style.setProperty("--code-string", theme.colors.code.string);
      root.style.setProperty("--code-keyword", theme.colors.code.keyword);
      root.style.setProperty("--code-number", theme.colors.code.number);
      root.style.setProperty("--code-builtin", theme.colors.code.builtin);
};

export default theme;
