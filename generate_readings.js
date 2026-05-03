const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, PageNumber, AlignmentType, BorderStyle, ShadingType,
  WidthType, SectionType, HeadingLevel,
} = require("docx");
const fs = require("fs");

// ─── Color Palette (Exam/Educational: clean black/white/grey) ───
const C = {
  title: "000000",
  body: "000000",
  section: "222222",
  subtitle: "555555",
  accent: "1a6b3c",
  vocabHighlight: "1a6b3c",
  lightGrey: "F5F5F5",
  borderGrey: "DDDDDD",
  headerGrey: "999999",
};

// ─── Font Config ───
const fontEN = "Times New Roman";
const fontCN = "SimSun";
const fontHeading = "Calibri";

// ─── Border Helpers ───
const NB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const NBs = { top: NB, bottom: NB, left: NB, right: NB };
const thinB = (c = "DDDDDD") => ({ style: BorderStyle.SINGLE, size: 1, color: c });
const thinBs = (c = "DDDDDD") => ({ top: thinB(c), bottom: thinB(c), left: thinB(c), right: thinB(c) });

// ─── Helpers ───
function emptyLine(h = 100) {
  return new Paragraph({ spacing: { before: h, after: 0 }, children: [] });
}

// ─── PASSAGE DATA ───

const passages = [
  // ═══════════════════════════════════════════════════════════
  // PASSAGE 1: A2 — Fitness & Studying at an Amman Gym
  // ═══════════════════════════════════════════════════════════
  {
    level: "A2",
    levelLabel: "Elementary",
    title: "Study Hard, Train Hard",
    subtitle: "A Daily Reading Passage",
    theme: "Balancing Studying with Fitness in Amman",
    vocabWords: ["routine", "resistance training", "bicep curls", "focused", "progress"],
    vocabList: [
      { word: "routine", translation: "\u0631\u0648\u062a\u064a\u0646 \u064a\u0648\u0645\u064a", example: "Ahmad follows the same routine every morning before class." },
      { word: "resistance training", translation: "\u062a\u062f\u0631\u064a\u0628\u0627\u062a \u0627\u0644\u0645\u0642\u0627\u0648\u0645\u0629", example: "Resistance training helps build strong muscles over time." },
      { word: "bicep curls", translation: "\u0639\u0645\u0644 \u0627\u0644\u0639\u0636\u0644\u0629 \u0627\u0644\u0628\u0627\u0626\u0646\u0629 \u0628\u0627\u0644\u062f\u0645\u0628\u0644", example: "She does three sets of bicep curls with light weights." },
      { word: "focused", translation: "\u0645\u0631\u0643\u0632", example: "After his workout, Fadi feels more focused when he studies." },
      { word: "progress", translation: "\u062a\u0642\u062f\u0645", example: "If you keep going to the gym, you will see progress in a few weeks." },
    ],
    paragraphs: [
      `Ahmad is a twenty-year-old student at Al al-Bayt University in Mafraq. Five days a week, he wakes up early, prays Fajr, and gets ready for his day. But Ahmad has a special part of his morning that most of his classmates do not know about. Before he opens a single textbook, he puts on his sports clothes, fills his water bottle, and walks to a small gym near his apartment in Sweifieh, Amman. It takes him about fifteen minutes on foot, and he enjoys the cool morning air before the city gets busy.`,
      [
        { text: `Ahmad's ` },
        { text: `routine`, bold: true },
        { text: ` at the gym is simple but effective. He starts with ten minutes of stretching to warm up his body. Then he moves on to ` },
        { text: `resistance training`, bold: true },
        { text: `, which uses bands and light dumbbells to make his muscles work harder. His favorite exercise is ` },
        { text: `bicep curls`, bold: true },
        { text: `. He uses eight-kilogram weights and does three sets of twelve repetitions. "I started with three kilograms," Ahmad says with a smile. "Now my arms are much stronger, and I can carry my heavy backpack to campus without any pain."` },
      ],
      `After the gym, Ahmad goes home, showers, and eats a healthy breakfast. His mother always prepares labneh, olives, and fresh bread for him. He drinks a large glass of milk and sometimes eats a banana for extra energy. Then he sits at his desk and studies for three to four hours. Ahmad believes that his morning workout helps him think more clearly. "When I exercise before I study, I feel more awake and ready to learn. My grades got better after I started going to the gym regularly," he explains.`,
      [
        { text: `Ahmad's friends have noticed the positive change in him. His classmate Omar joined the gym last month, and they train together on Saturdays. "It is easier when you have a friend with you," Omar says. "Ahmad taught me how to do ` },
        { text: `bicep curls`, bold: true },
        { text: ` correctly, and now I am already seeing ` },
        { text: `progress`, bold: true },
        { text: `." Ahmad's advice to other students is simple: "You do not need to spend hours at the gym. Even thirty minutes of exercise can make a big difference. Start small, stay ` },
        { text: `focused`, bold: true },
        { text: `, and be patient. Your body and your mind will thank you."` },
      ],
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // PASSAGE 2: B1 — Stage Fright at University of Jordan
  // ═══════════════════════════════════════════════════════════
  {
    level: "B1",
    levelLabel: "Intermediate",
    title: "Finding Her Voice",
    subtitle: "A Daily Reading Passage",
    theme: "Overcoming Stage Fright in a Public Speaking Course at the University of Jordan",
    vocabWords: ["stage fright", "persuasive", "confidently", "breakthrough", "audience"],
    vocabList: [
      { word: "stage fright", translation: "\u0631\u0647\u0628\u0629 \u0627\u0644\u0645\u0633\u0631\u062d", example: "Many people experience stage fright before speaking in front of a crowd." },
      { word: "persuasive", translation: "\u0645\u0642\u0646\u0639", example: "A persuasive speech gives strong reasons that make people agree with your opinion." },
      { word: "confidently", translation: "\u0628\u062b\u0642\u0629", example: "She answered the interviewer's questions confidently and got the job." },
      { word: "breakthrough", translation: "\u0627\u0646\u062a\u0635\u0627\u0631 / \u062e\u0637\u0648\u0629 \u0645\u0647\u0645\u0629", example: "After months of practice, learning that new skill was a real breakthrough for him." },
      { word: "audience", translation: "\u062c\u0645\u0647\u0648\u0631", example: "The speaker looked at her audience and smiled before she began talking." },
    ],
    paragraphs: [
      `Layla had always been a quiet student. Throughout her first two years at the University of Jordan, she sat in the back rows of her lecture halls, took careful notes, and rarely raised her hand. When her academic advisor suggested she take Essentials of Public Speaking as an elective, Layla's first reaction was fear. The thought of standing in front of thirty people and talking made her stomach turn. She had experienced severe stage fright ever since she was a child. In school presentations in Irbid, her voice would shake, her hands would tremble, and her mind would go completely blank.`,
      [
        { text: `But Layla needed this course to graduate. During the first few weeks, she struggled. Her classmates seemed natural in front of the room. Some were funny, some were bold, and some were very ` },
        { text: `persuasive`, bold: true },
        { text: `. Layla, on the other hand, could barely introduce herself without stumbling over her words. Her professor, Dr. Hana, noticed her difficulty and asked her to stay after class one afternoon. "Public speaking is not a talent you are born with," Dr. Hana told her. "It is a skill, and like any skill, it improves with practice. I want you to prepare a short speech about something you truly care about. Something real."` },
      ],
      `Layla thought about Dr. Hana's words for days. What did she truly care about? The answer came to her during a family dinner in Al Hashemiyyeh, Irbid. Her grandmother was telling stories about their family's olive groves near Nablus, before the occupation changed everything. Layla listened as her grandmother described the deep green hills, the sound of the wind through the olive branches, and the smell of fresh olive oil that filled every kitchen. Her grandmother's eyes shone with a mixture of pride and sadness. Layla realized that she wanted to share this story \u2014 not just her family's story, but the story of Palestinian connection to the land that runs through generations.`,
      [
        { text: `She spent two weeks writing and rewriting her speech. She practiced in front of her mirror, in her bedroom, and even recorded herself on her phone. She spoke about the olive trees of Palestine as a symbol of ` },
        { text: `Sumud`, bold: true, italics: true },
        { text: ` \u2014 steadfastness \u2014 and how her grandmother carried that strength to Jordan. She spoke about how the olive harvest brought families together, how children learned patience and hard work under the autumn sun, and how every jar of olive oil in a Palestinian home held decades of memory. On the day of the final presentation, Layla walked to the front of the classroom. Her heart was beating fast, but she took a deep breath, looked at her ` },
        { text: `audience`, bold: true },
        { text: `, and began to speak ` },
        { text: `confidently`, bold: true },
        { text: `.` },
      ],
      [
        { text: `Something remarkable happened. As Layla spoke, her voice grew stronger and steadier. She was no longer just a nervous student giving a presentation \u2014 she was sharing a piece of her heart. When she finished, the room was completely silent for a moment. Then her classmates began to clap. Some of them had tears in their eyes. Dr. Hana smiled and said, "Layla, that was not just a speech. That was a ` },
        { text: `breakthrough`, bold: true },
        { text: `." Layla walked out of the classroom that day feeling lighter than she had in years. She had not only conquered her ` },
        { text: `stage fright`, bold: true },
        { text: ` \u2014 she had found her voice.` },
      ],
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // PASSAGE 3: B2 — Road Trip from Irbid to Aqaba
  // ═══════════════════════════════════════════════════════════
  {
    level: "B2",
    levelLabel: "Upper Intermediate",
    title: "From Green North to Red South",
    subtitle: "A Daily Reading Passage",
    theme: "A Family Road Trip from Irbid to Aqaba in a New Toyota Land Cruiser",
    vocabWords: ["sweeping", "barren", "canyon", "breathtaking", "milestone"],
    vocabList: [
      { word: "sweeping", translation: "\u0648\u0627\u0633\u0639 / \u064a\u0645\u062a\u062f \u0644\u0644\u0623\u0641\u0642", example: "The sweeping desert views from the highway made everyone in the car fall silent." },
      { word: "barren", translation: "\u0642\u0627\u062d\u0644", example: "At first glance, the desert appeared barren, but closer inspection revealed small plants and animal tracks." },
      { word: "canyon", translation: "\u0648\u0627\u062f\u064a \u0639\u0645\u064a\u0642", example: "Wadi Mujib is a spectacular canyon that cuts through the mountains east of the Dead Sea." },
      { word: "breathtaking", translation: "\u0631\u0627\u0626\u0639", example: "The sunset over the Wadi Rum sandstone formations was truly breathtaking." },
      { word: "milestone", translation: "\u0645\u0631\u062d\u0644\u0629 \u0645\u0647\u0645\u0629 / \u062d\u062f\u062b \u0644\u0627 \u064a\u064f\u0646\u0633\u0649", example: "Reaching Aqaba safely was a milestone the family would talk about for years." },
    ],
    paragraphs: [
      [
        { text: `The Al-Rashid family had been planning this trip for months. Abu Fadi had finally purchased a brand-new Toyota Land Cruiser \u2014 a silver 2025 model with leather seats, a large sunroof, and enough space to comfortably seat seven passengers. For his wife Umm Fadi, who had spent years packing school lunches and driving the children to and from their schools in Irbid, this was more than just a new car. It was a promise: a promise that the family would finally take the road trip they had dreamed about since the children were small. On a cool Friday morning in late October, with the car packed with home-cooked food, blankets, and plenty of Arabic coffee in a thermos, the family set off from their home in Irbid, heading south toward Aqaba.` },
      ],
      [
        { text: `The first hour of the journey was familiar territory. They drove through the green, rolling hills of northern Jordan, passing through Jerash and then Ajloun, where the pine forests lined both sides of the road. The children \u2014 Fadi, twelve, and his younger sister Lina, nine \u2014 pressed their faces against the windows and pointed at the olive groves that stretched across the valleys. Abu Fadi drove ` },
        { text: `steadily`, bold: true },
        { text: `, explaining to the children that the olive trees they were seeing were the same kind their grandfather had tended to in the family village near Nablus before coming to Jordan. "Every olive tree you see," he told them, "is a sign of patience and hope. They live for hundreds of years."` },
      ],
      [
        { text: `As they descended toward the Jordan Valley, the landscape began to change dramatically. The green fields gradually gave way to rocky, brown hillsides, and the temperature climbed noticeably. They passed through Salt, then drove alongside the Dead Sea, where the water shimmered like liquid silver under the midday sun. The children were fascinated by the fact that nothing could live in the water \u2014 no fish, no plants, only salt. From there, the highway climbed into the mountains of Karak, where the air cooled again and the ` },
        { text: `sweeping`, bold: true },
        { text: ` views of the valleys below took everyone's breath away. Karak Castle appeared on the horizon, its ancient stone walls standing firm against the sky, a reminder of centuries of history carved into the land.` },
      ],
      [
        { text: `South of Karak, the transformation was even more dramatic. The mountains gave way to vast, open desert \u2014 a landscape that at first appeared almost ` },
        { text: `barren`, bold: true },
        { text: `, but slowly revealed its own kind of beauty. The road stretched straight ahead like a grey ribbon cutting through red sand and scattered rock formations. Abu Fadi pointed out Wadi Mujib in the distance, a deep ` },
        { text: `canyon`, bold: true },
        { text: ` that carved its way through the mountains and emptied into the Dead Sea. "That is one of the lowest nature reserves in the world," he explained. Lina asked if they could visit it one day, and Abu Fadi promised they would return in the spring, when the water level would be high enough to hike through the gorge.` },
      ],
      [
        { text: `As they approached Wadi Rum, the desert turned a deep, burnt red. Towering sandstone cliffs rose on both sides of the road, sculpted by thousands of years of wind into shapes that looked almost human \u2014 arches, pillars, and bridges of rock reaching toward the pale blue sky. The family stopped at a roadside rest area, where a Bedouin man served them sweet tea and fresh dates under a simple tent. "This is our land," he said with quiet pride, gesturing toward the horizon. "Every rock here has a story." The children ran between the formations, their laughter echoing off the ancient stone walls while Abu Fadi and Umm Fadi sat together in silence, watching the sunset paint the desert in shades of gold, orange, and deep crimson. It was, without question, ` },
        { text: `breathtaking`, bold: true },
        { text: `.` },
      ],
      [
        { text: `They reached Aqaba just after Maghrib prayer. The city lights were reflecting on the calm waters of the Red Sea, and a warm breeze carried the scent of salt and grilling fish from the nearby restaurants. Abu Fadi parked the Land Cruiser at their hotel, turned off the engine, and sat quietly for a moment. Four hundred and thirty kilometers. From the green hills of Irbid to the red mountains of Wadi Rum to the blue waters of Aqaba \u2014 all of Jordan in a single day. Umm Fadi placed her hand on his arm and smiled. "This was worth the wait," she said softly. For the Al-Rashid family, this road trip was not just a holiday. It was a ` },
        { text: `milestone`, bold: true },
        { text: ` \u2014 a memory they would carry with them like the olive oil their grandparents once pressed, rich with meaning and meant to last a lifetime.` },
      ],
    ],
  },
];

// ─── BUILD DOCUMENT ───

function buildParagraphs(passage) {
  const children = [];

  passage.paragraphs.forEach((para) => {
    if (typeof para === "string") {
      // Simple string paragraph
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
    } else {
      // Array of runs with potential bold/italic
      children.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          indent: { firstLine: 480 },
          spacing: { before: 80, after: 80, line: 360 },
          children: para.map((run) => {
            const runObj = {
              text: run.text,
              size: 24,
              font: { ascii: fontEN, eastAsia: fontCN },
              color: run.bold ? C.vocabHighlight : C.body,
            };
            if (run.bold) runObj.bold = true;
            if (run.italics) runObj.italics = true;
            return new TextRun(runObj);
          }),
        })
      );
    }
  });

  return children;
}

function buildVocabTable(vocabList) {
  const headerRow = new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: [
      { text: "Word", width: 22 },
      { text: "Arabic Translation", width: 25 },
      { text: "Example Sentence", width: 53 },
    ].map((col) =>
      new TableCell({
        width: { size: col.width, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: "E8F5E9" },
        borders: thinBs("BBBBBB"),
        margins: { top: 60, bottom: 60, left: 100, right: 100 },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 0, line: 360 },
            children: [
              new TextRun({
                text: col.text,
                bold: true,
                size: 21,
                font: { ascii: fontEN, eastAsia: fontCN },
                color: C.section,
              }),
            ],
          }),
        ],
      })
    ),
  });

  const dataRows = vocabList.map((item) =>
    new TableRow({
      cantSplit: true,
      children: [
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
                  color: C.accent,
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 25, type: WidthType.PERCENTAGE },
          borders: thinBs("DDDDDD"),
          margins: { top: 50, bottom: 50, left: 100, right: 80 },
          children: [
            new Paragraph({
              alignment: AlignmentType.LEFT,
              spacing: { before: 0, after: 0, line: 360 },
              children: [
                new TextRun({
                  text: item.translation,
                  size: 21,
                  font: { ascii: fontEN, eastAsia: fontCN },
                  color: C.body,
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 53, type: WidthType.PERCENTAGE },
          borders: thinBs("DDDDDD"),
          margins: { top: 50, bottom: 50, left: 100, right: 80 },
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
                  color: "444444",
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
    columnWidths: [2200, 2500, 5300],
    rows: [headerRow, ...dataRows],
  });
}

function buildPassageSection(passage, sectionIndex) {
  const children = [];

  // Level badge + title block
  children.push(
    new Paragraph({
      spacing: { before: sectionIndex === 0 ? 200 : 500, after: 60, line: 360 },
      alignment: AlignmentType.LEFT,
      children: [
        new TextRun({
          text: `CEFR ${passage.level}  \u2014  ${passage.levelLabel}`,
          bold: true,
          size: 20,
          font: { ascii: fontHeading, eastAsia: fontCN },
          color: C.accent,
        }),
      ],
    })
  );

  children.push(
    new Paragraph({
      spacing: { before: 60, after: 40, line: 360, lineRule: "atLeast" },
      alignment: AlignmentType.LEFT,
      children: [
        new TextRun({
          text: passage.title,
          bold: true,
          size: 32,
          font: { ascii: fontHeading, eastAsia: fontCN },
          color: C.title,
        }),
      ],
    })
  );

  children.push(
    new Paragraph({
      spacing: { before: 0, after: 60, line: 360 },
      alignment: AlignmentType.LEFT,
      children: [
        new TextRun({
          text: passage.theme,
          italics: true,
          size: 20,
          font: { ascii: fontEN, eastAsia: fontCN },
          color: C.subtitle,
        }),
      ],
    })
  );

  // Thin green accent line
  children.push(
    new Paragraph({
      spacing: { before: 0, after: 200 },
      borders: {
        bottom: { style: BorderStyle.SINGLE, size: 3, color: C.accent },
      },
      children: [],
    })
  );

  // Reading passage body
  children.push(...buildParagraphs(passage));

  // Spacer before vocabulary
  children.push(emptyLine(200));

  // Vocabulary heading
  children.push(
    new Paragraph({
      spacing: { before: 200, after: 120, line: 360 },
      alignment: AlignmentType.LEFT,
      children: [
        new TextRun({
          text: "Target Vocabulary",
          bold: true,
          size: 24,
          font: { ascii: fontHeading, eastAsia: fontCN },
          color: C.section,
        }),
      ],
    })
  );

  // Vocabulary table
  children.push(buildVocabTable(passage.vocabList));

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
          text: "Daily Reading Passages",
          bold: true,
          size: 36,
          font: { ascii: fontHeading, eastAsia: fontCN },
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
          text: "Levels: A2  \u2022  B1  \u2022  B2  |  Estimated Read Time: 3 minutes each",
          size: 18,
          font: { ascii: fontEN, eastAsia: fontCN },
          color: "888888",
        }),
      ],
    })
  );

  // Instruction line
  allChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 60, after: 200, line: 360 },
      children: [
        new TextRun({
          text: "Instructions: Read each passage carefully. Target vocabulary words are highlighted in ",
          size: 18,
          font: { ascii: fontEN, eastAsia: fontCN },
          color: "666666",
        }),
        new TextRun({
          text: "green bold",
          bold: true,
          size: 18,
          font: { ascii: fontEN, eastAsia: fontCN },
          color: C.accent,
        }),
        new TextRun({
          text: " throughout the text. Refer to the vocabulary table below each passage for definitions and example sentences.",
          size: 18,
          font: { ascii: fontEN, eastAsia: fontCN },
          color: "666666",
        }),
      ],
    })
  );

  // All three passage sections
  passages.forEach((passage, index) => {
    allChildren.push(...buildPassageSection(passage, index));
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
                    text: "Daily Reading Passages \u2014 Jordanian ESL Learner Series",
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
  fs.writeFileSync(
    "/home/z/my-project/download/ESL_Daily_Reading_Passages.docx",
    buffer
  );
  console.log("Daily Reading Passages document generated successfully.");
}

main().catch(console.error);
