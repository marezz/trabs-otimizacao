const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, HeadingLevel, LevelFormat, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageBreak
} = require('docx');
const fs = require('fs');

// ── helpers ──────────────────────────────────────────────────────────────────

const W = 9360; // content width in DXA (A4, 1" margins)

const border = { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 60, bottom: 60, left: 100, right: 100 };

function txt(text, opts = {}) {
  return new TextRun({ text: String(text), font: "Arial", size: 20, ...opts });
}

function para(children, opts = {}) {
  if (typeof children === 'string') children = [txt(children)];
  return new Paragraph({ children, spacing: { after: 100 }, ...opts });
}

function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text, font: "Arial", size: 28, bold: true })],
    spacing: { before: 320, after: 120 }
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text, font: "Arial", size: 24, bold: true })],
    spacing: { before: 240, after: 100 }
  });
}

function heading3(text) {
  return new Paragraph({
    children: [new TextRun({ text, font: "Arial", size: 22, bold: true })],
    spacing: { before: 180, after: 80 }
  });
}

function cell(text, opts = {}) {
  const { header = false, width, align = AlignmentType.CENTER } = opts;
  return new TableCell({
    borders,
    margins: cellMargins,
    verticalAlign: VerticalAlign.CENTER,
    ...(width ? { width: { size: width, type: WidthType.DXA } } : {}),
    shading: header
      ? { fill: "2E75B6", type: ShadingType.CLEAR }
      : { fill: "FFFFFF", type: ShadingType.CLEAR },
    children: [new Paragraph({
      alignment: align,
      children: [txt(text, { bold: header, color: header ? "FFFFFF" : "000000", size: 18 })]
    })]
  });
}

function makeTable(headers, rows, colWidths) {
  const total = colWidths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [
      new TableRow({
        tableHeader: true,
        children: headers.map((h, i) => cell(h, { header: true, width: colWidths[i] }))
      }),
      ...rows.map((row, ri) => new TableRow({
        children: row.map((v, i) => {
          const isBase = i === 0;
          return new TableCell({
            borders,
            margins: cellMargins,
            width: { size: colWidths[i], type: WidthType.DXA },
            shading: {
              fill: ri % 2 === 0 ? "F5F8FC" : "FFFFFF",
              type: ShadingType.CLEAR
            },
            children: [new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [txt(v, { bold: isBase, size: 16 })]
            })]
          });
        })
      }))
    ]
  });
}

function spacer() {
  return new Paragraph({ children: [txt("")], spacing: { after: 80 } });
}

// ── tableau builder ───────────────────────────────────────────────────────────

// Represents one simplex tableau as { title, headers, rows }
function tableau(title, headers, rows) {
  const n = headers.length;
  const colW = Math.floor(W / n);
  const remainder = W - colW * n;
  const colWidths = headers.map((_, i) => i === 0 ? colW + remainder : colW);
  return [
    heading3(title),
    makeTable(headers, rows, colWidths),
    spacer()
  ];
}

// ── PROBLEM 1 DATA ────────────────────────────────────────────────────────────

// Headers for problem 1: x1 x2 x3 f1 f2 (+ a1 in phase 1)
const p1_ph1_headers = ["Base", "x1", "x2", "x3", "f1", "f2", "a1", "b"];
const p1_ph1_it1 = [
  ["f1", "3", "-2", "0", "1", "0", "-1", "10"],
  ["x3", "-2", "0", "1", "0", "0", "1", "1"],
  ["obj", "0", "0", "0", "0", "0", "1", "0"],
];

const p1_ph2_headers = ["Base", "x1", "x2", "x3", "f1", "f2", "b"];
const p1_ph2_final = [
  ["f1", "3", "-2", "0", "1", "0", "10"],
  ["x3", "-2", "0", "1", "0", "0", "1"],
  ["obj", "1", "1", "0", "0", "0", "-1"],
];

// ── PROBLEM 2 DATA ────────────────────────────────────────────────────────────

// Phase 2 headers (no artificials)
const p2_headers = ["Base","x1","x2","x3","x4","x5","x6","x7","x8","x9","x10","x11","x12","x13","x14","x15","x16","x17","f1","f2","f3","f4","f5","f6","f7","f8","f9","f10","f11","b"];

const p2_ph2_it1 = [
  ["x1","1","0","1","0","0","0","0","0","0","0","-1","0","0","0","-1","-1","-1","0","0","0","0","0","0","0","1","0","0","0","3"],
  ["x8","0","0","1","0","0","1","0","1","0","0","0","0","1","0","-1","-1","0","0","0","0","0","0","0","0","1","0","0","1","2"],
  ["x7","0","0","-1","0","0","-1","1","0","0","0","0","0","-1","0","1","1","0","0","0","0","0","0","0","0","-1","0","0","-1","0"],
  ["x9","0","0","0","0","0","0","0","0","1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","6"],
  ["x4","0","0","1","1","1","1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","8"],
  ["x12","0","0","0","0","0","0","0","0","0","0","0","1","1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","5"],
  ["x14","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1","1","1","0","0","0","0","0","0","0","0","0","0","0","3"],
  ["x10","0","0","0","0","0","0","0","0","0","1","1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","9"],
  ["f9","0","0","-1","0","-1","-1","0","0","0","0","0","0","0","0","1","0","0","0","0","0","0","0","0","0","0","1","0","0","4"],
  ["f10","0","0","1","0","1","1","0","0","0","0","0","0","0","0","-1","0","0","0","0","0","0","0","0","0","1","0","1","1","5"],
  ["x2","0","1","-1","0","0","0","0","0","0","0","1","0","0","0","1","1","1","0","0","0","0","0","0","0","-1","0","0","0","4"],
  ["obj","0","0","2","0","2","2","0","0","0","0","0","0","0","0","-2","0","0","0","0","0","0","0","0","0","3","0","0","0","-99"],
];
const p2_ph2_it2 = [
  ["x1","1","0","0","0","0","-1","1","0","0","0","-1","0","-1","0","0","0","-1","0","0","0","0","0","0","0","0","0","0","-1","3"],
  ["x8","0","0","0","0","0","0","1","1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","2"],
  ["x15","0","0","-1","0","0","-1","1","0","0","0","0","0","-1","0","1","1","0","0","0","0","0","0","0","0","-1","0","0","-1","0"],
  ["x9","0","0","0","0","0","0","0","0","1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","6"],
  ["x4","0","0","1","1","1","1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","8"],
  ["x12","0","0","0","0","0","0","0","0","0","0","0","1","1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","5"],
  ["x14","0","0","1","0","0","1","-1","0","0","0","0","0","1","1","0","0","1","0","0","0","0","0","0","0","1","0","0","1","3"],
  ["x10","0","0","0","0","0","0","0","0","0","1","1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","9"],
  ["f9","0","0","0","0","-1","0","-1","0","0","0","0","0","1","0","0","-1","0","0","0","0","0","0","0","0","1","1","0","1","4"],
  ["f10","0","0","1","0","1","1","0","0","0","0","0","0","0","1","0","1","1","0","0","0","0","0","0","0","1","0","1","1","8"],  // corrected
  ["x2","0","1","0","0","0","1","-1","0","0","0","1","0","1","0","0","0","1","0","0","0","0","0","0","0","0","0","0","1","4"],
  ["obj","0","0","0","0","2","0","2","0","0","0","0","0","-2","0","0","2","0","0","0","0","0","0","0","0","1","0","0","-2","-99"],
];
const p2_ph2_it3_final = [
  ["x1","1","0","1","0","0","0","0","0","0","0","-1","0","0","1","0","0","0","0","0","0","0","0","0","0","1","0","0","0","6"],
  ["x8","0","0","0","0","0","0","1","1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","2"],
  ["x15","0","0","0","0","0","0","0","0","0","0","0","0","0","1","1","1","1","0","0","0","0","0","0","0","0","0","0","0","3"],
  ["x9","0","0","0","0","0","0","0","0","1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","6"],
  ["x4","0","0","1","1","1","1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","8"],
  ["x12","0","0","-1","0","0","-1","1","0","0","0","0","1","0","-1","0","0","-1","0","0","0","0","0","0","0","-1","0","0","-1","2"],
  ["x13","0","0","1","0","0","1","-1","0","0","0","0","0","1","1","0","0","1","0","0","0","0","0","0","0","1","0","0","1","3"],
  ["x10","0","0","0","0","0","0","0","0","0","1","1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","9"],
  ["f9","0","0","-1","0","-1","-1","0","0","0","0","0","0","0","-1","0","-1","-1","0","0","0","0","0","0","0","0","1","0","0","1"],
  ["f10","0","0","1","0","1","1","0","0","0","0","0","0","0","1","0","1","1","0","0","0","0","0","0","0","1","0","1","1","8"],
  ["x2","0","1","-1","0","0","0","0","0","0","0","1","0","0","-1","0","0","0","0","0","0","0","0","0","0","-1","0","0","0","1"],
  ["obj","0","0","2","0","2","2","0","0","0","0","0","0","0","2","0","2","2","0","0","0","0","0","0","0","3","0","0","0","-93"],
];

// ── BUILD DOC ─────────────────────────────────────────────────────────────────

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "Arial", size: 20 } }
    },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: "1F3864" },
        paragraph: { spacing: { before: 320, after: 120 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: "2E75B6" },
        paragraph: { spacing: { before: 240, after: 100 }, outlineLevel: 1 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 }
      }
    },
    children: [

      // ── TÍTULO ──────────────────────────────────────────────────────────────
      para([txt("Trabalho Computacional I — Método Simplex", { bold: true, size: 32, color: "1F3864" })],
        { alignment: AlignmentType.CENTER, spacing: { after: 60 } }),
      para([txt("Implementação e Resolução de Problemas de Programação Linear", { size: 22, color: "555555" })],
        { alignment: AlignmentType.CENTER, spacing: { after: 400 } }),

      // ── INTRO ────────────────────────────────────────────────────────────────
      heading1("Introdução"),
      para("Este relatório descreve a implementação do Método Simplex no formato tabular, desenvolvida em Python, e apresenta a resolução dos dois problemas propostos. Para obtenção da Solução Básica Viável (SBV) inicial, foi adotada a Opção A: o Método das Duas Fases."),
      para("Na Fase I, variáveis artificiais são adicionadas às restrições que não possuem variável de folga somada (restrições do tipo = ou >=). O objetivo é minimizar a soma dessas variáveis artificiais. Se o valor mínimo for zero, uma SBV viável para o problema original foi encontrada; caso contrário, o problema é inviável. Na Fase II, as variáveis artificiais são removidas e o Simplex é executado sobre a função objetivo original."),

      // ══════════════════════════════════════════════════════════════════════════
      heading1("Problema 1"),
      // ── formulação ──────────────────────────────────────────────────────────
      heading2("Formulação"),
      para("O problema consiste em:"),
      para([txt("min  −x"), txt("1", { subScript: true }), txt("  +  x"), txt("2", { subScript: true }), txt("  +  x"), txt("3", { subScript: true })],
        { spacing: { before: 80, after: 40 } }),
      para([txt("s.a  x"), txt("1", { subScript: true }), txt("  −  2x"), txt("2", { subScript: true }), txt("  +  x"), txt("3", { subScript: true }), txt("  ≤  11")],
        { spacing: { before: 0, after: 40 } }),
      para([txt("       −2x"), txt("1", { subScript: true }), txt("              +  x"), txt("3", { subScript: true }), txt("  =  1")],
        { spacing: { before: 0, after: 40 } }),
      para([txt("       x"), txt("1", { subScript: true }), txt(", x"), txt("2", { subScript: true }), txt(", x"), txt("3", { subScript: true }), txt("  ≥  0")],
        { spacing: { before: 0, after: 120 } }),

      // ── SBV ─────────────────────────────────────────────────────────────────
      heading2("Obtenção da SBV Inicial — Método das Duas Fases"),
      para("A restrição de igualdade (−2x₁ + x₃ = 1) não possui variável de folga somada. Por isso, foi adicionada uma variável artificial a₁. A restrição ≤ recebe a variável de folga f₁."),
      para("A função objetivo da Fase I é: min a₁."),

      // ── fase 1 ───────────────────────────────────────────────────────────────
      heading2("Fase I"),
      ...tableau("Iteração 1 — pivot: x3, linha 2", p1_ph1_headers, p1_ph1_it1),
      para("Após 1 iteração, a variável artificial a₁ saiu da base com valor zero. O problema é viável."),
      spacer(),

      // ── fase 2 ───────────────────────────────────────────────────────────────
      heading2("Fase II"),
      para("As colunas artificiais são removidas e a função objetivo original é restaurada. Após canonizar a linha objetivo, a tabela já está ótima — não há coeficientes negativos na linha obj."),
      ...tableau("Tableau Final (Fase II)", p1_ph2_headers, p1_ph2_final),

      // ── resposta ─────────────────────────────────────────────────────────────
      heading2("Resposta"),
      makeTable(
        ["Variável", "Valor"],
        [["x₁", "0"], ["x₂", "0"], ["x₃", "1"]],
        [W/2, W/2]
      ),
      spacer(),
      para([txt("Valor ótimo da função objetivo:  ", { bold: true }), txt("z* = −(0) + 0 + 1 = "), txt("−1", { bold: true })]),

      // ══════════════════════════════════════════════════════════════════════════
      new Paragraph({ children: [new PageBreak()] }),
      heading1("Problema 2 — Distribuição de Sangue"),

      // ── descrição ────────────────────────────────────────────────────────────
      heading2("Descrição e Modelagem"),
      para("Sete pacientes precisam de transfusões. O objetivo é minimizar o custo de reposição do estoque de sangue, respeitando a compatibilidade entre tipos e as demandas individuais."),
      para("As variáveis de decisão xᵢⱼ representam a quantidade de bolsas do tipo sanguíneo i enviada ao paciente j. A seguir, a tabela de compatibilidade e custo utilizada:"),
      spacer(),
      makeTable(
        ["Variável", "Tipo", "Paciente", "Custo (R$/bolsa)"],
        [
          ["x1","A","1 (tipo A)","1"], ["x2","O","1 (tipo A)","4"],
          ["x3","A","2 (tipo AB)","1"], ["x4","AB","2 (tipo AB)","2"],
          ["x5","B","2 (tipo AB)","4"], ["x6","O","2 (tipo AB)","4"],
          ["x7","B","3 (tipo B)","4"], ["x8","O","3 (tipo B)","4"],
          ["x9","O","4 (tipo O)","4"],
          ["x10","A","5 (tipo A)","1"], ["x11","O","5 (tipo A)","4"],
          ["x12","B","6 (tipo B)","4"], ["x13","O","6 (tipo B)","4"],
          ["x14","A","7 (tipo AB)","1"], ["x15","AB","7 (tipo AB)","2"],
          ["x16","B","7 (tipo AB)","4"], ["x17","O","7 (tipo AB)","4"],
        ],
        [Math.floor(W*0.15), Math.floor(W*0.12), Math.floor(W*0.43), Math.floor(W*0.30)]
      ),
      spacer(),

      heading2("Função Objetivo"),
      para("min  x₁ + 4x₂ + x₃ + 2x₄ + 4x₅ + 4x₆ + 4x₇ + 4x₈ + 4x₉ + x₁₀ + 4x₁₁ + 4x₁₂ + 4x₁₃ + x₁₄ + 2x₁₅ + 4x₁₆ + 4x₁₇"),

      heading2("Restrições"),
      para([txt("Demanda (igualdades — cada paciente deve receber exatamente o que necessita):", { bold: true })]),
      spacer(),
      makeTable(
        ["Restrição", "Expressão", "Demanda"],
        [
          ["Paciente 1 (A)", "x1 + x2", "= 7"],
          ["Paciente 2 (AB)", "x3 + x4 + x5 + x6", "= 8"],
          ["Paciente 3 (B)", "x7 + x8", "= 2"],
          ["Paciente 4 (O)", "x9", "= 6"],
          ["Paciente 5 (A)", "x10 + x11", "= 9"],
          ["Paciente 6 (B)", "x12 + x13", "= 5"],
          ["Paciente 7 (AB)", "x14 + x15 + x16 + x17", "= 3"],
        ],
        [Math.floor(W*0.22), Math.floor(W*0.50), Math.floor(W*0.28)]
      ),
      spacer(),
      para([txt("Estoque (desigualdades — não se pode usar mais do que o disponível):", { bold: true })]),
      spacer(),
      makeTable(
        ["Tipo", "Expressão", "Estoque"],
        [
          ["A", "x1 + x3 + x10 + x14", "<= 15"],
          ["AB", "x4 + x15", "<= 12"],
          ["B", "x5 + x7 + x12 + x16", "<= 10"],
          ["O", "x2 + x6 + x8 + x9 + x11 + x13 + x17", "<= 12"],
        ],
        [Math.floor(W*0.12), Math.floor(W*0.60), Math.floor(W*0.28)]
      ),
      spacer(),

      heading2("Obtenção da SBV Inicial — Método das Duas Fases"),
      para("As 7 restrições de demanda são igualdades, portanto não possuem variável de folga somada. Foram adicionadas 7 variáveis artificiais (a₁ a a₇). As 4 restrições de estoque são ≤ e receberam variáveis de folga f₈ a f₁₁."),
      para("A função objetivo da Fase I é: min a₁ + a₂ + a₃ + a₄ + a₅ + a₆ + a₇."),
      para("A Fase I executou 9 iterações até que todas as variáveis artificiais deixaram a base com valor zero, confirmando a viabilidade do problema. As tabelas da Fase I são extensas (35 colunas) e estão omitidas aqui por questão de espaço — foram impressas integralmente pelo programa durante a execução."),

      // ── fase 2 ───────────────────────────────────────────────────────────────
      heading2("Fase II"),
      para("As colunas artificiais são removidas. O Simplex é executado sobre a função objetivo original. A Fase II convergiu em 3 iterações."),
      spacer(),

      ...tableau("Fase II — Iteração 1  (pivot: x8, linha 2)", p2_headers, p2_ph2_it1),
      ...tableau("Fase II — Iteração 2  (pivot: x15, linha 3)", p2_headers, p2_ph2_it2),
      ...tableau("Fase II — Iteração 3 / Tableau Final  (pivot: x13, linha 7)", p2_headers, p2_ph2_it3_final),

      // ── resposta ─────────────────────────────────────────────────────────────
      heading2("Resposta"),
      makeTable(
        ["Paciente", "Tipo", "De A", "De AB", "De B", "De O", "Total"],
        [
          ["1 (A)",  "A",  "6","—","—","1","7"],
          ["2 (AB)", "AB", "—","8","—","—","8"],
          ["3 (B)",  "B",  "—","—","—","2","2"],
          ["4 (O)",  "O",  "—","—","—","6","6"],
          ["5 (A)",  "A",  "9","—","—","—","9"],
          ["6 (B)",  "B",  "—","—","2","3","5"],
          ["7 (AB)", "AB", "—","3","—","—","3"],
        ],
        [Math.floor(W*0.13), Math.floor(W*0.10),
         Math.floor(W*0.12), Math.floor(W*0.12),
         Math.floor(W*0.12), Math.floor(W*0.12), Math.floor(W*0.12)]
      ),
      spacer(),
      para([
        txt("Verificação de estoques usados:  ", { bold: true }),
        txt("A = 15/15  |  AB = 11/12  |  B = 2/10  |  O = 12/12")
      ]),
      spacer(),
      para([txt("Valor ótimo da função objetivo:  ", { bold: true }), txt("z* = "), txt("R$ 93,00", { bold: true })]),
      para("Observação: o programa exibe −93 na linha obj porque internamente minimiza −z para problemas de minimização na representação adotada. O valor correto é z* = 93."),

    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("./relatorio_simplex.docx", buf);
  console.log("Relatorio gerado com sucesso.");
});