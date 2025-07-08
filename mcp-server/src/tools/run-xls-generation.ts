import { env } from "cloudflare:workers";
import { getSandbox } from "@cloudflare/sandbox";
import z from "zod";
import type { ErpSystemMcp } from "..";
import jsTemplate from "../sandbox-js-template.txt";

const DESCRIPTION = `Run the XLS template generation for the ERP system

Always first fetch the generation rules using the get-xls-generation-rules tool.

Pass you generated code as code parameter to this tool.

Returns: a URL to the generated XLS file with the template.
`;

export function runXlsGeneration(agent: ErpSystemMcp) {
	agent.server.tool(
		"run-xls-generation",
		DESCRIPTION,
		{ code: z.string() },
		async ({ code }) => {
			const sandbox = getSandbox(env.Sandbox, "test-sandbox");

			const fullCode = jsTemplate.replace("{{code}}", code);
			const writeResult = await sandbox.writeFile(
				"generate-template.js",
				fullCode,
			);

			if (!writeResult || !writeResult.success) {
				return {
					content: [
						{
							type: "text",
							text: `Error occured while writing file: ${JSON.stringify(writeResult)}`,
						},
					],
				};
			}

			const executionResult = await sandbox.exec("bun", [
				"generate-template.js",
			]);

			if (!executionResult || !executionResult.success) {
				return {
					content: [
						{
							type: "text",
							text: `Error occured while executing file: ${JSON.stringify(executionResult)}`,
						},
					],
				};
			}

			const url = executionResult.stdout.trim();

			return {
				content: [
					{
						type: "text",
						text: JSON.stringify({ url }),
					},
				],
			};
		},
	);
}
