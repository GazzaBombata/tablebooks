import assert, { strictEqual } from 'assert';
import { restore, stub } from 'sinon';
import { Restaurant } from '../models/Models.js';
import sinon from 'sinon';

describe('Restaurant model', function() {
  afterEach(function() {
    // Restore the default sandbox here
    restore();
  });

  describe('createItem', function() {
    it('should create a new restaurant', async function() {
      const createStub = stub(Restaurant, 'create');
      createStub.returns(Promise.resolve({ RestaurantID: 1, Name: 'test', Address: '123 Main St' }));

      const restaurant = await Restaurant.createItem({ Name: 'test', Address: '123 Main St' });

      strictEqual(restaurant.RestaurantID, 1);
      strictEqual(restaurant.Name, 'test');
      strictEqual(restaurant.Address, '123 Main St');
      assert(createStub.calledOnce);
    });
  });

  describe('readItem', function() {
    it('should return a restaurant if the restaurant exists', async function() {
      const findByPkStub = stub(Restaurant, 'findByPk');
      findByPkStub.returns(Promise.resolve({ RestaurantID: 1, Name: 'test', Address: '123 Main St' }));

      const restaurant = await Restaurant.readItem(1);

      strictEqual(restaurant.RestaurantID, 1);
      strictEqual(restaurant.Name, 'test');
      strictEqual(restaurant.Address, '123 Main St');
      assert(findByPkStub.calledOnce);
    });

    it('should return "restaurant not found" if the restaurant does not exist', async function() {
      const findByPkStub = stub(Restaurant, 'findByPk');
      findByPkStub.returns(Promise.resolve(null));

      try {
        await Restaurant.readItem(1);
      } catch (error) {
        assert.strictEqual(error.message, 'restaurant not found');
      }

      assert(findByPkStub.calledOnce);
    });

    it('should return "id must be a number" if the id is not a number', async function() {
      try {
        await Restaurant.readItem('notANumber');
      } catch (error) {
        assert.strictEqual(error.message, 'id must be a number');
      }
    });
  });

  describe('updateItem', function() {
    it('should update a restaurant if the restaurant exists', async function() {
      const findByPkStub = stub(Restaurant, 'findByPk');
      findByPkStub.returns(Promise.resolve({ RestaurantID: 1, Name: 'test', Address: '123 Main St' }));

      const updateStub = sinon.stub(Restaurant, 'update');
      updateStub.returns(Promise.resolve([1]));

      const result = await Restaurant.updateItem(1, { Name: 'updated', Address: '456 Elm St' });

      assert.deepStrictEqual(result, [1]);
      assert(findByPkStub.calledOnce);
      assert(updateStub.calledOnce);
    });

    it('should throw an error with message "restaurant not found" if the restaurant does not exist', async function() {
      const findByPkStub = sinon.stub(Restaurant, 'findByPk');
      findByPkStub.returns(Promise.resolve(null));

      try {
        await Restaurant.updateItem(1, { Name: 'updated', Address: '456 Elm St' });
      } catch (error) {
        assert.strictEqual(error.message, 'restaurant not found');
      }

      assert(findByPkStub.calledOnce);
    });

    it('should return "id must be a number" if the id is not a number', async function() {
      try {
        await Restaurant.updateItem('notANumber', { Name: 'updated', Address: '456 Elm St' });
      } catch (error) {
        assert.strictEqual(error.message, 'id must be a number');
      }
    });
  });

  describe('deleteItem', function() {
    it('should delete a restaurant if the restaurant exists', async function() {
      const findByPkStub = stub(Restaurant, 'findByPk');
      findByPkStub.returns(Promise.resolve({ RestaurantID: 1, Name: 'test', Address: '123 Main St' }));

      const destroyStub = sinon.stub(Restaurant, 'destroy');
      destroyStub.returns(Promise.resolve(1));

      const result = await Restaurant.deleteItem(1);

      assert.strictEqual(result, 1);
      assert(destroyStub.calledOnce);
    });

    it('should return "restaurant not found" if the restaurant does not exist', async function() {
      const findByPkStub = stub(Restaurant, 'findByPk');
      findByPkStub.returns(Promise.resolve(null));

      const destroyStub = sinon.stub(Restaurant, 'destroy');
      destroyStub.returns(Promise.resolve(null));

      try {
        await Restaurant.deleteItem(1);
      } catch (error) {
        assert.strictEqual(error.message, 'restaurant not found');
      }
    });

    it('should return "id must be a number" if the id is not a number', async function() {
      try {
        await Restaurant.deleteItem('notANumber');
      } catch (error) {
        assert.strictEqual(error.message, 'id must be a number');
      }
    });
  });
  

  describe('Restaurant operations', function() {
    let createdRestaurant;
    let id;

    it('should create a Restaurant', async function() {
      createdRestaurant = await Restaurant.createItem({ Name: 'test', Address: '123 Main St' });
      id = createdRestaurant.dataValues.RestaurantID;
      assert.strictEqual(createdRestaurant.Name, 'test');
    });

    it('should retrieve a Restaurant', async function() {
      const retrievedRestaurant = await Restaurant.readItem(id);
      assert.strictEqual(retrievedRestaurant.Name, 'test');
    });

    it('should update a Restaurant', async function() {
      const updatedRestaurant = await Restaurant.updateItem(id, { Name: 'updatedTest', Address: '456 Elm St' });
      assert.strictEqual(updatedRestaurant[0], 1); // updateItem should return an array where the first element is the number of updated rows
      const retrievedRestaurant = await Restaurant.readItem(id);
      assert.strictEqual(retrievedRestaurant.Name, 'updatedTest');
    });

    it('should delete a Restaurant', async function() {
      const deletedCount = await Restaurant.deleteItem(id);
      assert.strictEqual(deletedCount, 1);
    });
  });
});



