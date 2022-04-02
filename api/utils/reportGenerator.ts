export function reportGenerator(data) {
  var PdfPrinter = require("pdfmake");
  var fonts = {
    THSarabun: {
      normal: "api/utils/fonts/THSarabunNew.ttf",
      bold: "api/utils/fonts/THSarabunNew-Bold.ttf",
      italics: "api/utils/fonts/THSarabunNew-Italic.ttf",
      bolditalics: "api/utils/fonts/THSarabunNew-BoldItalic.ttf",
    },
  };

  var printer = new PdfPrinter(fonts);

  var docDefinition = {
    content: [
      {
        style: "firstHeader",
        table: {
          widths: ["*"],
          body: [["มคอ.5 ผลการดำเนินงานของรายวิชา"]],
        },
      },
      {
        style: "universityInfo",
        table: {
          widths: [150, "*"],
          body: [
            [
              { text: "ชื่อสถาบันอุดมศึกษา", style: "textBold" },
              data.university,
            ],
            [
              { text: "คณะ/วิทยาเขต/วิทยาลัย", style: "textBold" },
              data.faculty,
            ],
            [{ text: "ภาควิชา", style: "textBold" }, data.department],
          ],
        },
        layout: "noBorders",
        margin: [4, 8, 0, 8],
      },
      {
        style: "topicHeader",
        table: {
          widths: ["*"],
          body: [["หมวดที่ 1 ข้อมูลทั่วไป"]],
        },
      },
      {
        style: "courseInfo",
        table: {
          widths: ["*"],
          body: [
            [
              {
                table: {
                  widths: [90, "*"],
                  body: [
                    [
                      { text: "1. รหัสวิชา", style: "textBold" },
                      data.course_id,
                    ],
                    [
                      {
                        text: "ชื่อวิชา",
                        style: "textBold",
                        margin: [12, 0, 0, 0],
                      },
                      data.course_name_th,
                    ],
                    [
                      {
                        text: "Course Name",
                        style: "textBold",
                        margin: [12, 0, 0, 0],
                      },
                      data.course_name_en,
                    ],
                  ],
                },
                layout: "noBorders",
                margin: [4, 0, 0, 0],
              },
            ],
          ],
        },
        margin: [0, 8, 0, 2],
      },
      {
        text: "2. อาจารย์ผู้รับผิดชอบรายวิชาและอาจารย์ผู้สอน",
        style: "textBold",
        margin: [6, 8, 0, 0],
      },
      {
        separator: ") ",
        ol: data.teachers,
        margin: [32, 0, 0, 0],
      },
      {
        text: "3. ภาคการศึกษา/ชั้นปีที่เรียน",
        style: "textBold",
        margin: [6, 8, 0, 0],
      },
      {
        text: ["ภาคการศึกษา ", data.semester],
        margin: [32, 0, 0, 0],
      },
      {
        text: "4. รายวิชาที่ต้องเรียนมาก่อน (Prerequisite) (ถ้ามี)",
        style: "textBold",
        margin: [6, 8, 0, 0],
      },
      {
        text: [data.prerequisite || "ไม่มี"],
        margin: [32, 0, 0, 0],
      },
      {
        text: "5. สถานที่เรียน",
        style: "textBold",
        margin: [6, 8, 0, 0],
      },
      {
        ul: data.campus,
        margin: [32, 0, 0, 0],
      },
      {
        style: "topicHeader",
        table: {
          widths: ["*"],
          body: [["หมวดที่ 2 ผลการจัดการเรียนการสอนของรายวิชา"]],
        },
        pageBreak: "before",
      },
      {
        text: "1. การกระจายของระดับคะแนน (Grade Distribution)",
        style: "textBold",
        margin: [24, 8, 0, 0],
      },
      {
        style: ["textCenter"],
        table: {
          widths: ["*", "*", "*", "*", "*", "*", "*", "*"],
          body: [
            [
              { text: "A", style: "textBold" },
              { text: "B+", style: "textBold" },
              { text: "B", style: "textBold" },
              { text: "C+", style: "textBold" },
              { text: "C", style: "textBold" },
              { text: "D+", style: "textBold" },
              { text: "D", style: "textBold" },
              { text: "F", style: "textBold" },
            ],
            [
              data.grades.a,
              data.grades.bp,
              data.grades.b,
              data.grades.cp,
              data.grades.c,
              data.grades.dp,
              data.grades.d,
              data.grades.f,
            ],
          ],
        },
        margin: [4, 0, 0, 8],
        layout: {
          fillColor: function (rowIndex) {
            return rowIndex === 0 ? "#f1f1f1" : null;
          },
        },
      },
      {
        text: "2. การปรับปรุงการเรียนการสอนจากตามที่เสนอในรายงานของรายวิชาครั้งที่ผ่านมา",
        style: "textBold",
        margin: [24, 8, 0, 0],
      },
      data.improveFromLast.map((ele) => {
        return {
          text: "- " + ele,
          margin: [32, 0, 0, 0],
        };
      }),
      {
        text: "3. ผลการเรียนรู้และการประเมินผล",
        style: "textBold",
        margin: [24, 8, 0, 0],
      },
      {
        table: {
          widths: [120, "*", 80, "auto", "auto", "auto"],
          headerRows: 1,
          dontBreakRows: true,
          keepWithHeaderRows: 1,
          body: [
            [
              { text: "ผลการเรียนรู้", style: "textCenter" },
              {
                text: "ข้อบ่งชี้ผลการเรียนรู้ (บรรลุผลการเรียนรู้เมื่อนักศึกษาไม่น้อยกว่า 70% สามารถทำได้หรือผิดเล็กน้อย)",
                style: "textCenter",
              },
              { text: "ผลการประเมิน\nผลการเรียนรู้", style: "textCenter" },
              { text: "บรรลุ", style: "textCenter" },
              { text: "มคอ.2", style: "textCenter" },
              { text: "PLO", style: "textCenter" },
            ],
            ...data.results.map((ele) => {
              return [
                ele.order_number + " " + ele.detail,
                ele.activities.map((ele) => {
                  return `${ele.title} (${ele.sub_activities.map(
                    (item) => item.detail
                  )})`;
                }),
                ele.activities.map((ele) => `${ele.percent}%`),
                { text: ele.isPassed ? "Y" : "N", style: "textCenter" },
                ele.main_sub_standards.map((ele) => ({
                  text: ele,
                  style: "textCenter",
                })),
                ele.relative_sub_standards.map((ele) => ({
                  text: ele,
                  style: "textCenter",
                })),
              ];
            }),
          ],
        },
        margin: [4, 0, 0, 8],
        layout: {
          fillColor: function (rowIndex) {
            return rowIndex === 0 ? "#f1f1f1" : null;
          },
        },
      },
      {
        style: "topicHeader",
        table: {
          widths: ["*"],
          body: [["หมวดที่ 3 การวิเคราะห์และแผนการปรับปรุง"]],
        },
        pageBreak: "before",
      },
      {
        text: "1. ข้อควรปรับปรุงสำหรับการสอนครั้งต่อไป",
        style: "textBold",
        margin: [24, 16, 0, 8],
      },
      data.improvements.map((ele) => {
        return [
          {
            table: {
              widths: [140, "*"],
              headerRows: 2,
              dontBreakRows: true,
              keepWithHeaderRows: 2,
              body: [
                [
                  {
                    colSpan: 2,
                    border: [false, false, false, false],
                    text: "หัวข้อ : " + ele.title,
                  },
                  "",
                ],
                [
                  { text: "รายละเอียด", style: "textCenter" },
                  {
                    text: "แสดงรายละเอียดของการปรับปรุง",
                    style: "textCenter",
                  },
                ],
                ["ที่มา / เหตุผล", ele.reason.map((ele) => "- " + ele)],
                ["การดำเนินการ", ele.solution.map((ele) => "- " + ele)],
                ["การประเมินผล", ele.evaluation.map((ele) => "- " + ele)],
              ],
            },
            margin: [4, 4, 0, 8],
            layout: {
              fillColor: function (rowIndex) {
                return rowIndex === 1 ? "#f1f1f1" : null;
              },
            },
          },
        ];
      }),
      {
        style: ["textCenter", "sign"],
        table: {
          widths: ["auto", "auto"],
          body: [
            [
              "ลงชื่อ",
              ".........................................................",
            ],
            ["", "(" + data.teachers[0] + ")"],
            ["", "ผู้จัดทำ"],
            ["", data.reportDate],
          ],
        },
        margin: [270, 32, 0, 0],
        layout: "noBorders",
      },
      {
        style: "lastHeader",
        table: {
          widths: ["*"],
          body: [["การทวนสอบการประเมินผลการเรียนรู้"]],
        },
        pageBreak: "before",
      },
      {
        table: {
          widths: [248, 248],
          headerRows: 1,
          body: [
            [
              { text: "วิธีการทวนสอบ", style: "textCenter" },
              {
                text: "สรุปผล",
                style: "textCenter",
              },
            ],
            [
              data.assesment.map((ele) => "- " + ele),
              data.summary.map((ele) => "- " + ele),
            ],
          ],
        },
        margin: [0, 16, 0, 8],
        layout: {
          fillColor: function (rowIndex) {
            return rowIndex === 0 ? "#f1f1f1" : null;
          },
        },
      },
      {
        table: {
          widths: ["*", "*", "*"],
          headerRows: 2,
          // dontBreakRows: true,
          // keepWithHeaderRows: 1,
          body: [
            [
              ["\n\n\nประธานหลักสูตร"],
              ["\n\n\nกรรมการหลักสูตร"],
              ["\n\n\nกรรมการหลักสูตร"],
            ],
            [["\n\n\nกรรมการหลักสูตร"], ["\n\n\nกรรมการหลักสูตร"], ["\n\n\n"]],
          ],
        },
        margin: [0, 16, 0, 2],
      },
      {
        text: "(กรุณาเซ็นชื่อพร้อมลงชื่อกำกับ)",
        margin: [4, 0, 0, 0],
      },
    ],
    header: function (currentPage, pageCount, pageSize) {
      return [
        {
          text: currentPage !== 1 ? currentPage : "",
          alignment: "center",
          margin: [0, 16, 0, 0],
        },
        {
          canvas: [
            { type: "rect", x: 170, y: 32, w: pageSize.width - 170, h: 80 },
          ],
        },
      ];
    },
    defaultStyle: {
      font: "THSarabun",
      fontSize: 16,
    },
    styles: {
      firstHeader: {
        fontSize: 20,
        bold: true,
        color: "#fff",
        fillColor: "#000",
        alignment: "center",
      },
      topicHeader: {
        fontSize: 18,
        bold: true,
        fillColor: "#f1f1f1",
        alignment: "center",
      },
      lastHeader: {
        fontSize: 18,
        bold: true,
        color: "#ffffff",
        fillColor: "#a8a8a8",
        alignment: "center",
      },
      courseInfo: {
        fontSize: 16,
      },
      textBold: {
        bold: true,
      },
      textCenter: {
        alignment: "center",
      },
      sign: { lineHeight: 0.5 },
      header: {
        fontSize: 18,
        bold: true,
      },
      bigger: {
        fontSize: 15,
        italics: true,
      },
    },
  };

  var pdfDoc = printer.createPdfKitDocument(docDefinition);

  return pdfDoc;
}
