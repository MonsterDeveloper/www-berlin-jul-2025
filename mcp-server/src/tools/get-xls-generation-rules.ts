import type { ErpSystemMcp } from "..";

export function getXlsGenerationRules(agent: ErpSystemMcp) {
	agent.server.tool(
		"get-xls-generation-rules",
		"Get XLS template code generation rules. Always call this tool before running XLS generation",
		async () => {
			return {
				content: [
					{
						type: "text",
						text: ``,
					},
				],
			};
		},
	);
}
