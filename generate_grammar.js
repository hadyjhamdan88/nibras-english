const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, PageNumber, AlignmentType, BorderStyle, ShadingType,
  WidthType,
} = require("docx");
const fs = require("fs");

// ─── Color Palette ───
const C = {
  title: "000000",
  body: "1a1a1a",
  section: "222222",
  subtitle: "555555",
  accent: "E65100",
  accentLight: "FFF3E0",
  accentBorder: "FFCC80",
  correct: "2E7D32",
  correctBg: "E8F5E9",
  correctBorder: "A5D6A7",
  wrong: "C62828",
  wrongBg: "FFEBEE",
  wrongBorder: "EF9A9A",
  tipBg: "E3F2FD",
  tipBorder: "90CAF9",
  tipText: "1565C0",
  headerGrey: "999999",
  lightGrey: "F5F5F5",
};

const fontEN = "Times New Roman";
const fontCN = "SimSun";
const fontHead = "Calibri";

const thinB = (c) => ({ style: BorderStyle.SINGLE, size: 1, color: c });
const thinBs = (c) => ({ top: thinB(c), bottom: thinB(c), left: thinB(c), right: thinB(c) });
const NB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const NBs = { top: NB, bottom: NB, left: NB, right: NB };

// ─── LESSON DATA ───

const lessons = [
  // ═══════════════════════════════════════════════════════════
  // LESSON 1: B1 — Present Perfect Continuous vs Present Continuous
  // ═══════════════════════════════════════════════════════════
  {
    level: "B1",
    levelLabel: "Intermediate",
    title: "A Common Mistake: \"I am working since\" vs \"I have been working since\"",
    theme: "Correcting direct-translation errors using examples from Ramadan fasting and community volunteer work",
    accent: C.accent,
    accentLight: C.accentLight,
    accentBorder: C.accentBorder,
    intro: [
      `Many Arabic speakers say \"I am working since 2019\" when they want to describe something that started in the past and continues to the present moment. This sounds natural in Arabic \u2014 \u0623\u0646\u0627 \u0623\u0639\u0645\u0644 \u0645\u0646\u0630 2019 \u2014 but in English, this sentence is incorrect. The mistake comes from directly translating Arabic into English without adjusting the verb tense. In this short lesson, you will learn why this happens, how to fix it, and how to sound more natural when you speak English.`,
      `The key difference is very simple once you understand the pattern. When you want to say that an action started in the past and is still happening now, English requires the present perfect continuous tense, not the present continuous. Let us look at how this works with real examples from your daily life in Jordan.`,
    ],
    tipTitle: "The Rule in One Sentence",
    tipBody: "When you use \"since\" or \"for\" to describe how long an action has been happening, always use \"have been + verb-ing\" instead of \"am/is/are + verb-ing.\"",
    comparisonTable: {
      headers: ["Incorrect (Arab-lish)", "Correct (Natural English)", "Why?"],
      rows: [
        {
          wrong: "I am working at the charity since 2021.",
          correct: "I have been working at the charity since 2021.",
          why: "\"Since 2021\" tells us the action started in the past and continues \u2014 this needs present perfect continuous.",
        },
        {
          wrong: "She is volunteering at the mosque every Ramadan since she was young.",
          correct: "She has been volunteering at the mosque every Ramadan since she was young.",
          why: "\"Since she was young\" marks a point in the past that connects to now.",
        },
        {
          wrong: "We are fasting since the beginning of Ramadan.",
          correct: "We have been fasting since the beginning of Ramadan.",
          why: "Fasting started at a specific time and continues today.",
        },
        {
          wrong: "They are helping families in need for three years.",
          correct: "They have been helping families in need for three years.",
          why: "\"For three years\" shows duration from past to present.",
        },
      ],
    },
    examples: [
      {
        title: "Ramadan Fasting",
        sentences: [
          "My family has been fasting since the first day of Ramadan.",
          "My grandfather has been fasting every Ramadan for over sixty years.",
          "We have been preparing iftar meals for the neighborhood since the holy month began.",
        ],
      },
      {
        title: "Community Volunteer Work",
        sentences: [
          "I have been volunteering at the Tkiyet Um Ali food bank since last September.",
          "My classmates and I have been organizing charity drives for three semesters.",
          "Our university club has been collecting winter clothes for Syrian refugees since 2018.",
        ],
      },
    ],
    practiceSection: {
      title: "Your Turn: Fix the Mistakes",
      instructions: "Rewrite each sentence correctly. Answers are at the bottom of this lesson.",
      sentences: [
        "I am helping my mother cook iftar since Ramadan started. \u2192 ____________________________________________________",
        "My brother is studying at the University of Jordan since 2022. \u2192 ____________________________________________________",
        "We are collecting donations for the orphanage for six months. \u2192 ____________________________________________________",
      ],
      answers: [
        "I have been helping my mother cook iftar since Ramadan started.",
        "My brother has been studying at the University of Jordan since 2022.",
        "We have been collecting donations for the orphanage for six months.",
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════
  // LESSON 2: B2 — Transition Words for Hamburger Essay
  // ═══════════════════════════════════════════════════════════
  {
    level: "B2",
    levelLabel: "Upper Intermediate",
    title: "Building a Strong Paragraph: The Hamburger Essay Model",
    theme: "Using Furthermore, Consequently, and However to connect ideas smoothly, with the preservation of ancient olive trees in Palestine as the core example",
    accent: "1B5E20",
    accentLight: "E8F5E9",
    accentBorder: "A5D6A7",
    intro: [
      `Have you ever written a paragraph that felt choppy \u2014 like a list of sentences with no connection between them? In English, strong writing flows naturally from one idea to the next, the way a conversation does when someone is speaking well. The secret behind this smooth flow is transition words. These small but powerful words act like bridges that carry your reader from one sentence to the next without any sudden jumps or confusion.`,
      `In this lesson, we will focus on three essential transition words \u2014 Furthermore, Consequently, and However \u2014 using the preservation of ancient olive trees in Palestine as our example topic. This is not only a subject close to the heart of every Jordanian and Palestinian family, but also a powerful theme that works beautifully with these three transitions. By the end of this lesson, you will be able to build a complete, well-connected paragraph using the Hamburger Essay model.`,
    ],
    tipTitle: "The Hamburger Essay Model",
    tipBody: "Think of a paragraph like a hamburger: the top bun is your topic sentence (the main idea), the filling is your supporting sentences (connected by transition words), and the bottom bun is your concluding sentence (wrapping it up). Every good paragraph needs all three parts.",
    transitionTable: {
      headers: ["Transition Word", "Purpose", "Example (Olive Trees)"],
      rows: [
        {
          word: "Furthermore",
          purpose: "Adds another reason or point to support the same idea",
          example: "Ancient olive trees in Palestine represent centuries of agricultural heritage. Furthermore, they provide a living connection to the land that Palestinian families have tended for generations.",
        },
        {
          word: "Consequently",
          purpose: "Shows the result or effect of the previous statement",
          example: "Many olive groves have been destroyed or cut off by the separation wall. Consequently, Palestinian farmers face enormous challenges in reaching their trees and harvesting their crops.",
        },
        {
          word: "However",
          purpose: "Introduces a contrast or opposite point",
          example: "The destruction of olive trees has caused great economic hardship for farming families. However, Palestinian communities continue to plant new saplings each year, refusing to abandon their land.",
        },
      ],
    },
    examples: [
      {
        title: "Complete Hamburger Paragraph (Put Together)",
        sentences: [
          { label: "Top Bun (Topic Sentence):", text: "The preservation of ancient olive trees in Palestine is not only an environmental issue but also a deeply cultural and spiritual one." },
          { label: "Filling (Support):", text: "These trees, some of which are over a thousand years old, carry the memory and identity of generations of Palestinian farmers who have cared for them through every season. Furthermore, olive oil from these ancient trees is central to Palestinian cuisine, traditions, and family life, making their protection essential to cultural survival." },
          { label: "Filling (Consequence):", text: "In recent decades, many of these groves have been threatened by land confiscation, settlement expansion, and the construction of the separation wall. Consequently, Palestinian farmers have increasingly lost access to their ancestral lands, resulting in significant economic and emotional hardship for entire communities." },
          { label: "Filling (Contrast):", text: "However, the spirit of Sumud \u2014 steadfastness \u2014 remains unbroken. Palestinian families continue to tend their remaining trees, plant new saplings, and organize community harvests, demonstrating extraordinary resilience in the face of systematic displacement." },
          { label: "Bottom Bun (Conclusion):", text: "Ultimately, the olive tree is more than a crop \u2014 it is a symbol of Palestinian identity, patience, and unbreakable connection to the land." },
        ],
      },
    ],
    practiceSection: {
      title: "Your Turn: Build Your Own Hamburger Paragraph",
      instructions: "Write a complete paragraph about a topic you care about, using Furthermore, Consequently, and However. Follow the Hamburger model. Start with a topic sentence, add 3\u20134 supporting sentences with transitions, and finish with a concluding sentence.",
      sentences: [
        "Topic: ________________________________________________________________",
        "Furthermore, ____________________________________________________________",
        "Consequently, ___________________________________________________________",
        "However, ______________________________________________________________",
        "Conclusion: ____________________________________________________________",
      ],
      answers: [],
    },
  },

  // ═══════════════════════════════════════════════════════════
  // LESSON 3: A2 — P vs B Pronunciation
  // ═══════════════════════════════════════════════════════════
  {
    level: "A2",
    levelLabel: "Elementary",
    title: "The P and B Sound: Can You Hear the Difference?",
    theme: "Mastering the pronunciation and spelling difference between P and B, with culturally relevant tongue-twisters and stories",
    accent: "6A1B9A",
    accentLight: "F3E5F5",
    accentBorder: "CE93D8",
    intro: [
      `Many Arabic speakers find it difficult to tell the difference between the \"P\" sound and the \"B\" sound in English. This is completely normal because in Arabic, the letter \u0628 (baa) is used for both sounds. When Arabic speakers learn English, they often say \"bark\" instead of \"park,\" \"bear\" instead of \"pear,\" and \"bizza\" instead of \"pizza.\" This small difference can change the meaning of a word completely, so learning to hear and produce both sounds is an important step in improving your English.`,
      `Here is the good news: the difference between \"P\" and \"B\" is actually very small. Both sounds are made with your lips pressed together \u2014 they are called \"bilabial\" sounds because \"bi\" means two and \"labia\" means lips. The only difference is that when you say \"P,\" no voice comes from your throat. When you say \"B,\" your throat vibrates. Try this right now: place your fingers lightly on your throat and say \"P-P-P-P.\" You will feel nothing. Now say \"B-B-B-B.\" You should feel a gentle buzzing. That buzzing is the only difference between these two sounds.`,
    ],
    tipTitle: "The Secret Trick: The Paper Test",
    tipBody: "Hold a thin piece of paper in front of your mouth. Say \"P\" \u2014 the paper should move with a small puff of air. Now say \"B\" \u2014 the paper should barely move. The \"P\" sound has a strong puff of air; the \"B\" sound does not.",
    comparisonTable: {
      headers: ["B Sound", "P Sound", "Meaning Difference"],
      rows: [
        {
          wrong: "bear",
          correct: "pear",
          why: "A bear is a large animal. A pear is a sweet fruit (we eat plenty in Jordan!).",
        },
        {
          wrong: "bat",
          correct: "pat",
          why: "A bat is an animal that flies at night. A pat is a gentle touch with your hand.",
        },
        {
          wrong: "berry",
          correct: "peach",
          why: "A berry is a small fruit. A peach is a large, soft fruit with fuzzy skin.",
        },
        {
          wrong: "bin",
          correct: "pin",
          why: "A bin is a container for trash. A pin is a thin, sharp piece of metal used for sewing.",
        },
      ],
    },
    examples: [
      {
        title: "P Words in Our Daily Life",
        sentences: [
          "My mother puts fresh pomegranate on the table every evening.",
          "The bakery on Rainbow Street sells the best pizza in Amman.",
          "Please pass me the plate of hummus and pita bread.",
          "My little brother loves playing with his pet parrot.",
        ],
      },
      {
        title: "B Words in Our Daily Life",
        sentences: [
          "My grandmother bakes fresh bread every Friday morning.",
          "The boys in my class play football behind the school building.",
          "Before Ramadan, we buy big baskets of dates from the market.",
          "My uncle is a businessman who works in building construction.",
        ],
      },
    ],
    practiceSection: {
      title: "Tongue-Twister Challenge!",
      instructions: "Read each tongue-twister out loud three times. Start slowly, then try to say it faster. Focus on making a clear puff of air for every P and a soft buzz for every B.",
      sentences: [
        "Bilal bakes big baskets of bread, but Pamela prefers fresh pita bread.",
        "Palestinian people plant precious pomegranate and peach trees by the beautiful blue beach.",
        "Bassam bought a big bag of beans, and his brother poured a pint of black pepper on his pizza.",
        "The patient baker baked plenty of pastries for the people at the Palestinian party.",
      ],
      answers: [],
    },
  },
];

// ─── BUILD FUNCTIONS ───

function buildComparisonTable(tableData, accentColor) {
  const { headers, rows } = tableData;

  const headerRow = new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: headers.map((h, i) =>
      new TableCell({
        width: { size: [28, 35, 37][i], type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: C.lightGrey },
        borders: thinBs("BBBBBB"),
        margins: { top: 60, bottom: 60, left: 100, right: 80 },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 0, line: 360 },
            children: [
              new TextRun({
                text: h,
                bold: true,
                size: 20,
                font: { ascii: fontHead, eastAsia: fontCN },
                color: C.section,
              }),
            ],
          }),
        ],
      })
    ),
  });

  const isPB = headers[0] === "B Sound";

  const dataRows = rows.map((r) =>
    new TableRow({
      cantSplit: true,
      children: [
        // Wrong / B Sound
        new TableCell({
          width: { size: 28, type: WidthType.PERCENTAGE },
          borders: thinBs("DDDDDD"),
          margins: { top: 50, bottom: 50, left: 100, right: 80 },
          shading: { type: ShadingType.CLEAR, fill: isPB ? C.correctBg : C.wrongBg },
          children: [
            new Paragraph({
              alignment: AlignmentType.LEFT,
              spacing: { before: 0, after: 0, line: 360 },
              children: [
                new TextRun({
                  text: isPB ? r.wrong : r.wrong,
                  bold: true,
                  size: 21,
                  font: { ascii: fontEN, eastAsia: fontCN },
                  color: isPB ? C.correct : C.wrong,
                }),
              ],
            }),
          ],
        }),
        // Correct / P Sound
        new TableCell({
          width: { size: 35, type: WidthType.PERCENTAGE },
          borders: thinBs("DDDDDD"),
          margins: { top: 50, bottom: 50, left: 100, right: 80 },
          shading: { type: ShadingType.CLEAR, fill: isPB ? C.correctBg : C.correctBg },
          children: [
            new Paragraph({
              alignment: AlignmentType.LEFT,
              spacing: { before: 0, after: 0, line: 360 },
              children: [
                new TextRun({
                  text: isPB ? r.correct : r.correct,
                  bold: true,
                  size: 21,
                  font: { ascii: fontEN, eastAsia: fontCN },
                  color: isPB ? C.correct : C.correct,
                }),
              ],
            }),
          ],
        }),
        // Why / Meaning
        new TableCell({
          width: { size: 37, type: WidthType.PERCENTAGE },
          borders: thinBs("DDDDDD"),
          margins: { top: 50, bottom: 50, left: 100, right: 80 },
          children: [
            new Paragraph({
              alignment: AlignmentType.LEFT,
              spacing: { before: 0, after: 0, line: 360 },
              children: [
                new TextRun({
                  text: r.why,
                  size: 20,
                  font: { ascii: fontEN, eastAsia: fontCN },
                  color: "333333",
                }),
              ],
            }),
          ],
        }),
      ],
    })
  );

  return new Table({
    alignment: AlignmentType.CENTER,
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [2800, 3500, 3700],
    rows: [headerRow, ...dataRows],
  });
}

function buildTransitionTable(tableData, accentColor) {
  const { headers, rows } = tableData;

  const headerRow = new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: headers.map((h, i) =>
      new TableCell({
        width: { size: [20, 30, 50][i], type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: C.lightGrey },
        borders: thinBs("BBBBBB"),
        margins: { top: 60, bottom: 60, left: 100, right: 80 },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 0, line: 360 },
            children: [
              new TextRun({
                text: h,
                bold: true,
                size: 20,
                font: { ascii: fontHead, eastAsia: fontCN },
                color: C.section,
              }),
            ],
          }),
        ],
      })
    ),
  });

  const dataRows = rows.map((r) =>
    new TableRow({
      cantSplit: true,
      children: [
        new TableCell({
          width: { size: 20, type: WidthType.PERCENTAGE },
          borders: thinBs("DDDDDD"),
          margins: { top: 50, bottom: 50, left: 100, right: 80 },
          children: [
            new Paragraph({
              alignment: AlignmentType.LEFT,
              spacing: { before: 0, after: 0, line: 360 },
              children: [
                new TextRun({
                  text: r.word,
                  bold: true,
                  size: 21,
                  font: { ascii: fontEN, eastAsia: fontCN },
                  color: accentColor,
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 30, type: WidthType.PERCENTAGE },
          borders: thinBs("DDDDDD"),
          margins: { top: 50, bottom: 50, left: 100, right: 80 },
          children: [
            new Paragraph({
              alignment: AlignmentType.LEFT,
              spacing: { before: 0, after: 0, line: 360 },
              children: [
                new TextRun({
                  text: r.purpose,
                  size: 20,
                  font: { ascii: fontEN, eastAsia: fontCN },
                  color: "333333",
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 50, type: WidthType.PERCENTAGE },
          borders: thinBs("DDDDDD"),
          margins: { top: 50, bottom: 50, left: 100, right: 80 },
          children: [
            new Paragraph({
              alignment: AlignmentType.LEFT,
              spacing: { before: 0, after: 0, line: 360 },
              children: [
                new TextRun({
                  text: r.example,
                  italics: true,
                  size: 20,
                  font: { ascii: fontEN, eastAsia: fontCN },
                  color: "333333",
                }),
              ],
            }),
          ],
        }),
      ],
    })
  );

  return new Table({
    alignment: AlignmentType.CENTER,
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [2000, 3000, 5000],
    rows: [headerRow, ...dataRows],
  });
}

function buildHamburgerExample(examples) {
  const children = [];
  examples.forEach((example) => {
    example.sentences.forEach((s) => {
      if (typeof s === "string") {
        children.push(
          new Paragraph({
            indent: { firstLine: 480 },
            spacing: { before: 40, after: 40, line: 360 },
            children: [
              new TextRun({
                text: s,
                size: 22,
                font: { ascii: fontEN, eastAsia: fontCN },
                color: C.body,
              }),
            ],
          })
        );
      } else {
        children.push(
          new Paragraph({
            indent: { firstLine: 480 },
            spacing: { before: 60, after: 40, line: 360 },
            keepNext: true,
            children: [
              new TextRun({
                text: s.label + " ",
                bold: true,
                size: 20,
                font: { ascii: fontHead, eastAsia: fontCN },
                color: "1565C0",
              }),
              new TextRun({
                text: s.text,
                size: 22,
                font: { ascii: fontEN, eastAsia: fontCN },
                color: C.body,
              }),
            ],
          })
        );
      }
    });
  });
  return children;
}

function buildLessonSection(lesson, index) {
  const children = [];

  // Level badge
  children.push(
    new Paragraph({
      spacing: { before: index === 0 ? 200 : 500, after: 60, line: 360 },
      alignment: AlignmentType.LEFT,
      children: [
        new TextRun({
          text: `CEFR ${lesson.level}  \u2014  ${lesson.levelLabel}`,
          bold: true,
          size: 20,
          font: { ascii: fontHead, eastAsia: fontCN },
          color: lesson.accent,
        }),
      ],
    })
  );

  // Title
  children.push(
    new Paragraph({
      spacing: { before: 60, after: 40, line: 360, lineRule: "atLeast" },
      alignment: AlignmentType.LEFT,
      children: [
        new TextRun({
          text: lesson.title,
          bold: true,
          size: 30,
          font: { ascii: fontHead, eastAsia: fontCN },
          color: C.title,
        }),
      ],
    })
  );

  // Theme
  children.push(
    new Paragraph({
      spacing: { before: 0, after: 60, line: 360 },
      alignment: AlignmentType.LEFT,
      children: [
        new TextRun({
          text: lesson.theme,
          italics: true,
          size: 20,
          font: { ascii: fontEN, eastAsia: fontCN },
          color: C.subtitle,
        }),
      ],
    })
  );

  // Accent line
  children.push(
    new Paragraph({
      spacing: { before: 0, after: 200 },
      borders: { bottom: { style: BorderStyle.SINGLE, size: 3, color: lesson.accent } },
      children: [],
    })
  );

  // Intro paragraphs
  lesson.intro.forEach((para) => {
    children.push(
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        indent: { firstLine: 480 },
        spacing: { before: 80, after: 80, line: 360 },
        children: [
          new TextRun({
            text: para,
            size: 24,
            font: { ascii: fontEN, eastAsia: fontCN },
            color: C.body,
          }),
        ],
      })
    );
  });

  // Tip Box (using a shaded table)
  children.push(
    new Paragraph({ spacing: { before: 160, after: 0 }, children: [] })
  );

  children.push(
    new Table({
      alignment: AlignmentType.CENTER,
      width: { size: 100, type: WidthType.PERCENTAGE },
      columnWidths: [10000],
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 100, type: WidthType.PERCENTAGE },
              shading: { type: ShadingType.CLEAR, fill: C.tipBg },
              borders: thinBs(C.tipBorder),
              margins: { top: 100, bottom: 100, left: 160, right: 160 },
              children: [
                new Paragraph({
                  spacing: { before: 0, after: 60, line: 360 },
                  children: [
                    new TextRun({
                      text: lesson.tipTitle,
                      bold: true,
                      size: 22,
                      font: { ascii: fontHead, eastAsia: fontCN },
                      color: C.tipText,
                    }),
                  ],
                }),
                new Paragraph({
                  spacing: { before: 0, after: 0, line: 360 },
                  children: [
                    new TextRun({
                      text: lesson.tipBody,
                      size: 22,
                      font: { ascii: fontEN, eastAsia: fontCN },
                      color: "333333",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    })
  );

  children.push(
    new Paragraph({ spacing: { before: 240, after: 0 }, children: [] })
  );

  // Comparison / Transition Table
  if (lesson.comparisonTable) {
    children.push(
      new Paragraph({
        spacing: { before: 120, after: 120, line: 360 },
        children: [
          new TextRun({
            text: "See the Difference:",
            bold: true,
            size: 22,
            font: { ascii: fontHead, eastAsia: fontCN },
            color: C.section,
          }),
        ],
      })
    );
    children.push(buildComparisonTable(lesson.comparisonTable, lesson.accent));
  }

  if (lesson.transitionTable) {
    children.push(
      new Paragraph({
        spacing: { before: 120, after: 120, line: 360 },
        children: [
          new TextRun({
            text: "The Three Key Transitions:",
            bold: true,
            size: 22,
            font: { ascii: fontHead, eastAsia: fontCN },
            color: C.section,
          }),
        ],
      })
    );
    children.push(buildTransitionTable(lesson.transitionTable, lesson.accent));
  }

  children.push(
    new Paragraph({ spacing: { before: 240, after: 0 }, children: [] })
  );

  // Example Sentences
  lesson.examples.forEach((example) => {
    children.push(
      new Paragraph({
        spacing: { before: 160, after: 80, line: 360 },
        children: [
          new TextRun({
            text: example.title,
            bold: true,
            size: 22,
            font: { ascii: fontHead, eastAsia: fontCN },
            color: lesson.accent,
          }),
        ],
      })
    );

    if (example.sentences[0] && typeof example.sentences[0] === "object" && example.sentences[0].label) {
      // Hamburger paragraph with labeled parts
      children.push(...buildHamburgerExample([example]));
    } else {
      // Regular sentence list
      example.sentences.forEach((s) => {
        children.push(
          new Paragraph({
            indent: { firstLine: 480 },
            spacing: { before: 40, after: 40, line: 360 },
            children: [
              new TextRun({
                text: s,
                size: 22,
                font: { ascii: fontEN, eastAsia: fontCN },
                color: C.body,
              }),
            ],
          })
        );
      });
    }
  });

  // Practice Section
  if (lesson.practiceSection) {
    children.push(
      new Paragraph({ spacing: { before: 200, after: 0 }, children: [] })
    );

    // Practice box
    children.push(
      new Table({
        alignment: AlignmentType.CENTER,
        width: { size: 100, type: WidthType.PERCENTAGE },
        columnWidths: [10000],
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 100, type: WidthType.PERCENTAGE },
                shading: { type: ShadingType.CLEAR, fill: lesson.accentLight },
                borders: thinBs(lesson.accentBorder),
                margins: { top: 100, bottom: 100, left: 160, right: 160 },
                children: [
                  new Paragraph({
                    spacing: { before: 0, after: 60, line: 360 },
                    children: [
                      new TextRun({
                        text: lesson.practiceSection.title,
                        bold: true,
                        size: 22,
                        font: { ascii: fontHead, eastAsia: fontCN },
                        color: lesson.accent,
                      }),
                    ],
                  }),
                  new Paragraph({
                    spacing: { before: 0, after: 100, line: 360 },
                    children: [
                      new TextRun({
                        text: lesson.practiceSection.instructions,
                        size: 21,
                        font: { ascii: fontEN, eastAsia: fontCN },
                        color: "444444",
                      }),
                    ],
                  }),
                  ...lesson.practiceSection.sentences.map(
                    (s) =>
                      new Paragraph({
                        spacing: { before: 60, after: 60, line: 400 },
                        children: [
                          new TextRun({
                            text: s,
                            size: 21,
                            font: { ascii: fontEN, eastAsia: fontCN },
                            color: C.body,
                          }),
                        ],
                      })
                  ),
                ],
              }),
            ],
          }),
        ],
      })
    );

    // Answers (if present)
    if (lesson.practiceSection.answers.length > 0) {
      children.push(
        new Paragraph({ spacing: { before: 200, after: 0 }, children: [] })
      );

      children.push(
        new Table({
          alignment: AlignmentType.CENTER,
          width: { size: 100, type: WidthType.PERCENTAGE },
          columnWidths: [10000],
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 100, type: WidthType.PERCENTAGE },
                  shading: { type: ShadingType.CLEAR, fill: "FFFDE7" },
                  borders: thinBs("FFF176"),
                  margins: { top: 80, bottom: 80, left: 160, right: 160 },
                  children: [
                    new Paragraph({
                      spacing: { before: 0, after: 60, line: 360 },
                      children: [
                        new TextRun({
                          text: "Answers",
                          bold: true,
                          size: 21,
                          font: { ascii: fontHead, eastAsia: fontCN },
                          color: "F57F17",
                        }),
                      ],
                    }),
                    ...lesson.practiceSection.answers.map((a, i) =>
                      new Paragraph({
                        spacing: { before: 30, after: 30, line: 360 },
                        children: [
                          new TextRun({
                            text: `${i + 1}. ${a}`,
                            size: 21,
                            font: { ascii: fontEN, eastAsia: fontCN },
                            color: "333333",
                          }),
                        ],
                      })
                    ),
                  ],
                }),
              ],
            }),
          ],
        })
      );
    }
  }

  return children;
}

// ─── MAIN ───

async function main() {
  const allChildren = [];

  // Document header
  allChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 40, line: 360 },
      children: [
        new TextRun({
          text: "Practical Grammar Lessons",
          bold: true,
          size: 36,
          font: { ascii: fontHead, eastAsia: fontCN },
          color: C.title,
        }),
      ],
    })
  );

  allChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 40, line: 360 },
      children: [
        new TextRun({
          text: "Jordanian ESL Learner Series \u2014 Bite-Sized Lessons",
          size: 22,
          font: { ascii: fontEN, eastAsia: fontCN },
          color: C.subtitle,
        }),
      ],
    })
  );

  allChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 100, line: 360 },
      children: [
        new TextRun({
          text: "Levels: A2  \u2022  B1  \u2022  B2  |  Focus: Natural Flow, Practical Application, Cultural Context",
          size: 18,
          font: { ascii: fontEN, eastAsia: fontCN },
          color: "888888",
        }),
      ],
    })
  );

  // Instruction
  allChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 60, after: 200, line: 360 },
      children: [
        new TextRun({
          text: "These lessons focus on practical application and natural English flow. No formal grammar jargon \u2014 just real patterns you can use every day.",
          size: 18,
          font: { ascii: fontEN, eastAsia: fontCN },
          color: "666666",
        }),
      ],
    })
  );

  // All lessons
  lessons.forEach((lesson, index) => {
    allChildren.push(...buildLessonSection(lesson, index));
  });

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: { ascii: fontEN, eastAsia: fontCN },
            size: 24,
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
            margin: { top: 1440, bottom: 1440, left: 1400, right: 1400 },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "Practical Grammar Lessons \u2014 Jordanian ESL Learner Series",
                    size: 16,
                    color: C.headerGrey,
                    font: { ascii: fontEN, eastAsia: fontCN },
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
                    font: { ascii: fontEN, eastAsia: fontCN },
                    color: "666666",
                  }),
                ],
              }),
            ],
          }),
        },
        children: allChildren,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync("/home/z/my-project/download/ESL_Practical_Grammar_Lessons.docx", buffer);
  console.log("Practical Grammar Lessons document generated successfully.");
}

main().catch(console.error);
