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
						text: `This ERP system has a template system. It uses XLS templates to generate reports. You can use the run-xls-generation tool to run code to generate an XLS template using SheetJS CE library (xlsx).
            
            The code environment already has all necessary imports and everything is installed. You can use the "XLSX" variable straight away.

            You must write the workbook to the 'workbook' variable, it will automatically be saved.

            Example code you can pass to the run-xls-generation tool:

            const rows = [] // define rows here
            const worksheet = XLSX.utils.json_to_sheet(rows);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Customer orders");

            As you can see, no imports or saving methods are needed. Just write the actual code for excel generation.

            To generate a template for a list of document, use 3 rows:
            <jx:forEach items="\${rows}" var="row">
            // row with data, e.g. \${row.name} \${formatter.getExcelDate(row.moment)}
            </jx:forEach>
            `,
					},
				],
			};
		},
	);
}
