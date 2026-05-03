const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, PageNumber, AlignmentType, BorderStyle, ShadingType,
  WidthType,
} = require("docx");
const fs = require("fs");

// ─── Color Palette ───
const C = {
  title: "000000",
  body: "000000",
  section: "222222",
  subtitle: "555555",
  accent: "1565C0",
  tableHeader: "E3F2FD",
  tableBorder: "90CAF9",
  lightBg: "F8FAFC",
  greenAccent: "1B5E20",
  greenHeader: "E8F5E9",
  greenBorder: "A5D6A7",
  purpleAccent: "6A1B9A",
  purpleHeader: "F3E5F5",
  purpleBorder: "CE93D8",
  headerGrey: "999999",
};

const fontEN = "Times New Roman";
const fontCN = "SimSun";
const fontHead = "Calibri";

const thinB = (c) => ({ style: BorderStyle.SINGLE, size: 1, color: c });
const thinBs = (c) => ({ top: thinB(c), bottom: thinB(c), left: thinB(c), right: thinB(c) });

// ─── VOCABULARY DATA ───

const vocabLists = [
  // ═══════════════════════════════════════════════════
  // A1 — Family, Household, Islamic Greetings
  // ═══════════════════════════════════════════════════
  {
    level: "A1",
    levelLabel: "Beginner",
    title: "Essential Words for Daily Life",
    theme: "Basic Family Members, Household Items, and Islamic Greetings",
    accent: C.greenAccent,
    headerBg: C.greenHeader,
    borderC: C.greenBorder,
    words: [
      {
        word: "mother",
        arabic: "\u0623\u0645\u0651 (umm)",
        example: "My mother prepares Arabic coffee every morning for the whole family before breakfast.",
      },
      {
        word: "father",
        arabic: "\u0623\u0628 (abb)",
        example: "My father takes us to the mosque every Friday for Jummah prayer.",
      },
      {
        word: "grandmother",
        arabic: "\u062c\u062f\u0651\u0629 (jaddah)",
        example: "My grandmother tells us beautiful stories about our family\u2019s olive trees in Palestine.",
      },
      {
        word: "brother",
        arabic: "\u0623\u062e (akh)",
        example: "My brother helps me with my English homework every evening after school.",
      },
      {
        word: "sister",
        arabic: "\u0623\u062e\u062a (ukht)",
        example: "My sister and I share a bedroom in our small apartment in Amman.",
      },
      {
        word: "kitchen",
        arabic: "\u0645\u0637\u0628\u062e (matbakh)",
        example: "The kitchen always smells wonderful when my mother cooks mansaf on Fridays.",
      },
      {
        word: "prayer mat",
        arabic: "\u0633\u062c\u0627\u062f\u0629 \u0635\u0644\u0627\u0629 (sajadah salah)",
        example: "My grandfather prays on his prayer mat five times a day, even at his age.",
      },
      {
        word: "cushion",
        arabic: "\u0648\u0633\u0627\u062f\u0629 (wisadah)",
        example: "We sit on cushions on the floor when guests come to visit our home.",
      },
      {
        word: "As-salamu alaykum",
        arabic: "\u0627\u0644\u0633\u0644\u0627\u0645 \u0639\u0644\u064a\u0643\u0645",
        example: "When we enter a room, we say \u2018As-salamu alaykum\u2019 to greet everyone with peace.",
      },
      {
        word: "In sha\u2019a Allah",
        arabic: "\u0625\u0646 \u0634\u0627\u0621 \u0627\u0644\u0644\u0647",
        example: "I will visit my grandmother in Irbid next weekend, in sha\u2019a Allah.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════
  // B2 — Automotive, Luxury Vehicles, Driving Safety
  // ═══════════════════════════════════════════════════
  {
    level: "B2",
    levelLabel: "Upper Intermediate",
    title: "On the Road: Technology and Safety",
    theme: "Automotive Technology, Luxury Vehicles, and Driving Safely in the City",
    accent: C.accent,
    headerBg: C.tableHeader,
    borderC: C.tableBorder,
    words: [
      {
        word: "infotainment system",
        arabic: "\u0646\u0638\u0627\u0645 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062a \u0648\u0627\u0644\u062a\u0631\u0641\u064a\u0647",
        example: "The BMW 5 Series features an advanced infotainment system with navigation, voice commands, and wireless connectivity.",
      },
      {
        word: "collision avoidance",
        arabic: "\u062a\u062c\u0646\u0628 \u0627\u0644\u0627\u0635\u0637\u062d\u0627\u0645",
        example: "Modern vehicles use radar and cameras for collision avoidance, helping prevent accidents on Amman\u2019s busy highways.",
      },
      {
        word: "fuel efficiency",
        arabic: "\u0643\u0641\u0627\u0621\u0629 \u0627\u0633\u062a\u0647\u0644\u0627\u0643 \u0627\u0644\u0648\u0642\u0648\u062f",
        example: "Many Jordanian families prioritize fuel efficiency because fuel prices have risen steadily in recent years.",
      },
      {
        word: "lane departure warning",
        arabic: "\u062a\u062d\u0630\u064a\u0631 \u0627\u0644\u0627\u0646\u062d\u0631\u0627\u0641 \u0639\u0646 \u0627\u0644\u0645\u0633\u0627\u0631",
        example: "The lane departure warning system gently vibrates the steering wheel if you drift out of your lane without signaling.",
      },
      {
        word: "adaptive cruise control",
        arabic: "\u0646\u0638\u0627\u0645 \u0627\u0644\u062a\u062d\u0643\u0645 \u0627\u0644\u062a\u0643\u064a\u0641\u064a \u0628\u0627\u0644\u0633\u0631\u0639\u0629",
        example: "On long drives from Amman to Aqaba, adaptive cruise control automatically adjusts your speed to maintain a safe distance from the car ahead.",
      },
      {
        word: "horsepower",
        arabic: "\u0642\u0648\u0629 \u0627\u0644\u062d\u0635\u0627\u0646",
        example: "The BMW 5 Series delivers impressive horsepower while maintaining a smooth, comfortable ride through city traffic.",
      },
      {
        word: "blind spot",
        arabic: "\u0627\u0644\u0646\u0642\u0637\u0629 \u0627\u0644\u0639\u0645\u064a\u0627\u0621",
        example: "Before changing lanes on the Airport Road in Amman, always check your blind spot carefully for motorcycles and scooters.",
      },
      {
        word: "vehicle diagnostics",
        arabic: "\u062a\u0634\u062e\u064a\u0635 \u0627\u0644\u0645\u0631\u0643\u0628\u0627\u062a",
        example: "The car\u2019s onboard computer runs automatic vehicle diagnostics to detect mechanical issues before they become costly repairs.",
      },
      {
        word: "regenerative braking",
        arabic: "\u0627\u0644\u0643\u0628\u062d \u0627\u0644\u062a\u062c\u062f\u064a\u062f\u064a",
        example: "Hybrid and electric vehicles use regenerative braking to convert kinetic energy back into battery power when the driver slows down.",
      },
      {
        word: "anti-lock braking system (ABS)",
        arabic: "\u0646\u0638\u0627\u0645 \u0645\u0627\u0646\u0639 \u0627\u0644\u0627\u0646\u063a\u0644\u0627\u0642",
        example: "The anti-lock braking system prevents the wheels from locking up during sudden braking on wet roads, giving the driver better steering control.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════
  // C2 — Linguistics, Pragmatics, Academic Research
  // ═══════════════════════════════════════════════════
  {
    level: "C2",
    levelLabel: "Proficiency",
    title: "The Architecture of Language",
    theme: "Advanced Linguistics, Pragmatics of Spoken Communication, and Academic Research",
    accent: C.purpleAccent,
    headerBg: C.purpleHeader,
    borderC: C.purpleBorder,
    words: [
      {
        word: "pragmatics",
        arabic: "\u0639\u0644\u0645 \u0627\u0644\u062f\u0644\u0627\u0644\u0629 \u0627\u0644\u062a\u0639\u0627\u0645\u0644\u064a\u0629 (\u0627\u0644\u0628\u0631\u0627\u063a\u0645\u0627\u062a\u064a\u0643\u0627)",
        example: "Pragmatics investigates how speakers use context, tone, and cultural knowledge to convey meanings that go far beyond the literal definitions of individual words.",
      },
      {
        word: "discourse analysis",
        arabic: "\u062a\u062d\u0644\u064a\u0644 \u0627\u0644\u062e\u0637\u0627\u0628",
        example: "Through discourse analysis, researchers can identify subtle power dynamics in political speeches and media narratives that shape public opinion.",
      },
      {
        word: "speech act",
        arabic: "\u0641\u0639\u0644 \u0643\u0644\u0627\u0645\u064a",
        example: "When a professor says \u2018I strongly encourage you to revise this essay,\u2019 the utterance functions as a speech act that is both an evaluation and a directive.",
      },
      {
        word: "sociolinguistics",
        arabic: "\u0639\u0644\u0645 \u0627\u0644\u0644\u063a\u0629 \u0627\u0644\u0627\u062c\u062a\u0645\u0627\u0639\u064a",
        example: "Sociolinguistics explores how factors like social class, educational background, and regional origin influence the way Jordanians switch between dialects in daily conversation.",
      },
      {
        word: "morphosyntax",
        arabic: "\u0627\u0644\u0635\u0631\u0641 \u0648\u0627\u0644\u0646\u062d\u0648",
        example: "Morphosyntax examines the interplay between a language\u2019s word formation processes and the rules that govern how words combine into meaningful sentences.",
      },
      {
        word: "presupposition",
        arabic: "\u0627\u0641\u062a\u0631\u0627\u0636 \u0645\u0633\u0628\u0642",
        example: "The question \u2018Why did you stop supporting the charitable initiative?\u2019 carries the presupposition that the listener once supported it \u2014 a strategy sometimes used in debates to frame the discussion.",
      },
      {
        word: "utterance",
        arabic: "\u0645\u0642\u0637\u0639 \u0643\u0644\u0627\u0645\u064a",
        example: "An utterance is not merely a grammatical sentence; it is a spoken act produced within a specific social setting, shaped by the speaker\u2019s intentions and the listener\u2019s expectations.",
      },
      {
        word: "corpus linguistics",
        arabic: "\u0644\u063a\u0648\u064a\u0627\u062a \u0627\u0644\u0645\u062c\u0645\u0648\u0639\u0627\u062a \u0627\u0644\u0646\u0635\u064a\u0629",
        example: "Corpus linguistics allows researchers to analyze millions of naturally occurring sentences, revealing patterns of usage that intuition alone could never detect.",
      },
      {
        word: "phonological awareness",
        arabic: "\u0627\u0644\u0648\u0639\u064a \u0627\u0644\u0641\u0648\u0646\u0648\u0644\u0648\u062c\u064a (\u0627\u0644\u0635\u0648\u062a\u064a)",
        example: "Research in second-language acquisition has shown that strong phonological awareness in the mother tongue significantly facilitates the learning of additional languages.",
      },
      {
        word: "semantics",
        arabic: "\u0639\u0644\u0645 \u0627\u0644\u062f\u0644\u0627\u0644\u0629 (\u0627\u0644\u0645\u0639\u0646\u0649)",
        example: "While semantics focuses on the inherent meaning encoded in words and sentences, pragmatics extends the study to how those meanings shift depending on who is speaking, to whom, and under what circumstances.",
      },
    ],
  },
];

// ─── BUILD VOCAB TABLE ───

function buildVocabTable(vocabEntry) {
  const { words, accent, headerBg, borderC } = vocabEntry;

  const headerRow = new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: [
      { label: "#", w: 6 },
      { label: "Word", w: 22 },
      { label: "Arabic", w: 24 },
      { label: "Example Sentence", w: 48 },
    ].map((col) =>
      new TableCell({
        width: { size: col.w, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: headerBg },
        borders: thinBs(borderC),
        margins: { top: 60, bottom: 60, left: 100, right: 100 },
        children: [
          new Paragraph({
            alignment: col.label === "Example Sentence" ? AlignmentType.LEFT : AlignmentType.CENTER,
            spacing: { before: 0, after: 0, line: 360 },
            children: [
              new TextRun({
                text: col.label,
                bold: true,
                size: 20,
                font: { ascii: fontHead, eastAsia: fontCN },
                color: accent,
              }),
            ],
          }),
        ],
      })
    ),
  });

  const dataRows = words.map((item, index) =>
    new TableRow({
      cantSplit: true,
      children: [
        // Number cell
        new TableCell({
          width: { size: 6, type: WidthType.PERCENTAGE },
          borders: thinBs("DDDDDD"),
          margins: { top: 50, bottom: 50, left: 80, right: 60 },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 0, after: 0, line: 360 },
              children: [
                new TextRun({
                  text: `${index + 1}`,
                  size: 20,
                  font: { ascii: fontEN, eastAsia: fontCN },
                  color: "888888",
                }),
              ],
            }),
          ],
        }),
        // Word cell
        new TableCell({
          width: { size: 22, type: WidthType.PERCENTAGE },
          borders: thinBs("DDDDDD"),
          margins: { top: 50, bottom: 50, left: 100, right: 80 },
          children: [
            new Paragraph({
              alignment: AlignmentType.LEFT,
              spacing: { before: 0, after: 0, line: 360 },
              children: [
                new TextRun({
                  text: item.word,
                  bold: true,
                  size: 21,
                  font: { ascii: fontEN, eastAsia: fontCN },
                  color: accent,
                }),
              ],
            }),
          ],
        }),
        // Arabic translation cell
        new TableCell({
          width: { size: 24, type: WidthType.PERCENTAGE },
          borders: thinBs("DDDDDD"),
          margins: { top: 50, bottom: 50, left: 100, right: 80 },
          children: [
            new Paragraph({
              alignment: AlignmentType.LEFT,
              spacing: { before: 0, after: 0, line: 360 },
              children: [
                new TextRun({
                  text: item.arabic,
                  size: 21,
                  font: { ascii: fontEN, eastAsia: fontCN },
                  color: C.body,
                }),
              ],
            }),
          ],
        }),
        // Example sentence cell
        new TableCell({
          width: { size: 48, type: WidthType.PERCENTAGE },
          borders: thinBs("DDDDDD"),
          margins: { top: 50, bottom: 50, left: 100, right: 100 },
          children: [
            new Paragraph({
              alignment: AlignmentType.LEFT,
              spacing: { before: 0, after: 0, line: 360 },
              children: [
                new TextRun({
                  text: item.example,
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
    columnWidths: [600, 2200, 2400, 4800],
    rows: [headerRow, ...dataRows],
  });
}

// ─── BUILD SECTION ───

function buildVocabSection(entry, index) {
  const children = [];

  // Level badge
  children.push(
    new Paragraph({
      spacing: { before: index === 0 ? 200 : 500, after: 60, line: 360 },
      alignment: AlignmentType.LEFT,
      children: [
        new TextRun({
          text: `CEFR ${entry.level}  \u2014  ${entry.levelLabel}`,
          bold: true,
          size: 20,
          font: { ascii: fontHead, eastAsia: fontCN },
          color: entry.accent,
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
          text: entry.title,
          bold: true,
          size: 32,
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
          text: entry.theme,
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
      borders: {
        bottom: { style: BorderStyle.SINGLE, size: 3, color: entry.accent },
      },
      children: [],
    })
  );

  // Table
  children.push(buildVocabTable(entry));

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
          text: "Vocabulary Lists",
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
          text: "Jordanian ESL Learner Series",
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
          text: "Levels: A1  \u2022  B2  \u2022  C2  |  10 Words per Level  |  30 Words Total",
          size: 18,
          font: { ascii: fontEN, eastAsia: fontCN },
          color: "888888",
        }),
      ],
    })
  );

  // Instructions
  allChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 60, after: 200, line: 360 },
      children: [
        new TextRun({
          text: "Each word includes its Arabic translation and a culturally relevant example sentence. Practice using each word in your own sentences.",
          size: 18,
          font: { ascii: fontEN, eastAsia: fontCN },
          color: "666666",
        }),
      ],
    })
  );

  // All sections
  vocabLists.forEach((entry, index) => {
    allChildren.push(...buildVocabSection(entry, index));
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
            margin: { top: 1440, bottom: 1440, left: 1300, right: 1300 },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "Vocabulary Lists \u2014 Jordanian ESL Learner Series",
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
  fs.writeFileSync("/home/z/my-project/download/ESL_Vocabulary_Lists.docx", buffer);
  console.log("Vocabulary Lists document generated successfully.");
}

main().catch(console.error);
