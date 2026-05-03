const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, PageNumber, AlignmentType, BorderStyle, ShadingType,
  WidthType, PageBreak, SectionType,
} = require("docx");
const fs = require("fs");

// ─── Color Palette (Exam: black/white/grey) ───
const C = {
  title: "000000",
  body: "000000",
  section: "333333",
  seal: "999999",
  answerLine: "CCCCCC",
  headerBg: "F0F0F0",
};

// ─── Border Helpers ───
const NB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const NBs = { top: NB, bottom: NB, left: NB, right: NB };

// ─── Font Config ───
const bodyFontEN = "Times New Roman";
const bodyFontCN = "SimSun";
const headingFontCN = "SimHei";
const bodySize = 21; // 10.5pt
const questionSize = 21;
const optionSize = 21;
const sectionTitleSize = 24; // 12pt

// ─── Layout Helpers ───
function sectionHeading(text) {
  return new Paragraph({
    spacing: { before: 360, after: 200, line: 360 },
    alignment: AlignmentType.LEFT,
    children: [
      new TextRun({
        text: text,
        bold: true,
        size: sectionTitleSize,
        font: { ascii: bodyFontEN, eastAsia: headingFontCN },
        color: C.title,
      }),
    ],
  });
}

function levelBadge(level) {
  return new Paragraph({
    spacing: { before: 0, after: 80, line: 360 },
    alignment: AlignmentType.LEFT,
    children: [
      new TextRun({
        text: `CEFR Level: ${level}`,
        bold: true,
        size: 20,
        font: { ascii: bodyFontEN, eastAsia: bodyFontCN },
        color: "555555",
        italics: true,
      }),
    ],
  });
}

function themeLine(theme) {
  return new Paragraph({
    spacing: { before: 0, after: 200, line: 360 },
    alignment: AlignmentType.LEFT,
    children: [
      new TextRun({
        text: `Theme: ${theme}`,
        size: 20,
        font: { ascii: bodyFontEN, eastAsia: bodyFontCN },
        color: "777777",
        italics: true,
      }),
    ],
  });
}

function instructionLine(text) {
  return new Paragraph({
    spacing: { before: 0, after: 120, line: 360 },
    alignment: AlignmentType.LEFT,
    children: [
      new TextRun({
        text: text,
        size: 20,
        font: { ascii: bodyFontEN, eastAsia: bodyFontCN },
        color: "666666",
      }),
    ],
  });
}

function questionParagraph(num, text) {
  return new Paragraph({
    spacing: { before: 180, after: 80, line: 360 },
    keepNext: true,
    children: [
      new TextRun({
        text: `${num}. `,
        bold: true,
        size: questionSize,
        font: { ascii: bodyFontEN, eastAsia: bodyFontCN },
        color: C.body,
      }),
      new TextRun({
        text: text,
        size: questionSize,
        font: { ascii: bodyFontEN, eastAsia: bodyFontCN },
        color: C.body,
      }),
    ],
  });
}

function boldInQuestion(num, plainText, boldParts) {
  // boldParts is array of { text, bold: true }
  // Interleave plainText segments with boldParts
  // For simplicity, construct runs manually
  const runs = [
    new TextRun({
      text: `${num}. `,
      bold: true,
      size: questionSize,
      font: { ascii: bodyFontEN, eastAsia: bodyFontCN },
      color: C.body,
    }),
  ];
  return new Paragraph({
    spacing: { before: 180, after: 80, line: 360 },
    keepNext: true,
    children: runs,
  });
}

function questionWithBoldRuns(num, runs) {
  return new Paragraph({
    spacing: { before: 180, after: 80, line: 360 },
    keepNext: true,
    children: [
      new TextRun({
        text: `${num}. `,
        bold: true,
        size: questionSize,
        font: { ascii: bodyFontEN, eastAsia: bodyFontCN },
        color: C.body,
      }),
      ...runs,
    ],
  });
}

// Options in a borderless table — short options: 4 columns in 1 row
function options4col(options) {
  return new Table({
    alignment: AlignmentType.LEFT,
    columnWidths: [2400, 2400, 2400, 2400],
    margins: { top: 40, bottom: 40, left: 100, right: 60 },
    rows: [
      new TableRow({
        children: options.map((opt, i) =>
          new TableCell({
            borders: NBs,
            width: { size: 25, type: WidthType.PERCENTAGE },
            margins: { top: 20, bottom: 20, left: 80, right: 60 },
            children: [
              new Paragraph({
                spacing: { before: 0, after: 0, line: 360 },
                children: [
                  new TextRun({
                    text: `${String.fromCharCode(65 + i)}. ${opt}`,
                    size: optionSize,
                    font: { ascii: bodyFontEN, eastAsia: bodyFontCN },
                    color: C.body,
                  }),
                ],
              }),
            ],
          })
        ),
      }),
    ],
  });
}

// Options in 2-column layout (medium options)
function options2col(options) {
  const rows = [];
  for (let i = 0; i < options.length; i += 2) {
    const cells = [];
    for (let j = i; j < Math.min(i + 2, options.length); j++) {
      cells.push(
        new TableCell({
          borders: NBs,
          width: { size: 50, type: WidthType.PERCENTAGE },
          margins: { top: 20, bottom: 20, left: 80, right: 60 },
          children: [
            new Paragraph({
              spacing: { before: 0, after: 0, line: 360 },
              children: [
                new TextRun({
                  text: `${String.fromCharCode(65 + j)}. ${options[j]}`,
                  size: optionSize,
                  font: { ascii: bodyFontEN, eastAsia: bodyFontCN },
                  color: C.body,
                }),
              ],
            }),
          ],
        })
      );
    }
    // If odd number, add empty cell
    if (options.length % 2 === 1 && i === options.length - 1) {
      cells.push(
        new TableCell({
          borders: NBs,
          width: { size: 50, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ children: [] })],
        })
      );
    }
    rows.push(new TableRow({ children: cells }));
  }
  return new Table({
    alignment: AlignmentType.LEFT,
    columnWidths: [4800, 4800],
    margins: { top: 40, bottom: 40, left: 100, right: 60 },
    rows: rows,
  });
}

// Options in 1-column layout (long options)
function options1col(options) {
  return new Table({
    alignment: AlignmentType.LEFT,
    columnWidths: [9600],
    margins: { top: 40, bottom: 40, left: 100, right: 60 },
    rows: options.map((opt, i) =>
      new TableRow({
        children: [
          new TableCell({
            borders: NBs,
            width: { size: 100, type: WidthType.PERCENTAGE },
            margins: { top: 20, bottom: 20, left: 80, right: 60 },
            children: [
              new Paragraph({
                spacing: { before: 0, after: 0, line: 360 },
                children: [
                  new TextRun({
                    text: `${String.fromCharCode(65 + i)}. ${opt}`,
                    size: optionSize,
                    font: { ascii: bodyFontEN, eastAsia: bodyFontCN },
                    color: C.body,
                  }),
                ],
              }),
            ],
          }),
        ],
      })
    ),
  });
}

function getOptionLayout(options) {
  const maxLen = Math.max(...options.map((o) => o.length));
  if (maxLen <= 25) return "4col";
  if (maxLen <= 70) return "2col";
  return "1col";
}

function renderOptions(options) {
  const layout = getOptionLayout(options);
  if (layout === "4col") return options4col(options);
  if (layout === "2col") return options2col(options);
  return options1col(options);
}

// Separator line
function separator() {
  return new Paragraph({
    spacing: { before: 300, after: 100 },
    children: [],
  });
}

// ─── A1 QUESTIONS ───
function buildA1Questions() {
  const children = [
    sectionHeading("Section A \u2014 CEFR A1: Beginner"),
    levelBadge("A1"),
    themeLine("Everyday Routines, Family Gatherings, and Traditional Food"),
    instructionLine("Choose the correct answer for each question. Each question is worth 2 points."),
    separator(),

    // Q1
    questionParagraph(1, "Every morning, my father ________ Arabic coffee for the whole family before breakfast."),
    renderOptions(["drinks", "makes", "eats", "sleeps"]),
    separator(),

    // Q2
    questionParagraph(2, "On Fridays, we always visit my grandmother in ________, a beautiful city in Jordan."),
    renderOptions(["Salt", "made", "cooking", "big"]),
    separator(),

    // Q3
    questionParagraph(3, [
      new TextRun({
        text: "Mansaf",
        bold: true,
        size: questionSize,
        font: { ascii: bodyFontEN, eastAsia: bodyFontCN },
        color: C.body,
      }),
      new TextRun({
        text: " is a traditional Jordanian dish made with ________ and jameed (yogurt).",
        size: questionSize,
        font: { ascii: bodyFontEN, eastAsia: bodyFontCN },
        color: C.body,
      }),
    ]),
    renderOptions(["rice", "water", "bread", "juice"]),
    separator(),

    // Q4
    questionParagraph(4, "My mother ________ the children with their homework after school every day."),
    renderOptions(["helps", "helping", "help", "helped"]),
    separator(),

    // Q5
    questionParagraph(5, [
      new TextRun({
        text: "During Ramadan, Muslims ________ from sunrise to sunset and break their fast with family.",
        size: questionSize,
        font: { ascii: bodyFontEN, eastAsia: bodyFontCN },
        color: C.body,
      }),
    ]),
    renderOptions(["eat", "sleep", "fast", "play"]),
    separator(),
  ];
  return children;
}

// ─── B1 QUESTIONS ───
function buildB1Questions() {
  const children = [
    sectionHeading("Section B \u2014 CEFR B1: Intermediate"),
    levelBadge("B1"),
    themeLine("University Life, Commuting in Amman, and Preparing for Exams"),
    instructionLine("Choose the correct answer for each question. Each question is worth 2 points."),
    separator(),

    // Q1
    questionParagraph(1, [
      new TextRun({
        text: 'Choose the correct word: "The traffic in Amman can be quite ________ during rush hour, especially near the 7th Circle."',
        size: questionSize,
        font: { ascii: bodyFontEN, eastAsia: bodyFontCN },
        color: C.body,
      }),
    ]),
    renderOptions(["heavy", "deep", "thick", "hard"]),
    separator(),

    // Q2
    questionParagraph(2, [
      new TextRun({
        text: "Complete the sentence: ",
        size: questionSize,
        font: { ascii: bodyFontEN, eastAsia: bodyFontCN },
        color: C.body,
      }),
      new TextRun({
        text: '"If I ________ harder last semester, I would have passed my calculus exam."',
        size: questionSize,
        font: { ascii: bodyFontEN, eastAsia: bodyFontCN },
        color: C.body,
        italics: true,
      }),
    ]),
    renderOptions(["study", "studied", "had studied", "would study"]),
    separator(),

    // Q3
    questionParagraph(3, "Which sentence is correct and natural?"),
    options1col([
      "I arrived to the university at 8 AM.",
      "I arrived at the university at 8 AM.",
      "I arrived in the university at 8 AM.",
      "I arrived on the university at 8 AM.",
    ]),
    separator(),

    // Q4
    questionParagraph(4, [
      new TextRun({
        text: "My roommate and I take turns preparing ________ meals in the dorm to save money.",
        size: questionSize,
        font: { ascii: bodyFontEN, eastAsia: bodyFontCN },
        color: C.body,
      }),
    ]),
    renderOptions(["our", "their", "your", "his"]),
    separator(),

    // Q5
    questionParagraph(5, "Which sentence flows naturally?"),
    options1col([
      "Despite the bus was late, I made it to the lecture on time.",
      "Even though the bus was late, I made it to the lecture on time.",
      "Although the bus was late, but I made it to the lecture on time.",
      "Because the bus was late, I made it to the lecture on time.",
    ]),
    separator(),
  ];
  return children;
}

// ─── C1 QUESTIONS ───
function buildC1Questions() {
  const children = [
    sectionHeading("Section C \u2014 CEFR C1: Advanced"),
    levelBadge("C1"),
    themeLine("Palestinian Resilience (Sumud), Historical Heritage, and Ethical Investments"),
    instructionLine("Choose the best answer for each question. These questions test sophisticated vocabulary, natural English flow, and nuanced expression. Each question is worth 2 points."),
    separator(),

    // Q1
    questionParagraph(1, [
      new TextRun({
        text: 'Sumud',
        bold: true,
        size: questionSize,
        font: { ascii: bodyFontEN, eastAsia: bodyFontCN },
        color: C.body,
      }),
      new TextRun({
        text: ', often translated as steadfastness, is not merely passive endurance but a deeply rooted ________ that permeates Palestinian daily life, cultural expression, and collective memory.',
        size: questionSize,
        font: { ascii: bodyFontEN, eastAsia: bodyFontCN },
        color: C.body,
      }),
    ]),
    renderOptions(["resilience", "ideology", "philosophy", "resistance"]),
    separator(),

    // Q2
    questionParagraph(2, "Which sentence best reflects advanced, natural English flow?"),
    options1col([
      "The olive trees in Palestine are not just trees; they represent the connection of the people to their land across generations.",
      "Olive trees in Palestine are important because people have had them for a very long time.",
      "The olive trees in Palestine symbolize an unbreakable bond between the people and their ancestral land that spans generations.",
      "Palestine\u2019s olive trees show how much people love their land.",
    ]),
    separator(),

    // Q3
    questionParagraph(3, [
      new TextRun({
        text: "Complete the passage: ",
        size: questionSize,
        font: { ascii: bodyFontEN, eastAsia: bodyFontCN },
        color: C.body,
      }),
      new TextRun({
        text: '"Ethical investment portfolios increasingly screen out companies that profit from ________ in occupied territories, redirecting capital toward community-driven enterprises that uphold human dignity."',
        size: questionSize,
        font: { ascii: bodyFontEN, eastAsia: bodyFontCN },
        color: C.body,
        italics: true,
      }),
    ]),
    options1col([
      "settlement expansion",
      "expanding settlements",
      "the expansion of settlement",
      "settlement\u2019s expansion",
    ]),
    separator(),

    // Q4
    questionParagraph(4, "Which sentence demonstrates the most sophisticated and natural English expression?"),
    options1col([
      "The historical heritage of Palestine dates back thousands of years.",
      "Palestine\u2019s historical heritage stretches back millennia, encompassing a rich tapestry of civilizations that have shaped the cultural and intellectual landscape of the region.",
      "Palestine has very old heritage from many civilizations in the past.",
      "The heritage of Palestine is historical and goes back very far in time.",
    ]),
    separator(),

    // Q5
    questionParagraph(5, [
      new TextRun({
        text: 'Rather than viewing charity solely as an obligation, many Jordanian families see it as an opportunity to ________ social bonds within their communities, reflecting values deeply embedded in both Islamic teachings and Arab cultural traditions.',
        size: questionSize,
        font: { ascii: bodyFontEN, eastAsia: bodyFontCN },
        color: C.body,
      }),
    ]),
    renderOptions(["strengthen", "make stronger", "create stronger", "build up strongly"]),
    separator(),
  ];
  return children;
}

// ─── ANSWER KEY (Separate Document) ───
function buildAnswerKey() {
  const answerData = [
    { section: "Section A \u2014 CEFR A1", answers: [
      { q: 1, answer: "B. makes" },
      { q: 2, answer: "A. Salt" },
      { q: 3, answer: "A. rice" },
      { q: 4, answer: "A. helps" },
      { q: 5, answer: "C. fast" },
    ]},
    { section: "Section B \u2014 CEFR B1", answers: [
      { q: 1, answer: "A. heavy" },
      { q: 2, answer: "C. had studied" },
      { q: 3, answer: "B. I arrived at the university at 8 AM." },
      { q: 4, answer: "A. our" },
      { q: 5, answer: "B. Even though the bus was late, I made it to the lecture on time." },
    ]},
    { section: "Section C \u2014 CEFR C1", answers: [
      { q: 1, answer: "A. resilience" },
      { q: 2, answer: "C. The olive trees in Palestine symbolize an unbreakable bond between the people and their ancestral land that spans generations." },
      { q: 3, answer: "A. settlement expansion" },
      { q: 4, answer: "B. Palestine\u2019s historical heritage stretches back millennia, encompassing a rich tapestry of civilizations that have shaped the cultural and intellectual landscape of the region." },
      { q: 5, answer: "A. strengthen" },
    ]},
  ];

  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 400, line: 360 },
      children: [
        new TextRun({
          text: "Placement Test \u2014 Answer Key",
          bold: true,
          size: 28,
          font: { ascii: bodyFontEN, eastAsia: headingFontCN },
          color: C.title,
        }),
      ],
    }),
  ];

  answerData.forEach((sec) => {
    children.push(
      new Paragraph({
        spacing: { before: 300, after: 150, line: 360 },
        children: [
          new TextRun({
            text: sec.section,
            bold: true,
            size: 22,
            font: { ascii: bodyFontEN, eastAsia: headingFontCN },
            color: C.section,
          }),
        ],
      })
    );
    sec.answers.forEach((a) => {
      children.push(
        new Paragraph({
          spacing: { before: 60, after: 60, line: 360 },
          children: [
            new TextRun({
              text: `Question ${a.q}: `,
              bold: true,
              size: bodySize,
              font: { ascii: bodyFontEN, eastAsia: bodyFontCN },
              color: C.body,
            }),
            new TextRun({
              text: a.answer,
              size: bodySize,
              font: { ascii: bodyFontEN, eastAsia: bodyFontCN },
              color: C.body,
            }),
          ],
        })
      );
    });
  });

  return children;
}

// ─── MAIN DOCUMENT ───
async function main() {
  const examChildren = [
    // Title
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 300, after: 100, line: 360 },
      children: [
        new TextRun({
          text: "English Placement Test",
          bold: true,
          size: 32,
          font: { ascii: bodyFontEN, eastAsia: headingFontCN },
          color: C.title,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 60, line: 360 },
      children: [
        new TextRun({
          text: "Jordanian ESL Learner Assessment",
          size: 22,
          font: { ascii: bodyFontEN, eastAsia: bodyFontCN },
          color: C.section,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 200, line: 360 },
      children: [
        new TextRun({
          text: "Levels: A1 \u2022 B1 \u2022 C1  |  Total: 15 Questions  |  30 Points",
          size: 20,
          font: { ascii: bodyFontEN, eastAsia: bodyFontCN },
          color: "666666",
        }),
      ],
    }),

    // Student Info Row (borderless table)
    new Table({
      alignment: AlignmentType.CENTER,
      columnWidths: [3000, 3000, 3000],
      margins: { top: 40, bottom: 40, left: 100, right: 100 },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              borders: NBs,
              width: { size: 33.33, type: WidthType.PERCENTAGE },
              margins: { top: 40, bottom: 40, left: 100, right: 100 },
              children: [
                new Paragraph({
                  spacing: { before: 0, after: 0, line: 360 },
                  children: [
                    new TextRun({
                      text: "Name: ________________",
                      size: bodySize,
                      font: { ascii: bodyFontEN, eastAsia: bodyFontCN },
                      color: C.body,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              borders: NBs,
              width: { size: 33.33, type: WidthType.PERCENTAGE },
              margins: { top: 40, bottom: 40, left: 100, right: 100 },
              children: [
                new Paragraph({
                  spacing: { before: 0, after: 0, line: 360 },
                  children: [
                    new TextRun({
                      text: "Date: ________________",
                      size: bodySize,
                      font: { ascii: bodyFontEN, eastAsia: bodyFontCN },
                      color: C.body,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              borders: NBs,
              width: { size: 33.33, type: WidthType.PERCENTAGE },
              margins: { top: 40, bottom: 40, left: 100, right: 100 },
              children: [
                new Paragraph({
                  spacing: { before: 0, after: 0, line: 360 },
                  children: [
                    new TextRun({
                      text: "Score: ________________",
                      size: bodySize,
                      font: { ascii: bodyFontEN, eastAsia: bodyFontCN },
                      color: C.body,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),

    new Paragraph({ spacing: { before: 100, after: 0 }, children: [] }),

    // Instructions
    instructionLine("Instructions: Read each question carefully and choose the best answer. There is only one correct answer per question. This test covers three levels \u2014 answer all questions."),

    new Paragraph({ spacing: { before: 200, after: 0 }, children: [] }),

    // Score Table
    new Table({
      alignment: AlignmentType.CENTER,
      width: { size: 80, type: WidthType.PERCENTAGE },
      margins: { top: 60, bottom: 60, left: 120, right: 120 },
      rows: [
        new TableRow({
          tableHeader: true,
          cantSplit: true,
          children: ["Section", "Level", "Questions", "Points", "Score"].map(
            (text) =>
              new TableCell({
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1, color: "333333" },
                  bottom: { style: BorderStyle.SINGLE, size: 1, color: "333333" },
                  left: { style: BorderStyle.NONE },
                  right: { style: BorderStyle.NONE },
                },
                shading: { type: ShadingType.CLEAR, fill: C.headerBg },
                margins: { top: 60, bottom: 60, left: 120, right: 120 },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 0, after: 0, line: 360 },
                    children: [
                      new TextRun({
                        text: text,
                        bold: true,
                        size: 20,
                        font: { ascii: bodyFontEN, eastAsia: bodyFontCN },
                        color: C.body,
                      }),
                    ],
                  }),
                ],
              })
          ),
        }),
        new TableRow({
          cantSplit: true,
          children: [
            "A", "A1 (Beginner)", "1\u20135", "10", "______",
          ].map((text) =>
            new TableCell({
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.SINGLE, size: 1, color: "999999" },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
              },
              margins: { top: 60, bottom: 60, left: 120, right: 120 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 0, after: 0, line: 360 },
                  children: [
                    new TextRun({
                      text: text,
                      size: 20,
                      font: { ascii: bodyFontEN, eastAsia: bodyFontCN },
                      color: C.body,
                    }),
                  ],
                }),
              ],
            })
          ),
        }),
        new TableRow({
          cantSplit: true,
          children: [
            "B", "B1 (Intermediate)", "6\u201310", "10", "______",
          ].map((text) =>
            new TableCell({
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.SINGLE, size: 1, color: "999999" },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
              },
              margins: { top: 60, bottom: 60, left: 120, right: 120 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 0, after: 0, line: 360 },
                  children: [
                    new TextRun({
                      text: text,
                      size: 20,
                      font: { ascii: bodyFontEN, eastAsia: bodyFontCN },
                      color: C.body,
                    }),
                  ],
                }),
              ],
            })
          ),
        }),
        new TableRow({
          cantSplit: true,
          children: [
            "C", "C1 (Advanced)", "11\u201315", "10", "______",
          ].map((text) =>
            new TableCell({
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.SINGLE, size: 1, color: "333333" },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
              },
              margins: { top: 60, bottom: 60, left: 120, right: 120 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 0, after: 0, line: 360 },
                  children: [
                    new TextRun({
                      text: text,
                      size: 20,
                      font: { ascii: bodyFontEN, eastAsia: bodyFontCN },
                      color: C.body,
                    }),
                  ],
                }),
              ],
            })
          ),
        }),
        new TableRow({
          cantSplit: true,
          children: [
            { text: "Total", bold: true },
            { text: "", bold: false },
            { text: "15", bold: true },
            { text: "30", bold: true },
            { text: "______", bold: false },
          ].map((item) =>
            new TableCell({
              borders: {
                top: { style: BorderStyle.SINGLE, size: 2, color: "333333" },
                bottom: { style: BorderStyle.SINGLE, size: 2, color: "333333" },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
              },
              shading: { type: ShadingType.CLEAR, fill: C.headerBg },
              margins: { top: 60, bottom: 60, left: 120, right: 120 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 0, after: 0, line: 360 },
                  children: [
                    new TextRun({
                      text: item.text,
                      bold: item.bold,
                      size: 20,
                      font: { ascii: bodyFontEN, eastAsia: bodyFontCN },
                      color: C.body,
                    }),
                  ],
                }),
              ],
            })
          ),
        }),
      ],
    }),

    new Paragraph({ spacing: { before: 300, after: 0 }, children: [] }),

    // All questions
    ...buildA1Questions(),
    ...buildB1Questions(),
    ...buildC1Questions(),
  ];

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: { ascii: bodyFontEN, eastAsia: bodyFontCN },
            size: bodySize,
            color: C.body,
          },
          paragraph: {
            spacing: { line: 360 },
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "English Placement Test \u2014 Jordanian ESL Learner Assessment",
                    size: 16,
                    color: C.seal,
                    font: { ascii: bodyFontEN, eastAsia: bodyFontCN },
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 18,
                    font: { ascii: bodyFontEN, eastAsia: bodyFontCN },
                    color: "666666",
                  }),
                ],
              }),
            ],
          }),
        },
        children: examChildren,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync("/home/z/my-project/download/ESL_Placement_Test_Question_Bank.docx", buffer);
  console.log("Exam document generated successfully.");

  // ─── Answer Key Document ───
  const answerKeyDoc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: { ascii: bodyFontEN, eastAsia: bodyFontCN },
            size: bodySize,
            color: C.body,
          },
          paragraph: {
            spacing: { line: 360 },
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "Answer Key \u2014 For Instructor Use Only",
                    size: 16,
                    color: C.seal,
                    font: { ascii: bodyFontEN, eastAsia: bodyFontCN },
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 18,
                    font: { ascii: bodyFontEN, eastAsia: bodyFontCN },
                    color: "666666",
                  }),
                ],
              }),
            ],
          }),
        },
        children: buildAnswerKey(),
      },
    ],
  });

  const answerBuffer = await Packer.toBuffer(answerKeyDoc);
  fs.writeFileSync("/home/z/my-project/download/ESL_Placement_Test_Answer_Key.docx", answerBuffer);
  console.log("Answer key document generated successfully.");
}

main().catch(console.error);
