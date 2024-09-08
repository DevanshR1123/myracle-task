import TestForm from "~/components/TestForm";
import { ArrowUpSquare } from "lucide-react";

function App() {
  return (
    <>
      <header className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 p-4">
        <hr className="border-2 border-primary" />
        <h1 className="pb-4 text-center text-6xl font-semibold">TestGen</h1>
        <hr className="border-2 border-primary" />
      </header>
      <main className="grid p-8">
        <TestForm />
      </main>
      <footer className="bg-muted p-2 text-center text-muted-foreground">
        For <a href="https://www.myracle.io/">Myracle.io</a> Case Study Task
      </footer>
      <a href="#" className="fixed bottom-4 right-4 rounded bg-ring p-2 text-secondary-foreground">
        <ArrowUpSquare size={32} />
      </a>
    </>
  );
}

export default App;
