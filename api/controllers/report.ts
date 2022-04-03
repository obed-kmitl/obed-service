import reportRepository from "_/repositories/report";
import { sendResponse } from "_/utils/response";
import { summaryService } from "_/services";
import { reportGenerator } from "_/utils/reportGenerator";

import { Request, Response, NextFunction } from "express";

//  Mock report data from requested sectionId
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
    "เพิ่มรายละเอียดเนื้อหาในส่วนวงจรไฟฟ้า และ Analog and Digtal เพื่อให้เข้าใจมากขึ้น",
    "เพิ่มโจทย์เกี่ยวกับวงจรไฟฟ้า",
  ],
  results: [
    {
      clo_id: 1,
      order_number: "1.1",
      detail: "clo_detail",
      main_sub_standards: ["1.3", "1.4", "4.2", "4.4", "4.5"],
      relative_sub_standards: ["6.1"],
      activities: [
        {
          activity_id: 1,
          title: "Test",
          detail: "Test Description",
          sub_activities: [
            {
              sub_activity_id: 1,
              detail: "Sub Activity 1",
              max_score: 10,
            },
            {
              sub_activity_id: 2,
              detail: "Final 1",
              max_score: 20,
            },
          ],
          percent: 2.85,
        },
        {
          activity_id: 2,
          title: "Test2",
          detail: "Desc",
          sub_activities: [
            {
              sub_activity_id: 4,
              detail: "Midterm 1",
              max_score: 50,
            },
          ],
          percent: 0,
        },
      ],
      isPassed: false,
    },
    {
      clo_id: 1,
      order_number: "1.1",
      detail: "clo_detail",
      main_sub_standards: ["1.3", "1.4", "4.2", "4.4", "4.5"],
      relative_sub_standards: ["6.1"],
      activities: [
        {
          activity_id: 1,
          title: "Test",
          detail: "Test Description",
          sub_activities: [
            {
              sub_activity_id: 1,
              detail: "Sub Activity 1",
              max_score: 10,
            },
            {
              sub_activity_id: 2,
              detail: "Final 1",
              max_score: 20,
            },
          ],
          percent: 2.85,
        },
        {
          activity_id: 2,
          title: "Test2",
          detail: "Desc",
          sub_activities: [
            {
              sub_activity_id: 4,
              detail: "Midterm 1",
              max_score: 50,
            },
          ],
          percent: 0,
        },
      ],
      isPassed: false,
    },
    {
      clo_id: 1,
      order_number: "1.1",
      detail: "clo_detail",
      main_sub_standards: ["1.3", "1.4", "4.2", "4.4", "4.5"],
      relative_sub_standards: ["6.1"],
      activities: [
        {
          activity_id: 1,
          title: "Test",
          detail: "Test Description",
          sub_activities: [
            {
              sub_activity_id: 1,
              detail: "Sub Activity 1",
              max_score: 10,
            },
            {
              sub_activity_id: 2,
              detail: "Final 1",
              max_score: 20,
            },
          ],
          percent: 2.85,
        },
        {
          activity_id: 2,
          title: "Test2",
          detail: "Desc",
          sub_activities: [
            {
              sub_activity_id: 4,
              detail: "Midterm 1",
              max_score: 50,
            },
          ],
          percent: 0,
        },
      ],
      isPassed: false,
    },
    {
      clo_id: 1,
      order_number: "1.1",
      detail: "clo_detail",
      main_sub_standards: ["1.3", "1.4", "4.2", "4.4", "4.5"],
      relative_sub_standards: ["6.1"],
      activities: [
        {
          activity_id: 1,
          title: "Test",
          detail: "Test Description",
          sub_activities: [
            {
              sub_activity_id: 1,
              detail: "Sub Activity 1",
              max_score: 10,
            },
            {
              sub_activity_id: 2,
              detail: "Final 1",
              max_score: 20,
            },
          ],
          percent: 2.85,
        },
        {
          activity_id: 2,
          title: "Test2",
          detail: "Desc",
          sub_activities: [
            {
              sub_activity_id: 4,
              detail: "Midterm 1",
              max_score: 50,
            },
          ],
          percent: 0,
        },
      ],
      isPassed: false,
    },
    {
      clo_id: 1,
      order_number: "1.1",
      detail: "clo_detail",
      main_sub_standards: ["1.3", "1.4", "4.2", "4.4", "4.5"],
      relative_sub_standards: ["6.1"],
      activities: [
        {
          activity_id: 1,
          title: "Test",
          detail: "Test Description",
          sub_activities: [
            {
              sub_activity_id: 1,
              detail: "Sub Activity 1",
              max_score: 10,
            },
            {
              sub_activity_id: 2,
              detail: "Final 1",
              max_score: 20,
            },
          ],
          percent: 2.85,
        },
        {
          activity_id: 2,
          title: "Test2",
          detail: "Desc",
          sub_activities: [
            {
              sub_activity_id: 4,
              detail: "Midterm 1",
              max_score: 50,
            },
          ],
          percent: 0,
        },
      ],
      isPassed: false,
    },
    {
      clo_id: 1,
      order_number: "1.1",
      detail: "clo_detail",
      main_sub_standards: ["1.3", "1.4", "4.2", "4.4", "4.5"],
      relative_sub_standards: ["6.1"],
      activities: [
        {
          activity_id: 1,
          title: "Test",
          detail: "Test Description",
          sub_activities: [
            {
              sub_activity_id: 1,
              detail: "Sub Activity 1",
              max_score: 10,
            },
            {
              sub_activity_id: 2,
              detail: "Final 1",
              max_score: 20,
            },
          ],
          percent: 2.85,
        },
        {
          activity_id: 2,
          title: "Test2",
          detail: "Desc",
          sub_activities: [
            {
              sub_activity_id: 4,
              detail: "Midterm 1",
              max_score: 50,
            },
          ],
          percent: 0,
        },
      ],
      isPassed: false,
    },
    {
      clo_id: 1,
      order_number: "1.1",
      detail: "clo_detail",
      main_sub_standards: ["1.3", "1.4", "4.2", "4.4", "4.5"],
      relative_sub_standards: ["6.1"],
      activities: [
        {
          activity_id: 1,
          title: "Test",
          detail: "Test Description",
          sub_activities: [
            {
              sub_activity_id: 1,
              detail: "Sub Activity 1",
              max_score: 10,
            },
            {
              sub_activity_id: 2,
              detail: "Final 1",
              max_score: 20,
            },
          ],
          percent: 2.85,
        },
        {
          activity_id: 2,
          title: "Test2",
          detail: "Desc",
          sub_activities: [
            {
              sub_activity_id: 4,
              detail: "Midterm 1",
              max_score: 50,
            },
          ],
          percent: 0,
        },
      ],
      isPassed: false,
    },
    {
      clo_id: 1,
      order_number: "1.1",
      detail: "clo_detail",
      main_sub_standards: ["1.3", "1.4", "4.2", "4.4", "4.5"],
      relative_sub_standards: ["6.1"],
      activities: [
        {
          activity_id: 1,
          title: "Test",
          detail: "Test Description",
          sub_activities: [
            {
              sub_activity_id: 1,
              detail: "Sub Activity 1",
              max_score: 10,
            },
            {
              sub_activity_id: 2,
              detail: "Final 1",
              max_score: 20,
            },
          ],
          percent: 2.85,
        },
        {
          activity_id: 2,
          title: "Test2",
          detail: "Desc",
          sub_activities: [
            {
              sub_activity_id: 4,
              detail: "Midterm 1",
              max_score: 50,
            },
          ],
          percent: 0,
        },
      ],
      isPassed: false,
    },
    {
      clo_id: 2,
      order_number: "1.2",
      detail: "test",
      main_sub_standards: ["2.1"],
      relative_sub_standards: ["1.2"],
      activities: [
        {
          activity_id: 1,
          title: "Test",
          detail: "Test Description",
          sub_activities: [
            {
              sub_activity_id: 3,
              detail: "Final 2",
              max_score: 20,
            },
          ],
          percent: 2.41,
        },
      ],
      isPassed: false,
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
    "ประชุมกรรมการหลักสูตรเพื่อพิจารณา ผลการเรียนรู้เป็นรายวิชา",
    "พิจารณาจากข้อสอบและงานที่มอบหมายในวิชาว่า ครอบคลุมผลการเรียนรู้หรือไม่",
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
	const result = await summaryService.getCLOSummaryBySection(sectionId);
	sendResponse(res, result);
};

/**
 * Generate report by section
 */
const generate = async (req: Request, res: Response): Promise<Response> => {
  const pdfDoc = reportGenerator(reportData);
  res.contentType("application/pdf");
  pdfDoc.pipe(res);
  pdfDoc.end();
};

const demo = async (req: Request, res: Response): Promise<Response> => {
  const pdfDoc = reportGenerator(reportData);
  res.contentType("application/pdf");
  pdfDoc.pipe(res);
  pdfDoc.end();
};

export default {
  save,
  getReportBySection,
  getSectionReport,
  generate,
  demo,
};
