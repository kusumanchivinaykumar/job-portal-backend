import path from "path";
import fs from "fs";

const getDataUri = (file) => {
  if (!file) return null;
  const ext = path.extname(file.originalname).substring(1);
  const fileContent = fs.readFileSync(file.path);
  const base64 = fileContent.toString("base64");
  return {
    content: `data:image/${ext};base64,${base64}`
  };
};

export default getDataUri;
