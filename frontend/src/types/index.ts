export interface ScreenshotDescription {
  screenshotNo: number;
  screenshotTitle: string;
  screenshotDescription: string[];
}

interface DataType {
  name: string;
  type: string;
}

export interface TestCase {
  testCaseID: number;
  testCaseName: string;
  testCaseDescription: string;
  preConditions: string[];
  steps: string[];
  data: DataType[];
  expectedResult: string;
  postConditions: string[];
}

export interface ScreenshotTestCase {
  screenshotNo: number;
  screenshotTitle: string;
  testCases: TestCase[];
}

export interface GeminiResponse {
  context: string;
  screenshots: File[];
  descriptions: ScreenshotDescription[];
  testCases: ScreenshotTestCase[];
}
