import test, { describe } from "node:test";
import assert from "node:assert";
import { World, Has } from "../src/index.ts";

describe("flock", () => {
	test("create world", () => {
		const world = new World();
	});

	test("create component", () => {
		class Component {
			x = 0;
		}
		const component = new Component();
	});

	test("register component", () => {
		class Component {
			x = 0;
		}
		const world = new World();
		const entity = world.createEntity();
		entity.addComponent(new Component());
	});

	test("basic query", () => {
		class Component {
			x = 0;
		}
		const world = new World();
		{
			const result = world.query([new Has(Component)]);
			assert.equal(result.length, 0);
		}
		{
			const entity = world.createEntity();
			entity.addComponent(new Component());
		}
		{
			const result = world.query([new Has(Component)]);
			assert.equal(result.length, 1);
			const entity = result[0];
			const component = entity.getComponent(Component);
			assert(component);
			assert.equal(component.x, 0);
		}
	});

	test("2 components and 2 queries", () => {
		class ComponentA {
			a = 0;
		}
		class ComponentB {
			b = 1;
		}
		const world = new World();
		{
			const result = world.query([new Has(ComponentA)]);
			assert.equal(result.length, 0);
		}
		{
			const result = world.query([new Has(ComponentB)]);
			assert.equal(result.length, 0);
		}
		{
			const entity = world.createEntity();
			entity.addComponent(new ComponentA());
		}
		{
			const result = world.query([new Has(ComponentA)]);
			assert.equal(result.length, 1);
		}
		{
			const result = world.query([new Has(ComponentB)]);
			assert.equal(result.length, 0);
		}
		{
			const entity = world.createEntity();
			entity.addComponent(new ComponentB());
		}
		{
			const result = world.query([new Has(ComponentA)]);
			assert.equal(result.length, 1);
		}
		{
			const result = world.query([new Has(ComponentB)]);
			assert.equal(result.length, 1);
		}
	});
});
