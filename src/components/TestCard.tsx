import type { ScreenshotDescription, ScreenshotTestCase } from "~/types";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";

const TestCard = ({
  screenshotNo,
  screenshotTitle,
  testCases,
  screenshotDescription,
  image,
}: ScreenshotTestCase & ScreenshotDescription & { image: File }) => {
  return (
    <div className="grid grid-cols-[20rem_1fr] gap-4" id={`screenshot-${screenshotNo}`}>
      <h4 className="col-span-2 text-2xl">
        {screenshotNo}: {screenshotTitle}
      </h4>
      <img
        src={URL.createObjectURL(image)}
        alt={screenshotTitle}
        className="sticky top-4 col-start-1 row-span-2 rounded-lg"
      />
      <div className="col-start-2">
        <h5 className="text-lg font-semibold">Description:</h5>
        <ul className="list-inside list-disc">
          {screenshotDescription.map((desc, index) => (
            <li key={index}>{desc}</li>
          ))}
        </ul>
      </div>
      <div className="grid grid-cols-[1fr_2fr] gap-4">
        {testCases.map((testCase, index) => (
          <Card key={testCase.testCaseID} className="col-span-2 grid grid-cols-subgrid border-2 border-primary">
            <CardHeader className="col-span-2">
              <CardTitle className="text-xl font-semibold">
                Test Case {index + 1}: {testCase.testCaseName}
              </CardTitle>
              <CardDescription>{testCase.testCaseDescription}</CardDescription>
            </CardHeader>
            <CardContent className="col-span-2 row-span-3 grid grid-cols-subgrid grid-rows-2 gap-4">
              <div className="py-4">
                <h6 className="text-lg font-semibold">Pre-conditions:</h6>
                {testCase.preConditions.length ? (
                  <ul className="list-outside list-disc pl-4">
                    {testCase.preConditions.map((preCondition, index) => (
                      <li key={index}>{preCondition}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No pre-conditions</p>
                )}
              </div>

              <div className="col-start-1 py-4">
                <h6 className="text-lg font-semibold">Data:</h6>
                {testCase.data.length ? (
                  <ol className="list-outside list-decimal pl-4">
                    {testCase.data.map(({ name, type }, index) => (
                      <li key={index}>
                        {name} ({type})
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p>No data required</p>
                )}
              </div>

              <div className="col-start-2 row-span-2 row-start-1 py-4">
                <h6 className="text-lg font-semibold">Steps:</h6>
                <ol className="list-outside list-decimal pl-4">
                  {testCase.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
            </CardContent>

            <CardFooter className="col-span-2 flex flex-col items-start">
              <h6 className="text-lg font-semibold">Expected Outcome:</h6>
              <p>{testCase.expectedResult}</p>
              {/* <ul className="list-inside list-disc">
                {testCase.postConditions.map((postCondition, index) => (
                  <li key={index}>{postCondition}</li>
                ))}
              </ul> */}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default TestCard;
