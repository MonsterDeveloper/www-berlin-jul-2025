import { Entity, MediaType } from "moysklad-ts";
import { z } from "zod";
import type { ErpSystemMcp } from "..";
import { MOYSKLAD_ORGANIZATION_ID } from "../constants";

const DESCRIPTION = `Create a customer order.

Fetch the customer and products using the tools provided first.`;

export function createCustomerOrder(agent: ErpSystemMcp) {
	agent.server.tool(
		"create-customer-order",
		DESCRIPTION,
		{
			customerId: z.string(),
			positions: z.array(
				z.object({
					type: z.enum([Entity.Product, Entity.Variant, Entity.Service]),
					id: z.string(),
					quantity: z.number(),
					price: z.number(),
				}),
			),
		},
		async ({ customerId, positions }) => {
			const order = await agent.moysklad.customerOrder.create(
				{
					agent: {
						meta: {
							type: Entity.Counterparty,
							href: agent.moysklad.client
								.buildUrl(["entity", Entity.Counterparty, customerId])
								.toString(),
							mediaType: MediaType.Json,
						},
					},
					organization: {
						meta: {
							type: Entity.Organization,
							href: agent.moysklad.client
								.buildUrl([
									"entity",
									Entity.Organization,
									MOYSKLAD_ORGANIZATION_ID,
								])
								.toString(),
							mediaType: MediaType.Json,
						},
					},
					positions: positions.map((position) => ({
						assortment: {
							meta: {
								type: position.type,
								href: agent.moysklad.client
									.buildUrl(["entity", position.type, position.id])
									.toString(),
								mediaType: MediaType.Json,
							},
						},
						quantity: position.quantity,
						price: position.price * 100,
					})),
				},
				{
					expand: {
						agent: true,
						state: true,
					},
				},
			);

			return {
				content: [
					{
						type: "text",
						text: JSON.stringify({
							id: order.id,
							number: order.name,
							state: order.state?.name,
							sum: order.sum / 100,
							currency: "eur",
						}),
					},
				],
			};
		},
	);
}
