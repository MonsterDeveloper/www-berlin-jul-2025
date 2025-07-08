import { env } from "cloudflare:workers";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import { createMoysklad } from "moysklad-ts";
import { checkStockLevel } from "./tools/check-stock-level";
import { createCustomerOrder } from "./tools/create-customer-order";
import { generateSalesReport } from "./tools/generate-sales-report";
import { getCustomerOrder } from "./tools/get-customer-order";
import { getProducts } from "./tools/get-products";
import { getXlsGenerationRules } from "./tools/get-xls-generation-rules";
import { listCustomerOrders } from "./tools/list-customer-orders";
import { runXlsGeneration } from "./tools/run-xls-generation";

export class ErpSystemMcp extends McpAgent {
	server = new McpServer({
		name: "ERP System",
		version: "1.0.0",
	});
	moysklad = createMoysklad({ auth: { token: env.MOYSKLAD_API_TOKEN } });

	async init() {
		checkStockLevel(this);
		getProducts(this);
		createCustomerOrder(this);
		getCustomerOrder(this);
		listCustomerOrders(this);
		generateSalesReport(this);
		runXlsGeneration(this);
		getXlsGenerationRules(this);
	}
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);

		if (url.pathname === "/sse" || url.pathname === "/sse/message") {
			return ErpSystemMcp.serveSSE("/sse").fetch(request, env, ctx);
		}

		if (url.pathname === "/mcp") {
			return ErpSystemMcp.serve("/mcp").fetch(request, env, ctx);
		}

		return new Response("Not found", { status: 404 });
	},
};

export { Sandbox } from "@cloudflare/sandbox";
