import type { ErpSystemMcp } from "..";

export function generateSalesReport(agent: ErpSystemMcp) {
	agent.server.tool(
		"generate-sales-report",
		`Generates sales report.
		
Returns:
margin - Profitability
profit - Profit
returnCost - Return cost in cents
returnCostSum - Sum of return costs in cents
returnPrice - Return price
returnQuantity - Returned quantity
returnSum - Return sum
sellCost - Cost in cents
sellCostSum - Sum of sales costs in cents
sellPrice - Sales price (average)
sellQuantity - Sold quantity
sellSum - Sales sum`,
		{ readOnlyHint: true },
		async () => {
			const { rows } = await agent.moysklad.report.profit.byVariant();

			return {
				content: [
					{
						type: "text",
						text: JSON.stringify(
							rows.map(({ assortment, ...row }) => ({
								name: assortment.name,
								currency: "eurCents",
								...row,
							})),
						),
					},
				],
			};
		},
	);
}
