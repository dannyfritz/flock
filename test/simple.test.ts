import test, { describe } from "node:test";
import assert from "node:assert";
import { World, And, Or, With, Without, Entity } from "../src/index.ts";

describe("flock", () => {
	describe("World / Entity", () => {
		test("new World()", () => {
			const world = new World();
			assert.equal(world.entities.length, 0);
		});
		test("new Entity()", () => {
			const entity = new Entity();
		});
		test("world.addEntity()", () => {
			class Component {}
			const world = new World();
			const entity = new Entity();
			world.addEntity(entity);
			assert.equal(world.entities.length, 1);
		});
		test("entity.addComponent()", () => {
			class Component {}
			const world = new World();
			const entity = new Entity();
			world.addEntity(entity);
			entity.addComponent(new Component());
			assert.equal(entity.hasComponent(Component), true);
		});
		test("entity.addComponent() when Component exists", () => {
			class Component {}
			const world = new World();
			const entity = new Entity();
			world.addEntity(entity);
			entity.addComponent(new Component());
			assert.throws(() => entity.addComponent(new Component()), {
				message: 'Component "Component" already exists on Entity!',
			});
		});
		test("entity.hasComponent()", () => {
			class Component {}
			const world = new World();
			const entity = new Entity();
			world.addEntity(entity);
			entity.addComponent(new Component());
			assert.equal(entity.hasComponent(Component), true);
		});
		test("entity.hasComponent() when Component doesn't exist", () => {
			class Component {}
			const world = new World();
			const entity = new Entity();
			world.addEntity(entity);
			assert.equal(entity.hasComponent(Component), false);
		});
		test("entity.getComponent()", () => {
			class Component {
				x = 12;
			}
			const world = new World();
			const entity = new Entity();
			world.addEntity(entity);
			entity.addComponent(new Component());
			assert.equal(entity.getComponent(Component)?.x, 12);
		});
		test("entity.getComponent() when Component doesn't exist", () => {
			class Component {}
			const world = new World();
			const entity = new Entity();
			world.addEntity(entity);
			assert.throws(() => entity.getComponent(Component), {
				message: `Component "Component" doesn't exist on Entity!`,
			});
		});
		test("entity.removeComponent()", () => {
			class Component {}
			const world = new World();
			const entity = new Entity();
			world.addEntity(entity);
			entity.addComponent(new Component());
			entity.removeComponent(Component);
			assert.equal(entity.hasComponent(Component), false);
		});
		test("entity.removeComponent() when Component doesn't exist", () => {
			class Component {}
			const world = new World();
			const entity = new Entity();
			world.addEntity(entity);
			entity.addComponent(new Component());
			entity.removeComponent(Component);
			assert.throws(() => entity.removeComponent(Component), {
				message: `Component "Component" doesn't exist on Entity!`,
			});
		});
		test("world.removeEntity()", () => {
			class Component {
				x = 0;
			}
			const world = new World();
			const entity = new Entity();
			world.addEntity(entity);
			world.removeEntity(entity);
			assert.equal(world.entities.length, 0);
		});
		test("entity.destroy() when Entity doesn't exist", () => {
			class Component {
				x = 0;
			}
			const world = new World();
			const entity = new Entity();
			world.addEntity(entity);
			world.removeEntity(entity);
			world.removeEntity(entity);
			assert.equal(world.entities.length, 0);
		});
	});
	describe("Queries", () => {
		test("And()", () => {
			class ComponentA {}
			class ComponentB {}
			const world = new World();
			assert.equal(
				world.query(And(With(ComponentA), With(ComponentB))).length,
				0,
			);
			world.addEntity(new Entity().addComponent(new ComponentA()));
			assert.equal(
				world.query(And(With(ComponentA), With(ComponentB))).length,
				0,
			);
			world.addEntity(new Entity().addComponent(new ComponentB()));
			assert.equal(
				world.query(And(With(ComponentA), With(ComponentB))).length,
				0,
			);
			world.addEntity(
				new Entity()
					.addComponent(new ComponentA())
					.addComponent(new ComponentB()),
			);
			assert.equal(
				world.query(And(With(ComponentA), With(ComponentB))).length,
				1,
			);
		});
		test("Or()", () => {
			class ComponentA {}
			class ComponentB {}
			const world = new World();
			assert.equal(
				world.query(Or(With(ComponentA), With(ComponentB))).length,
				0,
			);
			world.addEntity(new Entity().addComponent(new ComponentA()));
			world.addEntity(new Entity().addComponent(new ComponentA()));
			assert.equal(
				world.query(Or(With(ComponentA), With(ComponentB))).length,
				2,
			);
			world.addEntity(new Entity().addComponent(new ComponentB()));
			assert.equal(
				world.query(Or(With(ComponentA), With(ComponentB))).length,
				3,
			);
		});
		test("With()", () => {
			class ComponentA {}
			class ComponentB {}
			const world = new World();
			assert.equal(world.query(With(ComponentA)).length, 0);
			assert.equal(world.query(With(ComponentB)).length, 0);
			world.addEntity(new Entity().addComponent(new ComponentA()));
			world.addEntity(new Entity().addComponent(new ComponentA()));
			assert.equal(world.query(With(ComponentA)).length, 2);
			assert.equal(world.query(With(ComponentB)).length, 0);
			world.addEntity(new Entity().addComponent(new ComponentB()));
			assert.equal(world.query(With(ComponentA)).length, 2);
			assert.equal(world.query(With(ComponentB)).length, 1);
		});
		test("Without()", () => {
			class ComponentA {}
			class ComponentB {}
			const world = new World();
			assert.equal(world.query(Without(ComponentA)).length, 0);
			assert.equal(world.query(Without(ComponentB)).length, 0);
			world.addEntity(new Entity().addComponent(new ComponentA()));
			world.addEntity(new Entity().addComponent(new ComponentA()));
			assert.equal(world.query(Without(ComponentA)).length, 0);
			assert.equal(world.query(Without(ComponentB)).length, 2);
			world.addEntity(new Entity().addComponent(new ComponentB()));
			assert.equal(world.query(Without(ComponentA)).length, 1);
			assert.equal(world.query(Without(ComponentB)).length, 2);
		});
	});
	test("All together", () => {
		class Health {
			hp = 0;
		}
		class Dog {
			barks = 0;
		}
		class Cat {
			meows = 0;
		}
		class Boss {
			phase = 0;
		}
		class Player {}
		const world = new World();
		world.addEntity(
			new Entity().addComponent(new Health()).addComponent(new Dog()),
		);
		world.addEntity(
			new Entity().addComponent(new Health()).addComponent(new Dog()),
		);
		world.addEntity(
			new Entity()
				.addComponent(new Health())
				.addComponent(new Dog())
				.addComponent(new Boss()),
		);
		world.addEntity(
			new Entity()
				.addComponent(new Health())
				.addComponent(new Cat())
				.addComponent(new Player()),
		);
		let minionDogs = world.query(And(With(Dog), Without(Boss)));
		let players = world.query(With(Player));
		let thingsWithHealth = world.query(With(Health));
		let bosses = world.query(With(Boss));
		assert.equal(minionDogs.length, 2);
		assert.equal(players.length, 1);
		assert.equal(thingsWithHealth.length, 4);
		assert.equal(bosses.length, 1);
		players[0].getComponent(Health).hp = 100;
		bosses[0].getComponent(Health).hp = 100;
		bosses[0].getComponent(Boss).phase = 1;
		for (const minionDog of minionDogs) {
			minionDog.getComponent(Health).hp = 10;
		}
		minionDogs[1].getComponent(Health).hp = 0;
		world.removeEntity(minionDogs[1]);
		minionDogs = world.query(And(With(Dog), Without(Boss)));
		players = world.query(With(Player));
		thingsWithHealth = world.query(With(Health));
		bosses = world.query(With(Boss));
		assert.equal(minionDogs.length, 1);
		assert.equal(players.length, 1);
		assert.equal(thingsWithHealth.length, 3);
		assert.equal(bosses.length, 1);
		players[0].getComponent(Health).hp = 0;
		world.removeEntity(players[0]);
		minionDogs = world.query(And(With(Dog), Without(Boss)));
		players = world.query(With(Player));
		thingsWithHealth = world.query(With(Health));
		bosses = world.query(With(Boss));
		assert.equal(minionDogs.length, 1);
		assert.equal(players.length, 0);
		assert.equal(thingsWithHealth.length, 2);
		assert.equal(bosses.length, 1);
	});
});
