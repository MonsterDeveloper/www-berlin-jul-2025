import { Entity, isAssortmentOfType } from "moysklad-ts";
import type { ErpSystemMcp } from "..";

const DESCRIPTION = `Get all products & variants from the ERP.

Returns:
- item id & type
- name
- sale price
`;

export function getProducts(agent: ErpSystemMcp) {
	agent.server.tool("get-products", DESCRIPTION, async () => {
		const { rows } = await agent.moysklad.assortment.all();

		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(
						rows.map((row) => ({
							id: row.id,
							type: row.meta.type,
							name: row.name,
							currency: "eur",
							salePrice:
								isAssortmentOfType(row, Entity.Product) ||
								isAssortmentOfType(row, Entity.Service) ||
								isAssortmentOfType(row, Entity.Variant)
									? row.salePrices![0].value / 100
									: undefined,
						})),
					),
				},
			],
		};
	});
}
