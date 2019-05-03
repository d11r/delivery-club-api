/* eslint-disable prefer-const */
/* eslint-disable prefer-template */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose, { mongo } from "mongoose";

import responseHelper from "../../helpers/producer-helper";
import Dish from "../../models/dish";
import Producer from "../../models/users/producer";
import Consumer from "../../models/users/consumer";
import Category from "../../models/category";
import Order from "../../models/order";

import config from "../../config/config";

const dishes = dishIds => {
  return Dish.find({ _id: { $in: dishIds } })
    .then(dishObjects =>
      dishObjects.map(dish => ({
        ...dish._doc,
        _id: dish.id,
        creator: producer.bind(this, dish.creator),
        categories: dish.categories
          ? categories.bind(this, dish.categories)
          : []
      }))
    )
    .catch(err => {
      throw err;
    });
};

const producer = producerId => {
  return Producer.findById(producerId)
    .then(user => ({
      ...user._doc,
      _id: user.id,
      created_dishes: dishes.bind(this, user._doc.created_dishes)
    }))
    .catch(err => {
      throw err;
    });
};

const consumer = consumerId => {
  return Consumer.findById(consumerId)
    .then(user => ({
      ...user._doc,
      _id: user.id,
      ordered_dishes: dishes.bind(this, user._doc.ordered_dishes)
    }))
    .catch(err => {
      throw err;
    });
};

const categories = categoryIds => {
  return Category.find({ _id: { $in: categoryIds } }).then(categoryObjects =>
    categoryObjects.map(cat => ({
      ...cat._doc,
      _id: cat.id,
      dishes: dishes.bind(this, cat._doc.dishes)
    }))
  );
};

const login = async (type, email, password) => {
  const user =
    type === "producer"
      ? await Producer.findOne({ email })
      : await Consumer.findOne({ email });
  if (!user) {
    throw new Error(responseHelper.INVALID_EMAIL);
  }
  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) {
    throw new Error(responseHelper.INVALID_EMAIL_PASSWORD_COMBINATION);
  }
  const token = jwt.sign(
    { user_id: user.id, email: user.email },
    config.SECRET_KEY,
    {
      expiresIn: "2h"
    }
  );

  return {
    user_id: user.id,
    token,
    user_type: type,
    token_expiration: 1
  };
};

/**
 * Get a comparator function which specifies the order of two objects depending on specific field (key).
 * This compare function then can be passed to Array.sort(comparator) to sort an array of objects by the key.
 *
 * @param key The key on which the returned function should compare the objects
 * @returns   Function which returns -1, 0 or 1 based on the order relation
 *            of the corresponding field of the objects, specified by key
 */
const getDishComparator = key => {
  return (dish1, dish2) => {
    let key1 = dish1[key];
    let key2 = dish2[key];

    // If the field is of string type, convert both fields to lower case
    if(key1 + '' === key1) {
      key1 = key1.toLowerCase();
      key2 = key2.toLowerCase();
    }

    let res = key1 > key2 ? 1 : -1;
    return key1 === key2 ? 0 : res;
  }
};

module.exports = {
  dishes: () =>
    Dish.find()
      .then(listOfDishes =>
        listOfDishes.map(dish => ({
          ...dish._doc,
          _id: dish.id,
          creator: producer.bind(this, dish._doc.creator),
          categories: categories.bind(this, dish._doc.categories)
        }))
      )
      .catch(err => {
        throw err;
      }),
  dishesSorted: (args) => {
    return Dish.find()
      .then(ds => {
        if(!args.key){
          args.key = 'name';
        }

        return ds.sort(getDishComparator(args.key)).map(dish => ({
          ...dish._doc,
          _id: dish.id,
          creator: producer.bind(this, dish._doc.creator),
          categories: categories.bind(this, dish._doc.categories)
        }));
      })
      .catch(err => {
        throw err;
      });
  },
  dishesFiltered: (args) => {
    return Dish.find()
      .then(ds => {
        // Filtering by min price
        if (args.filterInput.minPrice) {
          let min = args.filterInput.minPrice;
          ds = ds.filter(d => d.price > min);
        }

        // Filtering by max price
        if (args.filterInput.maxPrice) {
          let max = args.filterInput.maxPrice;
          ds = ds.filter(d => d.price < max);
        }

        // Filtering by categories checked
        if (args.filterInput.categoriesIds) {
          let csIds = args.filterInput.categoriesIds;
          ds = ds.filter(d => {
            let l = csIds.length;

            let dishCsIds = [];
            d.categories.forEach(c => dishCsIds.push(c._id.toString()));

            csIds.forEach(cId => {
              l = dishCsIds.includes(cId) ? l - 1 : l;
            });

            return l === 0;
          });
        }

        return ds.map(dish => ({
          ...dish._doc,
          _id: dish.id,
          creator: producer.bind(this, dish._doc.creator),
          categories: categories.bind(this, dish._doc.categories)
        }));
      })
      .catch(err => {
        throw err;
      });
  },
  dish: (args, req) => {
    return Dish.findById(mongoose.Types.ObjectId(args.dishId))
      .then(d => {
        if (!d) {
          throw new Error(responseHelper.DISH_DOESNT_EXIST);
        }

        return {
          ...d._doc,
          _id: d.id,
          creator: producer.bind(this, d._doc.creator),
          categories: d._doc.categories
            ? categories.bind(this, d._doc.categories)
            : []
        };
      })
      .catch(err => {
        throw err;
      });
  },
  consumers: () =>
    Consumer.find()
      .then(consumers =>
        consumers.map(consumer => ({
          ...consumer._doc,
          _id: consumer._doc._id.toString()
        }))
      )
      .catch(err => {
        throw err;
      }),
  producers: () =>
    Producer.find()
      .then(producers =>
        producers.map(prod => ({
          ...prod._doc,
          _id: prod._doc._id.toString(),
          created_dishes: dishes.bind(this, prod._doc.created_dishes)
        }))
      )
      .catch(err => {
        throw err;
      }),
  orders: () =>
    Order.find()
      .then(orders =>
        orders.map(prod => ({
          ...prod._doc,
          _id: prod._doc._id.toString(),
          dishes: dishes.bind(this, prod._doc.dishes)
        }))
      )
      .catch(err => {
        throw err;
      }),
  createDish: (args, req) => {
    if (!req.isAuth) {
      throw new Error(responseHelper.ACTION_NOT_AUTHORIZED);
    }
    const dish = new Dish({
      name: args.dishInput.name,
      description: args.dishInput.description,
      price: +args.dishInput.price,
      creator: req.user_id,
      categories: []
    });

    let createdDish;
    return dish
      .save()
      .then(result => {
        createdDish = {
          ...result._doc,
          _id: result._doc._id.toString(),
          creator: producer.bind(this, result._doc.creator)
        };
        return Producer.findById(req.user_id);
      })
      .then(user => {
        if (!user) {
          throw new Error(responseHelper.PRODUCER_OF_DISH_DOESNT_EXIST);
        }
        user.created_dishes.push(dish);
        return user.save();
      })
      .then(_ => createdDish)
      .catch(err => {
        throw err;
      });
  },
  updateDish: (args, req) => {
    if (!req.isAuth) {
      throw new Error(responseHelper.ACTION_NOT_AUTHORIZED);
    }

    return Dish.findById(mongoose.Types.ObjectId(args.dishId))
      .then(d => {
        if (!d) {
          throw new Error(responseHelper.DISH_DOESNT_EXIST);
        }
        return d;
      })
      .then(d => {
        Object.entries(args.dishInput).forEach(entry => {
          const key = entry[0];
          const value = entry[1];

          d[key] = value;
        });
        return d;
      })
      .then(d => {
        return Producer.findById(mongoose.Types.ObjectId(d.creator))
          .then(user => {
            if (user.email !== req.userEmail) {
              throw new Error(responseHelper.ACTION_FORBIDDEN);
            }

            return d.save();
          })
          .catch(err => {
            throw err;
          });
      })
      .then(d => ({
        ...d._doc,
        _id: d.id,
        creator: producer.bind(this, d._doc.creator)
      }))
      .catch(err => {
        throw err;
      });
  },
  removeDish: (args, req) => {
    if (!req.isAuth) {
      throw new Error(responseHelper.ACTION_NOT_AUTHORIZED);
    }

    return Dish.findById(mongoose.Types.ObjectId(args.dishId))
      .then(d => {
        if (!d) {
          throw new Error(responseHelper.DISH_DOESNT_EXIST);
        }
        return d;
      })
      .then(d => {
        return Producer.findById(mongoose.Types.ObjectId(d.creator)).then(
          user => {
            if (user.email !== req.userEmail) {
              throw new Error(responseHelper.ACTION_FORBIDDEN);
            }

            return d.remove();
          }
        );
      })
      .then(d => ({
        ...d._doc,
        _id: d.id,
        creator: producer.bind(this, d._doc.creator)
      }))
      .catch(err => {
        throw err;
      });
  },
  createProducer: args => {
    return Producer.findOne({ email: args.producerInput.email })
      .then(user => {
        if (user) {
          throw new Error(responseHelper.PRODUCER_ALREADY_EXISTS);
        }
        return bcrypt.hash(args.producerInput.password, 12);
      })
      .then(hashPassword => {
        const prod = new Producer({
          email: args.producerInput.email.trim(),
          password: hashPassword,
          phone_number: args.producerInput.phone_number,
          business_address: args.producerInput.business_address,
          website_address: args.producerInput.website_address
        });
        return prod.save();
      })
      .then(result => ({
        ...result._doc,
        _id: result._doc._id.toString()
      }))
      .catch(err => {
        throw err;
      });
  },
  createConsumer: args => {
    return Consumer.findOne({ email: args.consumerInput.email })
      .then(user => {
        if (user) {
          throw new Error(responseHelper.CONSUMER_ALREADY_EXISTS);
        }

        return bcrypt.hash(args.consumerInput.password, 12);
      })
      .then(hashPassword => {
        const consumer = new Consumer({
          email: args.consumerInput.email.trim(),
          password: hashPassword,
          first_name: args.consumerInput.first_name,
          last_name: args.consumerInput.last_name,
          address: args.consumerInput.address,
          phone_number: args.consumerInput.phone_number
        });
        return consumer.save();
      })
      .then(result => ({
        ...result._doc,
        _id: result._doc._id.toString()
      }))
      .catch(err => {
        throw err;
      });
  },
  createOrder: (args, req) => {
    let totalPrice = 0.0;

    args.dishesIds.forEach(async dishID => {
      let dish = await Dish.findById(dishID);
      totalPrice += await dish.price;

      let creatorMail = await Consumer.findById(dish.creator).email;
      // TODO Sending notification mail to creator
    });

    const order = new Order({
      dishes: args.dishesIds,
      consumer: req.user_id,
      price: totalPrice
    });

    let createdOrder;
    return order
      .save()
      .then(result => {
        createdOrder = {
          ...result._doc,
          _id: result._doc._id.toString(),
          dishes: dishes.bind(this, result._doc.dishes),
          consumer: consumer.bind(this, req.user_id)
        };
        return Consumer.findById(req.user_id);
      })
      .then(user => {
        if (!user) {
          throw new Error(responseHelper.CONSUMER_DOESNT_EXIST);
        }
        user.ordered_dishes.push(args.dishes);
        return user.save();
      })
      .then(_ => createdOrder)
      .catch(err => {
        throw err;
      });
  },
  createProducerGoogle: (args, req) => {
    if (!req.isAuth) {
      throw new Error(responseHelper.GOOGLE_ACCOUNT_TOKEN_NOT_VALID);
    }

    return Producer.findOne({ email: req.userEmail })
      .then(user => {
        if (user) {
          throw new Error(responseHelper.PRODUCER_ALREADY_EXISTS);
        }

        const prod = new Producer({
          email: req.userEmail
        });

        return prod.save();
      })
      .then(result => ({
        ...result._doc,
        _id: result._doc._id.toString()
      }))
      .catch(err => {
        throw err;
      });
  },

  createConsumerGoogle: (args, req) => {
    if (!req.isAuth) {
      throw new Error(responseHelper.GOOGLE_ACCOUNT_TOKEN_NOT_VALID);
    }

    return Consumer.findOne({ email: req.userEmail })
      .then(user => {
        if (user) {
          throw new Error(responseHelper.CONSUMER_ALREADY_EXISTS);
        }

        const cons = new Consumer({
          email: req.userEmail,
          first_name: req.userName.split(" ")[0],
          last_name: req.userName.split(" ")[1]
        });

        return cons.save();
      })
      .then(result => ({
        ...result._doc,
        _id: result._doc._id.toString()
      }))
      .catch(err => {
        throw err;
      });
  },

  producerLogin: async ({ email, password }) =>
    login("producer", email.trim(), password),
  consumerLogin: async ({ email, password }) =>
    login("consumer", email.trim(), password),

  producerLoginGoogle: async (args, req) => {
    if (req.tokenExpired) {
      throw new Error(responseHelper.GOOGLE_TOKEN_EXPIRED);
    }
    if (!req.isAuth) {
      throw new Error(responseHelper.GOOGLE_ACCOUNT_TOKEN_NOT_VALID);
    }
    const user = await Producer.findOne({ email: req.userEmail });
    if (!user) {
      throw new Error(responseHelper.USER_NOT_SIGNED_UP);
    }

    return {
      user_id: user.id,
      user_type: "producer"
    };
  },
  consumerLoginGoogle: async (args, req) => {
    if (req.tokenExpired) {
      throw new Error(responseHelper.GOOGLE_TOKEN_EXPIRED);
    }
    if (!req.isAuth) {
      throw new Error(responseHelper.GOOGLE_ACCOUNT_TOKEN_NOT_VALID);
    }

    const user = await Consumer.findOne({ email: req.userEmail });
    if (!user) {
      throw new Error(responseHelper.USER_NOT_SIGNED_UP);
    }

    return {
      user_id: user.id,
      user_type: "consumer"
    };
  },
  createCategory: (args, req) => {
    return new Category({
      name: args.name
    })
      .save()
      .then(result => ({
        ...result._doc,
        _id: result._doc._id.toString()
      }))
      .catch(err => {
        throw err;
      });
  },
  addDishToCategory: async (args, req) => {
    const dish = await Dish.findById(mongoose.Types.ObjectId(args.dishId));
    const cate = await Category.findById(
      mongoose.Types.ObjectId(args.categoryId)
    );

    if (!dish) {
      throw new Error(responseHelper.DISH_DOESNT_EXIST);
    }

    if (!cate) {
      throw new Error(responseHelper.CATEGORY_DOESNT_EXIST);
    }

    cate.dishes.push(dish);
    dish.categories.push(cate);

    const newCategory = await cate.save();
    const newDish = await dish.save();

    return {
      ...newDish._doc,
      _id: newDish.id,
      categories: categories.bind(this, newDish._doc.categories)
    };
  },
  categories: () =>
    Category.find()
      .then(listOfCategories =>
        listOfCategories.map(cat => ({
          ...cat._doc,
          _id: cat.id,
          dishes: dishes.bind(this, cat._doc.dishes)
        }))
      )
      .catch(err => {
        throw err;
      }),
  category: (args, req) => {
    return Category.findById(mongoose.Types.ObjectId(args.categoryId))
      .then(c => {
        if (!c) {
          throw new Error(responseHelper.CATEGORY_DOESNT_EXIST);
        }

        return {
          ...c._doc,
          _id: c.id,
          dishes: dishes.bind(this, c._doc.dishes)
        };
      })
      .catch(err => {
        throw err;
      });
  }
};
