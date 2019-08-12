// resolvers.js

const { GraphQLScalarType } = require("graphql");

function convertDate(inputFormat) {
  function pad(s) {
    return s < 10 ? "0" + s : s;
  }
  var d = new Date(inputFormat);
  return [pad(d.getDate()), pad(d.getMonth()), d.getFullYear()].join("/");
}


const GQDate = new GraphQLScalarType({
  name: "GQDate",
  description: "Date type",
  parseValue(value) {
    return value; 
  },
  serialize(value) {
    return value; 
  },
  parseLiteral(ast) {
    return new Date(ast.value); 
  }
});

// data store with default data
const registrations = [
  {
    id: 1,
    firstName: "Noelia",
    lastName: "Ramos",
    dob: new Date("2014-08-31"),
    email: "noelia@gmail.com",
    password: "noelia123",
    country: "Peru"
  },
  {
    id: 2,
    firstName: "Julieta",
    lastName: "Rojas",
    dob: new Date("1981-11-24"),
    email: "julieta@gmail.com",
    password: "julieta123",
    country: "Bolivia"
  },
  {
    id: 3,
    firstName: "Ambar",
    lastName: "Castellanos",
    dob: new Date("1991-09-02"),
    email: "ambar@gmail.com",
    password: "ambarl123",
    country: "Bolivia"
  }
];

const resolvers = {
  Query: {
    Registrations: () => registrations, 
    Registration: (_, { id }) =>
      registrations.find(registration => registration.id == id) 
  },
  Mutation: {
    //registro
    createRegistration: (root, args) => {
      const nextId =
        registrations.reduce((id, registration) => {
          return Math.max(id, registration.id);
        }, -1) + 1;
      const newRegistration = {
        id: nextId,
        nombres: args.nombres,
        apellidos: args.apellidos,
        fc: args.fc,
        email: args.email,
        password: args.password,
        pais: args.pais
      };

      registrations.push(newRegistration);
      return newRegistration;
    }, 

    deleteRegistration: (root, args) => {
      const index = registrations.findIndex(
        registration => registration.id == args.id
      );
      registrations.splice(index, 1);
    }, 
    updateRegistration: (root, args) => {
      const index = registrations.findIndex(
        registration => registration.id == args.id
      );
      registrations[index].nombres = args.nombres;
      registrations[index].apellidos = args.apellidos;
      registrations[index].fc = args.fc;
      registrations[index].email = args.email;
      registrations[index].password = args.password;
      registrations[index].pais = args.pais;
      return registrations[index];
    }
  },
  GQDate
};

module.exports.Resolvers = resolvers;
