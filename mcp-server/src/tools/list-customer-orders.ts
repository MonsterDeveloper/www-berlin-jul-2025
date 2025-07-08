import z from "zod";
import type { ErpSystemMcp } from "..";

export function listCustomerOrders(agent: ErpSystemMcp) {
	agent.server.tool(
		"list-customer-orders",
		"List customer (sales) orders. You can also use this tool to search order(s) by number.",
		{ query: z.string().optional().describe("Search orders by number") },
		{ readOnlyHint: true },
		async ({ query }) => {
			const { rows } = await agent.moysklad.customerOrder.list({
				search: query,
				expand: {
					agent: true,
					positions: {
						assortment: true,
					},
				},
			});

			return {
				content: [
					{
						type: "text",
						text: JSON.stringify(
							rows.map((order) => ({
								number: order.name,
								datetime: order.moment,
								customer: {
									id: order.agent.id,
									name: order.agent.name,
								},
								positions: order.positions.rows.map((position) => ({
									assortment: {
										id: position.assortment.id,
										name: position.assortment.name,
									},
									quantity: position.quantity,
									currency: "eur",
									price: position.price / 100,
								})),
								total: order.sum / 100,
								currency: "eur",
								payedSum: order.payedSum / 100,
							})),
						),
					},
				],
			};
		},
	);
}
