import reportRepository from "_/repositories/report";
import { sendResponse } from "_/utils/response";
import { summaryService } from "_/services";
import { CommonError } from "_/errors/common";

import { Request, Response, NextFunction } from "express";

const reportData = {
  reportDate: new Date().toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }),
  university: "สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง",
  faculty: "วิศวกรรมศาสตร์",
  department: "วิศวกรรมคอมพิวเตอร์",
  course_id: "01076001",
  course_name_en: "Introduction to Computer Engineering",
  course_name_th: "วิศวกรรมคอมพิวเตอร์เบื้องต้น",
  teachers: ["ผศ. ธนา หงษ์สุวรรณ", "ดร. ธนัญชัย ตรีภาค"],
  semester: "1/2560",
  prerequisite: null,
  campus: ["สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง กรุงเทพมหานคร"],
  grades: {
    a: 10,
    bp: 15,
    b: 22,
    cp: 17,
    c: 10,
    dp: 4,
    d: 2,
    f: 0,
  },
  improveFromLast: [
    "เพิ่มเนื้อหา Trunkable เข้าไป",
    "ตัดเนื้อหาส่วน Computer System, Design Development Process",
    "เพิ่มรายละเอียดเนื้อหาในส่วนวงจรไฟฟ้า และ Analog and Digtal	เพื่อให้เข้าใจมากขึ้น",
    "เพิ่มโจทย์เกี่ยวกับวงจรไฟฟ้า",
  ],
  results: [
    {
      num: "1.1",
      title:
        "สามารถแปลงเลขระหว่างเลขฐาน 2 และฐาน 10 ทั้งคิดและไม่คิดเครื่องหมาย",
      works: ["Homework#1", "Final 2 ข้อ 1,2"],
      percent: [92, 86],
      isPass: true,
      tqf: ["2.1", "2.2"],
      plo: ["1.1", "1.2"],
    },
    {
      num: "1.1",
      title:
        "สามารถแปลงเลขระหว่างเลขฐาน 2 และฐาน 10 ทั้งคิดและไม่คิดเครื่องหมาย",
      works: ["Homework#1", "Final 2 ข้อ 1,2"],
      percent: [92, 86],
      isPass: true,
      tqf: ["2.1", "2.2"],
      plo: ["1.1", "1.2"],
    },
    {
      num: "1.1",
      title:
        "สามารถแปลงเลขระหว่างเลขฐาน 2 และฐาน 10 ทั้งคิดและไม่คิดเครื่องหมาย",
      works: ["Homework#1", "Final 2 ข้อ 1,2"],
      percent: [92, 86],
      isPass: true,
      tqf: ["2.1", "2.2"],
      plo: ["1.1", "1.2"],
    },
    {
      num: "1.1",
      title:
        "สามารถแปลงเลขระหว่างเลขฐาน 2 และฐาน 10 ทั้งคิดและไม่คิดเครื่องหมาย",
      works: ["Homework#1", "Final 2 ข้อ 1,2"],
      percent: [92, 86],
      isPass: true,
      tqf: ["2.1", "2.2"],
      plo: ["1.1", "1.2"],
    },
    {
      num: "1.1",
      title:
        "สามารถแปลงเลขระหว่างเลขฐาน 2 และฐาน 10 ทั้งคิดและไม่คิดเครื่องหมาย",
      works: ["Homework#1", "Final 2 ข้อ 1,2"],
      percent: [92, 86],
      isPass: true,
      tqf: ["2.1", "2.2"],
      plo: ["1.1", "1.2"],
    },
    {
      num: "1.1",
      title:
        "สามารถแปลงเลขระหว่างเลขฐาน 2 และฐาน 10 ทั้งคิดและไม่คิดเครื่องหมาย",
      works: ["Homework#1", "Final 2 ข้อ 1,2"],
      percent: [92, 86],
      isPass: true,
      tqf: ["2.1", "2.2"],
      plo: ["1.1", "1.2"],
    },
    {
      num: "1.1",
      title:
        "สามารถแปลงเลขระหว่างเลขฐาน 2 และฐาน 10 ทั้งคิดและไม่คิดเครื่องหมาย",
      works: ["Homework#1", "Final 2 ข้อ 1,2"],
      percent: [92, 86],
      isPass: true,
      tqf: ["2.1", "2.2"],
      plo: ["1.1", "1.2"],
    },
    {
      num: "1.1",
      title:
        "สามารถแปลงเลขระหว่างเลขฐาน 2 และฐาน 10 ทั้งคิดและไม่คิดเครื่องหมาย",
      works: ["Homework#1", "Final 2 ข้อ 1,2"],
      percent: [92, 86],
      isPass: true,
      tqf: ["2.1", "2.2"],
      plo: ["1.1", "1.2"],
    },
    {
      num: "1.1",
      title:
        "สามารถแปลงเลขระหว่างเลขฐาน 2 และฐาน 10 ทั้งคิดและไม่คิดเครื่องหมาย",
      works: ["Homework#1", "Final 2 ข้อ 1,2"],
      percent: [92, 86],
      isPass: true,
      tqf: ["2.1", "2.2"],
      plo: ["1.1", "1.2"],
    },
    {
      num: "1.1",
      title:
        "สามารถแปลงเลขระหว่างเลขฐาน 2 และฐาน 10 ทั้งคิดและไม่คิดเครื่องหมาย",
      works: ["Homework#1", "Final 2 ข้อ 1,2"],
      percent: [92, 86],
      isPass: true,
      tqf: ["2.1", "2.2"],
      plo: ["1.1", "1.2"],
    },
    {
      num: "1.1",
      title:
        "สามารถแปลงเลขระหว่างเลขฐาน 2 และฐาน 10 ทั้งคิดและไม่คิดเครื่องหมาย",
      works: ["Homework#1", "Final 2 ข้อ 1,2"],
      percent: [92, 86],
      isPass: true,
      tqf: ["2.1", "2.2"],
      plo: ["1.1", "1.2"],
    },
  ],
  improvements: [
    {
      title: "ปรับปรุง Learning Outcomes และข้อสอบ",
      reason: [
        "Learning Outcomes กับข้อสอบยังไม่สอดคล้องกันดี โดยบางส่วนของข้อสอบไม่ระบุใน Learning Outcomes",
      ],
      solution: [
        "ปรับปรุง Learning Outcomes สำหรับปีการศึกษาถัดไปให้สอดคล้องกับเนื้อหาที่สอนและข้อสอบ",
        "ปรับปรุงข้อสอบให้สามารถเก็บคะแนนเพื่อตรวจสอบ Outcomes ได้ง่ายยิ่งขึ้น",
      ],
      evaluation: ["ข้อสอบและ Learning Outcome มีความสอดคล้องกัน > 80%"],
    },
    {
      title: "ปรับปรุง Learning Outcomes และข้อสอบ",
      reason: [
        "Learning Outcomes กับข้อสอบยังไม่สอดคล้องกันดี โดยบางส่วนของข้อสอบไม่ระบุใน Learning Outcomes",
      ],
      solution: [
        "ปรับปรุง Learning Outcomes สำหรับปีการศึกษาถัดไปให้สอดคล้องกับเนื้อหาที่สอนและข้อสอบ",
        "ปรับปรุงข้อสอบให้สามารถเก็บคะแนนเพื่อตรวจสอบ Outcomes ได้ง่ายยิ่งขึ้น",
      ],
      evaluation: ["ข้อสอบและ Learning Outcome มีความสอดคล้องกัน > 80%"],
    },
    {
      title: "ปรับปรุง Learning Outcomes และข้อสอบ",
      reason: [
        "Learning Outcomes กับข้อสอบยังไม่สอดคล้องกันดี โดยบางส่วนของข้อสอบไม่ระบุใน Learning Outcomes",
      ],
      solution: [
        "ปรับปรุง Learning Outcomes สำหรับปีการศึกษาถัดไปให้สอดคล้องกับเนื้อหาที่สอนและข้อสอบ",
        "ปรับปรุงข้อสอบให้สามารถเก็บคะแนนเพื่อตรวจสอบ Outcomes ได้ง่ายยิ่งขึ้น",
      ],
      evaluation: ["ข้อสอบและ Learning Outcome มีความสอดคล้องกัน > 80%"],
    },
    {
      title: "ปรับปรุง Learning Outcomes และข้อสอบ",
      reason: [
        "Learning Outcomes กับข้อสอบยังไม่สอดคล้องกันดี โดยบางส่วนของข้อสอบไม่ระบุใน Learning Outcomes",
      ],
      solution: [
        "ปรับปรุง Learning Outcomes สำหรับปีการศึกษาถัดไปให้สอดคล้องกับเนื้อหาที่สอนและข้อสอบ",
        "ปรับปรุงข้อสอบให้สามารถเก็บคะแนนเพื่อตรวจสอบ Outcomes ได้ง่ายยิ่งขึ้น",
      ],
      evaluation: ["ข้อสอบและ Learning Outcome มีความสอดคล้องกัน > 80%"],
    },
    {
      title: "ปรับปรุง Learning Outcomes และข้อสอบ",
      reason: [
        "Learning Outcomes กับข้อสอบยังไม่สอดคล้องกันดี โดยบางส่วนของข้อสอบไม่ระบุใน Learning Outcomes",
      ],
      solution: [
        "ปรับปรุง Learning Outcomes สำหรับปีการศึกษาถัดไปให้สอดคล้องกับเนื้อหาที่สอนและข้อสอบ",
        "ปรับปรุงข้อสอบให้สามารถเก็บคะแนนเพื่อตรวจสอบ Outcomes ได้ง่ายยิ่งขึ้น",
      ],
      evaluation: ["ข้อสอบและ Learning Outcome มีความสอดคล้องกัน > 80%"],
    },
    {
      title: "ปรับปรุง Learning Outcomes และข้อสอบ",
      reason: [
        "Learning Outcomes กับข้อสอบยังไม่สอดคล้องกันดี โดยบางส่วนของข้อสอบไม่ระบุใน Learning Outcomes",
      ],
      solution: [
        "ปรับปรุง Learning Outcomes สำหรับปีการศึกษาถัดไปให้สอดคล้องกับเนื้อหาที่สอนและข้อสอบ",
        "ปรับปรุงข้อสอบให้สามารถเก็บคะแนนเพื่อตรวจสอบ Outcomes ได้ง่ายยิ่งขึ้น",
      ],
      evaluation: ["ข้อสอบและ Learning Outcome มีความสอดคล้องกัน > 80%"],
    },
    {
      title: "ปรับปรุง Learning Outcomes และข้อสอบ",
      reason: [
        "Learning Outcomes กับข้อสอบยังไม่สอดคล้องกันดี โดยบางส่วนของข้อสอบไม่ระบุใน Learning Outcomes",
      ],
      solution: [
        "ปรับปรุง Learning Outcomes สำหรับปีการศึกษาถัดไปให้สอดคล้องกับเนื้อหาที่สอนและข้อสอบ",
        "ปรับปรุงข้อสอบให้สามารถเก็บคะแนนเพื่อตรวจสอบ Outcomes ได้ง่ายยิ่งขึ้น",
      ],
      evaluation: ["ข้อสอบและ Learning Outcome มีความสอดคล้องกัน > 80%"],
    },
    {
      title: "ปรับปรุง Learning Outcomes และข้อสอบ",
      reason: [
        "Learning Outcomes กับข้อสอบยังไม่สอดคล้องกันดี โดยบางส่วนของข้อสอบไม่ระบุใน Learning Outcomes",
      ],
      solution: [
        "ปรับปรุง Learning Outcomes สำหรับปีการศึกษาถัดไปให้สอดคล้องกับเนื้อหาที่สอนและข้อสอบ",
        "ปรับปรุงข้อสอบให้สามารถเก็บคะแนนเพื่อตรวจสอบ Outcomes ได้ง่ายยิ่งขึ้น",
      ],
      evaluation: ["ข้อสอบและ Learning Outcome มีความสอดคล้องกัน > 80%"],
    },
    {
      title: "ปรับปรุง Learning Outcomes และข้อสอบ",
      reason: [
        "Learning Outcomes กับข้อสอบยังไม่สอดคล้องกันดี โดยบางส่วนของข้อสอบไม่ระบุใน Learning Outcomes",
      ],
      solution: [
        "ปรับปรุง Learning Outcomes สำหรับปีการศึกษาถัดไปให้สอดคล้องกับเนื้อหาที่สอนและข้อสอบ",
        "ปรับปรุงข้อสอบให้สามารถเก็บคะแนนเพื่อตรวจสอบ Outcomes ได้ง่ายยิ่งขึ้น",
      ],
      evaluation: ["ข้อสอบและ Learning Outcome มีความสอดคล้องกัน > 80%"],
    },
    {
      title: "ปรับปรุง Learning Outcomes และข้อสอบ",
      reason: [
        "Learning Outcomes กับข้อสอบยังไม่สอดคล้องกันดี โดยบางส่วนของข้อสอบไม่ระบุใน Learning Outcomes",
      ],
      solution: [
        "ปรับปรุง Learning Outcomes สำหรับปีการศึกษาถัดไปให้สอดคล้องกับเนื้อหาที่สอนและข้อสอบ",
        "ปรับปรุงข้อสอบให้สามารถเก็บคะแนนเพื่อตรวจสอบ Outcomes ได้ง่ายยิ่งขึ้น",
      ],
      evaluation: ["ข้อสอบและ Learning Outcome มีความสอดคล้องกัน > 80%"],
    },
    {
      title: "ปรับปรุง Learning Outcomes และข้อสอบ",
      reason: [
        "Learning Outcomes กับข้อสอบยังไม่สอดคล้องกันดี โดยบางส่วนของข้อสอบไม่ระบุใน Learning Outcomes",
      ],
      solution: [
        "ปรับปรุง Learning Outcomes สำหรับปีการศึกษาถัดไปให้สอดคล้องกับเนื้อหาที่สอนและข้อสอบ",
        "ปรับปรุงข้อสอบให้สามารถเก็บคะแนนเพื่อตรวจสอบ Outcomes ได้ง่ายยิ่งขึ้น",
      ],
      evaluation: ["ข้อสอบและ Learning Outcome มีความสอดคล้องกัน > 80%"],
    },
    {
      title: "ปรับปรุง Learning Outcomes และข้อสอบ",
      reason: [
        "Learning Outcomes กับข้อสอบยังไม่สอดคล้องกันดี โดยบางส่วนของข้อสอบไม่ระบุใน Learning Outcomes",
      ],
      solution: [
        "ปรับปรุง Learning Outcomes สำหรับปีการศึกษาถัดไปให้สอดคล้องกับเนื้อหาที่สอนและข้อสอบ",
        "ปรับปรุงข้อสอบให้สามารถเก็บคะแนนเพื่อตรวจสอบ Outcomes ได้ง่ายยิ่งขึ้น",
      ],
      evaluation: ["ข้อสอบและ Learning Outcome มีความสอดคล้องกัน > 80%"],
    },
    {
      title: "ปรับปรุง Learning Outcomes และข้อสอบ",
      reason: [
        "Learning Outcomes กับข้อสอบยังไม่สอดคล้องกันดี โดยบางส่วนของข้อสอบไม่ระบุใน Learning Outcomes",
      ],
      solution: [
        "ปรับปรุง Learning Outcomes สำหรับปีการศึกษาถัดไปให้สอดคล้องกับเนื้อหาที่สอนและข้อสอบ",
        "ปรับปรุงข้อสอบให้สามารถเก็บคะแนนเพื่อตรวจสอบ Outcomes ได้ง่ายยิ่งขึ้น",
      ],
      evaluation: ["ข้อสอบและ Learning Outcome มีความสอดคล้องกัน > 80%"],
    },
    {
      title: "ปรับปรุง Learning Outcomes และข้อสอบ",
      reason: [
        "Learning Outcomes กับข้อสอบยังไม่สอดคล้องกันดี โดยบางส่วนของข้อสอบไม่ระบุใน Learning Outcomes",
      ],
      solution: [
        "ปรับปรุง Learning Outcomes สำหรับปีการศึกษาถัดไปให้สอดคล้องกับเนื้อหาที่สอนและข้อสอบ",
        "ปรับปรุงข้อสอบให้สามารถเก็บคะแนนเพื่อตรวจสอบ Outcomes ได้ง่ายยิ่งขึ้น",
      ],
      evaluation: ["ข้อสอบและ Learning Outcome มีความสอดคล้องกัน > 80%"],
    },
    {
      title: "ปรับปรุง Learning Outcomes และข้อสอบ",
      reason: [
        "Learning Outcomes กับข้อสอบยังไม่สอดคล้องกันดี โดยบางส่วนของข้อสอบไม่ระบุใน Learning Outcomes",
      ],
      solution: [
        "ปรับปรุง Learning Outcomes สำหรับปีการศึกษาถัดไปให้สอดคล้องกับเนื้อหาที่สอนและข้อสอบ",
        "ปรับปรุงข้อสอบให้สามารถเก็บคะแนนเพื่อตรวจสอบ Outcomes ได้ง่ายยิ่งขึ้น",
      ],
      evaluation: ["ข้อสอบและ Learning Outcome มีความสอดคล้องกัน > 80%"],
    },
    {
      title: "ปรับปรุง Learning Outcomes และข้อสอบ",
      reason: [
        "Learning Outcomes กับข้อสอบยังไม่สอดคล้องกันดี โดยบางส่วนของข้อสอบไม่ระบุใน Learning Outcomes",
      ],
      solution: [
        "ปรับปรุง Learning Outcomes สำหรับปีการศึกษาถัดไปให้สอดคล้องกับเนื้อหาที่สอนและข้อสอบ",
        "ปรับปรุงข้อสอบให้สามารถเก็บคะแนนเพื่อตรวจสอบ Outcomes ได้ง่ายยิ่งขึ้น",
      ],
      evaluation: ["ข้อสอบและ Learning Outcome มีความสอดคล้องกัน > 80%"],
    },
  ],
  assesment: [
    "ประชุมกรรมการหลักสูตรเพื่อพิจารณาผลการเรียนรู้เป็นรายวิชา",
    "พิจารณาจากข้อสอบและงานที่มอบหมายในวิชาว่าครอบคลุมผลการเรียนรู้หรือไม่",
    "สัมภาษณ์ผู้สอนและนักศึกษา",
  ],
  summary: [
    "ผลการประเมินการเรียนรู้เป็นไปตามที่รายงาน",
    "ผลการเรียนรู้ที่ควรปรับปรุง คือ เรื่องไฟฟ้าพื้นฐาน",
  ],
};

/**
 * Create Report
 */
const save = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> => {
  const result = await reportRepository.save(req.body);
  sendResponse(res, result.rows[0]);
};

/**
 * Get Report
 */
const getReportBySection = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> => {
  const { sectionId } = req.params;
  const result = await reportRepository.getReportBySection(sectionId);
  await summaryService.getSectionReport(sectionId);

  sendResponse(res, result.rows[0]);
};

/**
 * getSectionReport
 */
const getSectionReport = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> => {
  const { sectionId } = req.params;
  const result = await summaryService.getSectionReport(sectionId);

  sendResponse(res, result);
};

/**
 * Generate report by section
 */
const generate = async (req: Request, res: Response): Promise<Response> => {
  return;
};

const demo = async (req: Request, res: Response): Promise<Response> => {
  res.render("report", { reportData });
};

export default {
  save,
  getReportBySection,
  getSectionReport,
  generate,
  demo,
};
