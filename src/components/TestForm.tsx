import React, { useState } from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import TestCard from "./TestCard";

import { runGemini } from "~/lib/gemini";
import { cn } from "~/lib/utils";

import type { GeminiResponse } from "~/types";

const TestForm = () => {
  const [context, setContext] = useState<string>("");
  const [screenshots, setScreenshots] = useState<FileList | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<GeminiResponse | null>(null);

  const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = async () => {
    console.log("Form submitted", { context, screenshots });
    setLoading(true);
    setError(null);
    setResponse(null);

    if (!screenshots) {
      setError("Please upload screenshots.");
      setLoading(false);
      return;
    }

    try {
      const res = (await runGemini(context, screenshots)) as GeminiResponse;
      console.log(res);
      setResponse(res);
    } catch {
      setError("An error occurred while generating test cases.");
      setLoading(false);
      return;
    }

    setLoading(false);
    setContext("");
    setScreenshots(null);
  };

  return (
    <div className="grid grid-cols-[1fr_3fr] grid-rows-[auto_1fr] flex-col gap-4">
      <section
        className={cn(
          "grid min-w-[32rem] gap-4 self-start rounded-xl border-2 border-primary bg-secondary px-6 py-8",
          screenshots?.length ? "col-span-1" : "col-span-2 mx-auto",
        )}
      >
        <h2 className="text-2xl font-semibold">Upload Screenshots</h2>
        <Input
          id="context"
          type="text"
          placeholder="Enter optional context for the images"
          onChange={(event) => setContext(event.target.value)}
          value={context}
          className="h-auto bg-secondary-foreground py-2 text-lg placeholder:text-secondary"
        />

        <Label
          htmlFor="screenshots"
          className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-md border-2 border-primary bg-primary px-4 py-4 text-lg font-medium shadow-sm transition-colors duration-200 ease-in-out hover:bg-accent hover:text-secondary-foreground"
        >
          {screenshots?.length ? `${screenshots.length} Images Selected` : "Upload Screenshots"}
          <input
            id="screenshots"
            type="file"
            accept="image/*"
            multiple
            required
            placeholder="Upload screenshots"
            hidden
            onChange={(event) => {
              setScreenshots(event.target.files);
              setError(null);
            }}
          />
        </Label>
        <Button className="mt-6 h-auto text-lg text-secondary-foreground" onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <div className="flex justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-x-transparent border-y-foreground"></div>
            </div>
          ) : (
            "Describe Testing Instructions"
          )}
        </Button>
      </section>

      {screenshots?.length ? ( // If screenshots exist
        <section className="grid gap-4">
          <h3 className="text-2xl font-semibold text-foreground">Screenshots Preview ({screenshots.length} images)</h3>
          <div className="col-span-2 grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4">
            {Array.from(screenshots).map((file, index) => (
              <img key={index} className="rounded-lg" src={URL.createObjectURL(file)} alt={file.name} />
            ))}
          </div>
        </section>
      ) : null}

      {error && (
        <p className="col-span-2 row-start-2 self-start rounded bg-destructive p-4 text-destructive-foreground">
          Error: {error}
        </p>
      )}

      {response && (
        <section className="col-span-2 grid gap-4">
          <h3 className="text-3xl font-semibold text-foreground">Testing Instructions</h3>
          <nav>
            <ul className="flex flex-wrap justify-center bg-secondary px-8">
              {response.descriptions.map(({ screenshotTitle, screenshotNo }, index) => (
                <li key={index}>
                  <a
                    className="inline-block px-6 py-4 font-bold hover:bg-primary hover:text-accent"
                    href={`#screenshot-${screenshotNo}`}
                  >
                    {screenshotNo}: {screenshotTitle}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="grid gap-12">
            {response.descriptions.map((description, index) => (
              <TestCard
                key={index}
                {...description}
                testCases={response.testCases[index].testCases}
                image={response.screenshots[index]}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
export default TestForm;
