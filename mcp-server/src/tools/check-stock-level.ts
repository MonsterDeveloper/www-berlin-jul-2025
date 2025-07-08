import type { ErpSystemMcp } from "..";

const DESCRIPTION = `Check stock level for all products and variants.

Returns:
- product name
- how many days it was in stock
- quantity
- unit of measure (шт means pcs)
- sale price & currency
`;

export function checkStockLevel(agent: ErpSystemMcp) {
	agent.server.tool("check-stock-level", DESCRIPTION, async () => {
		const { meta, rows } = await agent.moysklad.report.stock.all();

		return {
			content: [
				{
					type: "text",
					text: JSON.stringify({
						meta: {
							size: meta.size,
							limit: meta.limit,
							offset: meta.offset,
						},
						data: rows.map((row) => ({
							name: row.name,
							stockDays: row.stockDays,
							stock: row.stock,
							uom: row.uom.name,
							salePrice: row.salePrice! / 100,
							currency: "eur",
						})),
					}),
				},
			],
		};
	});
}
