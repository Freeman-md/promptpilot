export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-gray-200 px-6 py-3 text-sm text-center text-gray-500 bg-white">
      © {year} PromptPilot · Built by{" "}
      <a
        href="https://freemanmadudili.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline"
      >
        freemancodz
      </a>
    </footer>
  );
}
