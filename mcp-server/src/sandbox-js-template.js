import { randomUUID } from "node:crypto";
/* load 'fs' for readFile and writeFile support */
import * as fs from "node:fs";
import { S3Client } from "bun";
import * as XLSX from "xlsx";

XLSX.set_fs(fs);

/* load 'stream' for stream support */
import { Readable } from "node:stream";

XLSX.stream.set_readable(Readable);

/* load the codepage support library for extended support with older formats  */
import * as cpexcel from "xlsx/dist/cpexcel.full.mjs";

XLSX.set_cptable(cpexcel);

// {{code}}

// const workbook = XLSX.utils.book_new();
// const worksheet = XLSX.utils.json_to_sheet([]);
// XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");

XLSX.writeFile(workbook, "Template.xls", { bookType: "biff8" });

const s3 = new S3Client({
	accessKeyId: "9FKLmS8bwxFeOfhw2yuu",
	secretAccessKey: "y2ggJUcc4fMFxSFZtF5L96ywBXuJtUWGizlWkM4a",
	bucket: "templates",
	endpoint: "https://0a5135b91172.ngrok-free.app",
});

const file = await Bun.file("Template.xls");
const content = await file.arrayBuffer();

const s3fileName = `Template-${randomUUID()}.xls`;

await s3.write(s3fileName, content);

console.log(s3.presign(s3fileName));
