import { buildSchema } from "graphql";

module.exports = buildSchema(`
  type Dish {
    _id: ID!
    name: String!
    description: String!
    price: Float!
    creator: Producer!
    categories: [Category!]
  }

  type Category {
    _id: ID!
    name: String!
    dishes: [Dish!]
  }

  type AuthData {
    user_id: ID!
    token: String!
    user_type: String!
    token_expiration: Int!
  }

  type Producer {
    _id: ID!
    email: String!
    password: String
    business_address: String
    website_address: String
    phone_number: String
    created_dishes: [Dish!]
  }

  type Consumer {
    _id: ID!
    email: String!
    password: String
    first_name: String
    last_name: String
    address: String
    phone_number: String
  }
  
  type Order {
    _id: ID!
    dishes: [Dish!]!
    consumer: Consumer!
    producer: Producer!
    totalCost: Int!
  }

  input DishParams {
    name: String!
    description: String!
    price: Float!
  }

  input DishEditParams {
    name: String
    description: String
    price: Float
  }

  input ProducerParams {
    email: String!
    password: String!
    business_address: String
    website_address: String
    phone_number: String
  }

  input ConsumerParams {
    email: String!
    password: String!
    first_name: String
    last_name: String
    address: String
    phone_number: String
  }
  
  input OrderParams {
    dishesIds: [ID!]!
    producerId: ID!
    consumerId: ID!
  }

  input DishFilterParams {
    minPrice: Float
    maxPrice: Float
    categoriesIds: [ID]
  }

  type RootQuery {
    dishes: [Dish!]!
    dish(dishId: ID!): Dish
    dishesSorted(key: String): [Dish!]!
    dishesFiltered(filterInput: DishFilterParams): [Dish]!
    producers: [Producer!]!
    consumers: [Consumer!]!
    producerLogin(email: String!, password: String!): AuthData!
    consumerLogin(email: String!, password: String!): AuthData!
    producerLoginGoogle: AuthData!
    consumerLoginGoogle: AuthData!
    categories: [Category!]!
    category(categoryId: ID!): Category
    orders: [Order!]!
  }

  type RootMutation {
    createDish(dishInput: DishParams): Dish
    updateDish(dishId: ID!, dishInput: DishEditParams): Dish!
    removeDish(dishId: ID!): Dish!
    createProducer(producerInput: ProducerParams): Producer
    createConsumer(consumerInput: ConsumerParams): Consumer
    createOrder(orderInput: OrderParams): Order
    createProducerGoogle: Producer
    createConsumerGoogle: Consumer
    createCategory(name: String): Category!
    addDishToCategory(dishId: ID!, categoryId: ID!): Dish!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
