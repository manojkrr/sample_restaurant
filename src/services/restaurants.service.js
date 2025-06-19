const helper = require('../utils/helper.util');
const config = require('../configs/general.config');
const Restaurants = require('../models/restaurants.model');

/**
 *
 * @param {String} restaurantId
 * @returns single restaurant document
 */
async function getSingle(restaurantId) {
  const rows = await Restaurants.find({ _id: restaurantId });
  const data = helper.emptyOrRows(rows);
  return {
    data,
  };
}

/**
 *
 * @param {Number} page page number
 * @returns returns list of restaurant documents
 */
async function getMultiple(queryParams = {}) {
  // eslint-disable-next-line prefer-const
  let { page, perPage, borough } = queryParams;

  page = parseInt(page, 10) || 1;
  perPage = parseInt(perPage, 10);

  const numberOfDocuments = perPage || config.listPerPage;
  const offset = helper.getOffset(page, numberOfDocuments);

  // Prepare query
  const matchQuery = {};
  if (borough) {
    matchQuery.borough = borough;
  }

  const rows = await Restaurants.find(matchQuery)
    .sort({ restaurant_id: 1})
    .skip(offset)
    .limit(numberOfDocuments)
    .lean();
  const data = helper.emptyOrRows(rows);
  const totalPages = (await Restaurants.countDocuments()) / config.listPerPage;
  const meta = {
    page,
    limit: totalPages,
  };

  return {
    data,
    meta,
  };
}

/**
 *
 * @param {Object} restaurantData
 * @returns
 */
async function create(restaurantData) {
  const result = await Restaurants.create(restaurantData);

  let message = 'Error in creating restaurant';

  if (result) {
    message = 'Restaurant created successfully';
  }

  return { message };
}

/**
 *
 * @param {String} id
 * @param {Object} restaurantData
 * @returns
 */
async function update(id, restaurantData) {
  console.log(restaurantData);
  const result = await Restaurants.updateOne({ _id: id }, restaurantData);

  let message = 'Error in updating restaurant';

  if (result) {
    message = 'Restaurant updated successfully';
  }

  return { message };
}

/**
 *
 * @param {String} id
 * @returns
 */
async function remove(id) {
  const result = await Restaurants.findByIdAndDelete(id);

  let message = 'Error in deleting restaurant';

  if (result) {
    message = 'Restaurant deleted successfully';
  }

  return { message };
}

module.exports = {
  getSingle,
  getMultiple,
  create,
  update,
  remove,
};
