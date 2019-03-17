import { buildSchema } from "graphql";

module.exports = buildSchema(`
  type Dish {
    _id: ID!
    name: String!
    description: String!
    price: Float!
    creator: Producer!
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

  input DishParams {
    name: String!
    description: String!
    price: Float!
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

  type RootQuery {
    dishes: [Dish!]!
    producers: [Producer!]!
    consumers: [Consumer!]!
  }

  type RootMutation {
    createDish(dishInput: DishParams): Dish
    createProducer(producerInput: ProducerParams): Producer
    createConsumer(consumerInput: ConsumerParams): Consumer
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
