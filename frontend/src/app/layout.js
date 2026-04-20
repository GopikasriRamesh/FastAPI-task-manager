import "./globals.css";

export const metadata = {
  title: "Task Manager",
  description: "Internship Task for Webion",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}