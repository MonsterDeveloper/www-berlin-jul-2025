import z from "zod";
import type { ErpSystemMcp } from "..";

export function getCustomerOrder(agent: ErpSystemMcp) {
	agent.server.tool(
		"get-customer-order",
		"Get customer order details by ID",
		{ id: z.string().describe("Customer order UUID") },
		{ readOnlyHint: true },
		async ({ id }) => {
			const order = await agent.moysklad.customerOrder.get(id, {
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
						text: JSON.stringify({
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
						}),
					},
				],
			};
		},
	);
}
