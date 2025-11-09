import { useEffect, useState } from "react";

const script = `plan: add password reset flow to auth module\n- update API to send reset token\n- create reset page with token validation\n- add e2e tests for reset flow\n\nexecuting...\ncreated branch feat/password-reset\nopened PR #1289: password reset flow`;

export default function CodeDemo() {
  const [text, setText] = useState("");

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setText(script.slice(0, i));
      i++;
      if (i > script.length) {
        clearInterval(id);
      }
    }, 14);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="demo" className="relative">
      <div className="container py-10 md:py-16">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-xl border border-white/10 bg-black/60 ring-1 ring-white/5 backdrop-blur">
          <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-2">
            <div className="h-3 w-3 rounded-full bg-red-400/80" />
            <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
            <div className="h-3 w-3 rounded-full bg-green-400/80" />
            <div className="ml-3 text-xs text-white/60">forge run</div>
          </div>
          <pre className="relative max-h-[420px] overflow-auto p-4 text-sm leading-6 text-indigo-100">
            <code>
              {text}
              <span className="ml-0.5 inline-block h-4 w-2 translate-y-1 rounded-sm bg-indigo-300 align-middle animate-blink" />
            </code>
          </pre>
        </div>
      </div>
    </section>
  );
}
