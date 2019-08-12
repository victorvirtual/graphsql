// src/app/registration/registration.component.ts

import { Component, OnInit } from "@angular/core";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

class Registro {
  constructor(
    public nombres: string = "",
    public apellidos: string = "",
    public fc: NgbDateStruct = null,
    public email: string = "",
    public password: string = "",
    public pais: string = "Seleccionar pais"
  ) {}
}

@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.css"]
})
export class RegistrationComponent implements OnInit {
  
  registros: Array<any> = [];
  regModelo: Registro;
  mostrarNuevo: Boolean = false;
  submitType: string = "Guardar";
  selectedRow: number;
  paises: string[] = ["Bolivia", "Peru", "Chile", "Argentina"];

  registroList: Array<any> = []; 

  comments: Observable<any>;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.mostrarRegistros();
  }

  // Get all registrations
  mostrarRegistros() {
    const getRegistrations = gql`
      {
        Registrations {
          id
          nombres
          apellidos
          fc
          email
          pais
        }
      }
    `;

    this.apollo
      .watchQuery({
        query: getRegistrations,
        fetchPolicy: "network-only"
      })
      .valueChanges.map((result: any) => result.data.Registrations)
      .subscribe(data => {
        this.registros = data;
        console.log(this.registros);
      });
  }

  onNuevo() {
    this.regModelo = new Registro();
    this.submitType = "Guardar";
    this.mostrarNuevo = true;
  }

  // This method associate to Save Button.
  onGuardar() {
    var dateVal =
      this.regModelo.fc.year.toString() +
      "-" +
      this.regModelo.fc.month.toString() +
      "-" +
      this.regModelo.fc.day.toString();
    if (this.submitType === "Guardar") {
      const guardarRegistro = gql`
        mutation createRegistration(
          $nombres: String!
          $apellidos: String!
          $fc: GQDate!
          $email: String!
          $password: String!
          $pais: String!
        ) {
          createRegistration(
            nombres: $nombres
            apellidos: $apellidos
            fc: $fc
            email: $email
            password: $password
            pais: $pais
          ) {
            id
            fc
          }
        }
      `;
      this.apollo
        .mutate({
          mutation: guardarRegistro,
          variables: {
            nombres: this.regModelo.nombres,
            apellidos: this.regModelo.nombres,
            fc: new Date(dateVal),
            email: this.regModelo.email,
            password: this.regModelo.password,
            pais: this.regModelo.pais
          }
        })
        .subscribe(
          ({ data }) => {
            this.mostrarRegistros();
          },
          error => {
            console.log("Hubo ub error al enviar la consulta", error);
          }
        );

    } else {
      const updateRegistration = gql`
        mutation updateRegistration(
          $id: ID!
          $nombres: String!
          $apellidos: String!
          $fc: GQDate!
          $email: String!
          $password: String!
          $pais: String!
        ) {
          updateRegistration(
            id: $id
            nombres: $nombres
            apellidos: $apellidos
            fc: $fc
            email: $email
            password: $password
            pais: $pais
          ) {
            id
            pais
          }
        }
      `;
      this.apollo
        .mutate({
          mutation: updateRegistration,
          variables: {
            id: this.selectedRow + 1,
            nombres: this.regModelo.nombres,
            apellidos: this.regModelo.apellidos,
            fc: new Date(dateVal),
            email: this.regModelo.email,
            password: this.regModelo.password,
            pais: this.regModelo.pais
          }
        })
        .subscribe(
          ({ data }) => {
            console.log("editando", data);
            this.mostrarRegistros();
          },
          error => {
            console.log("Hubo un error al enviar la consulta", error);
          }
        );
    }
    this.mostrarNuevo = false;
  }

  onEditar(index: number) {
    this.selectedRow = index;
    this.regModelo = new Registro();
    this.regModelo = Object.assign({}, this.registros[this.selectedRow]);
    const fc = new Date(this.registros[this.selectedRow].fc);

    this.regModelo.fc = {
      day: fc.getDate(),
      month: fc.getMonth() + 1,
      year: fc.getFullYear()
    };

    this.submitType = "Actualizar";
    this.mostrarNuevo= true;
  }

  onEliminar(index: number) {
    const deleteRegistration = gql`
      mutation deleteRegistration($id: ID!) {
        deleteRegistration(id: $id) {
          id
        }
      }
    `;
    this.apollo
      .mutate({
        mutation: deleteRegistration,
        variables: {
          id: index + 1
        }
      })
      .subscribe(
        ({ data }) => {
          console.log("editdata", data);
          this.mostrarRegistros();
        },
        error => {
          console.log("Hubo un error al enviar la consulta", error);
        }
      );
  }

  onCancelar() {
    
    this.mostrarNuevo = false;

  }

  onCambiarPais(pais: string) {
    this.regModelo.pais = pais;
  }
}
