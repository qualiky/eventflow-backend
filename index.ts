import app from "./src/app.ts";

const PORT = Number(process.env["PORT"] ?? 3000);

app.listen(PORT, () => {
  console.log(`EventFlow API running on http://localhost:${PORT}`);
});
