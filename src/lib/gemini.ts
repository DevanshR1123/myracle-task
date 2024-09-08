import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
// import { GoogleAIFileManager } from "@google/generative-ai/server";

const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY as string;
const genAI = new GoogleGenerativeAI(apiKey);
// const fileManager = new GoogleAIFileManager(apiKey);

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 16384,
  responseMimeType: "application/json",
};

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig,
  systemInstruction:
    "You are a software tester. You have been given screenshots of an application. Analyse the various elements in the screenshots and answer the following questions.",
});

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

export async function runGemini(context = "", screenshots: FileList) {
  const imageFiles = await Promise.all(
    Array.from(screenshots).map(async (file) => {
      return {
        inlineData: {
          data: (await toBase64(file)).replace(/^data:image\/\w+;base64,/, ""),
          mimeType: file.type,
        },
      };
    }),
  );

  console.log(imageFiles);

  // const result = await model.generateContent([
  //   ...imageFiles,
  //   context || "The above are screenshots of an application.",
  //   "Describe the various elements in the screenshots.",
  // ]);

  const chatSession = model.startChat({
    generationConfig,
    history: [
      { role: "user", parts: imageFiles },
      {
        role: "user",
        parts: [{ text: context || "The above are screenshots of an application." }],
      },
    ],
  });

  /*
   * screenshotNo:
   * screenTitle:
   * desciption: []
   */

  chatSession.params!.generationConfig!.responseSchema = {
    type: SchemaType.ARRAY,
    description: "Each object represents a screenshot with its description.",
    items: {
      type: SchemaType.OBJECT,
      properties: {
        screenshotNo: {
          type: SchemaType.NUMBER,
          description: "The screenshot number.",
        },
        screenshotTitle: {
          type: SchemaType.STRING,
          description: "The title of the screenshot.",
        },
        screenshotDescription: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
          description: "Each string represents a description of the five most important elements in the screenshot.",
        },
      },
      required: ["screenshotNo", "screenshotTitle", "screenshotDescription"],
    },
  };

  const d_result = await chatSession.sendMessage("Describe the various elements in the screenshots.");
  const descriptions = JSON.parse(d_result.response.text());

  /*
   * Test Case ID:
   * Test Case Name:
   * Test Case Description:
   * Pre-conditions:
   * Steps:
   * Data:
   * Expected Result:
   * Post-conditions:
   */
  chatSession.params!.generationConfig!.responseSchema = {
    type: SchemaType.ARRAY,
    description: "Each object represents a unique test case for a screenshot.",
    items: {
      type: SchemaType.OBJECT,
      required: ["screenshotNo", "screenshotTitle", "testCases"],
      properties: {
        screenshotNo: {
          type: SchemaType.NUMBER,
          description: "The screenshot number.",
        },
        screenshotTitle: {
          type: SchemaType.STRING,
          description: "The title of the screenshot.",
        },
        testCases: {
          type: SchemaType.ARRAY,
          description: "Each object represents a test case for the screenshot.",
          items: {
            type: SchemaType.OBJECT,
            required: [
              "testCaseID",
              "testCaseName",
              "testCaseDescription",
              "preConditions",
              "steps",
              "data",
              "expectedResult",
              "postConditions",
            ],
            properties: {
              testCaseID: {
                type: SchemaType.NUMBER,
                description: "The test case ID.",
              },
              testCaseName: {
                type: SchemaType.STRING,
                description: "The test case name.",
              },
              testCaseDescription: {
                type: SchemaType.STRING,
                description: "The test case description.",
              },
              preConditions: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING },
                description: "The pre-conditions for the test case.",
              },
              steps: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING },
                description: "The steps for the test case.",
              },
              data: {
                type: SchemaType.ARRAY,
                description: "The data for the test case.",
                items: {
                  type: SchemaType.OBJECT,
                  description: "Each object represents a data entry.",
                  properties: {
                    name: {
                      type: SchemaType.STRING,
                      description: "The name of the data entry.",
                    },
                    type: {
                      type: SchemaType.STRING,
                      description: "The type of the data entry.",
                    },
                  },
                },
              },
              expectedResult: {
                type: SchemaType.STRING,
                description: "The expected result.",
              },
              postConditions: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING },
                description: "The post-conditions for the test case.",
              },
            },
          },
        },
      },
    },
  };

  const t_result = await chatSession.sendMessage("What are the test cases for the above screenshots?");
  const testCases = JSON.parse(t_result.response.text());

  return {
    context,
    screenshots: Array.from(screenshots),
    descriptions,
    testCases,
  };
}
