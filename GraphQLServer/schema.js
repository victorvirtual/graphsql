/ schema.js

const schema = `
# declare custom scalars for date as GQDate
scalar GQDate
# registration type
type Registration {
    id: ID!
    nombres: String
    apellidos: String
    fc: GQDate
    email: String
    password: String
    pais: String
}
type Query {
    # Return a registration by id
    Registration(id: ID!): Registration
    # Return all registrations
    Registrations(limit: Int): [Registration]
}
type Mutation {
    # Create a registration
    createRegistration (nombres: String,apellidos: String, fn: GQDate, email: String, password: String, pais: String): Registration
    # Update a registration
    updateRegistration (id: ID!, nombres: String,apellidos: String, fn: GQDate, email: String, password: String, pais: String): Registration
    # Delete a registration
    deleteRegistration(id: ID!): Registration
}
`;

module.exports.Schema = schema;