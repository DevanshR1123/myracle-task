import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import React, { useState } from "react";

const TestForm = () => {
  const [context, setContext] = useState<string>("");
  const [screenshots, setScreenshots] = useState<FileList | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);

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

    const formData = new FormData();
    formData.append("context", context);
    Array.from(screenshots).forEach((file) => {
      formData.append("screenshots", file);
    });

    console.log("Form data", formData);

    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <section className="mx-auto grid min-w-96 gap-4 rounded-xl border-2 border-primary px-6 py-8">
        <h2 className="text-2xl font-semibold text-foreground">
          Testing Instructions
        </h2>
        <Input
          id="context"
          type="text"
          placeholder="Enter optional context for the application"
          onChange={(event) => setContext(event.target.value)}
        />

        <Label
          htmlFor="screenshots"
          className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md border border-primary bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          {screenshots?.length
            ? `${screenshots.length} images selected`
            : "Upload screenshots"}
          <input
            id="screenshots"
            type="file"
            accept="image/*"
            multiple
            required
            placeholder="Upload screenshots"
            hidden
            onChange={(event) => setScreenshots(event.target.files)}
          />
        </Label>
        <Button className="mt-4" onClick={handleSubmit}>
          Describe Testing Instructions
        </Button>
      </section>

      {screenshots && ( // If screenshots exist
        <section className="grid gap-4">
          <h3 className="text-2xl font-semibold text-foreground">
            Screenshots Preview ({screenshots.length} images)
          </h3>
          <div className="col-span-2 grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4">
            {Array.from(screenshots).map((file, index) => (
              <img
                key={index}
                className="rounded-lg"
                src={URL.createObjectURL(file)}
                alt={file.name}
              />
            ))}
          </div>
        </section>
      )}

      {loading && <p className="text-foreground">Loading...</p>}
      {error && <p className="text-foreground">{error}</p>}

      {response && (
        <section className="grid gap-4">
          <h3 className="text-2xl font-semibold text-foreground">
            Testing Instructions
          </h3>
          <p className="text-foreground">{context || "No context provided."}</p>
        </section>
      )}
    </div>
  );
};
export default TestForm;
