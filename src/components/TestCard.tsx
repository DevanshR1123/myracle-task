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
    <div className="grid grid-cols-[20rem_1fr] gap-4">
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
      <div className="grid grid-cols-[repeat(auto-fill,minmax(32rem,1fr))] grid-rows-[repeat(5,auto)] gap-4">
        {testCases.map((testCase, index) => (
          <Card key={testCase.testCaseID} className="row-span-5 grid grid-rows-subgrid border-2 border-primary">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Test Case {index + 1}: {testCase.testCaseName}
              </CardTitle>
              <CardDescription>{testCase.testCaseDescription}</CardDescription>
            </CardHeader>
            <CardContent className="row-span-3 grid grid-rows-subgrid gap-0">
              <div className="border-y-2 py-4">
                <h6 className="text-lg font-semibold">Pre-conditions:</h6>
                <ul className="list-inside list-disc">
                  {testCase.preConditions.map((preCondition, index) => (
                    <li key={index}>{preCondition}</li>
                  ))}
                </ul>
              </div>
              <div className="border-y-2 py-4">
                <h6 className="text-lg font-semibold">Steps:</h6>
                <ol className="list-inside list-decimal">
                  {testCase.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
              <div className="border-y-2 py-4">
                <h6 className="text-lg font-semibold">Data:</h6>
                {testCase.data.length ? (
                  <ol className="list-inside list-decimal">
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
            </CardContent>

            <CardFooter className="flex flex-col items-start">
              <h6 className="text-lg font-semibold">Expected Outcome:</h6>
              <ul className="list-inside list-disc">
                {testCase.postConditions.map((postCondition, index) => (
                  <li key={index}>{postCondition}</li>
                ))}
              </ul>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default TestCard;
