export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-gray-200 px-6 py-3 text-sm text-center text-gray-500 bg-white">
      © {year} PromptPilot · Built by freemancodz
    </footer>
  );
}
